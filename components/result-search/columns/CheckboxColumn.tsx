import { type FC } from 'react';
import { Form } from 'react-bootstrap';
import type ResultCallbacks from 'components/result-search/ResultCallbacks';
import { type Result } from '@eosc-perf/eosc-perf-client';

type CheckboxColumnProps = {
    result: Result;
    callbacks: ResultCallbacks;
};

/**
 * Column to select result
 *
 * @param props
 * @param props.result
 * @param props.callbacks
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
