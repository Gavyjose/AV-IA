'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AiChatWidget from '@/components/AiChatWidget';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            {/* Top Right Actions */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100, display: 'flex', gap: '1rem' }}>
                <ThemeToggle />
            </div>

            {/* Main Content Area */}
            <main
                style={{
                    flex: 1,
                    padding: '2rem',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    zIndex: 1
                }}
            >
                {children}
            </main>

            {/* Floating Chat Widget */}
            <AiChatWidget />
        </div>
    );
}
