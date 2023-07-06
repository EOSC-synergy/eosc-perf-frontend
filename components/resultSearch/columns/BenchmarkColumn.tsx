import React, { FC } from 'react';
import { Result } from '@eosc-perf/eosc-perf-client';

type BenchmarkColumnProps = { result: Result };

/**
 * Column to display benchmark docker image and version tag
 * @param result
 */
const BenchmarkColumn: FC<BenchmarkColumnProps> = ({ result }) => (
    <>{result.benchmark.docker_image + ':' + result.benchmark.docker_tag}</>
);

export default BenchmarkColumn;
