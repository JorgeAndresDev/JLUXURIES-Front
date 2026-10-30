import { useEffect, useRef, useState } from 'react';

import type { NotificationType } from '../../../../components/common/Notification';
import { useEnviosStatus } from '../../../../hooks/useEnviosStatus';
import { createShippingGuide, quoteShipping } from '../../../../services/Envios';
import {
    carrierLabel,
    getEnviosErrorMessage,
} from '../../../../utils/envios';
import type {
    DaneCity,
    EnviosCarrier,
    GuideRecipient,
    GuideRequest,
    GuideResponse,
    QuoteOption,
    QuoteRequest,
    QuoteResponse,
} from '../../../../types';
import {
    initialNotification,
    initialRecipient,
    initialShipping,
    parseNumber,
    type NotificationState,
    type RecipientFormState,
    type ShippingFormState,
} from './types';

export const useGuideWizard = () => {
    const { branch, error: branchError } = useEnviosStatus();
    const creatingRef = useRef(false);

    const [step, setStep] = useState(0);
    const [destination, setDestination] = useState<DaneCity | null>(null);
    const [shipping, setShipping] = useState<ShippingFormState>(initialShipping);
    const [recipient, setRecipient] = useState<RecipientFormState>(initialRecipient);
    const [quote, setQuote] = useState<QuoteResponse | null>(null);
    const [selectedCarrier, setSelectedCarrier] = useState<EnviosCarrier | null>(null);
    const [createdGuide, setCreatedGuide] = useState<GuideResponse | null>(null);
    const [accepted, setAccepted] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isQuoting, setIsQuoting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [notification, setNotification] = useState<NotificationState>(initialNotification);

    const selectedOption: QuoteOption | null = quote
        ? quote.opciones.find((option) => option.transportadora === selectedCarrier)
            ?? quote.seleccionada
        : null;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step, createdGuide]);

    const showNotification = (type: NotificationType, title: string, message: string) => {
        setNotification({ isOpen: true, type, title, message });
    };

    const invalidateQuote = () => {
        setQuote(null);
        setSelectedCarrier(null);
        setQuoteError(null);
    };

    const updateShipping = (
        patch: Partial<ShippingFormState>,
        affectsQuote = true,
    ) => {
        setShipping((previous) => ({ ...previous, ...patch }));
        setAccepted(false);
        setCreateError(null);
        if (affectsQuote) invalidateQuote();
    };

    const updateRecipient = (patch: Partial<RecipientFormState>) => {
        setRecipient((previous) => ({ ...previous, ...patch }));
        setAccepted(false);
        setCreateError(null);
    };

    const selectDestination = (city: DaneCity | null) => {
        setDestination(city);
        setAccepted(false);
        setFieldErrors((previous) => {
            const next = { ...previous };
            delete next.destination;
            return next;
        });
        invalidateQuote();
    };

    const selectCarrier = (option: QuoteOption) => {
        setSelectedCarrier(option.transportadora);
        setQuoteError(null);
    };

    const validateShipping = (): Record<string, string> => {
        const errors: Record<string, string> = {};

        if (!destination) {
            errors.destination = 'Selecciona la ciudad de destino.';
        }

        const product = parseNumber(shipping.valorProducto);
        if (!Number.isFinite(product) || product <= 0) {
            errors.valorProducto = 'Ingresa un valor de producto mayor a cero.';
        }

        const weight = parseNumber(shipping.peso);
        if (!Number.isFinite(weight) || weight <= 0) {
            errors.peso = 'Ingresa un peso mayor a cero.';
        }

        const dimensions: Array<[keyof ShippingFormState, string]> = [
            ['largo', shipping.largo],
            ['ancho', shipping.ancho],
            ['alto', shipping.alto],
        ];
        dimensions.forEach(([key, value]) => {
            const parsed = parseNumber(value);
            if (!Number.isFinite(parsed) || parsed <= 0) {
                errors[key] = 'Debe ser mayor a cero.';
            }
        });

        if (shipping.valorDeclarado.trim()) {
            const declared = parseNumber(shipping.valorDeclarado);
            if (!Number.isFinite(declared) || declared < 0 || !Number.isInteger(declared)) {
                errors.valorDeclarado = 'Ingresa un valor declarado válido en pesos.';
            }
        }

        if (!shipping.contenido.trim()) {
            errors.contenido = 'Describe el contenido del paquete.';
        }

        return errors;
    };

    const validateRecipient = (): Record<string, string> => {
        const errors: Record<string, string> = {};

        if (!recipient.numeroDocumento.trim()) {
            errors.numeroDocumento = 'Ingresa el número de documento.';
        }
        if (!recipient.nombre.trim()) {
            errors.nombre = 'Ingresa el nombre del destinatario.';
        }
        if (!recipient.primerApellido.trim()) {
            errors.primerApellido = 'Ingresa el primer apellido.';
        }

        const phoneDigits = recipient.telefono.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
            errors.telefono = 'El teléfono debe tener al menos 7 dígitos.';
        }
        if (!recipient.direccion.trim()) {
            errors.direccion = 'Ingresa la dirección de entrega.';
        }
        if (!/^\S+@\S+\.\S+$/.test(recipient.correo.trim())) {
            errors.correo = 'Ingresa un correo electrónico válido.';
        }

        return errors;
    };

    const buildQuoteRequest = (city: DaneCity): QuoteRequest => {
        const declaredText = shipping.valorDeclarado.trim();
        const declared = declaredText ? Math.round(parseNumber(declaredText)) : null;

        return {
            codigo_destino: city.codigo,
            valor_producto: Math.round(parseNumber(shipping.valorProducto)),
            peso_kg: parseNumber(shipping.peso),
            largo_cm: parseNumber(shipping.largo),
            ancho_cm: parseNumber(shipping.ancho),
            alto_cm: parseNumber(shipping.alto),
            valor_declarado: declared,
            incluir_flete_en_valor_declarado: shipping.incluirFlete,
            aplica_contrapago: shipping.aplicaContrapago,
            seguro99: shipping.insurance === 'seguro99',
            seguro99plus: shipping.insurance === 'seguro99plus',
            tipo_entrega: 1,
            tipo_servicio: shipping.tipoServicio,
        };
    };

    const buildGuideRequest = (): GuideRequest | null => {
        if (!quote || !destination || !selectedOption?.cotizacion_id) {
            return null;
        }

        const recipientPayload: GuideRecipient = {
            tipo_documento: recipient.tipoDocumento,
            numero_documento: recipient.numeroDocumento.trim(),
            dv: recipient.tipoDocumento === 'NIT' && recipient.dv.trim()
                ? recipient.dv.trim()
                : null,
            nombre: recipient.nombre.trim(),
            primer_apellido: recipient.primerApellido.trim(),
            segundo_apellido: recipient.segundoApellido.trim(),
            telefono: recipient.telefono.trim(),
            direccion: recipient.direccion.trim(),
            correo: recipient.correo.trim(),
            id_localidad: destination.codigo,
        };

        return {
            cotizacion_id: selectedOption.cotizacion_id,
            transportadora: selectedOption.transportadora,
            valor_declarado: quote.valor_declarado,
            peso_kg: parseNumber(shipping.peso),
            largo_cm: parseNumber(shipping.largo),
            ancho_cm: parseNumber(shipping.ancho),
            alto_cm: parseNumber(shipping.alto),
            contenido: shipping.contenido.trim(),
            destinatario: recipientPayload,
            observaciones: recipient.observaciones.trim(),
            aplica_contrapago: shipping.aplicaContrapago,
            seguro99: shipping.insurance === 'seguro99',
            seguro99plus: shipping.insurance === 'seguro99plus',
            tipo_entrega: 1,
            tipo_servicio: shipping.tipoServicio,
            tipo_rotulo: 1,
        };
    };

    const handleQuote = async () => {
        const errors = validateShipping();
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0 || !destination) {
            showNotification('warning', 'Revisa los datos', 'Completa los campos obligatorios antes de cotizar.');
            return;
        }

        setIsQuoting(true);
        setQuoteError(null);
        try {
            const result = await quoteShipping(buildQuoteRequest(destination));
            setQuote(result);
            setSelectedCarrier(result.seleccionada.transportadora);
            setStep(1);
            showNotification('success', 'Cotización lista', '99envíos devolvió las tarifas del envío.');
        } catch (error) {
            const message = getEnviosErrorMessage(error);
            setQuoteError(message);
            showNotification('error', 'No se pudo cotizar', message);
        } finally {
            setIsQuoting(false);
        }
    };

    const handleContinueToRecipient = () => {
        if (!quote || !selectedOption) {
            setQuoteError('Primero debes generar una cotización.');
            return;
        }
        if (!selectedOption.cotizacion_id) {
            setQuoteError('La opción seleccionada no tiene identificador de cotización. Vuelve a cotizar.');
            return;
        }
        if (quote.valor_declarado < 25_000) {
            setQuoteError('El valor declarado debe ser de al menos $25.000 para crear la guía.');
            return;
        }

        setQuoteError(null);
        setFieldErrors({});
        setStep(2);
    };

    const handleReview = () => {
        const shippingErrors = validateShipping();
        if (Object.keys(shippingErrors).length > 0) {
            setFieldErrors(shippingErrors);
            setStep(0);
            showNotification('warning', 'Revisa el paquete', 'Hay datos del envío que debes corregir.');
            return;
        }

        const recipientErrors = validateRecipient();
        if (Object.keys(recipientErrors).length > 0) {
            setFieldErrors(recipientErrors);
            showNotification('warning', 'Revisa el destinatario', 'Completa los datos de entrega.');
            return;
        }

        setFieldErrors({});
        setCreateError(null);
        setStep(3);
    };

    const handleCreateGuide = async () => {
        if (creatingRef.current) return;

        const errors = { ...validateShipping(), ...validateRecipient() };
        if (Object.keys(errors).length > 0) {
            const shippingKeys = [
                'destination',
                'valorProducto',
                'peso',
                'largo',
                'ancho',
                'alto',
                'valorDeclarado',
                'contenido',
            ];
            const hasShippingErrors = shippingKeys.some((key) => Boolean(errors[key]));
            setConfirmOpen(false);
            setFieldErrors(errors);
            setStep(hasShippingErrors ? 0 : 2);
            return;
        }

        if (!accepted) {
            setConfirmOpen(false);
            showNotification('warning', 'Confirmación requerida', 'Debes confirmar que se generará una guía real.');
            return;
        }

        const payload = buildGuideRequest();
        if (!payload) {
            setConfirmOpen(false);
            setQuoteError('No fue posible preparar la guía. Vuelve a cotizar.');
            setStep(1);
            return;
        }

        creatingRef.current = true;
        setIsCreating(true);
        setCreateError(null);
        try {
            const result = await createShippingGuide(payload);
            setCreatedGuide(result);
            setConfirmOpen(false);
            showNotification(
                'success',
                'Guía creada',
                `La guía ${result.numero_guia} fue creada con ${carrierLabel(result.transportadora)}.`,
            );
        } catch (error) {
            const message = getEnviosErrorMessage(error);
            setCreateError(message);
            setConfirmOpen(false);
            showNotification('error', 'No se pudo crear la guía', message);
        } finally {
            creatingRef.current = false;
            setIsCreating(false);
        }
    };

    const resetForm = () => {
        setDestination(null);
        setShipping(initialShipping);
        setRecipient(initialRecipient);
        setQuote(null);
        setSelectedCarrier(null);
        setCreatedGuide(null);
        setAccepted(false);
        setConfirmOpen(false);
        setQuoteError(null);
        setCreateError(null);
        setFieldErrors({});
        setStep(0);
    };

    return {
        branch,
        branchError,
        step,
        setStep,
        destination,
        selectDestination,
        shipping,
        updateShipping,
        recipient,
        updateRecipient,
        quote,
        selectedOption,
        selectCarrier,
        createdGuide,
        accepted,
        setAccepted,
        confirmOpen,
        setConfirmOpen,
        isQuoting,
        isCreating,
        quoteError,
        createError,
        fieldErrors,
        notification,
        closeNotification: () => setNotification((previous) => ({ ...previous, isOpen: false })),
        handleQuote,
        handleContinueToRecipient,
        handleReview,
        handleCreateGuide,
        resetForm,
    };
};

export type GuideWizard = ReturnType<typeof useGuideWizard>;
