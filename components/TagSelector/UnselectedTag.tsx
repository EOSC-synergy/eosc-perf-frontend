import { type FC } from 'react';
import styles from 'styles/tagSelector.module.css';
import actionable from 'styles/actionable.module.css';
import { type Tag } from '@eosc-perf/eosc-perf-client';
import clsx from 'clsx';

type UnselectedTagProps = { tag: Tag; select: (tag: Tag) => void };
const UnselectedTag: FC<UnselectedTagProps> = ({ tag, select }) => (
    <div
        className={clsx(styles['tagBadge'], 'p-1', actionable['actionable'])}
        onClick={() => select(tag)}
    >
        {tag.name}
    </div>
);

export default UnselectedTag;
