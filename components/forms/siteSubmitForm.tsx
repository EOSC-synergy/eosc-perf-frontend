import { Alert, Button, Form } from 'react-bootstrap';
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { UserContext } from 'components/userContext';
import { useMutation } from 'react-query';
import { CreateSite } from 'model';
import { postHelper } from 'components/api-helpers';
import { AxiosError } from 'axios';
import { getErrorMessage } from 'components/forms/getErrorMessage';
import { RegistrationCheck } from 'components/registrationCheck';
import { LoadingWrapper } from '../loadingOverlay';
import { LoginCheck } from '../loginCheck';
import { SubmitHandler, useController, useForm } from 'react-hook-form';

type FormContents = {
    name: string;
    address: string;
    description: string;
};

export function SiteSubmitForm(props: {
    onSuccess: () => void;
    onError: () => void;
}): ReactElement {
    const auth = useContext(UserContext);

    const [errorMessage, setErrorMessage] = useState<ReactNode | undefined>(undefined);

    const { handleSubmit, control, formState } = useForm<FormContents>();

    useEffect(() => {
        setErrorMessage(undefined);
    }, []);

    const { mutate } = useMutation(
        (data: CreateSite) => postHelper<CreateSite>('/sites', data, auth.token),
        {
            onSuccess: () => {
                props.onSuccess();
            },
            onError: (error: Error | AxiosError) => {
                setErrorMessage(getErrorMessage(error));
                props.onError();
            },
        }
    );

    const nameInput = useController({
        name: 'name',
        control,
        rules: {
            required: 'A site must have a name!',
        },
        defaultValue: '',
    });

    const addressInput = useController({
        name: 'address',
        control,
        rules: {
            required: 'Please provide a link with more information about the site!',
        },
        defaultValue: '',
    });

    const descriptionInput = useController({
        name: 'description',
        control,
        defaultValue: '',
    });

    const onSubmit: SubmitHandler<FormContents> = (data) => {
        mutate({
            name: data.name,
            address: data.address,
            description: data.description.length ? data.description : undefined,
        });
    };

    return (
        <LoadingWrapper isLoading={auth.loading}>
            {errorMessage !== undefined && <Alert variant="danger">Error: {errorMessage}</Alert>}
            <LoginCheck message="You must be logged in to submit new sites!" />
            <RegistrationCheck />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="siteName" className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        placeholder="KIT SCC"
                        onBlur={nameInput.field.onBlur}
                        onChange={nameInput.field.onChange}
                        ref={nameInput.field.ref}
                        value={nameInput.field.value}
                        isInvalid={nameInput.fieldState.invalid}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.name?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="siteAddress" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        placeholder="https://www.scc.kit.edu/"
                        onBlur={addressInput.field.onBlur}
                        onChange={addressInput.field.onChange}
                        ref={addressInput.field.ref}
                        value={addressInput.field.value}
                        isInvalid={addressInput.fieldState.invalid}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.address?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="siteDescription" className="mb-1">
                    <Form.Label>Description (optional):</Form.Label>
                    <Form.Control
                        placeholder="Add a description here."
                        as="textarea"
                        onBlur={descriptionInput.field.onBlur}
                        onChange={descriptionInput.field.onChange}
                        ref={descriptionInput.field.ref}
                        value={descriptionInput.field.value}
                        isInvalid={descriptionInput.fieldState.invalid}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.description?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="success" type="submit" disabled={!auth.loggedIn}>
                    Submit
                </Button>
            </Form>
        </LoadingWrapper>
    );
}
