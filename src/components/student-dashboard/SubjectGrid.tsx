'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Subject {
    id: string;
    name: string;
    professor: string;
    color: string;
    nextClass: string;
    progress: number;
    code: string;
}

export default function SubjectGrid() {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (user) {
            fetchMyCourses();
        }
    }, [user]);

    async function fetchMyCourses() {
        setLoading(true);
        try {
            // 1. Obtener enrollments por email
            const { data: enrollments, error: enrollError } = await supabase
                .from('enrollments')
                .select(`
                    course_id,
                    courses (
                        id,
                        name,
                        code,
                        teacher_id,
                        user_profiles: teacher_id (
                            full_name
                        )
                    )
                `)
                .eq('student_email', user?.email)
                .eq('status', 'active');

            if (enrollError) throw enrollError;

            const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
            
            const formattedSubjects: Subject[] = (enrollments || []).map((en: any, index: number) => ({
                id: en.courses.id,
                name: en.courses.name,
                code: en.courses.code,
                professor: en.courses.user_profiles?.full_name || 'Profesor por asignar',
                color: colors[index % colors.length],
                nextClass: 'Consultar horario',
                progress: 0 // Implementar después con seguimiento real
            }));

            setSubjects(formattedSubjects);
        } catch (err) {
            console.error('Error fetching student courses:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} color="var(--primary)" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '1rem', color: 'var(--secondary)' }}>Cargando tus materias...</p>
        </div>
    );

    if (subjects.length === 0) return (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--glass-border)' }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3>No tienes materias inscritas</h3>
            <p style={{ color: 'var(--secondary)' }}>Cuando un profesor te invite a un curso, aparecerá aquí.</p>
        </div>
    );

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
                        transition: 'all 0.3s ease'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${subject.color}, transparent)` }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: `${subject.color}15`, borderRadius: '12px', border: `1px solid ${subject.color}40` }}>
                            <BookOpen size={24} style={{ color: subject.color }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{subject.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{subject.code}</span>
                                • {subject.professor}
                            </p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Progreso de curso</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: subject.color }}>{subject.progress}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${subject.progress}%` }}
                                style={{ height: '100%', background: subject.color, borderRadius: '3px' }}
                            />
                        </div>
                    </div>

                    <Link href={`/dashboard/student/course/${subject.id}`} style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '0.9rem',
                                background: `linear-gradient(135deg, ${subject.color}, ${subject.color}cc)`,
                                border: 'none',
                                borderRadius: '10px',
                                color: 'white',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            Ir a clase <ArrowRight size={18} />
                        </motion.button>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
