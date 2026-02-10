'use client';

import React, { useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import AiSidebar from '@/components/AiSidebar';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            {/* Main Content Area - Animates resizing */}
            <motion.main
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            </motion.main>

            {/* Sidebar - Animates width and content */}
            <AiSidebar
                collapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
        </div>
    );
}
