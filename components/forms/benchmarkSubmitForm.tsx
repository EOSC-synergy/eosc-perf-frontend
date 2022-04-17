import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { UserContext } from 'components/userContext';
import { useMutation } from 'react-query';
import { CreateBenchmark } from 'model';
import { postHelper } from 'components/api-helpers';
import { AxiosError } from 'axios';
import { getErrorMessage } from 'components/forms/getErrorMessage';
import benchmarkJsonSchema from 'components/benchmarkJsonSchemaExample.json';
import { RegistrationCheck } from 'components/registrationCheck';
import Link from 'next/link';
import { LoadingWrapper } from '../loadingOverlay';
import { LoginCheck } from '../loginCheck';
import { SubmitHandler, useForm, useController } from 'react-hook-form';

// TODO: do not show invalid on first load
//       use default state valid?

type FormContents = {
    dockerName: string;
    dockerTag: string;
    description: string;
    template: string;
};

export function BenchmarkSubmitForm(props: {
    onSuccess: () => void;
    onError: () => void;
}): ReactElement {
    const auth = useContext(UserContext);

    const { register, handleSubmit, formState, control } = useForm<FormContents>();

    function validateTemplate(template: string) {
        if (template.length === 0) {
            return false;
        }
        try {
            JSON.parse(template);
            return true;
        } catch (SyntaxError) {
            return false;
        }
    }

    const dockerNameInput = useController({
        name: 'dockerName',
        control,
        rules: {
            required: 'Must be a valid docker image name',
            pattern: /[^/]+\/[^/]+/,
        },
        defaultValue: '',
    });
    const dockerTagInput = useController({
        name: 'dockerTag',
        control,
        rules: {
            required: 'Must be a valid docker tag',
        },
        defaultValue: 'latest',
    });
    const templateInput = useController({
        name: 'template',
        control,
        rules: {
            required: 'Must be a valid JSON schema',
            validate: validateTemplate,
        },
        defaultValue: '',
    });

    const [errorMessage, setErrorMessage] = useState<ReactNode | undefined>(undefined);

    // clear error message on load
    useEffect(() => {
        setErrorMessage(undefined);
    }, []);

    const { mutate } = useMutation(
        (data: CreateBenchmark) => postHelper<CreateBenchmark>('/benchmarks', data, auth.token),
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
        const templateJson = data.template ? data.template : undefined;
        mutate({
            docker_image: data.dockerName,
            docker_tag: data.dockerTag,
            description: data.description.length ? data.description : null,
            json_schema: templateJson ? JSON.parse(templateJson) : undefined,
        });
    };

    return (
        <LoadingWrapper isLoading={auth.loading}>
            {errorMessage !== undefined && <Alert variant="danger">Error: {errorMessage}</Alert>}
            <LoginCheck message="You must be logged in to submit new benchmarks!" />
            <RegistrationCheck />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="dockerName">
                            <Form.Label>Docker image:</Form.Label>
                            <Form.Control
                                placeholder="user/image"
                                aria-label="Docker image name including username"
                                onBlur={dockerNameInput.field.onBlur}
                                onChange={dockerNameInput.field.onChange}
                                ref={dockerNameInput.field.ref}
                                value={dockerNameInput.field.value}
                                isInvalid={dockerNameInput.fieldState.invalid}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formState.errors.dockerName?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="dockerTag">
                            <Form.Label>Image version:</Form.Label>
                            <Form.Control
                                placeholder="tag"
                                aria-label="Tag or version of the docker image to use"
                                onBlur={dockerTagInput.field.onBlur}
                                onChange={dockerTagInput.field.onChange}
                                ref={dockerTagInput.field.ref}
                                value={dockerTagInput.field.value}
                                isInvalid={dockerTagInput.fieldState.invalid}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formState.errors.dockerTag?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Benchmark description (optional):</Form.Label>
                    <Form.Control
                        placeholder="Enter a description of the new benchmark here."
                        as="textarea"
                        {...register('description')}
                    />
                </Form.Group>

                <Form.Group controlId="template">
                    <Form.Label>
                        Benchmark result JSON schema (
                        <Link href="/code-guidelines#json">example here</Link>
                        ):
                    </Form.Label>
                    <Form.Control
                        placeholder={JSON.stringify(benchmarkJsonSchema, null, 4)}
                        as="textarea"
                        onBlur={templateInput.field.onBlur}
                        onChange={templateInput.field.onChange}
                        ref={templateInput.field.ref}
                        value={templateInput.field.value}
                        isInvalid={templateInput.fieldState.invalid}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.template?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="success" type="submit" className="mt-1" disabled={!auth.loggedIn}>
                    Submit
                </Button>
            </Form>
        </LoadingWrapper>
    );
}
