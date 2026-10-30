import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import Alert from '../../../../components/ui/Alert';
import Button from '../../../../components/ui/Button';
import { Card, CardHeader, Tile } from '../../../../components/ui/Card';
import { carrierLabel, formatCOP, formatWeight } from '../../../../utils/envios';
import { insuranceLabel, parseNumber } from './types';
import type { GuideWizard } from './useGuideWizard';

const StepReview = ({ wizard }: { wizard: GuideWizard }) => {
    const {
        destination,
        shipping,
        recipient,
        quote,
        selectedOption,
        accepted,
        setAccepted,
        createError,
        isCreating,
        setStep,
        setConfirmOpen,
    } = wizard;

    return (
        <div className="mx-auto max-w-4xl">
            <Card className="p-6 sm:p-8">
                <CardHeader
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    title="Confirma la creación"
                    description="Revisa todo antes de generar una guía real."
                />

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Tile className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Transportadora
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                            {selectedOption ? carrierLabel(selectedOption.transportadora) : '—'}
                        </p>
                    </Tile>
                    <Tile className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Costo del envío
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900 dark:text-white">
                            {selectedOption ? formatCOP(selectedOption.total) : '—'}
                        </p>
                    </Tile>
                    <Tile className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Destino
                        </p>
                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                            {destination?.nombre ?? '—'}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                            DANE {destination?.codigo ?? '—'}
                        </p>
                    </Tile>
                    <Tile className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Valor declarado
                        </p>
                        <p className="mt-1 font-semibold tabular-nums text-slate-900 dark:text-white">
                            {quote ? formatCOP(quote.valor_declarado) : '—'}
                        </p>
                    </Tile>
                    <Tile className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Destinatario
                        </p>
                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                            {recipient.nombre} {recipient.primerApellido}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                            {recipient.telefono}
                        </p>
                    </Tile>
                    <Tile className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Dirección
                        </p>
                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                            {recipient.direccion}
                        </p>
                    </Tile>
                </div>

                <Tile className="mt-4 p-4 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">Paquete</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                        {shipping.contenido} · {formatWeight(parseNumber(shipping.peso) || 0)} ·{' '}
                        {shipping.largo || '—'} × {shipping.ancho || '—'} × {shipping.alto || '—'} cm
                    </p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                        Seguro: {insuranceLabel(shipping.insurance)}
                        {' · '}
                        Contrapago: {shipping.aplicaContrapago ? 'Sí' : 'No'}
                    </p>
                    {recipient.observaciones && (
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                            Observaciones: {recipient.observaciones}
                        </p>
                    )}
                </Tile>

                <div className="mt-6">
                    <Alert tone="warning" title="Esta acción genera una guía real">
                        Al confirmar se creará una guía en 99envíos con costo para la empresa.
                        Verifica los datos antes de continuar.
                    </Alert>
                </div>

                <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(event) => setAccepted(event.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-600"
                    />
                    <span>
                        Confirmo que los datos son correctos y autorizo la creación de la guía.
                    </span>
                </label>

                {createError && (
                    <div className="mt-5">
                        <Alert tone="error" title="No se pudo crear la guía">
                            <p>{createError}</p>
                            <p className="mt-1">
                                Si el error fue de red, revisa el{' '}
                                <Link to="/admin/envios/guias" className="font-semibold underline">
                                    historial de guías
                                </Link>{' '}
                                antes de reintentar para evitar duplicados.
                            </p>
                        </Alert>
                    </div>
                )}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <Button
                        variant="secondary"
                        icon={<ArrowLeft className="h-4 w-4" />}
                        onClick={() => setStep(2)}
                    >
                        Editar destinatario
                    </Button>
                    <Button
                        disabled={!accepted}
                        loading={isCreating}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                        onClick={() => setConfirmOpen(true)}
                    >
                        Crear guía real
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default StepReview;
