import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { UserContext } from 'components/userContext';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { Alert, Button, Form } from 'react-bootstrap';
import { getErrorMessage } from 'components/forms/getErrorMessage';
import { RegistrationCheck } from 'components/registrationCheck';
import { LoadingWrapper } from '../loadingOverlay';
import { LoginCheck } from '../loginCheck';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { CreateFlavor, Site } from '@eosc-perf-automation/eosc-perf-client';
import useApi from '../../utils/useApi';

type FormContents = {
    name: string;
    description: string;
};

export function FlavorSubmitForm(props: {
    site: Site;
    onSuccess: () => void;
    onError: () => void;
}): ReactElement {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const { handleSubmit, control, formState } = useForm<FormContents>();

    const nameInput = useController({
        name: 'name',
        control,
        rules: {
            required: 'A flavor must have a name!',
        },
        defaultValue: '',
    });

    const descriptionInput = useController({
        name: 'description',
        control,
        defaultValue: '',
    });

    const [errorMessage, setErrorMessage] = useState<ReactNode | undefined>(undefined);

    // clear error message on load
    useEffect(() => {
        setErrorMessage(undefined);
    }, []);

    const { mutate } = useMutation(
        (data: CreateFlavor) => api.sites.addFlavor(props.site.id, data),
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

    const onSubmit: SubmitHandler<FormContents> = (data) => {
        mutate({
            name: data.name,
            description: data.description.length ? data.description : undefined,
        });
    };

    return (
        <LoadingWrapper isLoading={auth.loading}>
            {errorMessage !== undefined && <Alert variant="danger">Error: {errorMessage}</Alert>}
            <LoginCheck message="You must be logged in to submit new site flavors!" />
            <RegistrationCheck />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        placeholder="standard-medium"
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

                <Form.Group>
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
                </Form.Group>

                <Button variant="success" type="submit" disabled={!auth.loggedIn} className="mt-1">
                    Submit
                </Button>
            </Form>
        </LoadingWrapper>
    );
}
