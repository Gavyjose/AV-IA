'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    BookOpen, 
    FileText, 
    ArrowLeft, 
    Clock, 
    Download, 
    MessageSquare,
    Sparkles,
    Loader2,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import AiChatWidget from '@/components/AiChatWidget';

interface Material {
    id: string;
    title: string;
    content: string;
    created_at: string;
    metadata: any;
}

interface Course {
    id: string;
    name: string;
    code: string;
    description: string;
    teacher_id: string;
    user_profiles: {
        full_name: string;
    };
}

export default function StudentCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.id as string;
    const [course, setCourse] = useState<Course | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    async function fetchCourseData() {
        setLoading(true);
        try {
            // Fetch Course Info
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select(`
                    *,
                    user_profiles: teacher_id (
                        full_name
                    )
                `)
                .eq('id', courseId)
                .single();

            if (courseError) throw courseError;
            setCourse(courseData as any);

            // Fetch Course Materials
            const res = await fetch(`/api/student/materials?courseId=${courseId}`);
            const data = await res.json();
            if (data.materials) setMaterials(data.materials);

        } catch (err) {
            console.error('Error fetching course data:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            <p style={{ marginTop: '1rem', color: 'var(--secondary)' }}>Preparando tu aula virtual...</p>
        </div>
    );

    if (!course) return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Curso no encontrado</h2>
            <button onClick={() => router.back()} className="glass-panel" style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}> Volver </button>
        </div>
    );

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', paddingBottom: '5rem' }}>
            {/* Navigation Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                    onClick={() => router.push('/dashboard/student-home')}
                    style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={18} /> Volver al Resumen
                </button>
                <ChevronRight size={16} style={{ color: 'var(--glass-border)' }} />
                <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>Aulas Virtuales</span>
                <ChevronRight size={16} style={{ color: 'var(--glass-border)' }} />
                <span style={{ fontWeight: 600 }}>{course.name}</span>
            </div>

            {/* Course Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{
                    padding: '3rem',
                    marginBottom: '2rem',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ position: 'absolute', top: -50, right: -50, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent)', borderRadius: '50%', filter: 'blur(40px)' }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <span style={{ padding: '4px 12px', background: 'var(--primary)', color: 'white', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{course.code}</span>
                        <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>• {course.user_profiles?.full_name}</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {course.name}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--secondary)', maxWidth: '800px', lineHeight: 1.6 }}>
                        {course.description || 'Bienvenido a tu curso. Aquí encontrarás todos los materiales de estudio y el asistente virtual para resolver tus dudas.'}
                    </p>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(350px, 1fr)', gap: '2rem' }}>
                {/* Materials Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <BookOpen size={24} color="var(--primary)" />
                            Materiales del Curso
                        </h2>

                        {materials.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', opacity: 0.7 }}>
                                <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                <p>Aún no se han cargado materiales para este curso.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                {materials.map((material, idx) => (
                                    <motion.div 
                                        key={material.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="glass-panel"
                                        style={{ 
                                            padding: '1.5rem', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            background: 'rgba(255,255,255,0.02)'
                                        }}
                                        whileHover={{ background: 'rgba(255,255,255,0.04)', x: 10 }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                            <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.1)', borderRadius: '12px' }}>
                                                <FileText size={24} color="#3b82f6" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{material.title}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--secondary)', fontSize: '0.8rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={14} /> 
                                                        {new Date(material.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span>• {material.metadata?.type || 'Documento'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="glass-panel" style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--secondary)', cursor: 'pointer' }}>
                                            <Download size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--accent-glass)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={18} color="var(--accent)" />
                            IA Entrenada
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            Este curso cuenta con una Inteligencia Artificial personalizada que ha "leído" todos los materiales cargados.
                        </p>
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>{materials.length}</div>
                            <div style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>Documentos en Memoria</div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={18} color="var(--primary)" />
                            Próximas Actividades
                        </h3>
                        <div style={{ textAlign: 'center', padding: '1rem', opacity: 0.5 }}>
                            <p style={{ fontSize: '0.85rem' }}>No hay entregas programadas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Assistant Widget */}
            <AiChatWidget courseId={courseId} />

            <style jsx>{`
                .glass-panel {
                    transition: all 0.2s ease;
                }
            `}</style>
        </div>
    );
}
