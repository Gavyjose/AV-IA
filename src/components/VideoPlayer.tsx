import React from 'react';

export default function VideoPlayer() {
    return (
        <div className="glass-panel" style={{
            aspectRatio: '16/9',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ textAlign: 'center', color: 'var(--foreground)' }}>
                {/* Placeholder for actual video content */}
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>▶</div>
                <p>Reproductor de Video Principal</p>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Contenido Educativo en HD</span>
            </div>

            {/* Decorative elements to simulate video UI */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'rgba(255,255,255,0.1)'
            }}>
                <div style={{
                    width: '35%',
                    height: '100%',
                    background: 'var(--primary)'
                }} />
            </div>
        </div>
    );
}
