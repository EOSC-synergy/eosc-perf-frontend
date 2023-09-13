import { type FC } from 'react';
import { fetchSubkey, type Json } from 'components/result-search/jsonKeyHelpers';
import { truthyOrNoneTag } from 'components/utility';
import { type Result } from '@eosc-perf/eosc-perf-client';

type CustomColumnProps = {
    result: Result;
    jsonKey: string;
};

/**
 * Column to display specified JSON-value
 *
 * @param props
 * @param props.result
 * @param props.jsonKey Key to JSON value to display
 */
const CustomColumn: FC<CustomColumnProps> = ({ result, jsonKey }) => {
    const value = fetchSubkey(result.json as Json, jsonKey) as string | number;
    return <>{truthyOrNoneTag(value.toString(), 'Not found!')}</>;
};

export default CustomColumn;
