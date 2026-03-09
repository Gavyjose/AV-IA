import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getEmbeddings } from '@/lib/embeddings/pipeline';
import { chunkText } from '@/lib/embeddings/textSplitter';
import { Database } from '@/lib/supabase/database.types';

// Use service role key to bypass RLS for inserting admin data
const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, content, metadata } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        // 1. Insert document
        const { data: document, error: docError } = await supabase
            .from('documents')
            .insert({
                title,
                content,
                metadata: metadata || {}
            })
            .select()
            .single();

        if (docError || !document) throw docError;

        // 2. Chunk text
        const chunks = chunkText(content);
        let insertedChunks = 0;

        // 3. Process chunks sequentially to avoid memory spikes from the local model
        for (const chunk of chunks) {
            // Generate embedding locally
            const embeddingVector = await getEmbeddings(chunk);
            
            // Format for pgvector as '[0.1, 0.2, ...]' string representation
            const embeddingString = `[${embeddingVector.join(',')}]`;

            // Insert chunk with vector
            const { error: chunkError } = await supabase
                .from('document_sections')
                .insert({
                    document_id: document.id,
                    content: chunk,
                    embedding: embeddingString as any // Override type for pgvector insertion
                });

            if (chunkError) {
                console.error("Error inserting chunk:", chunkError);
                continue;
            }
            insertedChunks++;
        }

        return NextResponse.json({ 
            success: true, 
            documentId: document.id, 
            chunksProcessed: insertedChunks,
            totalChunks: chunks.length
        });

    } catch (error) {
        console.error('Ingest API Error:', error);
        return NextResponse.json({ error: 'Internal server error while processing document' }, { status: 500 });
    }
}
