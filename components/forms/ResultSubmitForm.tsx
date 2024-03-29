import { type FC, useState } from 'react';
import JsonSelection from 'components/JsonSelection';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useMutation } from 'react-query';
import SiteSearchPopover from 'components/searchSelectors/SiteSearchPopover';
import BenchmarkSearchSelect from 'components/searchSelectors/BenchmarkSearchSelect';
import FlavorSearchSelect from 'components/searchSelectors/FlavorSearchSelect';
import ErrorMessage from './ErrorMessage';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RegistrationCheck from 'components/RegistrationCheck';
import TagSelector from 'components/TagSelector';
import LoginCheck from 'components/LoginCheck';
import { LoadingWrapper } from 'components/loadingOverlay';
import useApi from 'lib/useApi';
import { type Benchmark, type Flavor, type Site, type Tag } from '@eosc-perf/eosc-perf-client';
import useUser from 'lib/useUser';

const filterFuture = (d: Date) => d < new Date();

type ResultSubmitFormProps = {
    onSuccess: () => void;
    onError: () => void;
};

const ResultSubmitForm: FC<ResultSubmitFormProps> = ({ onSuccess, onError }) => {
    const auth = useUser();
    const api = useApi(auth.token);

    const [benchmark, setBenchmark] = useState<Benchmark>();
    const [site, setSite] = useState<Site>();
    const [flavor, setFlavor] = useState<Flavor>();
    const [tags, setTags] = useState<Tag[]>([]);

    const [fileContents, setFileContents] = useState<string>();

    const [execDate, setExecDate] = useState<Date | undefined>(new Date());

    const { mutate, error: mutationError } = useMutation(
        [],
        (data: Record<string, unknown>) => {
            if (benchmark && flavor && execDate) {
                return api.results.createResult(
                    execDate.toISOString(),
                    benchmark.id,
                    flavor.id,
                    data,
                    tags.map((tag) => tag.id)
                );
            }
            throw new Error('unexpectedly missing benchmark, flavor or date');
        },
        {
            onSuccess: onSuccess,
            onError: onError,
        }
    );

    const isFormValid = () => {
        return benchmark && site && flavor && fileContents && auth.token !== undefined;
    };

    const submit = () => {
        if (!isFormValid()) {
            return;
        }
        if (fileContents !== undefined) {
            mutate(JSON.parse(fileContents));
        }
    };

    return (
        <LoadingWrapper isLoading={auth.loading}>
            {mutationError != null && (
                <Alert variant="danger">
                    Error: <ErrorMessage error={mutationError} />
                </Alert>
            )}
            <LoginCheck message="You must be logged in to submit new results." />
            <RegistrationCheck />
            <Form>
                <Row>
                    <Col lg>
                        <Form.Group className="mb-3">
                            <JsonSelection
                                fileContents={fileContents}
                                setFileContents={setFileContents}
                            />
                        </Form.Group>

                        <Row className="d-flex justify-content-center mb-4">
                            <Col xl={4}>
                                <BenchmarkSearchSelect
                                    benchmark={benchmark}
                                    setBenchmark={setBenchmark}
                                />
                            </Col>
                            <Col xl={4}>
                                <SiteSearchPopover site={site} setSite={setSite} />
                            </Col>
                            <Col xl={4}>
                                <FlavorSearchSelect
                                    site={site}
                                    flavor={flavor}
                                    setFlavor={setFlavor}
                                />
                            </Col>
                        </Row>

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
                                        filterDate={filterFuture}
                                        filterTime={filterFuture}
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
