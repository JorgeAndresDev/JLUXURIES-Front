import { useEffect } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isDanger = false,
}: ConfirmModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        await onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-black/50 animate-scale-in">
                {/* Icon */}
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDanger
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-blue-500/10 border border-blue-500/30'
                    }`}>
                    {isDanger ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-gray-300 leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-medium rounded-xl transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-6 py-3 font-bold rounded-xl transition-all shadow-lg transform hover:scale-[1.02] ${isDanger
                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-900/30'
                            : 'bg-gradient-to-r from-[#1E6BFF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-blue-900/30'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-in-out;
        }
        .animate-scale-in {
          animation: scale-in 0.15s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default ConfirmModal;
