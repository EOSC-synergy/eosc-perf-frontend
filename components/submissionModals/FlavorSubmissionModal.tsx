import { type FC, ReactElement, useState } from 'react';
import { Modal, Toast } from 'react-bootstrap';
import FlavorSubmitForm from 'components/forms/FlavorSubmitForm';
import { type Site } from '@eosc-perf/eosc-perf-client';

type FlavorSubmissionModalProps = {
    show: boolean;
    onHide: () => void;
    site: Site;
};

const FlavorSubmissionModal: FC<FlavorSubmissionModalProps> = ({ show, onHide, site }) => {
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    return (
        <>
            <Modal size="lg" show={show} onHide={onHide}>
                <Modal.Header closeButton>Add Site</Modal.Header>
                <Modal.Body>
                    <FlavorSubmitForm
                        site={site}
                        onSuccess={() => {
                            onHide();
                            setShowSuccessToast(true);
                        }}
                        onError={() => undefined}
                    />
                </Modal.Body>
            </Modal>
            <div style={{ position: 'fixed', bottom: 0, right: 0 }}>
                <Toast
                    show={showSuccessToast}
                    onClose={() => setShowSuccessToast(false)}
                    delay={5000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">eosc-perf</strong>
                    </Toast.Header>
                    <Toast.Body>Submission successful.</Toast.Body>
                </Toast>
            </div>
        </>
    );
};

export default FlavorSubmissionModal;
