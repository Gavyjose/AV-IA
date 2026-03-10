'use client';

import { useState } from 'react';
import { GraduationCap, BookOpen, Eye } from 'lucide-react';

// --- STUDENT VIEW (Rendered inline) ---
import VideoPlayer from '@/components/class-player/VideoPlayer';
import AiContextPanel from '@/components/class-player/AiContextPanel';
import SmartNotes from '@/components/SmartNotes';

// --- TEACHER VIEW (Rendered inline) ---
import { Upload, Users, BarChart, Layers } from 'lucide-react';

function StudentView() {
    return (
        <div style={{ 
            minHeight: '60vh', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            opacity: 0.5
        }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>
                Panel del Estudiante - Listo para configuración
            </p>
        </div>
    );
}

function TeacherView() {
    const [courses] = useState([
        { name: 'Inteligencia Artificial Fundamentos', students: 45, status: 'Activo' },
        { name: 'Machine Learning Avanzado', students: 28, status: 'Programado' },
    ]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Panel del Docente</h2>
                <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Gestiona tus clases y analiza el impacto de la IA</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <Link href="/dashboard/teacher/courses" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="glass-panel card-hover" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--primary)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '12px', width: 'fit-content' }}>
                            <BookOpen size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Gestión de Cursos</h3>
                            <p style={{ color: 'var(--secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>Crea materias, invita alumnos y sube materiales de estudio para la IA.</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/ai-analytics" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="glass-panel card-hover" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.3)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '12px', borderRadius: '12px', width: 'fit-content' }}>
                            <BarChart size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Analíticas de IA</h3>
                            <p style={{ color: 'var(--secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>Ver qué preguntan tus alumnos y su satisfacción.</p>
                        </div>
                    </div>
                </Link>
            </div>

            <style jsx>{`
                .card-hover:hover {
                    transform: translateY(-5px);
                    background: rgba(255,255,255,0.05);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
            `}</style>

            <section className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Clases Recientes</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--secondary)' }}>
                                <th style={{ padding: '1rem' }}>Clase</th>
                                <th style={{ padding: '1rem' }}>Alumnos</th>
                                <th style={{ padding: '1rem' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{row.name}</td>
                                    <td style={{ padding: '1rem' }}>{row.students}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>
                                            {row.status}
                                        </span>
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

// --- MAIN COMPONENT ---
type RoleTab = 'student' | 'teacher';

export default function PreviewRolesPage() {
    const [activeTab, setActiveTab] = useState<RoleTab>('student');

    const tabs: { id: RoleTab; label: string; icon: React.ReactNode; color: string }[] = [
        { id: 'student', label: 'Vista Estudiante', icon: <GraduationCap size={18} />, color: '#3b82f6' },
        { id: 'teacher', label: 'Vista Docente', icon: <BookOpen size={18} />, color: '#8b5cf6' },
    ];

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            {/* Header */}
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Eye size={24} color="var(--primary)" />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Vista Previa de Roles</h1>
                </div>
                <p style={{ color: 'var(--secondary)' }}>Visualiza cómo se ve el sistema desde la perspectiva de cada usuario sin cambiar de sesión.</p>
            </header>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '14px', width: 'fit-content', border: '1px solid var(--glass-border)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.6rem 1.25rem', borderRadius: '10px', cursor: 'pointer',
                            border: 'none', fontSize: '0.95rem', fontWeight: 500,
                            transition: 'all 0.2s',
                            background: activeTab === tab.id ? tab.color : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--secondary)',
                            boxShadow: activeTab === tab.id ? `0 4px 14px ${tab.color}44` : 'none',
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Role badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '8px', width: 'fit-content', fontSize: '0.85rem', color: 'var(--secondary)' }}>
                <Layers size={14} />
                Modo vista previa — Sesión de administrador activa
            </div>

            {/* Content */}
            {activeTab === 'student' ? <StudentView /> : <TeacherView />}
        </div>
    );
}
