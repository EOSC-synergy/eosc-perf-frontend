import { type FC, useState } from 'react';
import { Badge, Button, Form, Modal } from 'react-bootstrap';
import TermsOfService from './TermsOfService';
import actionable from 'styles/actionable.module.css';

type TermsOfServiceCheck = {
    accepted: boolean;
    setAccepted: (accepted: boolean) => void;
};

/**
 * Form element component to make sure user has accepted terms of service
 *
 * @param props
 * @param props.accepted whether the terms of service have been accepted
 * @param props.setAccepted set new acceptance state
 */
const TermsOfServiceCheck: FC<TermsOfServiceCheck> = ({ accepted, setAccepted }) => {
    const [showTOS, setShowTOS] = useState(false);

    return (
        <>
            <Form.Group>
                <Form.Check
                    type="switch"
                    label={
                        <>
                            I have read and accept the{' '}
                            <Badge
                                bg="secondary"
                                onClick={() => setShowTOS(true)}
                                className={actionable['actionable']}
                            >
                                Terms of Service
                            </Badge>
                        </>
                    }
                    checked={accepted}
                    onChange={() => setAccepted(!accepted)}
                />
            </Form.Group>
            <Modal show={showTOS} onHide={() => setShowTOS(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Acceptable Use Policy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TermsOfService />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="success"
                        onClick={() => {
                            setAccepted(true);
                            setShowTOS(false);
                        }}
                    >
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TermsOfServiceCheck;
