'use client';

import { useState } from 'react';
import { Upload, Database } from 'lucide-react';

export default function AiAdminPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const res = await fetch('/api/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, metadata: { source: 'admin_upload' } }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to ingest document');

            setStatus({
                type: 'success',
                message: `Documento "${title}" procesado correctamente. Creados ${data.chunksProcessed} fragmentos vectoriales.`,
            });
            setTitle('');
            setContent('');
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.message || 'Error desconocido',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>
                <Database size={24} />
                Gestión de Conocimiento IA
            </h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Sube guías, PDFs o texto que quieras que el Asistente Virtual lea y entienda. El sistema extraerá el texto, lo convertirá a matemáticamente (vectores) y lo guardará en la memoria.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div>
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#334155' }}>
                        Título del Documento o Materia
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                        placeholder="Ej. Guía de Álgebra Lineal - Semestre 1"
                    />
                </div>

                <div>
                    <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#334155' }}>
                        Contenido del Texto (Extrae el PDF y pega el texto aquí)
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={10}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                        placeholder="Pega aquí todo el texto de la clase, guía o temario..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: isLoading ? '#94a3b8' : '#2563eb',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        transition: 'background 0.2s',
                    }}
                >
                    <Upload size={18} />
                    {isLoading ? 'Procesando Vectores...' : 'Subir y Entrenar Memoria'}
                </button>

                {status.type && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: status.type === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {status.message}
                    </div>
                )}
            </form>
        </div>
    );
}
