import { type FC } from 'react';
import { X } from 'react-bootstrap-icons';
import styles from './InlineCloseButton.module.scss';
import clsx from 'clsx';

type InlineCloseButtonProps = { onClose: () => void };

// TODO: use unstyled button instead of div

/**
 * Small X button representing a close action that is rendered inline
 *
 * @param props
 * @param props.onClose callback to call when button is pressed
 */
const InlineCloseButton: FC<InlineCloseButtonProps> = ({ onClose }) => (
    <button
        onClick={() => onClose()}
        className={clsx('d-inline-block', styles['unstyledButton'])}
        type="button"
    >
        <X />
    </button>
);

export default InlineCloseButton;
