'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AiSidebar.module.css';
import { ChevronRight, ChevronLeft, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

export default function AiSidebar({ collapsed, onToggle }: AiSidebarProps) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte con tu clase hoy?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, collapsed]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: 'Entiendo tu pregunta. Aquí tienes una explicación detallada basada en el contenido del curso...'
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <motion.aside
            layout
            initial={false}
            animate={{ width: collapsed ? '60px' : '350px' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`${styles.sidebar} glass-panel`}
            style={{
                // Overlay default CSS module styles if needed or remove them from CSS
                width: 'auto', // Let framer handle width
                flexShrink: 0
            }}
        >
            <div className={styles.header}>
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                        >
                            <Sparkles size={18} className="text-blue-400" /> Asistente IA
                        </motion.span>
                    )}
                </AnimatePresence>
                <button
                    onClick={onToggle}
                    className={styles.toggleButton}
                    aria-label={collapsed ? "Expandir chat" : "Ocultar chat"}
                    style={{ marginLeft: collapsed ? 0 : 'auto' }}
                >
                    {collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
                    >
                        <div className={styles.chatContainer}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div className={`${styles.message} ${styles.aiMessage}`}>
                                    <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                                    <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={styles.inputArea}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Pregunta a la IA..."
                                className={styles.input}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                className={styles.sendButton}
                                disabled={isLoading || !input.trim()}
                                aria-label="Enviar respuesta"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.aside>
    );
}
