import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
        return NextResponse.json({ error: 'ID de curso faltante' }, { status: 400 });
    }

    try {
        const { data: materials, error } = await supabase
            .from('documents')
            .select('id, title, content, created_at, metadata')
            .eq('course_id', courseId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, materials });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
