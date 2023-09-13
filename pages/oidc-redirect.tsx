import Head from 'next/head';
import { Container } from 'react-bootstrap';
import { type NextPage } from 'next';

/**
 * Dummy page for oidc-redirect route.
 *
 * Once react-oidc-context is done, the user is redirected to the home page.
 */
const OidcRedirect: NextPage = () => (
    <>
        <Head>
            <title>Redirecting</title>
        </Head>
        <Container>Logging you in...</Container>
    </>
);

export default OidcRedirect;
