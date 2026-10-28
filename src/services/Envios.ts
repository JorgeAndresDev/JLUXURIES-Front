import api from '../api/axios';

import type {
    DaneCitiesResponse,
    EnviosBranch,
    EnviosCarrier,
    EnviosStatus,
    GuideDetail,
    GuideHistoryResponse,
    GuideRequest,
    GuideResponse,
    GuideState,
    QuoteDetail,
    QuoteHistoryResponse,
    QuoteRequest,
    QuoteResponse,
    QuoteState,
} from '../types';

export interface GuideHistoryParams {
    limit?: number;
    offset?: number;
    estado?: GuideState;
    id_cliente?: number;
    numero_guia?: string;
    transportadora?: EnviosCarrier;
}

export interface QuoteHistoryParams {
    limit?: number;
    offset?: number;
    estado?: QuoteState;
    id_cliente?: number;
    codigo_destino?: string;
}

export const getEnviosStatus = async (): Promise<EnviosStatus> => {
    const response = await api.get<EnviosStatus>('/envios/status');
    return response.data;
};

export const getEnviosBranch = async (): Promise<EnviosBranch> => {
    const response = await api.get<EnviosBranch>('/envios/sucursal');
    return response.data;
};

export const searchCities = async (
    query: string,
    limit = 30,
    signal?: AbortSignal,
): Promise<DaneCitiesResponse> => {
    const response = await api.get<DaneCitiesResponse>('/envios/ciudades', {
        params: { q: query, limit },
        signal,
    });
    return response.data;
};

export const quoteShipping = async (
    payload: QuoteRequest,
): Promise<QuoteResponse> => {
    const response = await api.post<QuoteResponse>('/envios/cotizar', payload);
    return response.data;
};

export const createShippingGuide = async (
    payload: GuideRequest,
): Promise<GuideResponse> => {
    const response = await api.post<GuideResponse>('/envios/guia', payload);
    return response.data;
};

export const getGuidePdf = async (
    numeroGuia: string,
    transportadora: EnviosCarrier,
    aplicaContrapago = false,
    endpoint: string | null = null,
): Promise<Blob> => {
    const url = endpoint || `/envios/guia/${encodeURIComponent(numeroGuia)}/pdf`;
    const response = await api.get<Blob>(url, {
        params: endpoint
            ? undefined
            : {
                transportadora,
                aplica_contrapago: aplicaContrapago,
            },
        responseType: 'blob',
    });
    return response.data;
};

export const getGuideHistory = async (
    params: GuideHistoryParams,
): Promise<GuideHistoryResponse> => {
    const response = await api.get<GuideHistoryResponse>('/envios/guias', {
        params,
    });
    return response.data;
};

export const getGuideDetail = async (id: number): Promise<GuideDetail> => {
    const response = await api.get<GuideDetail>(`/envios/guias/${id}`);
    return response.data;
};

export const getQuoteHistory = async (
    params: QuoteHistoryParams,
): Promise<QuoteHistoryResponse> => {
    const response = await api.get<QuoteHistoryResponse>('/envios/cotizaciones', {
        params,
    });
    return response.data;
};

export const getQuoteDetail = async (id: number): Promise<QuoteDetail> => {
    const response = await api.get<QuoteDetail>(`/envios/cotizaciones/${id}`);
    return response.data;
};
