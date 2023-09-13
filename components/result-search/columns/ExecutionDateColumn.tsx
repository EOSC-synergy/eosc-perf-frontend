import { FC, useMemo } from 'react';
import { Result } from '@eosc-perf/eosc-perf-client';
import { formatDistance } from 'date-fns';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from './ExecutionDateColumn.module.scss';

type ExecutionDateColumnProps = {
    result: Result;
};

/**
 * Column to display the time the result was obtained
 *
 * @param props
 * @param props.result
 */
const ExecutionDateColumn: FC<ExecutionDateColumnProps> = ({ result }) => {
    const executionDate = useMemo(
        () => new Date(result.execution_datetime),
        [result.execution_datetime]
    );

    return (
        <span className={styles['underline']}>
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
