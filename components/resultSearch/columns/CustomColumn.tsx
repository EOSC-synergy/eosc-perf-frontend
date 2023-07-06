import React, { FC, ReactElement } from 'react';
import { fetchSubkey, Json } from 'components/resultSearch/jsonKeyHelpers';
import { truthyOrNoneTag } from 'components/utility';
import { Result } from '@eosc-perf/eosc-perf-client';

type CustomColumnProps = {
    result: Result;
    jsonKey: string;
};

/**
 * Column to display specified JSON-value
 * @param result
 * @param jsonKey Key to JSON value to display
 */
const CustomColumn: FC<CustomColumnProps> = ({ result, jsonKey }) => {
    const value = fetchSubkey(result.json as Json, jsonKey) as string | number;
    return <>{truthyOrNoneTag(value?.toString(), 'Not found!')}</>;
};

export default CustomColumn;
