import { ArrowLeft, ArrowRight, Truck } from 'lucide-react';

import QuoteOptionCard from '../../../../components/envios/QuoteOptionCard';
import Alert from '../../../../components/ui/Alert';
import Button from '../../../../components/ui/Button';
import { Card, CardHeader, Tile } from '../../../../components/ui/Card';
import { carrierLabel, formatCOP, formatWeight } from '../../../../utils/envios';
import type { GuideWizard } from './useGuideWizard';

const StepQuote = ({ wizard }: { wizard: GuideWizard }) => {
    const {
        quote,
        selectedOption,
        selectCarrier,
        quoteError,
        setStep,
        handleContinueToRecipient,
    } = wizard;

    if (!quote) {
        return (
            <div className="mx-auto max-w-2xl">
                <Alert
                    tone="warning"
                    title="No hay una cotización vigente"
                    action={(
                        <Button variant="secondary" size="sm" onClick={() => setStep(0)}>
                            Volver a cotizar
                        </Button>
                    )}
                >
                    Genera una cotización para comparar transportadoras y continuar.
                </Alert>
            </div>
        );
    }

    return (
        <Card className="p-6 sm:p-8">
            <CardHeader
                icon={<Truck className="h-5 w-5" />}
                title="Cotización de 99envíos"
                description="Elige la transportadora. La opción sugerida viene preseleccionada."
                action={(
                    <div className="shrink-0 rounded-xl bg-brand-50 px-4 py-3 text-right dark:bg-brand-500/10">
                        <p className="text-xs font-medium uppercase tracking-wider text-brand-700 dark:text-brand-300">
                            Total seleccionado
                        </p>
                        <p className="mt-0.5 text-2xl font-bold tabular-nums text-brand-700 dark:text-brand-300">
                            {formatCOP(selectedOption?.total ?? quote.seleccionada.total)}
                        </p>
                    </div>
                )}
            />

            <div
                role="radiogroup"
                aria-label="Selecciona la transportadora"
                className="mt-6 space-y-4"
            >
                {quote.opciones.map((option) => (
                    <QuoteOptionCard
                        key={`${option.transportadora}-${option.cotizacion_id ?? option.total}`}
                        option={option}
                        selected={option.transportadora === selectedOption?.transportadora}
                        onSelect={selectCarrier}
                    />
                ))}
            </div>

            {quote.no_disponibles.length > 0 && (
                <div className="mt-5">
                    <Alert tone="warning" title="Transportadoras no disponibles">
                        <ul className="space-y-1">
                            {quote.no_disponibles.map((item) => (
                                <li key={item.transportadora}>
                                    {carrierLabel(item.transportadora)}: {item.mensaje}
                                </li>
                            ))}
                        </ul>
                    </Alert>
                </div>
            )}

            {quoteError && (
                <div className="mt-5">
                    <Alert tone="error" title="Revisa la cotización">
                        {quoteError}
                    </Alert>
                </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Tile className="p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Valor declarado</p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                        {formatCOP(quote.valor_declarado)}
                    </p>
                </Tile>
                <Tile className="p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Peso facturable</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {formatWeight(quote.peso_facturable)}
                    </p>
                </Tile>
                <Tile className="p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Peso volumétrico</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {formatWeight(quote.peso_volumetrico)}
                    </p>
                </Tile>
                <Tile className="p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Destino DANE</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
                        {quote.codigo_destino}
                    </p>
                </Tile>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                    variant="secondary"
                    icon={<ArrowLeft className="h-4 w-4" />}
                    onClick={() => setStep(0)}
                >
                    Editar envío
                </Button>
                <Button
                    icon={<ArrowRight className="h-4 w-4" />}
                    onClick={handleContinueToRecipient}
                >
                    Continuar con destinatario
                </Button>
            </div>
        </Card>
    );
};

export default StepQuote;
