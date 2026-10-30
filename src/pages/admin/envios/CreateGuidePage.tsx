import ConfirmModal from '../../../components/common/ConfirmModal';
import Notification from '../../../components/common/Notification';
import ShippingStepper from '../../../components/envios/ShippingStepper';
import Alert from '../../../components/ui/Alert';
import { Card } from '../../../components/ui/Card';
import PageHeader from '../../../components/ui/PageHeader';
import { carrierLabel, formatCOP } from '../../../utils/envios';
import GuideSuccess from './create/GuideSuccess';
import StepQuote from './create/StepQuote';
import StepRecipient from './create/StepRecipient';
import StepReview from './create/StepReview';
import StepShipping from './create/StepShipping';
import { steps } from './create/types';
import { useGuideWizard } from './create/useGuideWizard';

const CreateGuidePage = () => {
    const wizard = useGuideWizard();

    if (wizard.createdGuide) {
        return (
            <GuideSuccess
                guide={wizard.createdGuide}
                aplicaContrapago={wizard.shipping.aplicaContrapago}
                onReset={wizard.resetForm}
            />
        );
    }

    return (
        <div className="page-shell">
            <div className="page-container">
                <PageHeader
                    backTo="/admin/envios"
                    backLabel="Volver a Envíos"
                    title="Nueva guía"
                    description="Cotiza con 99envíos y genera una guía de domicilio."
                />

                <Card className="mb-6 p-5">
                    <ShippingStepper steps={steps} current={wizard.step} />
                </Card>

                {wizard.branchError && (
                    <div className="mb-6">
                        <Alert tone="warning" title="No se pudo consultar la sucursal de origen">
                            {wizard.branchError}
                        </Alert>
                    </div>
                )}

                {wizard.step === 0 && <StepShipping wizard={wizard} />}
                {wizard.step === 1 && <StepQuote wizard={wizard} />}
                {wizard.step === 2 && <StepRecipient wizard={wizard} />}
                {wizard.step === 3 && <StepReview wizard={wizard} />}
            </div>

            <ConfirmModal
                isOpen={wizard.confirmOpen}
                onClose={() => {
                    if (!wizard.isCreating) wizard.setConfirmOpen(false);
                }}
                onConfirm={wizard.handleCreateGuide}
                title="Crear guía real"
                message={`Se creará una guía con ${wizard.selectedOption ? carrierLabel(wizard.selectedOption.transportadora) : 'la transportadora seleccionada'} por un envío de ${wizard.selectedOption ? formatCOP(wizard.selectedOption.total) : 'valor pendiente'}. Esta acción tiene costo y no se puede deshacer automáticamente.`}
                confirmText="Sí, crear guía"
                cancelText="Revisar de nuevo"
                isDanger
            />

            <Notification
                isOpen={wizard.notification.isOpen}
                onClose={wizard.closeNotification}
                type={wizard.notification.type}
                title={wizard.notification.title}
                message={wizard.notification.message}
            />
        </div>
    );
};

export default CreateGuidePage;
