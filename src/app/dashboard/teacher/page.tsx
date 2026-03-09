import Link from 'next/link';
import { Upload, Users, BookOpen, BarChart, MessageSquare, TrendingUp } from 'lucide-react';

export default function TeacherDashboard() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Panel del Docente</h1>
                    <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Gestiona tus clases y analiza el impacto de la IA</p>
                </div>
                <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Semestre 2024-1</span>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { icon: <Upload size={24} />, title: "Subir Recursos", desc: "Añadir material para el entrenamiento de la IA", href: "/dashboard/ai-admin", color: "var(--primary)" },
                    { icon: <MessageSquare size={24} />, title: "Analíticas de IA", desc: "Ver qué preguntan tus alumnos y su satisfacción", href: "/dashboard/ai-analytics", color: "#22c55e", highlight: true },
                    { icon: <Users size={24} />, title: "Gestionar Alumnos", desc: "Ver progreso y calificaciones", color: "#8b5cf6" },
                    { icon: <BarChart size={24} />, title: "Rendimiento", desc: "Estadísticas generales del curso", color: "#f59e0b" }
                ].map((item, i) => (
                    <Link key={i} href={item.href || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass-panel card-hover" style={{
                            padding: '1.75rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: item.highlight ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--glass-border)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {item.highlight && (
                                <div style={{ position: 'absolute', top: 0, right: 0, background: '#22c55e', color: 'white', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700, borderRadius: '0 0 0 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <TrendingUp size={10} /> NUEVO
                                </div>
                            )}
                            <div style={{
                                background: `${item.color}15`,
                                color: item.color,
                                width: 'fit-content',
                                padding: '0.85rem',
                                borderRadius: '14px',
                                boxShadow: `0 8px 16px ${item.color}10`
                            }}>
                                {item.icon}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', lineHeight: '1.5' }}>{item.desc}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx>{`
                .card-hover:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    background: rgba(255,255,255,0.05);
                }
            `}</style>

            <section className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Clases Recientes</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--secondary)' }}>
                                <th style={{ padding: '1rem' }}>Clase</th>
                                <th style={{ padding: '1rem' }}>Alumnos</th>
                                <th style={{ padding: '1rem' }}>Estado</th>
                                <th style={{ padding: '1rem' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: "Inteligencia Artificial Fundamentos", students: 45, status: "Activo" },
                                { name: "Machine Learning Avanzado", students: 28, status: "Programado" },
                                { name: "Ética en IA", students: 156, status: "Finalizado" },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{row.name}</td>
                                    <td style={{ padding: '1rem' }}>{row.students}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.85rem',
                                            background: row.status === 'Activo' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            color: row.status === 'Activo' ? '#4ade80' : 'inherit'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button style={{
                                            background: 'none',
                                            border: '1px solid var(--glass-border)',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '6px',
                                            color: 'var(--foreground)',
                                            cursor: 'pointer'
                                        }}>
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
