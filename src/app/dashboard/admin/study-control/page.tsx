'use client';

import React, { useState } from 'react';
import { Users, UserPlus, BookOpen, GraduationCap, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudyControlPage() {
    const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
    const [showModal, setShowModal] = useState(false);

    // Mock Data
    const students = [
        { id: 1, name: 'Ana García', email: 'ana@est.com', career: 'Ing. Informática', semester: '3ro' },
        { id: 2, name: 'Pedro Perez', email: 'pedro@est.com', career: 'Administración', semester: '1ro' },
    ];

    const teachers = [
        { id: 1, name: 'Prof. Carlos Lopez', email: 'carlos@doc.com', subjects: ['Matemática I', 'Física I'] },
        { id: 2, name: 'Dra. Maria Sanchez', email: 'maria@doc.com', subjects: ['Algoritmos'] },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Control de Estudio</h1>
                    <p style={{ color: 'var(--secondary)' }}>Gestión de Estudiantes, Profesores e Inscripciones</p>
                </div>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('students')}
                    className="glass-panel"
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'students' ? 'var(--primary)' : 'var(--glass-bg)',
                        color: activeTab === 'students' ? 'white' : 'var(--foreground)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        border: activeTab === 'students' ? 'none' : '1px solid var(--glass-border)'
                    }}
                >
                    <GraduationCap size={18} /> Estudiantes
                </button>
                <button
                    onClick={() => setActiveTab('teachers')}
                    className="glass-panel"
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'teachers' ? 'var(--primary)' : 'var(--glass-bg)',
                        color: activeTab === 'teachers' ? 'white' : 'var(--foreground)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        border: activeTab === 'teachers' ? 'none' : '1px solid var(--glass-border)'
                    }}
                >
                    <Users size={18} /> Profesores
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                        <input
                            type="text"
                            placeholder={`Buscar ${activeTab === 'students' ? 'estudiante' : 'profesor'}...`}
                            style={{
                                width: '100%',
                                padding: '0.6rem 1rem 0.6rem 2.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'var(--foreground)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            padding: '0.6rem 1.2rem',
                            background: 'var(--accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600
                        }}
                    >
                        <UserPlus size={18} /> {activeTab === 'students' ? 'Inscribir Estudiante' : 'Nuevo Profesor'}
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--secondary)' }}>
                            <th style={{ padding: '1rem' }}>Nombre</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>{activeTab === 'students' ? 'Carrera / Semestre' : 'Materias Asignadas'}</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeTab === 'students' ? (
                            students.map(st => (
                                <tr key={st.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{st.name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--secondary)' }}>{st.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderRadius: '4px', fontSize: '0.85rem' }}>
                                            {st.career}
                                        </span>
                                        <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--secondary)' }}>({st.semester})</span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <ActionButtons />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            teachers.map(tc => (
                                <tr key={tc.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{tc.name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--secondary)' }}>{tc.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {tc.subjects.map((sub, i) => (
                                                <span key={i} style={{ padding: '0.2rem 0.5rem', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <ActionButtons />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mock Modal for Creation */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                        }}
                    >
                        <div className="glass-panel" style={{ width: '500px', padding: '2rem', background: 'var(--background)' }}>
                            <h2 style={{ marginBottom: '1.5rem' }}>{activeTab === 'students' ? 'Nuevo Estudiante' : 'Nuevo Profesor'}</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="text" placeholder="Nombre Completo" style={inputStyle} />
                                <input type="email" placeholder="Correo Electrónico" style={inputStyle} />
                                {activeTab === 'students' ? (
                                    <>
                                        <select style={inputStyle}><option>Seleccionar Carrera...</option><option>Ing. Informática</option></select>
                                        <select style={inputStyle}><option>Semestre de Ingreso...</option><option>1ro</option></select>
                                    </>
                                ) : (
                                    <div style={{ padding: '1rem', border: '1px dashed var(--glass-border)', borderRadius: '8px', textAlign: 'center', color: 'var(--secondary)' }}>
                                        + Asignar Materias (Posterior)
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--foreground)' }}>Cancelar</button>
                                    <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.8rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: 600 }}>Guardar</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const ActionButtons = () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button title="Editar" style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer' }}><Edit size={16} /></button>
        <button title="Eliminar" style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={16} /></button>
    </div>
);

const inputStyle = {
    padding: '0.8rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'var(--foreground)',
    outline: 'none',
    width: '100%'
};
