import React, { FC, ReactElement } from 'react';
import { Result } from '@eosc-perf/eosc-perf-client';

type ExecutionDateColumnProps = {
    result: Result;
};

/**
 * Column to display the time the result was obtained
 * @param {Result} result
 * @returns {React.ReactElement}
 * @constructor
 */
export const ExecutionDateColumn: FC<ExecutionDateColumnProps> = ({ result }) => {
    return <>{result.execution_datetime}</>;
};
