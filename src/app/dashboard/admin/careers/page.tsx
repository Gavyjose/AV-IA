'use client';

import React, { useState } from 'react';
import { Layers, Book, Plus, ChevronRight, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CareersPage() {
    const [activeTab, setActiveTab] = useState<'careers' | 'subjects'>('careers');

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Gestión de Carreras</h1>
                <p style={{ color: 'var(--secondary)' }}>Configura Pensum, Unidades de Crédito y Estructura</p>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <TabButton active={activeTab === 'careers'} onClick={() => setActiveTab('careers')} icon={<Layers size={18} />} label="Carreras y Pensum" />
                <TabButton active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} icon={<Book size={18} />} label="Catálogo de Materias" />
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'careers' ? <CareersView /> : <SubjectsView />}
            </motion.div>
        </div>
    );
}

function CareersView() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <button className="glass-panel" style={{
                minHeight: '200px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px dashed var(--glass-border)', background: 'transparent',
                color: 'var(--secondary)', cursor: 'pointer', transition: 'border-color 0.2s'
            }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', marginBottom: '1rem' }}>
                    <Plus size={32} />
                </div>
                <span style={{ fontWeight: 600 }}>Crear Nueva Carrera</span>
            </button>

            {[
                { name: 'Ingeniería en Informática', type: 'Semestral', periods: 10, totalUc: 168, code: 'ING-INF' },
                { name: 'Licenciatura en Administración', type: 'Trimestral', periods: 12, totalUc: 145, code: 'LIC-ADM' },
            ].map((c, i) => (
                <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{c.name}</h3>
                            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'var(--glass-border)', borderRadius: '4px' }}>{c.code}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            <Tag>{c.type}</Tag>
                            <Tag>{c.periods} Períodos</Tag>
                            <Tag color="accent">{c.totalUc} UC</Tag>
                        </div>
                    </div>
                    <button style={{
                        width: '100%', padding: '0.8rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px', color: 'var(--foreground)',
                        cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                        fontWeight: 600
                    }}>
                        Gestionar Pensum <ChevronRight size={16} />
                    </button>
                </div>
            ))}
        </div>
    )
}

function SubjectsView() {
    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Repositorio Global de Materias</h3>
                <button style={{ padding: '0.6rem 1.2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    + Nueva Materia
                </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--secondary)' }}>
                        <th style={{ padding: '1rem' }}>Código</th>
                        <th style={{ padding: '1rem' }}>Nombre Materia</th>
                        <th style={{ padding: '1rem' }}>U.C.</th>
                        <th style={{ padding: '1rem' }}>Tipo</th>
                        <th style={{ padding: '1rem' }}>Prelaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { code: 'MAT-101', name: 'Matemática I', uc: 4, type: 'Teórico-Práctica', pre: '-' },
                        { code: 'FIS-101', name: 'Física General', uc: 3, type: 'Teórica', pre: 'MAT-101' },
                        { code: 'PROG-101', name: 'Algoritmos I', uc: 5, type: 'Práctica', pre: '-' },
                    ].map((s, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--secondary)' }}>{s.code}</td>
                            <td style={{ padding: '1rem', fontWeight: 600 }}>{s.name}</td>
                            <td style={{ padding: '1rem' }}>{s.uc}</td>
                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{s.type}</td>
                            <td style={{ padding: '1rem', color: 'var(--secondary)', fontSize: '0.9rem' }}>{s.pre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className="glass-panel"
        style={{
            padding: '1rem 2rem',
            background: active ? 'var(--primary)' : 'var(--glass-bg)',
            color: active ? 'white' : 'var(--foreground)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            border: active ? 'none' : '1px solid var(--glass-border)',
            transition: 'all 0.2s'
        }}
    >
        {icon} {label}
    </button>
)

const Tag = ({ children, color = 'primary' }: { children: React.ReactNode, color?: 'primary' | 'accent' }) => (
    <span style={{
        padding: '0.25rem 0.75rem',
        background: color === 'primary' ? 'rgba(255,255,255,0.1)' : 'rgba(139, 92, 246, 0.15)',
        color: color === 'primary' ? 'var(--foreground)' : '#a78bfa',
        borderRadius: '999px', fontSize: '0.8rem',
        border: '1px solid rgba(255,255,255,0.05)'
    }}>
        {children}
    </span>
)
