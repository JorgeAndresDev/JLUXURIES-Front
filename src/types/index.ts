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
