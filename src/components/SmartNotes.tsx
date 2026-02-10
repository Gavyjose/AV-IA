'use client';

import React, { useState } from 'react';
import DraggableWidget from './DraggableWidget';
import { Save } from 'lucide-react';

export default function SmartNotes() {
    const [notes, setNotes] = useState('');

    return (
        <DraggableWidget title="Notas Inteligentes" initialPosition={{ x: 50, y: 100 }}>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Toma notas aquí... La IA las organizará después."
                style={{
                    width: '100%',
                    height: '150px',
                    background: 'rgba(0,0,0,0.1)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    color: 'var(--foreground)',
                    resize: 'none', // Managed by container
                    fontFamily: 'inherit'
                }}
            />
            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}
                    onClick={() => alert('Notas guardadas (simulación)')}
                >
                    <Save size={14} /> Guardar
                </button>
            </div>
        </DraggableWidget>
    );
}
