import { useState } from 'react';
import { Card, Container, Toast, ToastContainer } from 'react-bootstrap';
import BenchmarkSubmitForm from 'components/forms/BenchmarkSubmitForm';
import Head from 'next/head';
import { type NextPage } from 'next';

/**
 * Page allowing users to submit new benchmarks.
 *
 * This is essentially just a page wrapper around BenchmarkSubmitForm.
 */
const BenchmarkSubmission: NextPage = () => {
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    return (
        <>
            <Head>
                <title>Benchmark Submission</title>
            </Head>
            <Container>
                <h1>Add Benchmark</h1>
                <Card className="mb-2">
                    <Card.Body>
                        <BenchmarkSubmitForm
                            onSuccess={() => {
                                setShowSuccessToast(true);
                            }}
                            onError={() => undefined}
                        />
                    </Card.Body>
                </Card>
                <ToastContainer position="middle-center">
                    <Toast
                        show={showSuccessToast}
                        onClose={() => setShowSuccessToast(false)}
                        delay={4000}
                        autohide
                    >
                        <Toast.Header>
                            <strong className="me-auto">eosc-perf</strong>
                        </Toast.Header>
                        <Toast.Body>Submission successful.</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Container>
        </>
    );
};

export default BenchmarkSubmission;
