'use client';

import React from 'react';

/**
 * Panel del Estudiante - Reiniciado desde cero.
 * Este archivo está listo para ser reconstruido según los nuevos requerimientos.
 */
export default function StudentDashboardPage() {
    return (
        <div style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            {/* El panel está listo para recibir el nuevo diseño */}
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
