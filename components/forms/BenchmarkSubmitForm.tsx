import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import React, { FC, useContext } from 'react';
import { UserContext } from 'components/userContext';
import { useMutation } from 'react-query';
import ErrorMessage from './ErrorMessage';
import benchmarkJsonSchema from 'components/benchmarkJsonSchemaExample.json';
import { RegistrationCheck } from 'components/registrationCheck';
import Link from 'next/link';
import { LoadingWrapper } from 'components/loadingOverlay';
import { LoginCheck } from 'components/loginCheck';
import { SubmitHandler, useForm, useController } from 'react-hook-form';
import useApi from 'utils/useApi';
import { CreateBenchmark } from '@eosc-perf/eosc-perf-client';

const validateTemplate = (template: string) => {
    if (template.length === 0) {
        return false;
    }
    try {
        JSON.parse(template);
        return true;
    } catch (SyntaxError) {
        return false;
    }
};

type FormContents = {
    dockerName: string;
    dockerTag: string;
    description: string;
    template: string;
    url: string;
};

type BenchmarkSubmitForm = {
    onSuccess: () => void;
    onError: () => void;
};

const BenchmarkSubmitForm: FC<BenchmarkSubmitForm> = ({ onError, onSuccess }) => {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);
    const { register, handleSubmit, formState, control } = useForm<FormContents>();

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
    const urlInput = useController({
        name: 'url',
        control,
        rules: {
            required: 'Must contain a link to a website',
        },
        defaultValue: '',
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

    const { mutate, error: mutationError } = useMutation(
        (data: CreateBenchmark) => api.benchmarks.createBenchmark(data),
        {
            onSuccess: onSuccess,
            onError: onError,
        }
    );

    const onSubmit: SubmitHandler<FormContents> = (data) => {
        const templateJson = data.template ? data.template : undefined;
        mutate({
            docker_image: data.dockerName,
            docker_tag: data.dockerTag,
            url: data.url,
            description: data.description.length ? data.description : undefined,
            json_schema: templateJson ? JSON.parse(templateJson) : undefined,
        });
    };

    return (
        <LoadingWrapper isLoading={auth.loading}>
            {mutationError != null && (
                <Alert variant="danger">
                    Error: <ErrorMessage error={mutationError} />
                </Alert>
            )}
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

                <Form.Group className="mb-3" controlId="url">
                    <Form.Label>Link to website / source / project page:</Form.Label>
                    <Form.Control
                        placeholder="Link to a page about your benchmark"
                        aria-label="Add a link to a page where users can find out more about your benchmark!"
                        onBlur={urlInput.field.onBlur}
                        onChange={urlInput.field.onChange}
                        ref={urlInput.field.ref}
                        value={urlInput.field.value}
                        isInvalid={urlInput.fieldState.invalid}
                    />
                </Form.Group>

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
};

export default BenchmarkSubmitForm;
