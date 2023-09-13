import 'prismjs/themes/prism-dark.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/overrides.css';

import type { AppProps } from 'next/app';
import QueryClientWrapper from 'components/QueryClientWrapper';
import { AuthProvider, type AuthProviderProps } from 'react-oidc-context';
import UserContextWrapper from 'components/UserContextWrapper';
import NavHeader from 'components/NavHeader';
import Footer from 'components/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';

const oidcConfig: AuthProviderProps = {
    authority:
        process.env['NEXT_PUBLIC_OAUTH_AUTHORITY'] ??
        (process.env.NODE_ENV === 'development'
            ? 'https://aai-dev.egi.eu/auth/realms/egi/'
            : 'https://aai.egi.eu/auth/realms/egi/'),
    client_id: process.env['NEXT_PUBLIC_OIDC_CLIENT_ID'] ?? 'eosc-performance',
    redirect_uri: `${
        process.env['NEXT_PUBLIC_OIDC_REDIRECT_HOST'] ?? 'https://localhost'
    }/oidc-redirect`,
    scope: 'openid email profile eduperson_entitlement offline_access',
    //autoSignIn: false,
    response_type: 'code',
};

const MyApp = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>EOSC Performance</title>
                <link rel="shortcut icon" href="/images/eosc-perf-logo.5.png" />
                <meta name="theme-color" content="#f8f9fa" />
            </Head>
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
        </>
    );
};

export default MyApp;
