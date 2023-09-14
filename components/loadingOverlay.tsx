import { type FC, type PropsWithChildren } from 'react';

import styles from 'styles/loadingOverlay.module.css';

/**
 * Space filling loading overlay including a spinner or equivalent
 */
export const LoadingOverlay: FC = () => (
    <div className={styles['loading']}>
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
