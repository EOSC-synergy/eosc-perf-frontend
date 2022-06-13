import React, { ReactElement } from 'react';
import { truthyOrNoneTag } from 'components/utility';
import { Result } from '@eosc-perf/eosc-perf-client';

/**
 * Column to display a list of tags associated to result
 * @param {Result & {orderIndex: number}} result
 * @returns {React.ReactElement}
 * @constructor
 */
export function TagsColumn({ result }: { result: Result }): ReactElement {
    return <>{truthyOrNoneTag(result.tags.map((tag) => tag.name).join(', '))}</>;
}
