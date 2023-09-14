import { type FC, type PropsWithChildren } from 'react';

import styles from 'styles/loadingOverlay.module.css';
import clsx from 'clsx';

type LoadingOverlayProps = {
    loading?: boolean;
};

/**
 * Space filling loading overlay including a spinner or equivalent
 */
export const LoadingOverlay: FC<LoadingOverlayProps> = ({ loading = true }) => (
    <div className={clsx(styles['loading'], !loading && styles['loaded'])}>
        <div className={styles['ldsEllipsis']}>
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
);

type LoadingWrapperProps = {
    isLoading: boolean;
};
export const LoadingWrapper: FC<PropsWithChildren<LoadingWrapperProps>> = ({
    isLoading,
    children,
}) => {
    if (isLoading) {
        return <LoadingOverlay />;
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
};
