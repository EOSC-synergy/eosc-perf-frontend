import { type FC } from 'react';
import { Button, Modal } from 'react-bootstrap';
import JsonHighlight from 'components/JsonHighlight';
import { type Result } from '@eosc-perf/eosc-perf-client';

type JsonPreviewModalProps = {
    result: Result | null;
    show: boolean;
    closeModal: () => void;
};

/**
 * Modal to view the JSON data of a result
 *
 * @param props
 * @param props.result
 * @param props.show
 * @param props.closeModal
 */
const JsonPreviewModal: FC<JsonPreviewModalProps> = ({ result, show, closeModal }) => {
    return (
        <Modal show={show} scrollable size="lg" onHide={closeModal}>
            <Modal.Header>
                <Modal.Title>JSON Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {result !== null && (
                    <JsonHighlight>{JSON.stringify(result.json, null, 4)}</JsonHighlight>
                )}
                {result == null && <div className="text-muted">Loading...</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default JsonPreviewModal;
