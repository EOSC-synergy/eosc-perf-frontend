import { type FC } from 'react';
import { truthyOrNoneTag } from 'components/utility';
import { type Result } from '@eosc-perf/eosc-perf-client';

type TagsColumnProps = { result: Result };

/**
 * Column to display a list of tags associated to result
 *
 * @param props
 * @param props.result
 */
const TagsColumn: FC<TagsColumnProps> = ({ result }) => (
    <>{truthyOrNoneTag(result.tags.map((tag) => tag.name).join(', '))}</>
);

export default TagsColumn;
