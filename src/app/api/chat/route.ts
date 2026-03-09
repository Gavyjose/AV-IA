import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';
import { getEmbeddings } from '@/lib/embeddings/pipeline';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        console.log('[CHAT] Received messages:', messages?.length);

        const latestMessage = messages?.[messages.length - 1]?.content;
        if (!latestMessage) {
            return new Response('No message provided', { status: 400 });
        }

        // 1. Search for relevant content in the uploaded documents (RAG)
        let context = '';
        try {
            const queryEmbedding = await getEmbeddings(latestMessage);
            const embeddingString = `[${queryEmbedding.join(',')}]`;

            const { data: matchedDocuments } = await supabase.rpc('match_document_sections', {
                query_embedding: embeddingString as any,
                match_threshold: 0.25,
                match_count: 5,
            });

            if (matchedDocuments && (matchedDocuments as any[]).length > 0) {
                context = (matchedDocuments as any[])
                    .map((doc: any) => doc.content)
                    .join('\n\n---\n\n');
                console.log('[CHAT] Found', (matchedDocuments as any[]).length, 'relevant sections');
            } else {
                console.log('[CHAT] No relevant sections found in documents');
            }
        } catch (embeddingError) {
            console.error('[CHAT] Embedding/search error (continuing without context):', embeddingError);
        }

        // 2. Build the system prompt — generic, focused on uploaded course content
        const systemPrompt = context
            ? `Eres el Asistente Virtual del Aula Virtual. Responde preguntas de los estudiantes de forma amable y precisa en español, basándote ÚNICAMENTE en los materiales del curso que se te proporcionan a continuación.

REGLAS:
- Responde solo con información que esté en el contexto proporcionado.
- Si la respuesta no está en el contexto, responde: "Lo siento, no encontré información sobre eso en los materiales del curso. Te recomiendo consultar con tu profesor."
- Sé claro, directo y usa formato de lista cuando sea útil.
- No inventes información que no esté en el contexto.

MATERIALES DEL CURSO DISPONIBLES:
${context}`
            : `Eres el Asistente Virtual del Aula Virtual. Responde preguntas de los estudiantes en español.
Actualmente no hay materiales de curso cargados en la base de datos que sean relevantes para esta pregunta. 
Indica amablemente al estudiante que no tienes información disponible sobre ese tema y que consulte con su profesor o revise los materiales del curso directamente.`;

        // 3. Prepare the message history
        const chatMessages = messages
            .filter((m: any) => m.role === 'user' || m.role === 'assistant')
            .map((m: any) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
            }));

        console.log('[CHAT] Calling Groq...');

        // 4. Stream the response
        const stream = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                ...chatMessages,
            ],
            stream: true,
            temperature: 0.3, // Lower temperature for more factual responses
        });

        const readableStream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of stream) {
                        const text = chunk.choices[0]?.delta?.content || '';
                        if (text) controller.enqueue(encoder.encode(text));
                    }
                } catch (err) {
                    console.error('[CHAT] Stream error:', err);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
            },
        });

    } catch (error: any) {
        console.error('[CHAT] API Error:', error?.message || error);
        console.error('[CHAT] Status:', error?.status, '| Code:', error?.error?.code);
        return new Response('Error al procesar tu consulta. Por favor intenta de nuevo.', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}
