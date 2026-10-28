import axios from 'axios';

import type {
    EnviosCarrier,
    GuideState,
    QuoteState,
} from '../types';

const carrierNames: Record<EnviosCarrier, string> = {
    interrapidisimo: 'Interrapidísimo',
    tcc: 'TCC',
    servientrega: 'Servientrega',
    coordinadora: 'Coordinadora',
    envia: 'Envía',
};

const guideStateNames: Record<GuideState, string> = {
    creada: 'Creada',
    pdf_generado: 'PDF generado',
    pdf_error: 'PDF con error',
    cancelada: 'Cancelada',
};

const quoteStateNames: Record<QuoteState, string> = {
    seleccionada: 'Seleccionada',
    usada: 'Usada',
    anulada: 'Anulada',
};

const statusMessages: Record<number, string> = {
    401: 'Tu sesión expiró. Vuelve a iniciar sesión.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'No se encontró el registro solicitado.',
    409: 'La operación entra en conflicto con el estado actual.',
    422: 'Revisa los datos ingresados e inténtalo de nuevo.',
    429: '99envíos limitó las solicitudes. Espera unos segundos e inténtalo de nuevo.',
    502: '99envíos no respondió correctamente. Inténtalo de nuevo más tarde.',
    503: 'El servicio de envíos no está disponible temporalmente.',
};

export const formatCOP = (value: number): string =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);

export const formatDate = (value?: string | null): string => {
    if (!value) return '—';
    const date = value.length === 10
        ? new Date(`${value}T12:00:00`)
        : new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const formatDateTime = (value?: string | null): string => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatWeight = (value: number): string =>
    `${new Intl.NumberFormat('es-CO', {
        maximumFractionDigits: 2,
    }).format(value)} kg`;

export const formatDuration = (seconds: number): string => {
    if (seconds <= 0) return 'Expirado';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} h ${minutes} min`;
    return `${minutes} min`;
};

export const carrierLabel = (carrier: string): string =>
    carrierNames[carrier as EnviosCarrier] ?? carrier;

export const guideStateLabel = (state: string): string =>
    guideStateNames[state as GuideState] ?? state;

export const quoteStateLabel = (state: string): string =>
    quoteStateNames[state as QuoteState] ?? state;

export const guideStateClass = (state: string): string => {
    switch (state) {
        case 'pdf_generado':
            return 'border-green-500/30 bg-green-500/20 text-green-700 dark:text-green-400';
        case 'pdf_error':
            return 'border-yellow-500/30 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
        case 'cancelada':
            return 'border-red-500/30 bg-red-500/20 text-red-700 dark:text-red-400';
        case 'creada':
        default:
            return 'border-blue-500/30 bg-blue-500/20 text-blue-700 dark:text-blue-400';
    }
};

export const quoteStateClass = (state: string): string => {
    switch (state) {
        case 'usada':
            return 'border-green-500/30 bg-green-500/20 text-green-700 dark:text-green-400';
        case 'anulada':
            return 'border-gray-500/30 bg-gray-500/20 text-gray-700 dark:text-gray-300';
        case 'seleccionada':
        default:
            return 'border-blue-500/30 bg-blue-500/20 text-blue-700 dark:text-blue-400';
    }
};

const getDetailMessage = (detail: unknown): string | null => {
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (Array.isArray(detail)) {
        const first = detail[0];
        if (first && typeof first === 'object' && 'msg' in first) {
            const message = (first as Record<string, unknown>).msg;
            if (typeof message === 'string') return message;
        }
    }
    return null;
};

export const getEnviosErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data && typeof data === 'object' && 'detail' in data) {
            const detailMessage = getDetailMessage(
                (data as Record<string, unknown>).detail,
            );
            if (detailMessage) return detailMessage;
        }
        if (typeof data === 'string' && data.trim()) return data;
        if (error.code === 'ERR_NETWORK') {
            return 'No fue posible conectar con el servidor. Verifica tu conexión.';
        }
        const status = error.response?.status;
        if (status && statusMessages[status]) return statusMessages[status];
    }
    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }
    return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
};
