'use client';

import React from 'react';
import { BookOpen, Calendar, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Subject {
    id: number;
    name: string;
    professor: string;
    color: string;
    nextClass: string;
    progress: number;
}

const subjects: Subject[] = [
    { id: 1, name: 'Algoritmos Avanzados', professor: 'Dr. García', color: '#3b82f6', nextClass: 'Mañana 10:00 AM', progress: 65 },
    { id: 2, name: 'Bases de Datos II', professor: 'Prof. Martínez', color: '#8b5cf6', nextClass: 'Hoy 2:00 PM', progress: 78 },
    { id: 3, name: 'Inteligencia Artificial', professor: 'Dra. López', color: '#ec4899', nextClass: 'Miércoles 9:00 AM', progress: 82 },
    { id: 4, name: 'Arquitectura de Software', professor: 'Ing. Rodríguez', color: '#10b981', nextClass: 'Jueves 3:00 PM', progress: 55 },
];

export default function SubjectGrid() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {subjects.map((subject, index) => (
                <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: `0 0 25px ${subject.color}40`
                    }}
                    className="glass-panel"
                    style={{
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                        border: `1px solid ${subject.color}20`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                >
                    {/* Color indicator bar */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${subject.color}, transparent)`
                    }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            padding: '0.75rem',
                            background: `${subject.color}15`,
                            borderRadius: '12px',
                            border: `1px solid ${subject.color}30`
                        }}>
                            <BookOpen size={24} style={{ color: subject.color }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{subject.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>{subject.professor}</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Progreso</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: subject.color }}>{subject.progress}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${subject.progress}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                style={{
                                    height: '100%',
                                    background: `linear-gradient(90deg, ${subject.color}, ${subject.color}cc)`,
                                    borderRadius: '3px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Next class info */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}>
                        <Clock size={16} style={{ color: subject.color }} />
                        <span style={{ fontSize: '0.85rem' }}>{subject.nextClass}</span>
                    </div>

                    {/* Enter classroom button */}
                    <motion.button
                        whileHover={{ x: 5 }}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`,
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Entrar al Aula <ArrowRight size={18} />
                    </motion.button>
                </motion.div>
            ))}
        </div>
    );
}
