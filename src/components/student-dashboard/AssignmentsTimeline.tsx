'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Assignment {
    id: number;
    title: string;
    subject: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    color: string;
}

const initialAssignments: Assignment[] = [
    { id: 1, title: 'Implementar Árbol AVL', subject: 'Algoritmos', dueDate: 'Mañana', priority: 'high', completed: false, color: '#3b82f6' },
    { id: 2, title: 'Modelo Entidad-Relación', subject: 'Bases de Datos', dueDate: 'En 2 días', priority: 'high', completed: false, color: '#8b5cf6' },
    { id: 3, title: 'Ensayo sobre IA Generativa', subject: 'IA', dueDate: 'Viernes', priority: 'medium', completed: false, color: '#ec4899' },
    { id: 4, title: 'Diagrama de Clases UML', subject: 'Arquitectura', dueDate: 'Próxima semana', priority: 'low', completed: true, color: '#10b981' },
];

export default function AssignmentsTimeline() {
    const [assignments, setAssignments] = useState(initialAssignments);

    const toggleComplete = (id: number) => {
        setAssignments(prev => prev.map(a =>
            a.id === id ? { ...a, completed: !a.completed } : a
        ));
    };

    const priorityConfig = {
        high: { label: 'Alta Prioridad', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
        medium: { label: 'Media', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
        low: { label: 'Baja', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar size={24} style={{ color: 'var(--accent)' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Asignaciones Pendientes</h2>
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    {assignments.filter(a => !a.completed).length} activas
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence>
                    {assignments.map((assignment, index) => (
                        <motion.div
                            key={assignment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                padding: '1.25rem',
                                background: assignment.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${assignment.completed ? 'var(--glass-border)' : assignment.color}30`,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                opacity: assignment.completed ? 0.6 : 1,
                                transition: 'all 0.3s'
                            }}
                        >
                            {/* Checkbox with animation */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleComplete(assignment.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    color: assignment.completed ? assignment.color : 'var(--secondary)'
                                }}
                            >
                                {assignment.completed ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                        <CheckCircle2 size={28} style={{ color: assignment.color }} />
                                    </motion.div>
                                ) : (
                                    <Circle size={28} />
                                )}
                            </motion.button>

                            {/* Assignment info */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    marginBottom: '0.25rem',
                                    textDecoration: assignment.completed ? 'line-through' : 'none'
                                }}>
                                    {assignment.title}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    <span style={{
                                        fontSize: '0.85rem',
                                        padding: '0.2rem 0.6rem',
                                        background: `${assignment.color}15`,
                                        color: assignment.color,
                                        borderRadius: '6px',
                                        border: `1px solid ${assignment.color}30`
                                    }}>
                                        {assignment.subject}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>
                                        Entrega: {assignment.dueDate}
                                    </span>
                                </div>
                            </div>

                            {/* Priority badge */}
                            {!assignment.completed && assignment.priority === 'high' && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 0.75rem',
                                        background: priorityConfig[assignment.priority].bgColor,
                                        borderRadius: '8px',
                                        border: `1px solid ${priorityConfig[assignment.priority].color}30`
                                    }}
                                >
                                    <AlertCircle size={16} style={{ color: priorityConfig[assignment.priority].color }} />
                                    <span style={{
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        color: priorityConfig[assignment.priority].color
                                    }}>
                                        {priorityConfig[assignment.priority].label}
                                    </span>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
