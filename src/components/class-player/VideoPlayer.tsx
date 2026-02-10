'use client';

import React, { useState } from 'react';
import { Play, Pause, Volume2, Maximize, Brain, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
    onAiMomentClick: () => void;
}

export default function VideoPlayer({ onAiMomentClick }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="glass-panel" style={{
            position: 'relative',
            aspectRatio: '16/9',
            width: '100%',
            background: '#000',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)'
        }}>
            {/* Video Placeholder Content */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>Conceptos Avanzados de IA Generativa</h3>
                    <p style={{ color: 'var(--secondary)' }}>Clase 3: Modelos de Difusión</p>
                </div>
            </div>

            {/* Play Button Overlay */}
            {!isPlaying && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    <button
                        onClick={() => setIsPlaying(true)}
                        style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'white',
                            boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                        }}
                    >
                        <Play size={32} fill="white" />
                    </button>
                </div>
            )}

            {/* AI Moment Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAiMomentClick}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                    zIndex: 20
                }}
            >
                <Brain size={24} color="white" />
            </motion.button>

            {/* Controls Bar */}
            <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                zIndex: 20
            }}>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginBottom: '1rem', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ width: '35%', height: '100%', background: 'var(--primary)', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ position: 'absolute', right: -6, top: -4, width: '12px', height: '12px', background: 'white', borderRadius: '50%', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            {isPlaying ? <Pause size={24} /> : <Play size={24} fill="white" />}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Volume2 size={20} />
                            <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                                <div style={{ width: '70%', height: '100%', background: 'white', borderRadius: '2px' }} />
                            </div>
                        </div>
                        <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontFamily: 'monospace' }}>12:45 / 45:00</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Settings size={20} style={{ cursor: 'pointer', opacity: 0.8 }} />
                        <Maximize size={20} style={{ cursor: 'pointer', opacity: 0.8 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
