import React, { useState } from 'react';
import { Card, Container, Toast } from 'react-bootstrap';
import { PageBase } from '../pageBase';
import { BenchmarkSubmitForm } from 'components/forms/benchmarkSubmitForm';

function BenchmarkSubmission() {
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    return (
        <Container>
            <h1>Add Benchmark</h1>
            <Card>
                <Card.Body>
                    <BenchmarkSubmitForm
                        onSuccess={() => {
                            setShowSuccessToast(true);
                        }}
                        onError={() => {}}
                    />
                </Card.Body>
            </Card>
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
        </Container>
    );
}

const BenchmarkSubmissionModule: PageBase = {
    path: '/benchmark-submission',
    element: BenchmarkSubmission,
    name: 'BenchmarkSubmission',
    displayName: 'Benchmark',
};

export default BenchmarkSubmissionModule;
