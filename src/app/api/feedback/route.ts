import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { user_query, ai_response, liked } = await req.json();

        if (!user_query || !ai_response) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('chat_logs')
            .insert({
                user_query,
                ai_response,
                liked
            } as any)
            .select()
            .single() as any;

        if (error) throw error;

        return NextResponse.json({ success: true, id: data.id });
    } catch (error) {
        console.error('Feedback API Error:', error);
        return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
    }
}
