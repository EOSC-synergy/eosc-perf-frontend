import 'prismjs/themes/prism-dark.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import type { AppProps } from 'next/app';
import { QueryClientWrapper } from 'components/queryClientWrapper';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { UserContextWrapper } from 'components/userContextWrapper';
import { NavHeader } from 'components/navHeader';
import { Footer } from 'components/footer';
import { useRouter } from 'next/router';
import { SSRProvider } from 'react-bootstrap';
import Head from 'next/head';

const oidcConfig: AuthProviderProps = {
    authority:
        process.env.NEXT_PUBLIC_OAUTH_AUTHORITY ??
        (process.env.NODE_ENV === 'development'
            ? 'https://aai-dev.egi.eu/auth/realms/egi/'
            : 'https://aai.egi.eu/oidc/'),
    client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? 'eosc-performance',
    redirect_uri:
        (process.env.NEXT_PUBLIC_OIDC_REDIRECT_HOST ??
            process.env.NEXT_PUBLIC_API_HOST ??
            'https://localhost') + '/oidc-redirect',
    scope: 'openid email profile eduperson_entitlement offline_access',
    //autoSignIn: false,
    response_type: 'code',
};

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>EOSC Performance</title>
                <link rel="shortcut icon" href="/images/eosc-perf-logo.5.png" />
            </Head>
            <SSRProvider>
                <QueryClientWrapper>
                    <AuthProvider
                        {...oidcConfig}
                        onSigninCallback={() => {
                            router.push('/');
                        }}
                    >
                        <UserContextWrapper>
                            <div className="d-flex flex-column min-vh-100">
                                <NavHeader />
                                <div className="my-2 flex-grow-1">
                                    <Component {...pageProps} />
                                </div>
                                <Footer />
                            </div>
                        </UserContextWrapper>
                    </AuthProvider>
                </QueryClientWrapper>
            </SSRProvider>
        </>
    );
}

export default MyApp;
