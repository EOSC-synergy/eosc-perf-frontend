import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import React, { FC, useContext } from 'react';
import { UserContext } from 'components/userContext';
import { useMutation } from 'react-query';
import ErrorMessage from './ErrorMessage';
import { RegistrationCheck } from 'components/registrationCheck';
import { LoadingWrapper } from '../loadingOverlay';
import { LoginCheck } from '../loginCheck';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { CreateSite } from '@eosc-perf/eosc-perf-client';
import useApi from 'utils/useApi';

type FormContents = {
    name: string;
    address: string;
    description: string;
};

type SiteSubmitFormProps = {
    onSuccess: () => void;
    onError: () => void;
};

const SiteSubmitForm: FC<SiteSubmitFormProps> = ({ onSuccess, onError }) => {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const { handleSubmit, formState, register } = useForm<FormContents>({
        defaultValues: {
            name: '',
            address: '',
            description: '',
        },
    });

    const { mutate, error: mutationError } = useMutation(
        (data: CreateSite) => api.sites.createSite(data),
        {
            onSuccess: onSuccess,
            onError: onError,
        }
    );

    const onSubmit: SubmitHandler<FormContents> = (data) => {
        mutate({
            name: data.name,
            address: data.address,
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
            <LoginCheck message="You must be logged in to submit new sites." />
            <RegistrationCheck />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="siteName" className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        placeholder="KIT SCC"
                        {...register('name', {
                            required: 'A site must have a name!',
                        })}
                        isInvalid={formState.errors.name?.message !== undefined}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.name?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="siteAddress" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        placeholder="https://www.scc.kit.edu/"
                        {...register('address', {
                            required: 'Please provide a link with more information about the site.',
                        })}
                        isInvalid={formState.errors.address?.message !== undefined}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.address?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="siteDescription" className="mb-1">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        placeholder="Add a description here."
                        as="textarea"
                        {...register('description')}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.description?.message}
                    </Form.Control.Feedback>
                    <Form.Text>(optional)</Form.Text>
                </Form.Group>

                <Row>
                    <Col />
                    <Col xs="auto">
                        <Button variant="success" type="submit" disabled={!auth.loggedIn}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </LoadingWrapper>
    );
};

export default SiteSubmitForm;
