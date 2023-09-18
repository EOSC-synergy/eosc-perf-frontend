import { type FC } from 'react';
import styles from 'styles/tagSelector.module.css';
import { type Tag } from '@eosc-perf/eosc-perf-client';
import clsx from 'clsx';

type UnselectedTagProps = { tag: Tag; select: (tag: Tag) => void };
const UnselectedTag: FC<UnselectedTagProps> = ({ tag, select }) => (
    <button className={clsx(styles['tagBadge'], 'p-1')} onClick={() => select(tag)} type="button">
        {tag.name}
    </button>
);

export default UnselectedTag;
