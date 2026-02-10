import { Upload, Users, BookOpen, BarChart } from 'lucide-react';

export default function TeacherDashboard() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Panel del Docente</h1>
                <p style={{ color: 'var(--secondary)' }}>Gestiona tus clases y recursos educativos</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { icon: <Upload size={24} />, title: "Subir Recursos", desc: "Añadir diapositivas, videos o lecturas" },
                    { icon: <Users size={24} />, title: "Gestionar Alumnos", desc: "Ver progreso y calificaciones" },
                    { icon: <BookOpen size={24} />, title: "Planificar Clases", desc: "Editar temario y calendario" },
                    { icon: <BarChart size={24} />, title: "Analíticas", desc: "Rendimiento del curso" }
                ].map((item, i) => (
                    <div key={i} className="glass-panel" style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: 'var(--primary)',
                            width: 'fit-content',
                            padding: '0.75rem',
                            borderRadius: '12px'
                        }}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

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
