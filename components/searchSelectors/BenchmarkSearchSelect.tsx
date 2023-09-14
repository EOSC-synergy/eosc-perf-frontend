import { type FC, useState } from 'react';
import BenchmarkSubmissionModal from 'components/submissionModals/BenchmarkSubmissionModal';
import { SearchingSelector } from './index';
import { type Benchmark } from '@eosc-perf/eosc-perf-client';
import useApi from 'lib/useApi';
import { Button, InputGroup } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

type BenchmarkSearchSelectProps = {
    benchmark?: Benchmark;
    setBenchmark: (benchmark?: Benchmark) => void;
};

const BenchmarkSearchSelect: FC<BenchmarkSearchSelectProps> = ({ benchmark, setBenchmark }) => {
    const api = useApi();

    const displayRow = (benchmark: Benchmark) => (
        <>
            {`${benchmark.docker_image}:${benchmark.docker_tag}`}
            <p>{benchmark.description}</p>
        </>
    );

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <div>
            Benchmark:{' '}
            {benchmark && (
                <a
                    href={`https://hub.docker.com/r/${benchmark.docker_image}`}
                    className="float-end"
                >
                    website
                </a>
            )}
            <InputGroup className="w-100 flex-nowrap">
                <SearchingSelector<Benchmark>
                    queryKeyPrefix="benchmark"
                    tableName="Benchmark"
                    queryCallback={(terms) => api.benchmarks.searchBenchmarks(terms)}
                    setItem={setBenchmark}
                    displayRow={displayRow}
                    submitNew={() => setShowSubmitModal(true)}
                    toggle={
                        <Button
                            variant={benchmark ? 'primary' : 'outline-primary'}
                            className="d-block flex-grow-1"
                        >
                            {benchmark
                                ? `${benchmark.docker_image}:${benchmark.docker_tag}`
                                : 'None'}
                        </Button>
                    }
                />
                {benchmark && (
                    <Button variant="secondary" onClick={() => setBenchmark(undefined)}>
                        <X />
                    </Button>
                )}
            </InputGroup>
            <BenchmarkSubmissionModal
                show={showSubmitModal}
                onHide={() => setShowSubmitModal(false)}
            />
        </div>
    );
};

export default BenchmarkSearchSelect;
