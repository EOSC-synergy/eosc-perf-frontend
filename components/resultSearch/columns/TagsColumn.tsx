import React, { FC } from 'react';
import { truthyOrNoneTag } from 'components/utility';
import { Result } from '@eosc-perf/eosc-perf-client';

type TagsColumnProps = { result: Result };

/**
 * Column to display a list of tags associated to result
 * @param result
 */
const TagsColumn: FC<TagsColumnProps> = ({ result }) => (
    <>{truthyOrNoneTag(result.tags.map((tag) => tag.name).join(', '))}</>
);

export default TagsColumn;
