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
    Sparkles,
    Trash2,
    UserPlus,
    FileUp
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

        // Intenta insertar o actualizar (upsert) para permitir reenvíos
        const { error } = await (supabase.from('enrollments') as any).upsert({
            course_id: courseId,
            student_email: inviteEmail,
            status: 'invited'
        }, { 
            onConflict: 'course_id,student_email' 
        });

        if (!error || error.code === '23505') { // Si no hay error o es duplicado, enviamos email
            // Send email invitation
            try {
                const res = await fetch('/api/invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: inviteEmail,
                        courseId: courseId,
                        courseName: course?.name || 'Materia Nueva'
                    }),
                });
                
                const data = await res.json();
                if (!res.ok) {
                    alert('Email no enviado: ' + (data.details?.message || data.error));
                }
            } catch (emailErr) {
                console.error('Error enviando email:', emailErr);
            }

            setInviteEmail('');
            fetchCourseData();
        } else {
            alert('Error al invitar: ' + error.message);
        }
        setIsInviting(false);
    }

    async function handleDeleteEnrollment(id: string) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta invitación?')) return;
        
        const { error } = await supabase
            .from('enrollments')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchCourseData();
        } else {
            alert('Error al eliminar: ' + error.message);
        }
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
                                {/* Manual Invite Form */}
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <UserPlus size={20} color="var(--primary)" /> Invitación Individual
                                    </h3>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        const studentData = {
                                            firstName: formData.get('firstName') as string,
                                            lastName: formData.get('lastName') as string,
                                            idNumber: formData.get('idNumber') as string,
                                            email: formData.get('email') as string,
                                            courseId: courseId,
                                            courseName: course?.name
                                        };

                                        if (!studentData.email || !studentData.idNumber) return;
                                        setIsInviting(true);

                                        try {
                                            const res = await fetch('/api/students/invite', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(studentData)
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                                alert('¡Estudiante invitado con éxito!');
                                                (e.target as HTMLFormElement).reset();
                                                fetchCourseData();
                                            } else {
                                                alert('Error: ' + data.error);
                                            }
                                        } catch (err) {
                                            alert('Error de conexión');
                                        } finally {
                                            setIsInviting(false);
                                        }
                                    }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input required name="firstName" placeholder="Nombres" style={{ padding: '0.9rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
                                        <input required name="lastName" placeholder="Apellidos" style={{ padding: '0.9rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
                                        <input required name="idNumber" placeholder="Cédula (Solo números)" style={{ padding: '0.9rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
                                        <input required name="email" type="email" placeholder="Correo Electrónico" style={{ padding: '0.9rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
                                        
                                        <button 
                                            disabled={isInviting}
                                            style={{ 
                                                gridColumn: 'span 2',
                                                padding: '1rem', 
                                                borderRadius: '10px', 
                                                background: 'var(--primary)', 
                                                color: 'white', 
                                                border: 'none', 
                                                fontWeight: 700, 
                                                cursor: 'pointer', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                gap: '10px' 
                                            }}
                                        >
                                            {isInviting ? <div className="spinner-small" /> : <Plus size={20} />} Registrar e Invitar
                                        </button>
                                    </form>
                                </div>

                                {/* Batch Upload Section */}
                                <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '3rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Users size={20} color="var(--primary)" /> Carga por Lotes (IA)
                                    </h3>
                                    <div 
                                        style={{ 
                                            border: '2px dashed var(--glass-border)', 
                                            borderRadius: '16px', 
                                            padding: '2.5rem', 
                                            textAlign: 'center',
                                            background: 'rgba(255,255,255,0.01)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onClick={() => document.getElementById('batchInviteInput')?.click()}
                                    >
                                        <FileUp size={32} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                                        <p style={{ margin: 0, fontWeight: 600 }}>Sube tu lista de alumnos</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '8px' }}>PDF. Excel, Word o TXT</p>
                                        <input 
                                            type="file" 
                                            id="batchInviteInput" 
                                            hidden 
                                            accept=".pdf,.docx,.xlsx,.txt"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                
                                                const btn = e.target.parentElement?.querySelector('p') as HTMLParagraphElement;
                                                const originalText = btn.innerText;
                                                btn.innerText = 'Procesando lista con IA...';
                                                
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                formData.append('courseId', courseId);
                                                formData.append('courseName', course?.name || '');

                                                try {
                                                    const res = await fetch('/api/students/batch-invite', { method: 'POST', body: formData });
                                                    const data = await res.json();
                                                    if (res.ok) {
                                                        alert(`¡Carga completada! Se procesaron ${data.processed} de ${data.total} alumnos.`);
                                                        fetchCourseData();
                                                    } else {
                                                        alert('Error en carga masiva: ' + data.error);
                                                    }
                                                } catch (err) {
                                                    alert('Error de conexión');
                                                } finally {
                                                    btn.innerText = originalText;
                                                }
                                            }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '1rem', lineHeight: 1.5 }}>
                                        * La IA extraerá nombres, correos y cédulas para crear las cuentas automáticamente.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.03)', fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <tr>
                                        <th style={{ padding: '1.25rem 2rem' }}>Estudiante</th>
                                        <th style={{ padding: '1.25rem 2rem' }}>Correo</th>
                                        <th style={{ padding: '1.25rem 2rem' }}>Estado</th>
                                        <th style={{ padding: '1.25rem 2rem' }}>Fecha</th>
                                        <th style={{ padding: '1.25rem 2rem' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrollments.map(enroll => (
                                        <tr key={enroll.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1.25rem 2rem', fontWeight: 500 }}>
                                                {enroll.id_number ? enroll.id_number : <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>S/C</span>}
                                            </td>
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
                                                 <div style={{ display: 'flex', gap: '10px' }}>
                                                     <button 
                                                         onClick={() => handleDeleteEnrollment(enroll.id)}
                                                         style={{ 
                                                             background: 'rgba(239, 68, 68, 0.1)', 
                                                             border: '1px solid rgba(239, 68, 68, 0.2)', 
                                                             color: '#ef4444', 
                                                             padding: '6px', 
                                                             borderRadius: '8px', 
                                                             cursor: 'pointer',
                                                             display: 'flex',
                                                             alignItems: 'center',
                                                             justifyContent: 'center',
                                                             transition: 'all 0.2s'
                                                         }}
                                                         title="Borrar invitación"
                                                     >
                                                         <Trash2 size={16} />
                                                     </button>
                                                     <button style={{ background: 'transparent', border: 'none', color: 'var(--secondary)', cursor: 'pointer' }}><MoreVertical size={18} /></button>
                                                 </div>
                                             </td>
                                        </tr>
                                    ))}
                                    {enrollments.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--secondary)' }}>
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
                        <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Upload size={20} color="var(--primary)" /> Cargar Material de Apoyo
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Título del recurso (ej: Guía de Algoritmos)" 
                                        id="materialTitle"
                                        style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                    <textarea 
                                        placeholder="O pega el contenido aquí..." 
                                        id="materialContent"
                                        rows={5}
                                        style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', resize: 'vertical' }}
                                    ></textarea>
                                </div>
                                <div 
                                    style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '2rem', cursor: 'pointer' }}
                                    onClick={() => document.getElementById('courseFileInput')?.click()}
                                >
                                    <Upload size={32} color="var(--secondary)" />
                                    <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Subir PDF o Word</p>
                                    <input 
                                        type="file" 
                                        id="courseFileInput" 
                                        hidden 
                                        accept=".pdf,.docx,.txt"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const titleInput = document.getElementById('materialTitle') as HTMLInputElement;
                                                if (!titleInput.value) titleInput.value = file.name.split('.')[0];
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <button 
                                id="ingestBtn"
                                onClick={async () => {
                                    const title = (document.getElementById('materialTitle') as HTMLInputElement).value;
                                    const content = (document.getElementById('materialContent') as HTMLTextAreaElement).value;
                                    const fileInput = document.getElementById('courseFileInput') as HTMLInputElement;
                                    const file = fileInput.files?.[0];
                                    const btn = document.getElementById('ingestBtn') as HTMLButtonElement;

                                    if (!title) return alert('Por favor ingresa un título');
                                    if (!content && !file) return alert('Ingresa contenido o sube un archivo');

                                    btn.disabled = true;
                                    btn.innerText = 'Procesando...';

                                    const formData = new FormData();
                                    formData.append('title', title);
                                    formData.append('courseId', courseId);
                                    if (file) formData.append('file', file);
                                    if (content) formData.append('content', content);

                                    try {
                                        const res = await fetch('/api/ingest', { method: 'POST', body: formData });
                                        const data = await res.json();
                                        if (res.ok) {
                                            alert('¡Material cargado con éxito!');
                                            location.reload();
                                        } else {
                                            alert('Error: ' + data.error);
                                        }
                                    } catch (err) {
                                        alert('Error de conexión');
                                    } finally {
                                        btn.disabled = false;
                                        btn.innerText = 'Cargar Material';
                                    }
                                }}
                                style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Cargar Material
                            </button>
                        </section>
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
