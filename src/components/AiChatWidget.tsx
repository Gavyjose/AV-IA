'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AiChatWidget.module.css';
import { Send, Bot, X, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const INITIAL_MESSAGE: Message = {
    id: 'welcome',
    role: 'assistant',
    content: 'Hola, soy el Asistente Virtual de la UPT Aragua. Estoy aquí para ayudarte con información sobre admisiones, programas académicos, servicios, becas y mucho más. ¿En qué puedo ayudarte hoy?'
};

const SUGGESTIONS = [
    '¿Cómo me inscribo?',
    '¿Qué carreras ofrecen?',
    'Información de postgrados',
    'Becas disponibles'
];

export default function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);
    const [ratedMessages, setRatedMessages] = useState<Record<string, 'liked' | 'disliked'>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isOpen]);

    const handleSend = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            // Prepare the messages payload for the API
            const payload = updatedMessages.map(m => ({ role: m.role, content: m.content }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: payload }),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            // Handle streaming text response
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            const aiMsgId = (Date.now() + 1).toString();
            let fullText = '';

            // Add empty assistant placeholder immediately
            setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    fullText += decoder.decode(value, { stream: true });
                    // Update the last message progressively
                    setMessages(prev =>
                        prev.map(m => m.id === aiMsgId ? { ...m, content: fullText } : m)
                    );
                }
            }
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: 'Lo siento, ocurrió un error al procesar tu consulta. Por favor intenta de nuevo.'
            }]);
        } finally {
            setIsLoading(false);
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
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={styles.chatWindow}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.headerIcon}><Bot size={24} color="white" /></div>
                            <div className={styles.headerTitle}>
                                <h3>Asistente UPT Aragua</h3>
                                <div className={styles.onlineStatus}>
                                    <div className={styles.onlineDot} />
                                    <span>En línea</span>
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
                                <div key={msg.id} className={styles.messageRow}>
                                    {msg.role === 'assistant' && (
                                        <div className={styles.aiAvatar}><Bot size={18} /></div>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', marginLeft: msg.role === 'user' ? 'auto' : '0' }}>
                                        <div className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
                                            {msg.content}
                                        </div>
                                        {msg.role === 'assistant' && idx > 0 && !isLoading && idx === messages.length - 1 && msg.content && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', paddingLeft: '4px' }}>
                                                <button onClick={() => handleRate(msg.id, true, msg.content)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: ratedMessages[msg.id] === 'liked' ? '#22c55e' : '#94a3b8' }} title="Respuesta útil" type="button">
                                                    <ThumbsUp size={14} />
                                                </button>
                                                <button onClick={() => handleRate(msg.id, false, msg.content)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: ratedMessages[msg.id] === 'disliked' ? '#ef4444' : '#94a3b8' }} title="Respuesta incorrecta" type="button">
                                                    <ThumbsDown size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {messages.length === 1 && !isLoading && (
                                <div className={styles.suggestionsContainer}>
                                    {SUGGESTIONS.map((suggestion, idx) => (
                                        <button key={idx} type="button" className={styles.suggestionPill} onClick={() => handleSend(suggestion)}>
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {isLoading && (
                                <div className={styles.messageRow}>
                                    <div className={styles.aiAvatar}><Bot size={18} /></div>
                                    <div className={`${styles.message} ${styles.aiMessage}`}>
                                        <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                                        <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                                    </div>
                                </div>
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
                {isOpen ? <X size={28} /> : <Bot size={28} />}
                {!isOpen && <div className={styles.notificationBadge} />}
            </motion.button>
        </div>
    );
}
