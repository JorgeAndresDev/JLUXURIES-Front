export interface User {
    id_cliente?: number;
    email: string;
    nombre?: string;
    telefono?: string;
    direccion?: string;
    role?: 'admin' | 'client';
}

export interface Product {
    idProducts: number;
    ProductsName: string;
    moto?: string;
    Description: string;
    categoria: string;
    Quantity: number;
    Price: number;
    color: string;
    image_url?: string;
}

export interface CartItem {
    id_carrito?: number; // ID del item en el carrito
    id_cliente: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal?: number;
    estado: 'activo';
    // Product details from backend join (comes directly in the item, not nested)
    ProductsName?: string;
    image_url?: string;
    categoria?: string;
    descripcion?: string;
    // Legacy support for nested product object (in case backend changes)
    product?: Product;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    usuario: User;
}

export interface Client {
    id_cliente?: number;
    nombre: string;
    email: string;
    password?: string;
    telefono?: string;
    direccion?: string;
    role?: 'admin' | 'client';
}


export interface AuditLog {
    id_log: number;
    user_id: number;
    user_name: string;
    user_email: string;
    action: string;
    details?: string;
    ip_address?: string;
    timestamp: string;
}

export type EnviosCarrier =
    | 'interrapidisimo'
    | 'tcc'
    | 'servientrega'
    | 'coordinadora'
    | 'envia';

export type QuoteState = 'seleccionada' | 'usada' | 'anulada';

export type GuideState = 'creada' | 'pdf_generado' | 'pdf_error' | 'cancelada';

export interface EnviosStatus {
    provider: string;
    configured: boolean;
    authenticated: boolean;
    expires_in_seconds: number;
}

export interface EnviosBranch {
    id: number;
    id_usuario: number;
    nombre_sucursal: string;
    codigo_sucursal: string;
    ciudad_origen: string;
    direccion: string;
    telefono: string;
    activa: boolean;
}

export interface DaneCity {
    codigo: string;
    nombre: string;
}

export interface DaneCitiesResponse {
    total: number;
    ciudades: DaneCity[];
}

export interface QuoteRequest {
    codigo_destino: string;
    valor_producto: number;
    peso_kg: number;
    largo_cm: number;
    ancho_cm: number;
    alto_cm: number;
    valor_declarado?: number | null;
    incluir_flete_en_valor_declarado?: boolean;
    aplica_contrapago?: boolean;
    seguro99?: boolean;
    seguro99plus?: boolean;
    tipo_entrega?: 1 | 2 | 3;
    tipo_servicio?: 1 | 2;
    fecha?: string | null;
}

export interface QuoteOption {
    transportadora: EnviosCarrier;
    valor: number;
    sobreflete: number;
    valor_contrapago: number;
    seguro99: number;
    total: number;
    dias: string | number | null;
    fecha_entrega: string | null;
    cotizacion_id: string | null;
    id_servicio: number | null;
    mensaje: string | null;
}

export interface QuoteUnavailable {
    transportadora: string;
    mensaje: string;
}

export interface QuoteResponse {
    cotizacion_id: string;
    seleccionada: QuoteOption;
    opciones: QuoteOption[];
    no_disponibles: QuoteUnavailable[];
    valor_declarado: number;
    valor_producto: number;
    incluye_flete_en_valor_declarado: boolean;
    peso_facturable: number;
    peso_volumetrico: number;
    codigo_destino: string;
    codigo_sucursal: string;
    nombre_sucursal: string;
    ciudad_origen: string;
    fecha: string;
    registro_id: number | null;
}

export interface GuideRecipient {
    tipo_documento: string;
    numero_documento: string;
    dv: string | null;
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    telefono: string;
    direccion: string;
    correo: string;
    id_localidad: string;
}

export interface GuideRequest {
    origen?: 'app' | '99envios';
    cotizacion_id: string;
    transportadora: EnviosCarrier;
    valor_declarado: number;
    peso_kg: number;
    largo_cm: number;
    ancho_cm: number;
    alto_cm: number;
    contenido: string;
    destinatario: GuideRecipient;
    observaciones: string;
    aplica_contrapago: boolean;
    seguro99: boolean;
    seguro99plus: boolean;
    tipo_entrega: 1;
    tipo_servicio: 1 | 2;
    tipo_rotulo: 1 | 2;
}

export interface GuideResponse {
    numero_guia: string;
    transportadora: EnviosCarrier;
    cotizacion_id: string;
    valor_declarado: number;
    mensaje: string | null;
    pdf_url: string | null;
    pdf_endpoint: string | null;
    pdf_error: string | null;
    pdf_generado: boolean;
    registro_id: number | null;
}

export interface QuoteHistoryItem {
    id_cotizacion: number;
    id_cliente: number;
    cotizacion_id: string;
    transportadora: EnviosCarrier;
    codigo_sucursal: string;
    nombre_sucursal: string;
    ciudad_origen: string;
    codigo_destino: string;
    valor_producto: number;
    valor_declarado: number;
    incluye_flete_en_valor_declarado: boolean;
    peso_facturable: number;
    peso_volumetrico: number;
    fecha_cotizacion: string;
    total: number;
    valor: number;
    sobreflete: number;
    valor_contrapago: number;
    seguro99: number;
    estado: QuoteState;
    fecha_creacion: string;
    fecha_actualizacion: string | null;
}

export interface QuoteDetail extends QuoteHistoryItem {
    request: QuoteRequest;
    response: QuoteResponse;
}

export interface QuoteHistoryResponse {
    total: number;
    items: QuoteHistoryItem[];
}

export interface GuideHistoryItem {
    id_guia: number;
    id_cotizacion: number | null;
    id_cliente: number;
    numero_guia: string;
    transportadora: EnviosCarrier;
    cotizacion_id: string | null;
    valor_declarado: number;
    estado: GuideState;
    pdf_url: string | null;
    pdf_error: string | null;
    fecha_creacion: string;
    fecha_actualizacion: string | null;
}

export interface GuideEvent {
    id_evento: number;
    estado: string;
    detalle: string | null;
    fecha_creacion: string;
}

export interface GuideDetail extends GuideHistoryItem {
    request: GuideRequest;
    response: GuideResponse;
    eventos: GuideEvent[];
}

export interface GuideHistoryResponse {
    total: number;
    items: GuideHistoryItem[];
}
