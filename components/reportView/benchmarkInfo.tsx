import React, { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import { benchmarkLinkDisplay, truthyOrNoneTag } from 'components/utility';
import useApi from '../../utils/useApi';

export function BenchmarkInfo(props: { id: string }): ReactElement {
    const api = useApi();

    const benchmark = useQuery(
        ['benchmark', props.id],
        () => api.benchmarks.getBenchmark(props.id),
        {
            refetchOnWindowFocus: false, // do not spam queries
        }
    );

    return (
        <>
            {benchmark.isLoading && <LoadingOverlay />}
            {benchmark.isSuccess && benchmark.data && (
                <>
                    Image: {benchmarkLinkDisplay(benchmark.data.data)}
                    <br />
                    Description: {truthyOrNoneTag(benchmark.data.data.description)}
                    <br />
                    Submitted on: {new Date(benchmark.data.data.upload_datetime).toLocaleString()}
                </>
            )}
        </>
    );
}
