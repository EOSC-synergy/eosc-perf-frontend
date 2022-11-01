import React, { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { emptyUser, UserContext } from 'components/userContext';
import useApi from '../utils/useApi';
import { OidcUserStatus, useOidc, useOidcAccessToken, useOidcUser } from '@axa-fr/react-oidc';

/**
 * Wrapper to provide authentication info about the current user, such as email or token
 * @param children
 * @constructor
 */
export function UserContextWrapper({ children }: { children: ReactNode }) {
    const { login, logout, isAuthenticated } = useOidc();
    const { accessToken } = useOidcAccessToken();
    const { oidcUser, oidcUserLoadingState } = useOidcUser();
    const api = useApi(accessToken);

    const amIRegistered = useQuery('registered', () => api.users.getSelf(), {
        retry: false,
        enabled: isAuthenticated,
    });

    const amIAdmin = useQuery('is_admin', () => api.users.tryAdmin(), {
        retry: false,
        enabled: amIRegistered.isSuccess,
    });

    const callbacks = {
        login,
        logout,
    };

    return (
        <UserContext.Provider
            value={
                (isAuthenticated &&
                    oidcUserLoadingState == OidcUserStatus.Loaded && {
                        token: accessToken,
                        email: amIRegistered.data?.data.email,
                        registered: amIRegistered.isSuccess,
                        admin: amIAdmin.isSuccess,
                        loggedIn: true,
                        loading: amIRegistered.isLoading || amIAdmin.isLoading,
                        ...callbacks,
                    }) || { ...emptyUser, ...callbacks }
            }
        >
            {children}
        </UserContext.Provider>
    );
}
