import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative h-7 w-14 rounded-full p-1 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950
                ${theme === 'dark' ? 'bg-brand-600' : 'bg-slate-200'}
            `}
            aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
            <motion.div
                className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                style={{
                    marginLeft: theme === 'dark' ? 'auto' : '0',
                    marginRight: theme === 'dark' ? '0' : 'auto',
                }}
            >
                {theme === 'dark' ? (
                    <Moon size={12} className="text-brand-600" />
                ) : (
                    <Sun size={12} className="text-amber-500" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
