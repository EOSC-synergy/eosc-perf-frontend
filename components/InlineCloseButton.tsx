import { type FC } from 'react';
import { X } from 'react-bootstrap-icons';
import actionable from 'styles/actionable.module.css';
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
    <div
        onClick={() => onClose()}
        className={clsx('d-inline-block', actionable['actionable'])}
        role="button"
    >
        <X />
    </div>
);

export default InlineCloseButton;
