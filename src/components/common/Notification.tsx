import { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
    isOpen: boolean;
    onClose: () => void;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
}

const Notification = ({
    isOpen,
    onClose,
    type,
    title,
    message,
    duration = 3000,
}: NotificationProps) => {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'from-green-600/90 to-emerald-700/90',
                    border: 'border-green-500/50',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                };
            case 'error':
                return {
                    bg: 'from-red-600/90 to-rose-700/90',
                    border: 'border-red-500/50',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                };
            case 'warning':
                return {
                    bg: 'from-yellow-600/90 to-orange-700/90',
                    border: 'border-yellow-500/50',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                };
            case 'info':
            default:
                return {
                    bg: 'from-blue-600/90 to-indigo-700/90',
                    border: 'border-blue-500/50',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
            <div className={`bg-gradient-to-r ${styles.bg} border ${styles.border} rounded-xl shadow-2xl shadow-black/50 p-4 max-w-sm w-full`}>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-white">
                        {styles.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
                        <p className="text-white/90 text-sm leading-relaxed">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out;
        }
      `}</style>
        </div>
    );
};

export default Notification;
