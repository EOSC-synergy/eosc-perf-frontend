import React, { FC, ReactElement } from 'react';
import { Form } from 'react-bootstrap';
import { ResultCallbacks } from 'components/resultSearch/resultCallbacks';
import { Result } from '@eosc-perf/eosc-perf-client';

type CheckboxColumnProps = {
    result: Result;
    callbacks: ResultCallbacks;
};

/**
 * Column to select result
 * @param result
 * @param callbacks
 */
const CheckboxColumn: FC<CheckboxColumnProps> = ({ result, callbacks }) => (
    <Form>
        <Form.Check
            // TODO: "switch" => "checkbox" once it's fixed in react-bootstrap
            type="switch"
            onChange={() => {
                callbacks.isSelected(result)
                    ? callbacks.unselect(result)
                    : callbacks.select(result);
            }}
            checked={callbacks.isSelected(result)}
        />
    </Form>
);

export default CheckboxColumn;
