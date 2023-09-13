import { type FC } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import useUser from 'lib/useUser';

const DEFAULT_MESSAGE =
    'You must be logged in to submit data to the platform! Log in using the dropdown in the top right of the page.';

type LoginCheckProps = { message?: string };

/**
 * Warning banner that displays if the user is not logged in.
 * @constructor
 */
const LoginCheck: FC<LoginCheckProps> = ({ message = DEFAULT_MESSAGE }) => {
    const auth = useUser();

    if (auth.loading || auth.loggedIn) {
        return null;
    }

    return (
        <Alert variant="danger">
            <Row className="align-items-center">
                <Col>{message}</Col>
                <Col md="auto">
                    <Button onClick={auth.login} variant="secondary">
                        Login
                    </Button>
                </Col>
            </Row>
        </Alert>
    );
};

export default LoginCheck;
