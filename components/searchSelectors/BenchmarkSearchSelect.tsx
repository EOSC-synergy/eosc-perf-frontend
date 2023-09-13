import { type FC, useState } from 'react';
import BenchmarkSubmissionModal from 'components/submissionModals/BenchmarkSubmissionModal';
import { SearchingSelector } from './index';
import { type Benchmark } from '@eosc-perf/eosc-perf-client';
import useApi from 'lib/useApi';

type BenchmarkSearchSelectProps = {
    benchmark?: Benchmark;
    setBenchmark: (benchmark?: Benchmark) => void;
};

const BenchmarkSearchSelect: FC<BenchmarkSearchSelectProps> = ({ benchmark, setBenchmark }) => {
    const api = useApi();

    const display = (benchmark?: Benchmark) => (
        <>
            Benchmark:{' '}
            {benchmark ? (
                <a href={`https://hub.docker.com/r/${benchmark.docker_image}`}>
                    {`${benchmark.docker_image}:${benchmark.docker_tag}`}
                </a>
            ) : (
                <div className="text-muted" style={{ display: 'inline-block' }}>
                    None
                </div>
            )}
        </>
    );

    const displayRow = (benchmark: Benchmark) => (
        <>
            {`${benchmark.docker_image}:${benchmark.docker_tag}`}
            <p>{benchmark.description}</p>
        </>
    );

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <>
            <SearchingSelector<Benchmark>
                queryKeyPrefix="benchmark"
                tableName="Benchmark"
                queryCallback={(terms) => api.benchmarks.searchBenchmarks(terms)}
                item={benchmark}
                setItem={setBenchmark}
                display={display}
                displayRow={displayRow}
                submitNew={() => setShowSubmitModal(true)}
            />
            <BenchmarkSubmissionModal
                show={showSubmitModal}
                onHide={() => setShowSubmitModal(false)}
            />
        </>
    );
};

export default BenchmarkSearchSelect;
