'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Github, Chrome, User, GraduationCap, ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signIn, userRole, user } = useAuth();
    
    // Invitation detection
    const inviteCourseId = searchParams.get('courseId');
    const inviteEmail = searchParams.get('email');
    const isInvite = searchParams.get('invite') === 'true';

    const [email, setEmail] = useState(inviteEmail || '');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [invitationName, setInvitationName] = useState('');

    // Fetch course name if invited
    useEffect(() => {
        if (isInvite && inviteCourseId) {
            const supabase = createClient();
            supabase.from('courses').select('name').eq('id', inviteCourseId).single()
                .then(({ data }) => {
                    if (data) setInvitationName((data as any).name);
                });
        }
    }, [isInvite, inviteCourseId]);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (user && userRole && !isChangingPassword) {
            // Si es administrador, no pedir cambio de clave y redirigir directamente
            if (userRole === 'admin') {
                redirectByRole(userRole);
                return;
            }

            // Verificar si debe cambiar clave antes de redirigir (para otros roles)
            const supabase = createClient();
            supabase.from('user_profiles').select('must_change_password').eq('id', user.id).single()
                .then(({ data }) => {
                    const profile = data as { must_change_password: boolean } | null;
                    if (profile?.must_change_password) {
                        setIsChangingPassword(true);
                    } else {
                        redirectByRole(userRole);
                    }
                });
        }
    }, [user, userRole, isChangingPassword]);

    const redirectByRole = (role: 'admin' | 'teacher' | 'student') => {
        switch (role) {
            case 'admin':
                router.push('/dashboard/admin');
                break;
            case 'teacher':
                router.push('/dashboard/teacher');
                break;
            case 'student':
            default:
                router.push('/dashboard/student-home');
                break;
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const { error: signInError } = await signIn(email, password);

        if (signInError) {
            setError(signInError.message || 'Credenciales inválidas');
            setIsLoading(false);
        } else {
            // El useEffect de arriba se encargará de verificar must_change_password
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) return setError('La nueva clave debe tener al menos 6 caracteres');
        setIsLoading(true);

        const supabase = createClient();
        
        // 1. Actualizar contraseña en Auth
        const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
        if (authError) {
            setError(authError.message);
            setIsLoading(false);
            return;
        }

        // 2. Marcar must_change_password como false en perfil
        const { error: profileError } = await (supabase
            .from('user_profiles')
            .update({ must_change_password: false } as any)
            .eq('id', user?.id) as any);

        if (profileError) {
            setError('Clave actualizada, pero hubo un error al actualizar el perfil.');
        } else {
            setIsChangingPassword(false);
            if (userRole) redirectByRole(userRole);
        }
        setIsLoading(false);
    };

    if (isChangingPassword) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15), transparent 70%)'
            }}>
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100 }}>
                    <ThemeToggle />
                </div>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
                    <div style={{ textAlign: 'center' }}>
                        <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Actualiza tu Contraseña</h1>
                        <p style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>Por seguridad, debes cambiar tu clave temporal por una nueva para continuar.</p>
                    </div>

                    <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                            <input
                                type="password"
                                placeholder="Nueva contraseña segura"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--foreground)', outline: 'none' }}
                                required
                            />
                        </div>

                        {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer', transition: 'all 0.2s', opacity: isLoading ? 0.7 : 1 }}
                        >
                            {isLoading ? 'Actualizando...' : 'Confirmar y Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15), transparent 70%)',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100 }}>
                <ThemeToggle />
            </div>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem'
                    }}>
                        {isInvite ? '¡Bienvenido!' : 'Inicia Sesión'}
                    </h1>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>
                        {isInvite ? `Completa tu acceso para unirte a ${invitationName || 'tu curso'}` : 'Accede a tu Aula Virtual con IA'}
                    </p>
                </div>

                {isInvite && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '12px'
                    }}>
                        <Info size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                            Has sido invitado oficialmente. Usa tu correo <strong>{inviteEmail}</strong> para entrar y acceder a los materiales.
                        </p>
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                        <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.8rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'var(--foreground)',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                fontFamily: 'inherit'
                            }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.8rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'var(--foreground)',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                fontFamily: 'inherit'
                            }}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#ef4444',
                            fontSize: '0.85rem',
                            marginTop: '-0.5rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: isLoading ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'transform 0.2s, opacity 0.2s',
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? 'Iniciando sesión...' : <>Ingresar a mi Aula Virtual <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--secondary)', fontSize: '0.9rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                    <span>o continúa con</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--foreground)',
                        transition: 'background 0.2s'
                    }}>
                        <Github size={20} />
                    </button>
                    <button style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--foreground)',
                        transition: 'background 0.2s'
                    }}>
                        <Chrome size={20} />
                    </button>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--secondary)', marginTop: '1rem' }}>
                    ¿No tienes cuenta? <Link href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Regístrate</Link>
                </p>
            </div>
        </div>
    );
}
