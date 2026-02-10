'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Github, Chrome, User, GraduationCap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type UserRole = 'student' | 'teacher' | 'admin';

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState<UserRole>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (email && password) {
                setIsLoading(false);
                // Redirect based on selected role
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
            } else {
                setError('Por favor completa todos los campos');
                setIsLoading(false);
            }
        }, 1500);
    };

    const roleConfig = {
        student: { icon: User, label: 'Estudiante', color: '#3b82f6' },
        teacher: { icon: GraduationCap, label: 'Docente', color: '#8b5cf6' },
        admin: { icon: ShieldCheck, label: 'Admin', color: '#ec4899' }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15), transparent 70%)'
        }}>
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
                        Bienvenido
                    </h1>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>
                        Accede a tu Aula Virtual con IA
                    </p>
                </div>

                {/* Role Selector */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '4px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)'
                }}>
                    {(Object.keys(roleConfig) as UserRole[]).map((r) => {
                        const isActive = role === r;
                        const Icon = roleConfig[r].icon;
                        return (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                style={{
                                    flex: 1,
                                    background: isActive ? 'var(--glass-bg)' : 'transparent',
                                    border: isActive ? '1px solid var(--glass-border)' : 'none',
                                    borderRadius: '8px',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    color: isActive ? 'var(--foreground)' : 'var(--secondary)',
                                    fontWeight: isActive ? 600 : 400,
                                    transition: 'all 0.2s',
                                    fontSize: '0.8rem'
                                }}
                            >
                                <Icon size={18} color={isActive ? roleConfig[r].color : 'currentColor'} />
                                {roleConfig[r].label}
                            </button>
                        )
                    })}
                </div>

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
                            background: role === 'student' ? 'var(--primary)' : role === 'teacher' ? 'var(--accent)' : '#ec4899',
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
                        {isLoading ? 'Iniciando sesión...' : <>Ingresar como {roleConfig[role].label} <ArrowRight size={18} /></>}
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
