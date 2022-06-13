import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { UserContext } from 'components/userContext';
import { JsonHighlight } from 'components/jsonHighlight';
import useApi from '../utils/useApi';
import { CreateClaim, Result } from '@eosc-perf/eosc-perf-client';

export function ResultReportModal(props: {
    result: Result;
    show: boolean;
    closeModal: () => void;
}) {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const [message, setMessage] = useState('');

    const { mutate } = useMutation(
        (data: CreateClaim) => api.results.claimReport(props.result.id, data),
        {
            onSuccess: () => {
                props.closeModal();
            },
        }
    );

    function submitReport() {
        mutate({ message });
    }

    return (
        <Modal show={props.show} scrollable={true} size="lg" onHide={props.closeModal}>
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
                {props.result !== null && (
                    <JsonHighlight>{JSON.stringify(props.result.json, null, 4)}</JsonHighlight>
                )}
                {props.result == null && <div className="text-muted">Loading...</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={submitReport}>
                    Submit
                </Button>
                <Button variant="secondary" onClick={props.closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
