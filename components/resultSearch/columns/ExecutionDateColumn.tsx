import React, { FC } from 'react';
import { Result } from '@eosc-perf/eosc-perf-client';
import { formatDistance } from 'date-fns';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type ExecutionDateColumnProps = {
    result: Result;
};

/**
 * Column to display the time the result was obtained
 * @param result
 */
const ExecutionDateColumn: FC<ExecutionDateColumnProps> = ({ result }) => {
    const executionDate = new Date(result.execution_datetime);

    return (
        <span
            style={{
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
                textDecorationColor: 'rgba(0, 0, 0, 0.33)',
            }}
        >
            <OverlayTrigger
                overlay={
                    <Tooltip id={result.id + '-tooltip'}>
                        {executionDate.toLocaleString(undefined)}
                    </Tooltip>
                }
            >
                <span>
                    {formatDistance(executionDate, new Date(), {
                        addSuffix: true,
                    })}
                </span>
            </OverlayTrigger>
        </span>
    );
};

export default ExecutionDateColumn;
