import Link from 'next/link';
import { Users, Layers, Shield, Settings, Eye } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Panel de Administración</h1>
                <p style={{ color: 'var(--secondary)' }}>Centro de Control Académico</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* Control de Estudio Card */}
                <Link href="/dashboard/admin/study-control" className="glass-panel" style={{
                    padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                    cursor: 'pointer', border: '1px solid var(--glass-border)', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'linear-gradient(135deg, var(--primary), transparent)', opacity: 0.1, borderRadius: '50%' }} />
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '12px' }}>
                            <Users size={32} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Control de Estudio</h2>
                            <p style={{ color: 'var(--secondary)' }}>Estudiantes, Profesores, Inscripciones</p>
                        </div>
                    </div>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--secondary)', lineHeight: '1.6' }}>
                        <li>Gestión de Matrícula</li>
                        <li>Asignación de Carga Académica</li>
                        <li>Expedientes Docentes</li>
                    </ul>
                </Link>

                {/* Gestión de Carreras Card */}
                <Link href="/dashboard/admin/careers" className="glass-panel" style={{
                    padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                    cursor: 'pointer', border: '1px solid var(--glass-border)', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'linear-gradient(135deg, var(--accent), transparent)', opacity: 0.1, borderRadius: '50%' }} />
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', borderRadius: '12px' }}>
                            <Layers size={32} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Gestión de Carreras</h2>
                            <p style={{ color: 'var(--secondary)' }}>Pensum, Materias, U.C.</p>
                        </div>
                    </div>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--secondary)', lineHeight: '1.6' }}>
                        <li>Configuración de Pensum</li>
                        <li>Catálogo de Materias</li>
                        <li>Definición de Períodos</li>
                    </ul>
                </Link>

                {/* Vista de Roles Card (NEW) */}
                <Link href="/dashboard/admin/preview-roles" className="glass-panel" style={{
                    padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                    cursor: 'pointer', border: '1px solid var(--glass-border)', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'linear-gradient(135deg, #22c55e, transparent)', opacity: 0.1, borderRadius: '50%' }} />
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderRadius: '12px' }}>
                            <Eye size={32} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Vista de Roles</h2>
                            <p style={{ color: 'var(--secondary)' }}>Previsualizar paneles sin cambiar sesión</p>
                        </div>
                    </div>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--secondary)', lineHeight: '1.6' }}>
                        <li>Vista del Panel de Estudiante</li>
                        <li>Vista del Panel del Docente</li>
                        <li>Sin cambiar de cuenta</li>
                    </ul>
                </Link>
            </div>

            {/* Quick Stats or Footer */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Shield size={20} color="var(--secondary)" />
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Sistema</div>
                        <div style={{ fontWeight: 600 }}>v1.0.0 (Stable)</div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Settings size={20} color="var(--secondary)" />
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Configuración</div>
                        <div style={{ fontWeight: 600 }}>Global</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Usuarios Recientes</h2>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {["Ana García (Estudiante)", "Carlos Lopez (Docente)", "Maria Rodriguez (Estudiante)"].map((u, i) => (
                            <li key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px'
                            }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-border)' }} />
                                <span>{u}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Estado del Sistema</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { label: "Uso de CPU", value: "34%" },
                            { label: "Memoria", value: "62%" },
                            { label: "Almacenamiento", value: "45%" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>{stat.label}</span>
                                    <span>{stat.value}</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: stat.value,
                                        height: '100%',
                                        background: i === 1 ? 'var(--accent)' : 'var(--primary)',
                                        borderRadius: '3px'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
