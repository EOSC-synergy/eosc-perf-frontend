import { type FC, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useMutation } from 'react-query';
import JsonHighlight from 'components/JsonHighlight';
import useApi from 'lib/useApi';
import { type CreateClaim, type Result } from '@eosc-perf/eosc-perf-client';
import useUser from 'lib/useUser';

type ResultReportModalProps = {
    result: Result;
    show: boolean;
    closeModal: () => void;
};

const ResultReportModal: FC<ResultReportModalProps> = ({ result, show, closeModal }) => {
    const auth = useUser();
    const api = useApi(auth.token);

    const [message, setMessage] = useState('');

    const { mutate } = useMutation(
        (data: CreateClaim) => api.results.claimReport(result.id, data),
        {
            onSuccess: closeModal,
        }
    );

    function submitReport() {
        mutate({ message });
    }

    return (
        <Modal show={show} scrollable size="lg" onHide={closeModal}>
            <Modal.Header>
                <Modal.Title>Report result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Reason:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unrealistic results"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Form.Group>
                </Form>
                <JsonHighlight>{JSON.stringify(result.json, null, 4)}</JsonHighlight>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={submitReport}>
                    Submit
                </Button>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ResultReportModal;
