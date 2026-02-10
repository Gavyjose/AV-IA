'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Clock, Sparkles } from 'lucide-react';

interface AiContextPanelProps {
    isActive: boolean;
}

export default function AiContextPanel({ isActive }: AiContextPanelProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [input, setInput] = useState('');
    const listRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setInput('');

        // Simulating AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: 'Esa es una excelente pregunta. En el contexto de los modelos de difusión, el ruido gaussiano se añade progresivamente para destruir la estructura de datos data...' }]);
        }, 1000);
    };

    const keyMoments = [
        { time: '04:20', label: 'Introducción a Redes Neuronales' },
        { time: '12:35', label: 'Explicación del Ruido Gaussiano' },
        { time: '28:10', label: 'Proceso de Denoising' },
    ];

    return (
        <motion.div
            className="glass-panel"
            animate={{
                borderColor: isActive ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isActive ? '0 0 20px rgba(139, 92, 246, 0.15)' : 'none'
            }}
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Sparkles size={18} className="text-purple-400" />
                    <h3 style={{ fontWeight: 600 }}>Asistente de Contexto</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Análisis en tiempo real de la clase</p>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Key Moments Section */}
                <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Momentos Clave Detectados</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {keyMoments.map((moment, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '0.75rem', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                                cursor: 'pointer', transition: 'background 0.2s'
                            }}>
                                <div style={{
                                    padding: '0.25rem 0.5rem', borderRadius: '4px',
                                    background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa',
                                    fontSize: '0.8rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.25rem'
                                }}>
                                    <Clock size={12} /> {moment.time}
                                </div>
                                <span style={{ fontSize: '0.9rem' }}>{moment.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel"
                                style={{
                                    padding: '1rem',
                                    background: msg.role === 'ai' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))' : 'rgba(255,255,255,0.05)',
                                    alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                                    maxWidth: '90%',
                                    border: msg.role === 'ai' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid var(--glass-border)'
                                }}
                            >
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{msg.text}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={listRef} />
                </div>
            </div>

            {/* Input Area */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pregunta sobre el video..."
                        style={{
                            width: '100%',
                            padding: '1rem 3.5rem 1rem 1.5rem',
                            background: 'rgba(0,10,30,0.4)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--foreground)',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '36px',
                            height: '36px',
                            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
