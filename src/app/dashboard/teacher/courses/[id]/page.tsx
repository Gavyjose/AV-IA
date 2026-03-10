'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
    Users, 
    FileText, 
    BarChart3, 
    ArrowLeft, 
    Mail, 
    Plus, 
    MoreVertical, 
    CheckCircle2, 
    Clock, 
    Upload,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface Course {
    id: string;
    name: string;
    code: string;
    description: string;
}

interface Enrollment {
    id: string;
    student_email: string;
    status: 'invited' | 'active';
    enrolled_at: string;
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: courseId } = use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [activeTab, setActiveTab] = useState<'students' | 'materials' | 'ai'>('students');
    const [isLoading, setIsLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    
    const supabase = createClient();

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    async function fetchCourseData() {
        setIsLoading(true);
        
        // Fetch course details
        const { data: courseData } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();
        
        if (courseData) setCourse(courseData);

        // Fetch enrollments
        const { data: enrollData } = await supabase
            .from('enrollments')
            .select('*')
            .eq('course_id', courseId)
            .order('enrolled_at', { ascending: false });
        
        if (enrollData) setEnrollments(enrollData as any);

        setIsLoading(false);
    }

    async function handleInvite(e: React.FormEvent) {
        e.preventDefault();
        if (!inviteEmail) return;
        setIsInviting(true);

        const { error } = await supabase.from('enrollments').insert({
            course_id: courseId,
            student_email: inviteEmail,
            status: 'invited'
        });

        if (!error) {
            setInviteEmail('');
            fetchCourseData();
        } else {
            alert('Error al invitar: ' + error.message);
        }
        setIsInviting(false);
    }

    if (isLoading) return <div style={{ padding: '5rem', textAlign: 'center' }}><div className="spinner" /></div>;
    if (!course) return (
        <div style={{ padding: '5rem', textAlign: 'center' }}>
            <h2>Curso no encontrado</h2>
            <Link href="/dashboard/teacher/courses" style={{ color: 'var(--primary)' }}>Volver a mis cursos</Link>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <Link href="/dashboard/teacher/courses" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    color: 'var(--secondary)', 
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    width: 'fit-content'
                }}>
                    <ArrowLeft size={16} /> Volver a mis cursos
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>{course.name}</h1>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '5px 12px', borderRadius: '20px' }}>
                                {course.code}
                            </span>
                        </div>
                        <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>{course.description}</p>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2.5rem' }}>
                {[
                    { id: 'students', label: 'Estudiantes', icon: <Users size={18} /> },
                    { id: 'materials', label: 'Materiales', icon: <FileText size={18} /> },
                    { id: 'ai', label: 'Panel IA', icon: <Sparkles size={18} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '1rem 0',
                            border: 'none',
                            background: 'transparent',
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--secondary)',
                            fontWeight: activeTab === tab.id ? 700 : 500,
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'color 0.2s'
                        }}
                    >
                        {tab.icon} {tab.label}
                        {activeTab === tab.id && (
                            <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: '3px', background: 'var(--primary)', borderRadius: '3px' }} />
                        )}
                    </button>
                ))}
            </nav>

            <main>
                {activeTab === 'students' && (
                    <div className="tab-content fadeIn">
                        <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Mail size={20} color="var(--primary)" /> Invitar Estudiante
                            </h3>
                            <form onSubmit={handleInvite} style={{ display: 'flex', gap: '1rem' }}>
                                <input 
                                    required
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                />
                                <button 
                                    disabled={isInviting}
                                    style={{ padding: '1rem 2rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                                >
                                    {isInviting ? <div className="spinner-small" /> : <Plus size={20} />} Invitar Alumno
                                </button>
                            </form>
                        </section>

                        <section className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.03)', fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <tr>
                                        <th style={{ padding: '1.25rem 2rem' }}>Correo Electrónico</th>
                                        <th style={{ padding: '1.25rem 2rem' }}>Estado</th>
                                        <th style={{ padding: '1.25rem 2rem' }}>Fecha</th>
                                        <th style={{ padding: '1.25rem 2rem' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrollments.map(enroll => (
                                        <tr key={enroll.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1.25rem 2rem', fontWeight: 500 }}>{enroll.student_email}</td>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                {enroll.status === 'active' ? (
                                                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                                                        <CheckCircle2 size={14} /> Activo
                                                    </span>
                                                ) : (
                                                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                                                        <Clock size={14} /> Invitado
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem', color: 'var(--secondary)', fontSize: '0.9rem' }}>
                                                {new Date(enroll.enrolled_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <button style={{ background: 'transparent', border: 'none', color: 'var(--secondary)', cursor: 'pointer' }}><MoreVertical size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {enrollments.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--secondary)' }}>
                                                Aún no hay estudiantes invitados en este curso.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </section>
                    </div>
                )}

                {activeTab === 'materials' && (
                    <div className="tab-content fadeIn">
                        <div style={{ textAlign: 'center', padding: '5rem', border: '2px dashed var(--glass-border)', borderRadius: '24px' }}>
                            <Upload size={48} color="var(--secondary)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                            <h3>Gestión de Materiales Inteligentes</h3>
                            <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>Aquí podrás subir PDFs, Office y videos que alimentarán a la IA de esta materia.</p>
                            <Link href="/dashboard/ai-admin" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                                <Sparkles size={18} /> Ir al Ingestor de IA
                            </Link>
                        </div>
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="tab-content fadeIn">
                        <div style={{ textAlign: 'center', padding: '5rem', border: '2px dashed var(--glass-border)', borderRadius: '24px' }}>
                            <BarChart3 size={48} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                            <h3>Analíticas de Clase</h3>
                            <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>Próximamente verás aquí las dudas frecuentes de tus alumnos filtradas por esta materia.</p>
                            <Link href="/dashboard/ai-analytics" style={{ color: 'var(--primary)', fontWeight: 700 }}>Ver analíticas generales</Link>
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .tab-content { animation: fadeIn 0.3s ease-out; }
                .spinner { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-radius: 50%; border-top-color: var(--primary); animation: spin 0.8s linear infinite; margin: 0 auto; }
                .spinner-small { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .btn-primary { background: var(--primary); color: white; border-radius: 12px; font-weight: 700; transition: all 0.2s; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); }
            `}</style>
        </div>
    );
}
