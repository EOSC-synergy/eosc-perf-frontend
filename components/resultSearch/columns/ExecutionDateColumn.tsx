import React, { FC } from 'react';
import { Result } from '@eosc-perf/eosc-perf-client';

type ExecutionDateColumnProps = {
    result: Result;
};

/**
 * Column to display the time the result was obtained
 * @param result
 */
const ExecutionDateColumn: FC<ExecutionDateColumnProps> = ({ result }) => (
    <>{result.execution_datetime}</>
);

export default ExecutionDateColumn;
