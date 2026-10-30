import type { NotificationType } from '../../../../components/common/Notification';

export type InsuranceChoice = 'none' | 'seguro99' | 'seguro99plus';

export interface ShippingFormState {
    valorProducto: string;
    peso: string;
    largo: string;
    ancho: string;
    alto: string;
    valorDeclarado: string;
    incluirFlete: boolean;
    aplicaContrapago: boolean;
    insurance: InsuranceChoice;
    tipoServicio: 1 | 2;
    contenido: string;
}

export interface RecipientFormState {
    tipoDocumento: string;
    numeroDocumento: string;
    dv: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    telefono: string;
    direccion: string;
    correo: string;
    observaciones: string;
}

export interface NotificationState {
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
}

export const initialShipping: ShippingFormState = {
    valorProducto: '',
    peso: '',
    largo: '',
    ancho: '',
    alto: '',
    valorDeclarado: '',
    incluirFlete: true,
    aplicaContrapago: false,
    insurance: 'seguro99plus',
    tipoServicio: 1,
    contenido: '',
};

export const initialRecipient: RecipientFormState = {
    tipoDocumento: 'CC',
    numeroDocumento: '',
    dv: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    telefono: '',
    direccion: '',
    correo: '',
    observaciones: '',
};

export const initialNotification: NotificationState = {
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
};

export const steps = [
    'Destino y paquete',
    'Cotización',
    'Destinatario',
    'Confirmación',
];

export const parseNumber = (value: string): number => Number(value.replace(',', '.'));

export const insuranceLabel = (insurance: InsuranceChoice): string => {
    if (insurance === 'seguro99') return 'Seguro 99';
    if (insurance === 'seguro99plus') return 'Seguro 99 Plus';
    return 'Sin seguro';
};
