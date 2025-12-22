import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}
            `}
            aria-label="Toggle Theme"
        >
            <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center relative z-10"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                style={{
                    marginLeft: theme === 'dark' ? 'auto' : '0',
                    marginRight: theme === 'dark' ? '0' : 'auto',
                }}
            >
                {theme === 'dark' ? (
                    <Moon size={12} className="text-blue-600" />
                ) : (
                    <Sun size={12} className="text-yellow-500" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
