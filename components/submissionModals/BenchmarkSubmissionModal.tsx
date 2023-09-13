import { type FC, useState } from 'react';
import { Modal, Toast } from 'react-bootstrap';
import BenchmarkSubmitForm from 'components/forms/BenchmarkSubmitForm';

type BenchmarkSubmissionModalProps = {
    show: boolean;
    onHide: () => void;
};

// TODO: do not show invalid on first load
//       use default state valid?

const BenchmarkSubmissionModal: FC<BenchmarkSubmissionModalProps> = ({ show, onHide }) => {
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    return (
        <>
            <Modal size="lg" show={show} onHide={onHide}>
                <Modal.Header closeButton>Add Benchmark</Modal.Header>
                <Modal.Body>
                    <BenchmarkSubmitForm
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

export default BenchmarkSubmissionModal;
