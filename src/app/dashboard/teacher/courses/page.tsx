'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Book, Plus, Users, Layout, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Course {
    id: string;
    name: string;
    code: string;
    description: string;
    created_at: string;
}

export default function TeacherCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: '', code: '', description: '' });
    const [isCreating, setIsCreating] = useState(false);
    
    const supabase = createClient();

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Fetching courses for user:', user?.id);
            
            if (user) {
                const { data, error } = await (supabase
                    .from('courses') as any)
                    .select('*')
                    .eq('teacher_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.error('Supabase fetch error:', {
                        message: error.message,
                        details: error.details,
                        hint: error.hint,
                        code: error.code
                    });
                    // Mostrar alerta solo si hay un error real (no un objeto vacío)
                    if (error.message) {
                        alert('Error al cargar cursos: ' + error.message + '\nCódigo: ' + error.code);
                    }
                } else if (data) {
                    setCourses(data);
                }
            }
        } catch (err) {
            console.error('Unexpected error in fetchCourses:', err);
        }
        setIsLoading(false);
    }

    async function handleCreateCourse(e: React.FormEvent) {
        e.preventDefault();
        setIsCreating(true);
        console.log('Attempting to create course:', newCourse);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                alert('No se detectó sesión activa. Por favor, inicia sesión.');
                setIsCreating(false);
                return;
            }

            console.log('Inserting course for teacher:', user.id);

            const { data, error } = await (supabase.from('courses') as any).insert({
                name: newCourse.name,
                code: newCourse.code,
                description: newCourse.description,
                teacher_id: user.id
            }).select();

            if (!error) {
                console.log('Course created successfully:', data);
                setIsModalOpen(false);
                setNewCourse({ name: '', code: '', description: '' });
                fetchCourses();
            } else {
                console.error('Supabase error creating course:', error);
                alert('Error al crear el curso: ' + error.message + '\n\nDetalle: ' + (error.details || 'Revisa los permisos de tu usuario.'));
            }
        } catch (err: any) {
            console.error('Unexpected error creating course:', err);
            alert('Ocurrió un error inesperado: ' + err.message);
        }
        setIsCreating(false);
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Diagnostic Console (Only visible if there are issues) */}
            {(courses.length === 0 && !isLoading) && (
                <div style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.2)', 
                    borderRadius: '12px', 
                    padding: '1.5rem', 
                    marginBottom: '2rem',
                    color: '#ef4444'
                }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Layout size={20} /> Diagnóstico de Conexión
                    </h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Si no ves tus cursos, asegúrate de haber ejecutado el SQL en Supabase.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            onClick={() => fetchCourses()}
                            style={{ 
                                background: '#ef4444', color: 'white', border: 'none', 
                                padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                                fontSize: '0.85rem', fontWeight: 600
                            }}
                        >
                            Reintentar Conexión
                        </button>
                        <button 
                            onClick={async () => {
                                const { data: { user } } = await supabase.auth.getUser();
                                const { data, error } = await supabase.from('courses').select('count', { count: 'exact' });
                                alert(`Sesión: ${user ? 'Activa (' + user.email + ')' : 'Inactiva'}\nTabla Courses: ${error ? 'Error: ' + error.message : 'OK (' + data.length + ' cursos encontrados)'}`);
                            }}
                            style={{ 
                                background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', 
                                padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            Verificar Tabla y Sesión
                        </button>
                    </div>
                </div>
            )}

            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
                        Mis <span style={{ color: 'var(--primary)' }}>Cursos</span>
                    </h1>
                    <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Gestiona tus materias y materiales de estudio</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{ 
                        background: 'var(--primary)', 
                        color: 'white', 
                        padding: '1rem 1.5rem', 
                        borderRadius: '14px', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                    }}
                >
                    <Plus size={20} /> Crear Curso
                </button>
            </header>

            {isLoading ? (
                <div style={{ padding: '5rem', textAlign: 'center' }}>
                    <Loader2 className="spinner" size={40} color="var(--primary)" />
                </div>
            ) : courses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--glass-border)' }}>
                    <BookOpen size={60} color="var(--secondary)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>No tienes cursos activos</h3>
                    <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>Comienza creando tu primer curso para invitar alumnos y alimentar la IA.</p>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '12px' }}>Crear ahora</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {courses.map(course => (
                        <Link key={course.id} href={`/dashboard/teacher/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="glass-panel card-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '12px' }}>
                                        <Book size={24} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', color: 'var(--secondary)' }}>
                                        {course.code}
                                    </span>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{course.name}</h3>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--secondary)', lineHeight: '1.6', height: '3rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {course.description || 'Sin descripción disponible.'}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--secondary)', fontSize: '0.85rem' }}>
                                        <Users size={16} /> 0 Alumnos
                                    </div>
                                    <div style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        Gestionar <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Modal de Creación */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem', border: '1px solid var(--glass-border)', animation: 'slideUp 0.3s ease-out' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Nuevo Curso</h2>
                        <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Nombre de la Materia</label>
                                <input 
                                    required 
                                    className="input-field" 
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} 
                                    placeholder="Ej: Matemáticas Avanzadas" 
                                    value={newCourse.name}
                                    onChange={e => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Código del Curso</label>
                                <input 
                                    required 
                                    className="input-field" 
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} 
                                    placeholder="Ej: MATH-101" 
                                    value={newCourse.code}
                                    onChange={e => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Descripción (Breve)</label>
                                <textarea 
                                    rows={3}
                                    className="input-field" 
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', resize: 'none' }} 
                                    placeholder="De qué trata esta materia..." 
                                    value={newCourse.description}
                                    onChange={e => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" disabled={isCreating} style={{ flex: 1.5, padding: '1rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}>
                                    {isCreating ? 'Creando...' : 'Crear Materia'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .card-hover:hover { transform: translateY(-5px); border-color: var(--primary) !important; background: rgba(255,255,255,0.06) !important; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4); }
                .input-field:focus { border-color: var(--primary) !important; background: rgba(255,255,255,0.08) !important; outline: none; }
            `}</style>
        </div>
    );
}
