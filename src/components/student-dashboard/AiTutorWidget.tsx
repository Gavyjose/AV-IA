'use client';

import React from 'react';
import { Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiTutorWidget() {
    const recommendations = [
        { subject: 'Algoritmos Avanzados', reason: 'Tu último examen mostró dificultad en recursión', icon: '🎯' },
        { subject: 'Bases de Datos', reason: 'Tienes una evaluación próxima', icon: '📊' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel"
            style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated glow effect */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                        padding: '0.5rem',
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        borderRadius: '10px'
                    }}>
                        <Sparkles size={20} color="white" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>IA Tutor</h3>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                    Basado en tu desempeño, hoy te recomendamos:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {recommendations.map((rec, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            style={{
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            whileHover={{
                                background: 'rgba(255,255,255,0.08)',
                                borderColor: 'rgba(139, 92, 246, 0.4)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>{rec.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem', color: '#a78bfa' }}>
                                        {rec.subject}
                                    </h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', lineHeight: '1.4' }}>
                                        {rec.reason}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        marginTop: '1.25rem',
                        padding: '0.875rem',
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.95rem'
                    }}
                >
                    <TrendingUp size={18} />
                    Ver Análisis Completo
                </motion.button>
            </div>
        </motion.div>
    );
}
