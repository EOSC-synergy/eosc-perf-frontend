import React, { FC, ReactElement, useContext, useState } from 'react';
import { JsonSelection } from 'components/jsonSelection';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { UserContext } from 'components/userContext';
import { useMutation } from 'react-query';
import { SiteSearchPopover } from 'components/searchSelectors/siteSearchPopover';
import { BenchmarkSearchSelect } from 'components/searchSelectors/benchmarkSearchSelect';
import { FlavorSearchSelect } from 'components/searchSelectors/flavorSearchSelect';
import ErrorMessage from './ErrorMessage';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegistrationCheck } from 'components/registrationCheck';
import TagSelector from 'components/tagSelector';
import { LoginCheck } from 'components/loginCheck';
import { LoadingWrapper } from 'components/loadingOverlay';
import useApi from 'utils/useApi';
import { Benchmark, Flavor, Site, Tag } from '@eosc-perf/eosc-perf-client';

type ResultSubmitFormProps = {
    onSuccess: () => void;
    onError: () => void;
};

const ResultSubmitForm: FC<ResultSubmitFormProps> = ({ onSuccess, onError }) => {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const [benchmark, setBenchmark] = useState<Benchmark>();
    const [site, setSite] = useState<Site>();
    const [flavor, setFlavor] = useState<Flavor>();
    const [tags, setTags] = useState<Tag[]>([]);

    const [fileContents, setFileContents] = useState<string>();

    const [execDate, setExecDate] = useState<Date | undefined>(new Date());

    const { mutate, error: mutationError } = useMutation(
        [],
        (data: any) => {
            if (benchmark && flavor && execDate) {
                return api.results.createResult(
                    execDate.toISOString(),
                    benchmark.id,
                    flavor.id,
                    data,
                    tags.map((tag) => tag.id)
                );
            }
            throw 'unexpectedly missing benchmark, flavor or date';
        },
        {
            onSuccess: onSuccess,
            onError: onError,
        }
    );

    function isFormValid() {
        return benchmark && site && flavor && fileContents && auth.token !== undefined;
    }

    function submit() {
        if (!isFormValid()) {
            return;
        }
        if (fileContents !== undefined) {
            mutate(JSON.parse(fileContents));
        }
    }

    function noFuture(d: Date) {
        return d < new Date();
    }

    return (
        <LoadingWrapper isLoading={auth.loading}>
            {mutationError != null && (
                <Alert variant="danger">
                    Error: <ErrorMessage error={mutationError} />
                </Alert>
            )}
            <LoginCheck message={'You must be logged in to submit new results!'} />
            <RegistrationCheck />
            <Form>
                <Row>
                    <Col lg={true}>
                        <Form.Group className="mb-3">
                            <JsonSelection
                                fileContents={fileContents}
                                setFileContents={setFileContents}
                            />{' '}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <BenchmarkSearchSelect
                                benchmark={benchmark}
                                setBenchmark={setBenchmark}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <SiteSearchPopover site={site} setSite={setSite} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FlavorSearchSelect site={site} flavor={flavor} setFlavor={setFlavor} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Row>
                                <Col>Execution date:</Col>
                                <Col md="auto">
                                    <DatePicker
                                        selected={execDate}
                                        onChange={(date: Date | null) =>
                                            setExecDate(date ?? undefined)
                                        }
                                        showTimeSelect
                                        timeIntervals={15}
                                        dateFormat="MMMM d, yyyy HH:mm"
                                        timeFormat="HH:mm"
                                        filterDate={noFuture}
                                        filterTime={noFuture}
                                    />
                                </Col>
                            </Row>
                            {/* dateFormat="Pp"*/}
                        </Form.Group>
                    </Col>
                    <Col lg="auto">
                        <div className="vr h-100" />
                    </Col>
                    <Col lg="auto">
                        <div className="mb-1">
                            <TagSelector selected={tags} setSelected={setTags} addTags />
                        </div>
                    </Col>
                </Row>

                <Row className="align-items-center">
                    <Col />
                    <Col md="auto">
                        <Button variant="success" disabled={!isFormValid()} onClick={submit}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </LoadingWrapper>
    );
};

export default ResultSubmitForm;
