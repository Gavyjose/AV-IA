'use client';

import React from 'react';
import { Trophy, Award, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import SubjectGrid from '@/components/student-dashboard/SubjectGrid';
import AssignmentsTimeline from '@/components/student-dashboard/AssignmentsTimeline';
import AiTutorWidget from '@/components/student-dashboard/AiTutorWidget';

export default function StudentHomePage() {
    const metrics = [
        { label: 'Promedio General', value: '8.7', max: '10.0', icon: Trophy, color: '#3b82f6', progress: 87 },
        { label: 'Créditos Aprobados', value: '45', max: '168', icon: Award, color: '#8b5cf6', progress: 27 },
        { label: 'Nivel de Progreso', value: '3', max: '10', icon: TrendingUp, color: '#ec4899', progress: 30 },
    ];

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
            {/* Header */}
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    ¡Bienvenido de nuevo! 👋
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>
                    Este es tu resumen académico del día
                </p>
            </header>

            {/* Metrics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {metrics.map((metric, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel"
                        style={{
                            padding: '1.75rem',
                            background: `linear-gradient(135deg, ${metric.color}10, transparent)`,
                            border: `1px solid ${metric.color}30`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Background decoration */}
                        <div style={{
                            position: 'absolute',
                            top: -30,
                            right: -30,
                            width: '120px',
                            height: '120px',
                            background: `radial-gradient(circle, ${metric.color}15, transparent)`,
                            borderRadius: '50%',
                            filter: 'blur(20px)'
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{
                                    padding: '0.75rem',
                                    background: `${metric.color}20`,
                                    borderRadius: '12px',
                                    border: `1px solid ${metric.color}40`
                                }}>
                                    <metric.icon size={28} style={{ color: metric.color }} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1 }}>
                                        {metric.value}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                                        de {metric.max}
                                    </div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--secondary)' }}>
                                {metric.label}
                            </h3>

                            {/* Progress bar with gradient */}
                            <div style={{
                                height: '8px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                    style={{
                                        height: '100%',
                                        background: `linear-gradient(90deg, ${metric.color}, #3b82f6)`,
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main content grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '2rem',
                marginBottom: '2rem'
            }}>
                {/* Subjects section */}
                <section>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Target size={28} style={{ color: 'var(--accent)' }} />
                        Tus Materias Activas
                    </h2>
                    <SubjectGrid />
                </section>
            </div>

            {/* Two-column layout for assignments and AI widget */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
                gap: '2rem',
                alignItems: 'start'
            }}
                className="responsive-dashboard-grid"
            >
                <AssignmentsTimeline />
                <AiTutorWidget />
            </div>

            {/* Responsive styles */}
            <style jsx>{`
                @media (max-width: 968px) {
                    .responsive-dashboard-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
