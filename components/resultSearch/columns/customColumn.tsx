import React, { ReactElement } from 'react';
import { fetchSubkey, Json } from 'components/resultSearch/jsonKeyHelpers';
import { truthyOrNoneTag } from 'components/utility';
import { Result } from '@eosc-perf-automation/eosc-perf-client';

/**
 * Column to display specified JSON-value
 * @param {Result} result
 * @param {string} jsonKey Key to JSON value to display
 * @returns {React.ReactElement}
 * @constructor
 */
export function CustomColumn({
    result,
    jsonKey,
}: {
    result: Result;
    jsonKey: string;
}): ReactElement {
    const value = fetchSubkey(result.json as Json, jsonKey) as string | number;
    return <>{truthyOrNoneTag(value?.toString(), 'Not found!')}</>;
}
