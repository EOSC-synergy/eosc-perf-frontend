import 'prismjs/themes/prism-dark.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import type { AppProps } from 'next/app';
import { QueryClientWrapper } from 'components/queryClientWrapper';
import { OidcConfiguration, OidcProvider } from '@axa-fr/react-oidc';
import { UserContextWrapper } from 'components/userContextWrapper';
import { NavHeader } from 'components/navHeader';
import { Footer } from 'components/footer';
import { useRouter } from 'next/router';
import { SSRProvider } from 'react-bootstrap';
import Head from 'next/head';

const oidcConfig: OidcConfiguration = {
    authority:
        process.env.NEXT_PUBLIC_OAUTH_AUTHORITY ??
        (process.env.NODE_ENV === 'development'
            ? 'https://aai-dev.egi.eu/auth/realms/egi'
            : 'https://aai.egi.eu/oidc'),
    client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? 'eosc-performance',
    redirect_uri:
        (process.env.NEXT_PUBLIC_OIDC_REDIRECT_HOST ?? 'https://localhost') + '/oidc-redirect',
    scope: 'openid email profile eduperson_entitlement offline_access',
    //autoSignIn: false,
};

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const withCustomHistory = () => {
        return {
            replaceState: (url: string) => {
                router
                    .replace({
                        pathname: url,
                    })
                    .then(() => {
                        window.dispatchEvent(new Event('popstate'));
                    });
            },
        };
    };

    return (
        <>
            <Head>
                <title>EOSC Performance</title>
                <link rel="shortcut icon" href="/images/eosc-perf-logo.5.png" />
                <meta name="theme-color" content="#f8f9fa" />
            </Head>
            <SSRProvider>
                <QueryClientWrapper>
                    <OidcProvider configuration={oidcConfig} withCustomHistory={withCustomHistory}>
                        <UserContextWrapper>
                            <div className="d-flex flex-column min-vh-100">
                                <NavHeader />
                                <div className="my-2 flex-grow-1">
                                    <Component {...pageProps} />
                                </div>
                                <Footer />
                            </div>
                        </UserContextWrapper>
                    </OidcProvider>
                </QueryClientWrapper>
            </SSRProvider>
        </>
    );
}

export default MyApp;
