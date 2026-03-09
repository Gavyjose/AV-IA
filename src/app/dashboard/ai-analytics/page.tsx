'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
    ThumbsUp, 
    ThumbsDown, 
    MessageSquare, 
    TrendingUp, 
    Users, 
    Clock, 
    ArrowLeft,
    BarChart3,
    PieChart as PieChartIcon
} from 'lucide-react';
import Link from 'next/link';

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
                .limit(100) as any;

            if (!error && data) {
                setLogs(data);
            }
            setIsLoading(false);
        }

        fetchLogs();
    }, []);

    const total = logs.length;
    const likes = logs.filter(l => l.liked === true).length;
    const dislikes = logs.filter(l => l.liked === false).length;
    const neutral = total - likes - dislikes;
    
    const satisfactionRate = total > 0 ? Math.round((likes / (likes + dislikes || 1)) * 100) : 0;

    return (
        <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            width: '100%',
            padding: '1rem',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            {/* Header Navigation */}
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Link href="/dashboard/teacher" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: 'var(--secondary)', 
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        marginBottom: '0.75rem'
                    }}>
                        <ArrowLeft size={16} /> Volver al Panel
                    </Link>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
                        Analíticas de <span style={{ color: 'var(--primary)' }}>IA</span>
                    </h1>
                    <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Métricas de interacción y retroalimentación del aula virtual</p>
                </div>
                
                <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sistema Operativo</span>
                </div>
            </header>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {/* Total Interactions */}
                <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
                        <MessageSquare size={100} />
                    </div>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 500, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare size={16} /> Total Consultas
                    </h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{total}</div>
                     <div style={{ fontSize: '0.85rem', color: '#22c55e', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={14} /> +12% vs ayer
                    </div>
                </div>

                {/* Satisfaction Rate */}
                <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
                        <BarChart3 size={100} />
                    </div>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 500, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ThumbsUp size={16} /> Satisfacción
                    </h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{satisfactionRate}%</div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '1rem' }}>
                        <div style={{ width: `${satisfactionRate}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #22c55e)', borderRadius: '3px' }}></div>
                    </div>
                </div>

                {/* Feedback Ratio */}
                <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PieChartIcon size={16} /> Distribución Feedback
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', height: '32px' }}>
                        <div title={`Útiles: ${likes}`} style={{ flex: likes || 1, background: '#22c55e', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ThumbsUp size={14} color="white" /></div>
                        <div title={`Mejorables: ${dislikes}`} style={{ flex: dislikes || 1, background: '#ef4444', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ThumbsDown size={14} color="white" /></div>
                        <div title={`Sin feedback: ${neutral}`} style={{ flex: neutral || 1, background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                        <span>{likes} Útiles</span>
                        <span>{dislikes} Críticas</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                {/* Logs Table */}
                <section className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Historial Reciente</h2>
                        <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--foreground)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>Exportar CSV</button>
                    </div>
                    
                    {isLoading ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--secondary)' }}>
                            <div className="loading-spinner" style={{ marginBottom: '1rem' }}></div>
                            Cargando datos maestros...
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <tr>
                                        <th style={{ padding: '1rem 1.5rem' }}>Usuario / Consulta</th>
                                        <th style={{ padding: '1rem 1.5rem' }}>Respuesta IA</th>
                                        <th style={{ padding: '1rem 1.5rem' }}>Estatus</th>
                                        <th style={{ padding: '1rem 1.5rem' }}>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover-row">
                                            <td style={{ padding: '1.25rem 1.5rem', width: '35%' }}>
                                                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{log.user_query}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Users size={12} /> ID: student_{log.id % 100}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', width: '40%', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                                                {log.ai_response.length > 120 ? log.ai_response.substring(0, 120) + '...' : log.ai_response}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                {log.liked === true ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '0.85rem', background: 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}>
                                                        <ThumbsUp size={14} /> Útil
                                                    </span>
                                                ) : log.liked === false ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}>
                                                        <ThumbsDown size={14} /> Revisar
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'var(--secondary)', fontSize: '0.85rem' }}>Sin feedback</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--secondary)', fontSize: '0.8rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={12} />
                                                    {new Date(log.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Sidebar Insights */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <TrendingUp size={20} color="var(--primary)" /> Temas Hot
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { tag: 'Horarios de Clase', count: 42 },
                                { tag: 'Material de Lectura', count: 28 },
                                { tag: 'Fechas de Examen', count: 15 },
                                { tag: 'Dudas Técnicas', count: 9 }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>{item.tag}</span>
                                    <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>IA Tip</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', lineHeight: '1.6' }}>
                            "La mayoría de los 'dislikes' se deben a falta de contexto sobre las fechas de entrega. Te recomendamos subir el cronograma actualizado."
                        </p>
                    </div>
                </aside>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hover-row:hover {
                    background: rgba(255,255,255,0.03);
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-radius: 50%;
                    border-top-color: var(--primary);
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
