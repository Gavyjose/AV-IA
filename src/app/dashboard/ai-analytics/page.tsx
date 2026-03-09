'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface ChatLog {
    id: number;
    user_query: string;
    ai_response: string;
    liked: boolean | null;
    created_at: string;
}

export default function AiAnalyticsPage() {
    const [logs, setLogs] = useState<ChatLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchLogs() {
            const { data, error } = await supabase
                .from('chat_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50) as any; // Cast as any to bypass outaded strict typing

            if (!error && data) {
                setLogs(data);
            }
            setIsLoading(false);
        }

        fetchLogs();
    }, []);

    const likes = logs.filter(l => l.liked === true).length;
    const dislikes = logs.filter(l => l.liked === false).length;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>
                <MessageSquare size={24} />
                Analítica del Asistente Virtual
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Interacciones Recientes</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{logs.length}</p>
                </div>
                <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <h3 style={{ color: '#166534', fontSize: '0.9rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ThumbsUp size={16} /> Respuestas Útiles
                    </h3>
                    <p style={{ fontSize: '2rem', fontWeight: 600, color: '#15803d', margin: 0 }}>{likes}</p>
                </div>
                <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
                    <h3 style={{ color: '#991b1b', fontSize: '0.9rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ThumbsDown size={16} /> Para Mejorar
                    </h3>
                    <p style={{ fontSize: '2rem', fontWeight: 600, color: '#b91c1c', margin: 0 }}>{dislikes}</p>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#334155' }}>Historial de Conversaciones</h3>
                </div>
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Cargando analíticas...</div>
                ) : logs.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Aún no hay interacciones registradas.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                                <th style={{ padding: '1rem', width: '30%' }}>Pregunta del Estudiante</th>
                                <th style={{ padding: '1rem', width: '50%' }}>Respuesta del Bot</th>
                                <th style={{ padding: '1rem', width: '10%' }}>Feedback</th>
                                <th style={{ padding: '1rem', width: '10%' }}>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' }}>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>{log.user_query}</td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>{log.ai_response.length > 150 ? log.ai_response.substring(0, 150) + '...' : log.ai_response}</td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        {log.liked === true ? <ThumbsUp size={16} color="#22c55e" /> : 
                                         log.liked === false ? <ThumbsDown size={16} color="#ef4444" /> : 
                                         <span style={{ color: '#cbd5e1' }}>-</span>}
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top', color: '#94a3b8', fontSize: '0.8rem' }}>
                                        {new Date(log.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
