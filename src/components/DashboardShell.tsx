'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AiChatWidget from '@/components/AiChatWidget';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
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
