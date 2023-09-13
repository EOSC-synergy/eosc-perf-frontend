import { type FC } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import { benchmarkLinkDisplay, truthyOrNoneTag } from 'components/utility';
import useApi from 'lib/useApi';

type BenchmarkInfoProps = { id: string };
const BenchmarkInfo: FC<BenchmarkInfoProps> = ({ id }) => {
    const api = useApi();

    const benchmark = useQuery(['benchmark', id], () => api.benchmarks.getBenchmark(id));

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
};

export default BenchmarkInfo;
