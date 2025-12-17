'use client';

import { useState } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger',
}: ConfirmDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    const getColors = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: 'text-red-600',
                    bg: 'bg-red-100',
                    button: 'bg-red-600 hover:bg-red-700',
                };
            case 'warning':
                return {
                    icon: 'text-yellow-600',
                    bg: 'bg-yellow-100',
                    button: 'bg-yellow-600 hover:bg-yellow-700',
                };
            default:
                return {
                    icon: 'text-blue-600',
                    bg: 'bg-blue-100',
                    button: 'bg-blue-600 hover:bg-blue-700',
                };
        }
    };

    const colors = getColors();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                        <svg className={`w-6 h-6 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-600 text-sm">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 ${colors.button} text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Procesando...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
