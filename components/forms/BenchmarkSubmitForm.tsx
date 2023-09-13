import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { type FC } from 'react';
import { useMutation } from 'react-query';
import ErrorMessage from './ErrorMessage';
import benchmarkJsonSchema from 'components/benchmarkJsonSchemaExample.json';
import RegistrationCheck from 'components/RegistrationCheck';
import Link from 'next/link';
import { LoadingWrapper } from 'components/loadingOverlay';
import LoginCheck from 'components/LoginCheck';
import { type SubmitHandler, useForm } from 'react-hook-form';
import useApi from 'lib/useApi';
import { type CreateBenchmark } from '@eosc-perf/eosc-perf-client';
import useUser from 'lib/useUser';

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
    const auth = useUser();
    const api = useApi(auth.token);
    const { register, handleSubmit, formState } = useForm<FormContents>({
        defaultValues: {
            dockerName: '',
            dockerTag: 'latest',
            description: '',
            template: '',
            url: '',
        },
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
            <LoginCheck message="You must be logged in to submit new benchmarks." />
            <RegistrationCheck />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="dockerName">
                            <Form.Label>Docker image:</Form.Label>
                            <Form.Control
                                placeholder="user/image"
                                aria-label="Docker image name including username"
                                {...register('dockerName', {
                                    required: 'Must be a valid docker image name',
                                    pattern: /[^/]+\/[^/]+/,
                                })}
                                isInvalid={formState.errors.dockerName?.message !== undefined}
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
                                {...register('dockerTag', {
                                    required: 'Must be a valid docker tag',
                                })}
                                isInvalid={formState.errors.dockerTag?.message !== undefined}
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
                        {...register('url', {
                            required: 'Must contain a link to a website',
                        })}
                        isInvalid={formState.errors.url?.message !== undefined}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.url?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Benchmark description:</Form.Label>
                    <Form.Control
                        placeholder="Enter a description of the new benchmark here."
                        as="textarea"
                        rows={4}
                        {...register('description')}
                    />
                    <Form.Text>(optional)</Form.Text>
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
                        rows={4}
                        {...register('template', {
                            required: 'Must be a valid JSON schema',
                            validate: validateTemplate,
                        })}
                        isInvalid={formState.errors.template?.message !== undefined}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formState.errors.template?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Row>
                    <Col />
                    <Col xs="auto">
                        <Button
                            variant="success"
                            type="submit"
                            className="mt-1"
                            disabled={!auth.loggedIn}
                        >
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </LoadingWrapper>
    );
};

export default BenchmarkSubmitForm;
