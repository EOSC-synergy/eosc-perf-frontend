import { type FC } from 'react';
import styles from 'styles/tagSelector.module.css';
import { Placeholder } from 'react-bootstrap';
import clsx from 'clsx';

/**
 * Placeholder tag component for use when tags are still loading
 */
const PlaceholderTag: FC = () => (
    <div className={clsx(styles['tagBadge'], 'p-1')}>
        <Placeholder xs={12} style={{ width: '2em' }} />
    </div>
);

export default PlaceholderTag;
