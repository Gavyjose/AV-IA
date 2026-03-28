import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import * as pdfjs from 'pdfjs-dist';
// @ts-ignore
import mammoth from 'mammoth';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const courseId = formData.get('courseId') as string;
        const courseName = formData.get('courseName') as string;

        if (!file || !courseId) {
            return NextResponse.json({ error: 'Archivo o ID de curso faltante' }, { status: 400 });
        }

        let text = '';
        const buffer = Buffer.from(await file.arrayBuffer());

        // 1. Extraer texto según formato
        if (file.name.endsWith('.pdf')) {
            const data = new Uint8Array(buffer);
            const loadingTask = pdfjs.getDocument({ data });
            const pdf = await loadingTask.promise;
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map((it: any) => it.str).join(' ') + '\n';
            }
        } else if (file.name.endsWith('.docx')) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            text = buffer.toString('utf-8');
        }

        // 2. Usar IA para estructurar el listado
        const { text: jsonResponse } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: `
            Analiza el siguiente texto y extrae una lista estructurada de alumnos. 
            Regresa ÚNICAMENTE un arreglo JSON de objetos con los campos: "firstName", "lastName", "email", "idNumber".
            Si un campo falta, intenta deducirlo o deja una cadena vacía.
            Cédula (idNumber) debe ser solo números. Si hay puntos o letras, quítalos.

            TEXTO:
            ${text}
            `
        });

        // Limpiar posible markdown del JSON
        const cleanJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const students = JSON.parse(cleanJson);

        if (!Array.isArray(students)) {
            throw new Error('La IA no devolvió un formato de lista válido');
        }

        // 3. Procesar cada alumno (Llamar a la lógica de invitación)
        // Por eficiencia, no hacemos fetch interno, sino que ejecutamos la lógica
        const results = [];
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = req.headers.get('host') || 'localhost:3000';

        for (const student of students) {
            try {
                // Reutilizamos la lógica del endpoint individual (aquí simplificada para el loop)
                const res = await fetch(`${protocol}://${host}/api/students/invite`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...student,
                        courseId,
                        courseName
                    })
                });
                results.push({ email: student.email, success: res.ok });
            } catch (err) {
                results.push({ email: student.email, success: false, error: 'Error en proceso' });
            }
        }

        return NextResponse.json({ 
            success: true, 
            total: students.length,
            processed: results.filter(r => r.success).length,
            details: results 
        });

    } catch (err: any) {
        console.error('[BATCH_INVITE] Error:', err);
        return NextResponse.json({ error: err.message || 'Error en procesamiento' }, { status: 500 });
    }
}
