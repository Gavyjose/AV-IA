'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AiChatWidget.module.css';
import { Send, Bot, X, RotateCcw, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const INITIAL_MESSAGE: Message = {
    id: 'welcome',
    role: 'assistant',
    content: '¡Hola! Soy tu Asistente del Aula Virtual. Puedo ayudarte con dudas sobre los materiales cargados, fechas de entrega o cualquier contenido del curso. ¿Qué te gustaría consultar hoy?'
};

const SUGGESTIONS = [
    '¿Qué materiales hay disponibles?',
    '¿Cuándo son las próximas entregas?',
    'Explícame el tema principal',
    '¿Cómo contacto al profesor?'
];

const TypingDots = () => (
    <div className={styles.typingContainer}>
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
    </div>
);

import { useParams } from 'next/navigation';

interface AiChatWidgetProps {
    courseId?: string;
}

export default function AiChatWidget({ courseId: manualCourseId }: AiChatWidgetProps) {
    const params = useParams();
    const courseId = manualCourseId || (params?.id as string);
    
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [ratedMessages, setRatedMessages] = useState<Record<string, 'liked' | 'disliked'>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isOpen, isTyping]);

    const handleSend = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const payload = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: payload,
                    courseId: courseId // Pass course context if available
                }),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            const aiMsgId = (Date.now() + 1).toString();
            let fullText = '';

            setIsTyping(false); // Stop typing indicator as streaming starts
            setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    fullText += decoder.decode(value, { stream: true });
                    setMessages(prev =>
                        prev.map(m => m.id === aiMsgId ? { ...m, content: fullText } : m)
                    );
                }
            }
        } catch (err) {
            console.error('Chat error:', err);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: 'Lo siento, ocurrió un error al procesar tu consulta. Por favor intenta de nuevo.'
            }]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSend(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(inputValue);
        }
    };

    const handleReset = () => {
        setMessages([{ ...INITIAL_MESSAGE, id: Date.now().toString() }]);
        setInputValue('');
        setRatedMessages({});
        setIsTyping(false);
    };

    const handleRate = async (messageId: string, liked: boolean, aiResponse: string) => {
        if (ratedMessages[messageId]) return;
        setRatedMessages(prev => ({ ...prev, [messageId]: liked ? 'liked' : 'disliked' }));

        const msgIndex = messages.findIndex(m => m.id === messageId);
        const userQuery = msgIndex > 0 ? messages[msgIndex - 1].content : 'N/A';

        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_query: userQuery, ai_response: aiResponse, liked })
            });
        } catch (error) {
            console.error('Failed to submit feedback', error);
        }
    };

    return (
        <div className={styles.widgetContainer}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, y: 10, filter: 'blur(10px)' }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={styles.chatWindow}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.headerIcon}><Sparkles size={22} color="white" /></div>
                            <div className={styles.headerTitle}>
                                <h3>Asistente Virtual</h3>
                                <div className={styles.onlineStatus}>
                                    <div className={styles.onlineDot} />
                                    <span>Sistema Activo</span>
                                </div>
                            </div>
                            <div className={styles.headerActions}>
                                <button type="button" className={styles.headerButton} onClick={handleReset} title="Reiniciar chat">
                                    <RotateCcw size={18} />
                                </button>
                                <button type="button" className={styles.headerButton} onClick={() => setIsOpen(false)} title="Cerrar">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className={styles.chatContainer}>
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    key={msg.id} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={styles.messageRow}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className={styles.aiAvatar}><Bot size={18} /></div>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', marginLeft: msg.role === 'user' ? 'auto' : '0' }}>
                                        <div className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
                                            {msg.content}
                                        </div>
                                        {msg.role === 'assistant' && idx > 0 && !isLoading && idx === messages.length - 1 && msg.content && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                style={{ display: 'flex', gap: '8px', marginTop: '4px', paddingLeft: '4px' }}
                                            >
                                                <button onClick={() => handleRate(msg.id, true, msg.content)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: ratedMessages[msg.id] === 'liked' ? '#22c55e' : '#94a3b8', transition: 'transform 0.2s' }} className="hover-scale" title="Respuesta útil" type="button">
                                                    <ThumbsUp size={14} />
                                                </button>
                                                <button onClick={() => handleRate(msg.id, false, msg.content)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: ratedMessages[msg.id] === 'disliked' ? '#ef4444' : '#94a3b8', transition: 'transform 0.2s' }} className="hover-scale" title="Respuesta incorrecta" type="button">
                                                    <ThumbsDown size={14} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className={styles.messageRow}>
                                    <div className={styles.aiAvatar}><Bot size={18} /></div>
                                    <div className={`${styles.message} ${styles.aiMessage}`}>
                                        <TypingDots />
                                    </div>
                                </div>
                            )}

                            {messages.length === 1 && !isLoading && !isTyping && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className={styles.suggestionsContainer}
                                >
                                    {SUGGESTIONS.map((suggestion, idx) => (
                                        <button key={idx} type="button" className={styles.suggestionPill} onClick={() => handleSend(suggestion)}>
                                            {suggestion}
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleFormSubmit} className={styles.inputArea}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe tu pregunta..."
                                    className={styles.input}
                                    disabled={isLoading}
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    className={`${styles.sendButton} ${inputValue.trim() ? styles.active : ''}`}
                                    disabled={isLoading || !inputValue.trim()}
                                    aria-label="Enviar"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={styles.fab}
                aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
                type="button"
            >
                {isOpen ? <X size={28} /> : 
                    <div style={{ position: 'relative' }}>
                        <Bot size={28} />
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, background: '#4ade80', borderRadius: '50%', border: '2px solid white' }} 
                        />
                    </div>
                }
            </motion.button>
            <style jsx>{`
                .hover-scale { transition: transform 0.2s ease; }
                .hover-scale:hover { transform: scale(1.2); }
            `}</style>
        </div>
    );
}
