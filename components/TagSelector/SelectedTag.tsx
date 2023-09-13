import styles from 'styles/tagSelector.module.css';
import InlineCloseButton from 'components/InlineCloseButton';
import { type FC } from 'react';
import { type Tag } from '@eosc-perf/eosc-perf-client';
import clsx from 'clsx';

type SelectedTagProps = { tag: Tag; unselect: (tag: Tag) => void };

/**
 * Represents a selected tag
 *
 * @param props
 * @param props.tag selected tag
 * @param props.unselect callback to un-select tag
 */
const SelectedTag: FC<SelectedTagProps> = ({ tag, unselect }) => (
    <div className={clsx(styles['tagBadge'], 'p-1')}>
        {tag.name}
        <InlineCloseButton onClose={() => unselect(tag)} />
    </div>
);

export default SelectedTag;
