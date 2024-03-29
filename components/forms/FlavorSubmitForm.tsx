import { type FC } from 'react';
import { useMutation } from 'react-query';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import RegistrationCheck from 'components/RegistrationCheck';
import { LoadingWrapper } from 'components/loadingOverlay';
import LoginCheck from 'components/LoginCheck';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { type CreateFlavor, type Site } from '@eosc-perf/eosc-perf-client';
import useApi from 'lib/useApi';
import useUser from 'lib/useUser';

type FormContents = {
    name: string;
    description: string;
};

type FlavorSubmitFormProps = {
    site: Site;
    onSuccess: () => void;
    onError: () => void;
};

const FlavorSubmitForm: FC<FlavorSubmitFormProps> = ({ site, onSuccess, onError }) => {
    const auth = useUser();
    const api = useApi(auth.token);

    const { handleSubmit, formState, register } = useForm<FormContents>({
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const { mutate, error: mutationError } = useMutation(
        (data: CreateFlavor) => api.sites.addFlavor(site.id, data),
        {
            onSuccess,
            onError,
        }
    );

    const onSubmit: SubmitHandler<FormContents> = (data) => {
        mutate({
            name: data.name,
            description: data.description.length ? data.description : undefined,
        });
    };

    return (
        <LoadingWrapper isLoading={auth.loading}>
            {mutationError != null && (
                <Alert variant="danger">
                    Error: <ErrorMessage error={mutationError} />
                </Alert>
            )}
            <LoginCheck message="You must be logged in to submit new site flavors." />
            <RegistrationCheck />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        placeholder="standard-medium"
                        {...register('name', {
                            required: 'A flavor must have a name!',
                        })}
                        isInvalid={formState.errors.name?.message !== undefined}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.name?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description (optional):</Form.Label>
                    <Form.Control
                        placeholder="Add a description here."
                        as="textarea"
                        {...register('description')}
                    />
                </Form.Group>

                <Row>
                    <Col />
                    <Col xs="auto">
                        <Button
                            variant="success"
                            type="submit"
                            disabled={!auth.loggedIn}
                            className="mt-1"
                        >
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </LoadingWrapper>
    );
};

export default FlavorSubmitForm;
