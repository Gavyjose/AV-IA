'use client';

import React, { useState } from 'react';
import VideoPlayer from '@/components/class-player/VideoPlayer';
import AiContextPanel from '@/components/class-player/AiContextPanel';
import SmartNotes from '@/components/SmartNotes';

export default function DashboardPage() {
    const [aiActive, setAiActive] = useState(false);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

            {/* Flex Layout for 70/30 Control */}
            <div className="responsive-split-layout" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <section style={{ flex: '1 1 65%', minWidth: '300px' }}>
                    <header style={{ marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Introducción a la Inteligencia Artificial</h1>
                        <p style={{ color: 'var(--secondary)' }}>Módulo 1: Fundamentos y Conceptos Básicos</p>
                    </header>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <VideoPlayer onAiMomentClick={() => setAiActive(true)} />
                    </div>

                    {/* Resources Section under Video */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Recursos de la Clase</h2>
                        <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {['Diapositivas PDF', 'Lectura Complementaria', 'Quiz Rápido', 'Código Fuente'].map((item, i) => (
                                <li key={i} style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'background 0.2s'
                                }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <aside style={{ flex: '1 1 30%', minWidth: '300px', height: 'fit-content', minHeight: '600px' }}>
                    <AiContextPanel isActive={aiActive} />
                </aside>
            </div>

            <SmartNotes />
        </div>
    );
}
