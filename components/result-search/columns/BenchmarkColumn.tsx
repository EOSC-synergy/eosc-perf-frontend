import { type FC } from 'react';
import { type Result } from '@eosc-perf/eosc-perf-client';

type BenchmarkColumnProps = { result: Result };

/**
 * Column to display benchmark docker image and version tag
 *
 * @param props
 * @param props.result result data
 */
const BenchmarkColumn: FC<BenchmarkColumnProps> = ({ result }) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{`${result.benchmark.docker_image}:${result.benchmark.docker_tag}`}</>
);

export default BenchmarkColumn;
