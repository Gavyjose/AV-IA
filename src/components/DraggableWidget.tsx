'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2, Move } from 'lucide-react';

interface DraggableWidgetProps {
    title: string;
    children: React.ReactNode;
    initialPosition?: { x: number; y: number };
    onClose?: () => void;
}

export default function DraggableWidget({
    title,
    children,
    initialPosition = { x: 20, y: 20 },
    onClose
}: DraggableWidgetProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dragRef.current) return;

            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;

            setPosition({
                x: dragRef.current.initialX + dx,
                y: dragRef.current.initialY + dy
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            dragRef.current = null;
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            className="glass-panel"
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                width: isMinimized ? '200px' : '300px',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                transition: 'width 0.2s, height 0.2s'
            }}
        >
            <div
                onMouseDown={handleMouseDown}
                style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid var(--glass-border)',
                    cursor: 'move',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    userSelect: 'none',
                    background: 'rgba(255,255,255,0.05)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <Move size={14} /> {title}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}
                        aria-label={isMinimized ? "Maximizar widget" : "Minimizar widget"}
                    >
                        {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}
                            aria-label="Cerrar widget"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {!isMinimized && (
                <div style={{ padding: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {children}
                </div>
            )}
        </div>
    );
}
