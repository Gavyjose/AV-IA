'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Database, BookOpen, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AiAdminPage() {
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState('');
    const [courses, setCourses] = useState<{id: string, name: string}[]>([]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const supabase = createClient();

    useEffect(() => {
        async function fetchCourses() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('courses').select('id, name').eq('teacher_id', user.id);
                if (data) setCourses(data);
            }
        }
        fetchCourses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId) {
            setStatus({ type: 'error', message: 'Por favor selecciona un curso.' });
            return;
        }
        setIsLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const selectedCourse = courses.find(c => c.id === courseId);
            const res = await fetch('/api/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title, 
                    content, 
                    course_id: courseId,
                    metadata: { 
                        source: 'teacher_upload',
                        subject: selectedCourse?.name 
                    } 
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error al procesar el documento');

            setStatus({
                type: 'success',
                message: `¡Excelente! El material ha sido integrado al curso. Se crearon ${data.chunksProcessed} fragmentos de memoria.`,
            });
            setTitle('');
            setCourseId('');
            setContent('');
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.message || 'Ocurrió un error inesperado durante el procesamiento.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            width: '100%',
            padding: '2rem',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            {/* Header */}
            <header style={{ marginBottom: '3rem' }}>
                <Link href="/dashboard/teacher" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    color: 'var(--secondary)', 
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    width: 'fit-content'
                }}>
                    <ArrowLeft size={16} /> Volver al Panel
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                    <div style={{ 
                        background: 'linear-gradient(135deg, var(--primary) 0%, #22c55e 100%)',
                        padding: '12px',
                        borderRadius: '16px',
                        color: 'white',
                        boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)'
                    }}>
                        <Database size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
                            Alimentar <span style={{ color: 'var(--primary)' }}>Cerebro IA</span>
                        </h1>
                        <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Sube material educativo segmentado por curso</p>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <section className="glass-panel" style={{ padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(59, 130, 246, 0.05)', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                        <Sparkles size={20} color="var(--primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                            La IA utilizará este contenido para responder dudas de tus alumnos según el curso asignado.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--secondary)' }}>
                                    MATERIA / CURSO
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <BookOpen size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <select
                                        value={courseId}
                                        onChange={(e) => setCourseId(e.target.value)}
                                        required
                                        style={{ 
                                            width: '100%', 
                                            padding: '0.85rem 1rem 0.85rem 2.5rem', 
                                            borderRadius: '12px', 
                                            background: 'rgba(255,255,255,0.05)', 
                                            border: '1px solid var(--glass-border)',
                                            color: 'white',
                                            outline: 'none',
                                            appearance: 'none',
                                            cursor: 'pointer'
                                        }}
                                        className="input-focus"
                                    >
                                        <option value="" style={{ background: '#0f172a' }}>Selecciona un curso...</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id} style={{ background: '#0f172a' }}>{course.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--secondary)' }}>
                                    TÍTULO DEL RECURSO
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Ej: Guía de Algoritmos"
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.85rem 1rem', 
                                        borderRadius: '12px', 
                                        background: 'rgba(255,255,255,0.05)', 
                                        border: '1px solid var(--glass-border)',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                    className="input-focus"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--secondary)' }}>
                                CONTENIDO DIDÁCTICO
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={10}
                                placeholder="Pega aquí el contenido que la IA debe aprender para este curso..."
                                style={{ 
                                    width: '100%', 
                                    padding: '1.25rem', 
                                    borderRadius: '16px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    outline: 'none',
                                    resize: 'vertical',
                                    minHeight: '200px',
                                    fontSize: '1rem',
                                    lineHeight: '1.6'
                                }}
                                className="input-focus"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                background: isLoading ? 'rgba(255,255,255,0.1)' : 'var(--primary)',
                                color: 'white',
                                padding: '1.25rem',
                                borderRadius: '16px',
                                border: 'none',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                marginTop: '1rem',
                                boxShadow: isLoading ? 'none' : '0 10px 30px rgba(59, 130, 246, 0.3)'
                            }}
                            className="btn-glow"
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner" />
                                    Generando Vectores...
                                </>
                            ) : (
                                <>
                                    <Upload size={22} />
                                    Ingestar Conocimiento
                                </>
                            )}
                        </button>

                        {status.type && (
                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${status.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                color: status.type === 'success' ? '#4ade80' : '#f87171',
                                animation: 'slideUp 0.3s ease-out'
                            }}>
                                {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                <span style={{ fontWeight: 500 }}>{status.message}</span>
                            </div>
                        )}
                    </form>
                </section>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .input-focus:focus {
                    border-color: var(--primary) !important;
                    background: rgba(255,255,255,0.08) !important;
                }
                .btn-glow:hover:not(:disabled) {
                    transform: translateY(-2px);
                    background: #2563eb;
                    box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
                }
                .btn-glow:active:not(:disabled) {
                    transform: translateY(0);
                }
                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255,255,255,0.2);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
