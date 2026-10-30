import { MapPin, ShieldCheck, Truck } from 'lucide-react';

import DaneCitySelect from '../../../../components/envios/DaneCitySelect';
import Alert from '../../../../components/ui/Alert';
import Button from '../../../../components/ui/Button';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { Field, Input, Select } from '../../../../components/ui/Field';
import type { GuideWizard } from './useGuideWizard';

const insuranceOptions = [
    ['none', 'Sin seguro'],
    ['seguro99', 'Seguro 99'],
    ['seguro99plus', 'Seguro 99 Plus'],
] as const;

const StepShipping = ({ wizard }: { wizard: GuideWizard }) => {
    const {
        branch,
        destination,
        selectDestination,
        shipping,
        updateShipping,
        fieldErrors,
        quoteError,
        isQuoting,
        handleQuote,
    } = wizard;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <Card className="p-6 sm:p-8">
                <CardHeader
                    icon={<MapPin className="h-5 w-5" />}
                    title="Destino y paquete"
                    description="Estos datos se envían a 99envíos para calcular la tarifa."
                />

                <div className="mt-6 space-y-5">
                    <div>
                        <DaneCitySelect
                            value={destination}
                            onChange={selectDestination}
                        />
                        {fieldErrors.destination && (
                            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                                {fieldErrors.destination}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            label="Valor del producto (COP)"
                            htmlFor="valorProducto"
                            error={fieldErrors.valorProducto}
                        >
                            <Input
                                id="valorProducto"
                                type="number"
                                min="1"
                                step="1"
                                value={shipping.valorProducto}
                                onChange={(event) => updateShipping({ valorProducto: event.target.value })}
                                placeholder="Ej. 250000"
                                aria-invalid={Boolean(fieldErrors.valorProducto)}
                            />
                        </Field>
                        <Field
                            label="Contenido"
                            htmlFor="contenido"
                            error={fieldErrors.contenido}
                        >
                            <Input
                                id="contenido"
                                type="text"
                                value={shipping.contenido}
                                onChange={(event) => updateShipping({ contenido: event.target.value }, false)}
                                placeholder="Ej. Prenda de vestir"
                                aria-invalid={Boolean(fieldErrors.contenido)}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Field label="Peso (kg)" htmlFor="peso" error={fieldErrors.peso}>
                            <Input
                                id="peso"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={shipping.peso}
                                onChange={(event) => updateShipping({ peso: event.target.value })}
                                aria-invalid={Boolean(fieldErrors.peso)}
                            />
                        </Field>
                        <Field label="Largo (cm)" htmlFor="largo" error={fieldErrors.largo}>
                            <Input
                                id="largo"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={shipping.largo}
                                onChange={(event) => updateShipping({ largo: event.target.value })}
                                aria-invalid={Boolean(fieldErrors.largo)}
                            />
                        </Field>
                        <Field label="Ancho (cm)" htmlFor="ancho" error={fieldErrors.ancho}>
                            <Input
                                id="ancho"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={shipping.ancho}
                                onChange={(event) => updateShipping({ ancho: event.target.value })}
                                aria-invalid={Boolean(fieldErrors.ancho)}
                            />
                        </Field>
                        <Field label="Alto (cm)" htmlFor="alto" error={fieldErrors.alto}>
                            <Input
                                id="alto"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={shipping.alto}
                                onChange={(event) => updateShipping({ alto: event.target.value })}
                                aria-invalid={Boolean(fieldErrors.alto)}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            label="Valor declarado (opcional)"
                            htmlFor="valorDeclarado"
                            hint="99envíos lo calcula si lo dejas vacío."
                            error={fieldErrors.valorDeclarado}
                        >
                            <Input
                                id="valorDeclarado"
                                type="number"
                                min="0"
                                step="1"
                                value={shipping.valorDeclarado}
                                onChange={(event) => updateShipping({ valorDeclarado: event.target.value })}
                                placeholder="Ej. 250000"
                                aria-invalid={Boolean(fieldErrors.valorDeclarado)}
                            />
                        </Field>
                        <Field label="Tipo de servicio" htmlFor="tipoServicio">
                            <Select
                                id="tipoServicio"
                                value={shipping.tipoServicio}
                                onChange={(event) => updateShipping({
                                    tipoServicio: Number(event.target.value) as 1 | 2,
                                })}
                            >
                                <option value={1}>Estándar</option>
                                <option value={2}>Express</option>
                            </Select>
                        </Field>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Seguro del envío
                        </p>
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {insuranceOptions.map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={shipping.insurance === value}
                                    onClick={() => updateShipping({ insurance: value })}
                                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                                        shipping.insurance === value
                                            ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500/60 dark:bg-brand-500/10 dark:text-brand-300'
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                            <input
                                type="checkbox"
                                checked={shipping.incluirFlete}
                                onChange={(event) => updateShipping({ incluirFlete: event.target.checked })}
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-600"
                            />
                            <span>
                                <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                                    Incluir flete en el valor declarado
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                                    Recomendado para proteger el valor total.
                                </span>
                            </span>
                        </label>
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                            <input
                                type="checkbox"
                                checked={shipping.aplicaContrapago}
                                onChange={(event) => updateShipping({ aplicaContrapago: event.target.checked })}
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-600"
                            />
                            <span>
                                <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                                    Aplica contrapago
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                                    El destinatario paga al recibir.
                                </span>
                            </span>
                        </label>
                    </div>

                    {quoteError && (
                        <Alert tone="error" title="No se pudo cotizar">
                            {quoteError}
                        </Alert>
                    )}

                    <Button
                        type="button"
                        onClick={() => void handleQuote()}
                        loading={isQuoting}
                        icon={<Truck className="h-5 w-5" />}
                        className="w-full sm:w-auto"
                    >
                        {isQuoting ? 'Cotizando…' : 'Cotizar envío'}
                    </Button>
                </div>
            </Card>

            <aside className="space-y-5">
                <Card className="p-6">
                    <CardHeader
                        icon={<MapPin className="h-5 w-5" />}
                        title="Origen"
                        description="Sucursal configurada"
                    />
                    {branch ? (
                        <div className="mt-4 space-y-1 text-sm">
                            <p className="font-semibold text-slate-900 dark:text-white">
                                {branch.nombre_sucursal}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">{branch.ciudad_origen}</p>
                            <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
                                {branch.codigo_sucursal}
                            </p>
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            Consultando sucursal…
                        </p>
                    )}
                </Card>

                <Card className="p-6">
                    <CardHeader
                        icon={<ShieldCheck className="h-5 w-5" />}
                        title="Antes de continuar"
                    />
                    <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <li>La tarifa se calcula en vivo con 99envíos.</li>
                        <li>Puedes elegir la transportadora al cotizar.</li>
                        <li>Solo se admite entrega a domicilio.</li>
                        <li>El valor declarado mínimo para crear la guía es $25.000.</li>
                    </ul>
                </Card>
            </aside>
        </div>
    );
};

export default StepShipping;
