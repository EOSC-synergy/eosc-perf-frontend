import React, { ReactElement } from 'react';
import { Result } from '@eosc-perf/eosc-perf-client';

/**
 * Column to display benchmark docker image and version tag
 * @param {Result & {orderIndex: number}} result
 * @returns {React.ReactElement}
 * @constructor
 */
export function BenchmarkColumn({ result }: { result: Result }): ReactElement {
    return <>{result.benchmark.docker_image + ':' + result.benchmark.docker_tag}</>;
}
