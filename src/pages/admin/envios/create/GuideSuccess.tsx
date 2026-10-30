import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import GuidePdfButton from '../../../../components/envios/GuidePdfButton';
import Alert from '../../../../components/ui/Alert';
import Button from '../../../../components/ui/Button';
import { buttonClass } from '../../../../components/ui/buttonStyles';
import { Card, Tile } from '../../../../components/ui/Card';
import { carrierLabel, formatCOP } from '../../../../utils/envios';
import type { GuideResponse } from '../../../../types';

const GuideSuccess = ({
    guide,
    aplicaContrapago,
    onReset,
}: {
    guide: GuideResponse;
    aplicaContrapago: boolean;
    onReset: () => void;
}) => (
    <div className="page-shell">
        <div className="page-container max-w-3xl">
            <Card className="overflow-hidden">
                <div className="p-6 sm:p-10">
                    <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <CheckCircle2 className="h-7 w-7" />
                        </span>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                                Guía creada correctamente
                            </h1>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                {carrierLabel(guide.transportadora)} · {guide.numero_guia}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Tile className="p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Número de guía
                            </p>
                            <p className="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white">
                                {guide.numero_guia}
                            </p>
                        </Tile>
                        <Tile className="p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Transportadora
                            </p>
                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                {carrierLabel(guide.transportadora)}
                            </p>
                        </Tile>
                        <Tile className="p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Valor declarado
                            </p>
                            <p className="mt-1 font-semibold tabular-nums text-slate-900 dark:text-white">
                                {formatCOP(guide.valor_declarado)}
                            </p>
                        </Tile>
                        <Tile className="p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                PDF
                            </p>
                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                {guide.pdf_generado ? 'Generado' : 'No generado'}
                            </p>
                        </Tile>
                    </div>

                    {guide.mensaje && (
                        <div className="mt-5">
                            <Alert tone="info">{guide.mensaje}</Alert>
                        </div>
                    )}

                    {!guide.pdf_generado && (
                        <div className="mt-5">
                            <Alert tone="warning" title="La guía existe, pero el PDF no se generó">
                                {guide.pdf_error || 'Puedes reintentar la descarga desde el detalle de la guía.'}
                            </Alert>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <GuidePdfButton
                            numeroGuia={guide.numero_guia}
                            transportadora={guide.transportadora}
                            aplicaContrapago={aplicaContrapago}
                            pdfUrl={guide.pdf_url}
                            pdfEndpoint={guide.pdf_endpoint}
                            variant="primary"
                            label="Descargar PDF"
                        />
                        {guide.registro_id && (
                            <Link
                                to={`/admin/envios/guias/${guide.registro_id}`}
                                className={buttonClass('secondary')}
                            >
                                Ver detalle de la guía
                            </Link>
                        )}
                        <Link
                            to="/admin/envios/guias"
                            className={buttonClass('secondary')}
                        >
                            Ir al historial
                        </Link>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={onReset}
                        className="mt-6 px-0"
                    >
                        Crear otra guía
                    </Button>
                </div>
            </Card>
        </div>
    </div>
);

export default GuideSuccess;
