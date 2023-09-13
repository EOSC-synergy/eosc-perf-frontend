import { type FC } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import Link from 'next/link';
import useUser from 'lib/useUser';

/**
 * Warning banner that displays if the user has not completed registration
 */
const RegistrationCheck: FC = () => {
    const auth = useUser();

    if (auth.loading || !auth.loggedIn || auth.registered) {
        return null;
    }

    return (
        <Alert variant="warning">
            <Row className="align-items-center">
                <Col>You must register before submitting data to the services on this website!</Col>
                <Col md="auto">
                    <Link as="a" href="/registration" passHref>
                        <Button variant="secondary">Register</Button>
                    </Link>
                </Col>
            </Row>
        </Alert>
    );
};

export default RegistrationCheck;
