import React, { ReactElement } from 'react';
import { Form } from 'react-bootstrap';
import { ResultCallbacks } from 'components/resultSearch/resultCallbacks';
import { Result } from '@eosc-perf/eosc-perf-client';

/**
 * Column to select result
 * @param {Result} result
 * @param {ResultCallbacks} callbacks
 * @returns {React.ReactElement}
 * @constructor
 */
export function CheckboxColumn({
    result,
    callbacks,
}: {
    result: Result;
    callbacks: ResultCallbacks;
}): ReactElement {
    // TODO: "switch" => "checkbox" once it's fixed in react-bootstrap
    return (
        <Form>
            <Form.Check
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
}
