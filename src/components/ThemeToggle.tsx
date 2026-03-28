'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--foreground)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
            title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        >
            <motion.div
                initial={false}
                animate={{
                    y: theme === 'light' ? 0 : 40,
                    opacity: theme === 'light' ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                style={{ position: 'absolute' }}
            >
                <Sun size={20} />
            </motion.div>
            
            <motion.div
                initial={false}
                animate={{
                    y: theme === 'dark' ? 0 : -40,
                    opacity: theme === 'dark' ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                style={{ position: 'absolute' }}
            >
                <Moon size={20} />
            </motion.div>
        </motion.button>
    );
}
