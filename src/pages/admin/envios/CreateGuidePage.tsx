import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Loader2,
    MapPin,
    Package,
    ShieldCheck,
    Truck,
    User,
} from 'lucide-react';

import ConfirmModal from '../../../components/common/ConfirmModal';
import Notification from '../../../components/common/Notification';
import type { NotificationType } from '../../../components/common/Notification';
import DaneCitySelect from '../../../components/envios/DaneCitySelect';
import GuidePdfButton from '../../../components/envios/GuidePdfButton';
import QuoteOptionCard from '../../../components/envios/QuoteOptionCard';
import ShippingStepper from '../../../components/envios/ShippingStepper';
import { useEnviosStatus } from '../../../hooks/useEnviosStatus';
import {
    createShippingGuide,
    quoteShipping,
} from '../../../services/Envios';
import {
    carrierLabel,
    formatCOP,
    formatWeight,
    getEnviosErrorMessage,
} from '../../../utils/envios';
import type {
    DaneCity,
    EnviosCarrier,
    GuideRecipient,
    GuideRequest,
    GuideResponse,
    QuoteOption,
    QuoteRequest,
    QuoteResponse,
} from '../../../types';

type InsuranceChoice = 'none' | 'seguro99' | 'seguro99plus';

interface ShippingFormState {
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

interface RecipientFormState {
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

interface NotificationState {
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
}

const initialShipping: ShippingFormState = {
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

const initialRecipient: RecipientFormState = {
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

const initialNotification: NotificationState = {
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
};

const steps = ['Destino y paquete', 'Cotización', 'Destinatario', 'Confirmación'];

const CreateGuidePage = () => {
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

    const parseNumber = (value: string): number => Number(value.replace(',', '.'));

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

    if (createdGuide) {
        return (
            <div className="min-h-screen w-full bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
                <div className="container mx-auto px-4 pt-24 pb-12">
                    <div className="mx-auto max-w-3xl">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white sm:px-10">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold sm:text-3xl">Guía creada correctamente</h1>
                                        <p className="mt-1 text-white/80">
                                            {carrierLabel(createdGuide.transportadora)} · {createdGuide.numero_guia}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-10">
                                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Número de guía</dt>
                                        <dd className="mt-1 font-mono text-lg font-bold text-gray-900 dark:text-white">{createdGuide.numero_guia}</dd>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Transportadora</dt>
                                        <dd className="mt-1 font-semibold text-gray-900 dark:text-white">{carrierLabel(createdGuide.transportadora)}</dd>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Valor declarado</dt>
                                        <dd className="mt-1 font-semibold text-green-600 dark:text-green-400">{formatCOP(createdGuide.valor_declarado)}</dd>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">PDF</dt>
                                        <dd className="mt-1 font-semibold text-gray-900 dark:text-white">
                                            {createdGuide.pdf_generado ? 'Generado' : 'No generado'}
                                        </dd>
                                    </div>
                                </dl>

                                {createdGuide.mensaje && (
                                    <p className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                                        {createdGuide.mensaje}
                                    </p>
                                )}

                                {!createdGuide.pdf_generado && (
                                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">La guía existe, pero el PDF no se generó.</p>
                                            {createdGuide.pdf_error && <p className="mt-1">{createdGuide.pdf_error}</p>}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <GuidePdfButton
                                        numeroGuia={createdGuide.numero_guia}
                                        transportadora={createdGuide.transportadora}
                                        aplicaContrapago={shipping.aplicaContrapago}
                                        pdfUrl={createdGuide.pdf_url}
                                        pdfEndpoint={createdGuide.pdf_endpoint}
                                        variant="primary"
                                        label="Descargar PDF"
                                    />
                                    {createdGuide.registro_id && (
                                        <Link
                                            to={`/admin/envios/guias/${createdGuide.registro_id}`}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                                        >
                                            Ver detalle de la guía
                                        </Link>
                                    )}
                                    <Link
                                        to="/admin/envios/guias"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                                    >
                                        Ir al historial
                                    </Link>
                                </div>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="mt-6 text-sm font-semibold text-[#1E6BFF] transition-colors hover:text-blue-500"
                                >
                                    Crear otra guía
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <Link
                            to="/admin/envios"
                            className="mb-4 inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a Envíos
                        </Link>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Nueva guía
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Cotiza con 99envíos y genera una guía de domicilio.
                        </p>
                    </div>

                    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                        <ShippingStepper steps={steps} current={step} />
                    </div>

                    {branchError && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                            <span>No se pudo consultar la sucursal de origen: {branchError}</span>
                        </div>
                    )}

                    {step === 0 && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E6BFF] to-blue-700 text-white">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Destino y paquete</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Los datos que usa 99envíos para cotizar.</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <DaneCitySelect
                                            value={destination}
                                            onChange={(city) => {
                                                setDestination(city);
                                                setAccepted(false);
                                                invalidateQuote();
                                            }}
                                        />
                                        {fieldErrors.destination && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.destination}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="valorProducto" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Valor del producto (COP) *
                                            </label>
                                            <input
                                                id="valorProducto"
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={shipping.valorProducto}
                                                onChange={(event) => updateShipping({ valorProducto: event.target.value })}
                                                placeholder="Ej. 250000"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.valorProducto && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.valorProducto}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="contenido" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Contenido *
                                            </label>
                                            <input
                                                id="contenido"
                                                type="text"
                                                value={shipping.contenido}
                                                onChange={(event) => updateShipping({ contenido: event.target.value }, false)}
                                                placeholder="Ej. Prenda de vestir"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.contenido && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.contenido}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <div>
                                            <label htmlFor="peso" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Peso (kg) *
                                            </label>
                                            <input
                                                id="peso"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={shipping.peso}
                                                onChange={(event) => updateShipping({ peso: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.peso && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.peso}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="largo" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Largo (cm) *
                                            </label>
                                            <input
                                                id="largo"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={shipping.largo}
                                                onChange={(event) => updateShipping({ largo: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.largo && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.largo}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="ancho" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Ancho (cm) *
                                            </label>
                                            <input
                                                id="ancho"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={shipping.ancho}
                                                onChange={(event) => updateShipping({ ancho: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.ancho && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.ancho}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="alto" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Alto (cm) *
                                            </label>
                                            <input
                                                id="alto"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={shipping.alto}
                                                onChange={(event) => updateShipping({ alto: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.alto && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.alto}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="valorDeclarado" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Valor declarado (opcional)
                                            </label>
                                            <input
                                                id="valorDeclarado"
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={shipping.valorDeclarado}
                                                onChange={(event) => updateShipping({ valorDeclarado: event.target.value })}
                                                placeholder="99envíos lo calcula si lo dejas vacío"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.valorDeclarado && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.valorDeclarado}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="tipoServicio" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Tipo de servicio
                                            </label>
                                            <select
                                                id="tipoServicio"
                                                value={shipping.tipoServicio}
                                                onChange={(event) => updateShipping({
                                                    tipoServicio: Number(event.target.value) as 1 | 2,
                                                })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            >
                                                <option value={1}>Estándar</option>
                                                <option value={2}>Express</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Seguro del envío</p>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                            {([
                                                ['none', 'Sin seguro'],
                                                ['seguro99', 'Seguro 99'],
                                                ['seguro99plus', 'Seguro 99 Plus'],
                                            ] as const).map(([value, label]) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    aria-pressed={shipping.insurance === value}
                                                    onClick={() => updateShipping({ insurance: value })}
                                                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${shipping.insurance === value
                                                        ? 'border-[#1E6BFF] bg-blue-50 text-[#1E6BFF] dark:border-[#1E6BFF]/60 dark:bg-[#1E6BFF]/10 dark:text-blue-300'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                            <input
                                                type="checkbox"
                                                checked={shipping.incluirFlete}
                                                onChange={(event) => updateShipping({ incluirFlete: event.target.checked })}
                                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>
                                                <span className="block text-sm font-semibold text-gray-900 dark:text-white">Incluir flete en el valor declarado</span>
                                                <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Recomendado para proteger el valor total.</span>
                                            </span>
                                        </label>
                                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                            <input
                                                type="checkbox"
                                                checked={shipping.aplicaContrapago}
                                                onChange={(event) => updateShipping({ aplicaContrapago: event.target.checked })}
                                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>
                                                <span className="block text-sm font-semibold text-gray-900 dark:text-white">Aplica contrapago</span>
                                                <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">El destinatario paga al recibir.</span>
                                            </span>
                                        </label>
                                    </div>

                                    {quoteError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                                            {quoteError}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => void handleQuote()}
                                        disabled={isQuoting}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E6BFF] to-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:from-blue-600 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                    >
                                        {isQuoting ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Truck className="h-5 w-5" />
                                        )}
                                        {isQuoting ? 'Cotizando...' : 'Cotizar envío'}
                                    </button>
                                </div>
                            </section>

                            <aside className="space-y-6">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1E6BFF] dark:bg-[#1E6BFF]/10 dark:text-blue-300">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Origen</h2>
                                    </div>
                                    {branch ? (
                                        <div className="space-y-1 text-sm">
                                            <p className="font-semibold text-gray-900 dark:text-white">{branch.nombre_sucursal}</p>
                                            <p className="text-gray-500 dark:text-gray-400">{branch.ciudad_origen}</p>
                                            <p className="font-mono text-xs text-gray-400">{branch.codigo_sucursal}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Consultando sucursal...</p>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Antes de continuar</h2>
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li>La tarifa se calcula en vivo con 99envíos.</li>
                                        <li>Puedes elegir la transportadora al cotizar.</li>
                                        <li>Solo se admite entrega a domicilio.</li>
                                    </ul>
                                </div>
                            </aside>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            {!quote ? (
                                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200">
                                    <p className="font-semibold">No hay una cotización vigente.</p>
                                    <button
                                        type="button"
                                        onClick={() => setStep(0)}
                                        className="mt-3 text-sm font-semibold underline"
                                    >
                                        Volver a cotizar
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8">
                                        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cotización de 99envíos</h2>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Elige la transportadora que prefieras. La tarifa de mayor valor viene preseleccionada.
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-green-50 px-4 py-3 text-right dark:bg-green-500/10">
                                                <p className="text-xs uppercase tracking-wider text-green-700 dark:text-green-400">Total de tu selección</p>
                                                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                                    {formatCOP(selectedOption?.total ?? quote.seleccionada.total)}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            role="radiogroup"
                                            aria-label="Selecciona la transportadora"
                                            className="space-y-4"
                                        >
                                            {quote.opciones.map((option) => (
                                                <QuoteOptionCard
                                                    key={`${option.transportadora}-${option.cotizacion_id ?? option.total}`}
                                                    option={option}
                                                    selected={
                                                        option.transportadora === selectedOption?.transportadora
                                                    }
                                                    onSelect={(nextOption) => {
                                                        setSelectedCarrier(nextOption.transportadora);
                                                        setQuoteError(null);
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {quote.no_disponibles.length > 0 && (
                                            <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200">
                                                <p className="font-semibold">Transportadoras no disponibles</p>
                                                <ul className="mt-2 space-y-1">
                                                    {quote.no_disponibles.map((item) => (
                                                        <li key={item.transportadora}>
                                                            {carrierLabel(item.transportadora)}: {item.mensaje}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {quoteError && (
                                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                                                {quoteError}
                                            </div>
                                        )}

                                        <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-white/10 dark:bg-black/20 sm:grid-cols-4">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Valor declarado</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{formatCOP(quote.valor_declarado)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Peso facturable</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{formatWeight(quote.peso_facturable)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Peso volumétrico</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{formatWeight(quote.peso_volumetrico)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Destino DANE</p>
                                                <p className="font-mono font-semibold text-gray-900 dark:text-white">{quote.codigo_destino}</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setStep(0)}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                Editar envío
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleContinueToRecipient}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E6BFF] to-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:from-blue-600 hover:to-blue-800"
                                            >
                                                Continuar con destinatario
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Destinatario</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Datos de quien recibe el envío.</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                                        <div>
                                            <label htmlFor="tipoDocumento" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Tipo de documento *
                                            </label>
                                            <select
                                                id="tipoDocumento"
                                                value={recipient.tipoDocumento}
                                                onChange={(event) => updateRecipient({ tipoDocumento: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            >
                                                <option value="CC">Cédula de ciudadanía</option>
                                                <option value="CE">Cédula de extranjería</option>
                                                <option value="NIT">NIT</option>
                                                <option value="TI">Tarjeta de identidad</option>
                                                <option value="PAS">Pasaporte</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="numeroDocumento" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Número de documento *
                                            </label>
                                            <input
                                                id="numeroDocumento"
                                                type="text"
                                                value={recipient.numeroDocumento}
                                                onChange={(event) => updateRecipient({ numeroDocumento: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.numeroDocumento && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.numeroDocumento}</p>
                                            )}
                                        </div>
                                    </div>

                                    {recipient.tipoDocumento === 'NIT' && (
                                        <div className="sm:w-1/3">
                                            <label htmlFor="dv" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Dígito de verificación
                                            </label>
                                            <input
                                                id="dv"
                                                type="text"
                                                maxLength={2}
                                                value={recipient.dv}
                                                onChange={(event) => updateRecipient({ dv: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div>
                                            <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Nombre *
                                            </label>
                                            <input
                                                id="nombre"
                                                type="text"
                                                value={recipient.nombre}
                                                onChange={(event) => updateRecipient({ nombre: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.nombre && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.nombre}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="primerApellido" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Primer apellido *
                                            </label>
                                            <input
                                                id="primerApellido"
                                                type="text"
                                                value={recipient.primerApellido}
                                                onChange={(event) => updateRecipient({ primerApellido: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.primerApellido && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.primerApellido}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="segundoApellido" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Segundo apellido
                                            </label>
                                            <input
                                                id="segundoApellido"
                                                type="text"
                                                value={recipient.segundoApellido}
                                                onChange={(event) => updateRecipient({ segundoApellido: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Teléfono *
                                            </label>
                                            <input
                                                id="telefono"
                                                type="tel"
                                                value={recipient.telefono}
                                                onChange={(event) => updateRecipient({ telefono: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.telefono && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.telefono}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="correo" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Correo electrónico *
                                            </label>
                                            <input
                                                id="correo"
                                                type="email"
                                                value={recipient.correo}
                                                onChange={(event) => updateRecipient({ correo: event.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                            />
                                            {fieldErrors.correo && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.correo}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="direccion" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Dirección de entrega *
                                        </label>
                                        <input
                                            id="direccion"
                                            type="text"
                                            value={recipient.direccion}
                                            onChange={(event) => updateRecipient({ direccion: event.target.value })}
                                            placeholder="Ej. Calle 100 # 15-20, apto 301"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                        />
                                        {fieldErrors.direccion && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.direccion}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="observaciones" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Observaciones
                                        </label>
                                        <textarea
                                            id="observaciones"
                                            rows={3}
                                            value={recipient.observaciones}
                                            onChange={(event) => updateRecipient({ observaciones: event.target.value })}
                                            placeholder="Indicaciones para la entrega (opcional)"
                                            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                                        />
                                    </div>

                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-white/10 dark:bg-black/20">
                                        <p className="font-semibold text-gray-900 dark:text-white">Ciudad de entrega</p>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                                            {destination?.nombre ?? ''} · DANE <span className="font-mono">{destination?.codigo ?? ''}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            Volver a cotización
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleReview}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E6BFF] to-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:from-blue-600 hover:to-blue-800"
                                        >
                                            Revisar guía
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <aside className="space-y-6">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1E6BFF] dark:bg-[#1E6BFF]/10 dark:text-blue-300">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Resumen</h2>
                                    </div>
                                    <dl className="space-y-3 text-sm">
                                        <div className="flex justify-between gap-3">
                                            <dt className="text-gray-500 dark:text-gray-400">Transportadora</dt>
                                            <dd className="text-right font-medium text-gray-900 dark:text-white">{selectedOption ? carrierLabel(selectedOption.transportadora) : '—'}</dd>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <dt className="text-gray-500 dark:text-gray-400">Total</dt>
                                            <dd className="text-right font-semibold text-green-600 dark:text-green-400">{selectedOption ? formatCOP(selectedOption.total) : '—'}</dd>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <dt className="text-gray-500 dark:text-gray-400">Peso real</dt>
                                            <dd className="text-right font-medium text-gray-900 dark:text-white">{formatWeight(parseNumber(shipping.peso) || 0)}</dd>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <dt className="text-gray-500 dark:text-gray-400">Dimensiones</dt>
                                            <dd className="text-right font-medium text-gray-900 dark:text-white">
                                                {shipping.largo || '—'} × {shipping.ancho || '—'} × {shipping.alto || '—'} cm
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </aside>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="mx-auto max-w-4xl space-y-6">
                            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E6BFF] to-blue-700 text-white">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirma la creación</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Revisa todo antes de generar una guía real.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Transportadora</p>
                                        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                                            {selectedOption ? carrierLabel(selectedOption.transportadora) : '—'}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Costo del envío</p>
                                        <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                                            {selectedOption ? formatCOP(selectedOption.total) : '—'}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Destino</p>
                                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">{destination?.nombre ?? '—'}</p>
                                        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">DANE {destination?.codigo ?? '—'}</p>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Valor declarado</p>
                                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                            {quote ? formatCOP(quote.valor_declarado) : '—'}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Destinatario</p>
                                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                            {recipient.nombre} {recipient.primerApellido}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{recipient.telefono}</p>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Dirección</p>
                                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">{recipient.direccion}</p>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-white/10 dark:bg-black/20">
                                    <p className="font-semibold text-gray-900 dark:text-white">Paquete</p>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        {shipping.contenido} · {formatWeight(parseNumber(shipping.peso) || 0)} ·{' '}
                                        {shipping.largo || '—'} × {shipping.ancho || '—'} × {shipping.alto || '—'} cm
                                    </p>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Seguro: {shipping.insurance === 'none' ? 'Sin seguro' : shipping.insurance === 'seguro99' ? 'Seguro 99' : 'Seguro 99 Plus'}
                                        {' · '}
                                        Contrapago: {shipping.aplicaContrapago ? 'Sí' : 'No'}
                                    </p>
                                    {recipient.observaciones && (
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">Observaciones: {recipient.observaciones}</p>
                                    )}
                                </div>

                                <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                                    <p>
                                        Al confirmar se creará una guía real en 99envíos con costo para la empresa.
                                        Verifica los datos antes de continuar.
                                    </p>
                                </div>

                                <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={accepted}
                                        onChange={(event) => setAccepted(event.target.checked)}
                                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Confirmo que los datos son correctos y autorizo la creación de la guía.</span>
                                </label>

                                {createError && (
                                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                                        <div>
                                            <p>{createError}</p>
                                            <p className="mt-1">
                                                Si el error fue de red, revisa el{' '}
                                                <Link to="/admin/envios/guias" className="font-semibold underline">
                                                    historial de guías
                                                </Link>{' '}
                                                antes de reintentar para evitar duplicados.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Editar destinatario
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!accepted || isCreating}
                                        onClick={() => setConfirmOpen(true)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-900/30 transition-all hover:from-green-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isCreating ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5" />
                                        )}
                                        Crear guía real
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => {
                    if (!isCreating) setConfirmOpen(false);
                }}
                onConfirm={handleCreateGuide}
                title="Crear guía real"
                message={`Se creará una guía con ${selectedOption ? carrierLabel(selectedOption.transportadora) : 'la transportadora seleccionada'} por un envío de ${selectedOption ? formatCOP(selectedOption.total) : 'valor pendiente'}. Esta acción tiene costo y no se puede deshacer automáticamente.`}
                confirmText="Sí, crear guía"
                cancelText="Revisar de nuevo"
                isDanger
            />

            <Notification
                isOpen={notification.isOpen}
                onClose={() => setNotification((previous) => ({ ...previous, isOpen: false }))}
                type={notification.type}
                title={notification.title}
                message={notification.message}
            />
        </div>
    );
};

export default CreateGuidePage;
