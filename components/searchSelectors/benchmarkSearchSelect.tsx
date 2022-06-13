import React, { ReactElement, useState } from 'react';
import { BenchmarkSubmissionModal } from 'components/submissionModals/benchmarkSubmissionModal';
import { SearchingSelector } from './index';
import { useQuery } from 'react-query';
import { Benchmark } from '@eosc-perf/eosc-perf-client';
import useApi from '../../utils/useApi';

type BenchmarkSearchSelectProps = {
    benchmark?: Benchmark;
    initialBenchmarkId?: string;
    initBenchmark?: (benchmark?: Benchmark) => void;
    setBenchmark: (benchmark?: Benchmark) => void;
};

export const BenchmarkSearchSelect: React.FC<BenchmarkSearchSelectProps> = (
    props
): ReactElement => {
    const api = useApi();

    useQuery(
        ['initial-benchmark', props.initialBenchmarkId],
        () => {
            if (props.initialBenchmarkId) {
                return api.benchmarks.getBenchmark(props.initialBenchmarkId);
            }
            throw 'tried to get benchmark without id';
        },
        {
            enabled: props.initialBenchmarkId !== undefined,
            refetchOnWindowFocus: false, // do not spam queries
            onSuccess: (data) => {
                if (props.initBenchmark) {
                    props.initBenchmark(data.data);
                } else {
                    props.setBenchmark(data.data);
                }
            },
        }
    );

    function display(benchmark?: Benchmark) {
        return (
            <>
                Benchmark:{' '}
                {benchmark ? (
                    <a href={'https://hub.docker.com/r/' + benchmark.docker_image}>
                        {benchmark.docker_image + ':' + benchmark.docker_tag}
                    </a>
                ) : (
                    <div className="text-muted" style={{ display: 'inline-block' }}>
                        None
                    </div>
                )}
            </>
        );
    }

    function displayRow(benchmark: Benchmark) {
        return (
            <>
                {benchmark.docker_image + ':' + benchmark.docker_tag}
                <div>
                    {benchmark.description}
                    <br />
                </div>
            </>
        );
    }

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <>
            <SearchingSelector<Benchmark>
                queryKeyPrefix="benchmark"
                tableName="Benchmark"
                queryCallback={(terms) => api.benchmarks.searchBenchmarks(terms)}
                item={props.benchmark}
                setItem={props.setBenchmark}
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
