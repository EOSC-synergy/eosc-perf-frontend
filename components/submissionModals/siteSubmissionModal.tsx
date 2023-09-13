import { type FC, useState } from 'react';
import { Modal, Toast } from 'react-bootstrap';
import SiteSubmitForm from 'components/forms/SiteSubmitForm';

type SiteSubmissionModalProps = { show: boolean; onHide: () => void };

const SiteSubmissionModal: FC<SiteSubmissionModalProps> = ({ show, onHide }) => {
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    return (
        <>
            <Modal size="lg" show={show} onHide={onHide}>
                <Modal.Header closeButton>Add Site</Modal.Header>
                <Modal.Body>
                    <SiteSubmitForm
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

export default SiteSubmissionModal;
