import { ArrowLeft, ArrowRight, Package, User } from 'lucide-react';

import Button from '../../../../components/ui/Button';
import { Card, CardHeader, Tile } from '../../../../components/ui/Card';
import { Field, Input, Select, Textarea } from '../../../../components/ui/Field';
import { carrierLabel, formatCOP, formatWeight } from '../../../../utils/envios';
import { parseNumber } from './types';
import type { GuideWizard } from './useGuideWizard';

const StepRecipient = ({ wizard }: { wizard: GuideWizard }) => {
    const {
        destination,
        shipping,
        recipient,
        updateRecipient,
        selectedOption,
        fieldErrors,
        setStep,
        handleReview,
    } = wizard;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <Card className="p-6 sm:p-8">
                <CardHeader
                    icon={<User className="h-5 w-5" />}
                    title="Destinatario"
                    description="Datos de la persona que recibe el envío."
                />

                <div className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                        <Field label="Tipo de documento" htmlFor="tipoDocumento">
                            <Select
                                id="tipoDocumento"
                                value={recipient.tipoDocumento}
                                onChange={(event) => updateRecipient({ tipoDocumento: event.target.value })}
                            >
                                <option value="CC">Cédula de ciudadanía</option>
                                <option value="CE">Cédula de extranjería</option>
                                <option value="NIT">NIT</option>
                                <option value="TI">Tarjeta de identidad</option>
                                <option value="PAS">Pasaporte</option>
                            </Select>
                        </Field>
                        <Field
                            label="Número de documento"
                            htmlFor="numeroDocumento"
                            error={fieldErrors.numeroDocumento}
                        >
                            <Input
                                id="numeroDocumento"
                                type="text"
                                value={recipient.numeroDocumento}
                                onChange={(event) => updateRecipient({ numeroDocumento: event.target.value })}
                                aria-invalid={Boolean(fieldErrors.numeroDocumento)}
                            />
                        </Field>
                    </div>

                    {recipient.tipoDocumento === 'NIT' && (
                        <div className="sm:w-1/3">
                            <Field label="Dígito de verificación" htmlFor="dv">
                                <Input
                                    id="dv"
                                    type="text"
                                    maxLength={2}
                                    value={recipient.dv}
                                    onChange={(event) => updateRecipient({ dv: event.target.value })}
                                />
                            </Field>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Field label="Nombre" htmlFor="nombre" error={fieldErrors.nombre}>
                            <Input
                                id="nombre"
                                type="text"
                                value={recipient.nombre}
                                onChange={(event) => updateRecipient({ nombre: event.target.value })}
                                aria-invalid={Boolean(fieldErrors.nombre)}
                            />
                        </Field>
                        <Field
                            label="Primer apellido"
                            htmlFor="primerApellido"
                            error={fieldErrors.primerApellido}
                        >
                            <Input
                                id="primerApellido"
                                type="text"
                                value={recipient.primerApellido}
                                onChange={(event) => updateRecipient({ primerApellido: event.target.value })}
                                aria-invalid={Boolean(fieldErrors.primerApellido)}
                            />
                        </Field>
                        <Field label="Segundo apellido" htmlFor="segundoApellido">
                            <Input
                                id="segundoApellido"
                                type="text"
                                value={recipient.segundoApellido}
                                onChange={(event) => updateRecipient({ segundoApellido: event.target.value })}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Teléfono" htmlFor="telefono" error={fieldErrors.telefono}>
                            <Input
                                id="telefono"
                                type="tel"
                                value={recipient.telefono}
                                onChange={(event) => updateRecipient({ telefono: event.target.value })}
                                aria-invalid={Boolean(fieldErrors.telefono)}
                            />
                        </Field>
                        <Field
                            label="Correo electrónico"
                            htmlFor="correo"
                            error={fieldErrors.correo}
                        >
                            <Input
                                id="correo"
                                type="email"
                                value={recipient.correo}
                                onChange={(event) => updateRecipient({ correo: event.target.value })}
                                aria-invalid={Boolean(fieldErrors.correo)}
                            />
                        </Field>
                    </div>

                    <Field
                        label="Dirección de entrega"
                        htmlFor="direccion"
                        error={fieldErrors.direccion}
                    >
                        <Input
                            id="direccion"
                            type="text"
                            value={recipient.direccion}
                            onChange={(event) => updateRecipient({ direccion: event.target.value })}
                            placeholder="Ej. Calle 100 # 15-20, apto 301"
                            aria-invalid={Boolean(fieldErrors.direccion)}
                        />
                    </Field>

                    <Field label="Observaciones" htmlFor="observaciones">
                        <Textarea
                            id="observaciones"
                            rows={3}
                            value={recipient.observaciones}
                            onChange={(event) => updateRecipient({ observaciones: event.target.value })}
                            placeholder="Indicaciones para la entrega (opcional)"
                        />
                    </Field>

                    <Tile className="p-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Ciudad de entrega
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {destination?.nombre ?? ''} · DANE{' '}
                            <span className="font-mono">{destination?.codigo ?? ''}</span>
                        </p>
                    </Tile>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <Button
                            variant="secondary"
                            icon={<ArrowLeft className="h-4 w-4" />}
                            onClick={() => setStep(1)}
                        >
                            Volver a cotización
                        </Button>
                        <Button
                            icon={<ArrowRight className="h-4 w-4" />}
                            onClick={handleReview}
                        >
                            Revisar guía
                        </Button>
                    </div>
                </div>
            </Card>

            <aside className="space-y-5">
                <Card className="p-6">
                    <CardHeader
                        icon={<Package className="h-5 w-5" />}
                        title="Resumen"
                    />
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500 dark:text-slate-400">Transportadora</dt>
                            <dd className="text-right font-medium text-slate-900 dark:text-white">
                                {selectedOption ? carrierLabel(selectedOption.transportadora) : '—'}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500 dark:text-slate-400">Total</dt>
                            <dd className="text-right font-semibold tabular-nums text-slate-900 dark:text-white">
                                {selectedOption ? formatCOP(selectedOption.total) : '—'}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500 dark:text-slate-400">Peso real</dt>
                            <dd className="text-right font-medium text-slate-900 dark:text-white">
                                {formatWeight(parseNumber(shipping.peso) || 0)}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500 dark:text-slate-400">Dimensiones</dt>
                            <dd className="text-right font-medium text-slate-900 dark:text-white">
                                {shipping.largo || '—'} × {shipping.ancho || '—'} × {shipping.alto || '—'} cm
                            </dd>
                        </div>
                    </dl>
                </Card>
            </aside>
        </div>
    );
};

export default StepRecipient;
