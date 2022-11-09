import React, { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { emptyUser, UserContext } from 'components/userContext';
import { useAuth } from 'react-oidc-context';
import useApi from '../utils/useApi';

/**
 * Wrapper to provide authentication info about the current user, such as email or token
 * @param children
 * @constructor
 */
export function UserContextWrapper({ children }: { children: ReactNode }) {
    const authentication = useAuth();
    const api = useApi(authentication.user?.access_token);

    const amIRegistered = useQuery('registered', () => api.users.getSelf(), {
        retry: false,
        enabled: authentication.isAuthenticated,
        refetchOnWindowFocus: false,
    });

    const amIAdmin = useQuery('is_admin', () => api.users.tryAdmin(), {
        retry: false,
        enabled: authentication.user != null,
        refetchOnWindowFocus: false,
    });

    const callbacks = {
        login: () => authentication.signinRedirect(),
        logout: () => authentication.removeUser(),
    };

    return (
        <UserContext.Provider
            value={
                authentication.isAuthenticated && authentication.user
                    ? {
                          token: authentication.user.access_token,
                          email: amIRegistered.data?.data.email,
                          registered: amIRegistered.isSuccess,
                          admin: amIAdmin.isSuccess,
                          loggedIn: true,
                          loading:
                              authentication.isLoading ||
                              amIRegistered.isLoading ||
                              amIAdmin.isLoading,
                          ...callbacks,
                      }
                    : { ...emptyUser, ...callbacks }
            }
        >
            {children}
        </UserContext.Provider>
    );
}
