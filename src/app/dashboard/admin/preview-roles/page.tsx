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
    const [aiActive, setAiActive] = useState(false);
    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
                <section style={{ flex: '1 1 65%', minWidth: '300px' }}>
                    <header style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Introducción a la Inteligencia Artificial</h2>
                        <p style={{ color: 'var(--secondary)' }}>Módulo 1: Fundamentos y Conceptos Básicos</p>
                    </header>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <VideoPlayer onAiMomentClick={() => setAiActive(true)} />
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Recursos de la Clase</h3>
                        <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {['Diapositivas PDF', 'Lectura Complementaria', 'Quiz Rápido', 'Código Fuente'].map((item, i) => (
                                <li key={i} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                <aside style={{ flex: '1 1 30%', minWidth: '300px' }}>
                    <AiContextPanel isActive={aiActive} />
                </aside>
            </div>
            <SmartNotes />
        </div>
    );
}

function TeacherView() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Panel del Docente</h2>
                <p style={{ color: 'var(--secondary)' }}>Gestiona tus clases y recursos educativos</p>
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { icon: <Upload size={24} />, title: 'Subir Recursos', desc: 'Añadir diapositivas, videos o lecturas' },
                    { icon: <Users size={24} />, title: 'Gestionar Alumnos', desc: 'Ver progreso y calificaciones' },
                    { icon: <BookOpen size={24} />, title: 'Planificar Clases', desc: 'Editar temario y calendario' },
                    { icon: <BarChart size={24} />, title: 'Analíticas', desc: 'Rendimiento del curso' },
                ].map((item, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', width: 'fit-content', padding: '0.75rem', borderRadius: '12px' }}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <section className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Clases Recientes</h3>
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
                                { name: 'Inteligencia Artificial Fundamentos', students: 45, status: 'Activo' },
                                { name: 'Machine Learning Avanzado', students: 28, status: 'Programado' },
                                { name: 'Ética en IA', students: 156, status: 'Finalizado' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{row.name}</td>
                                    <td style={{ padding: '1rem' }}>{row.students}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', background: row.status === 'Activo' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)', color: row.status === 'Activo' ? '#4ade80' : 'inherit' }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button style={{ background: 'none', border: '1px solid var(--glass-border)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--foreground)', cursor: 'pointer' }}>
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
