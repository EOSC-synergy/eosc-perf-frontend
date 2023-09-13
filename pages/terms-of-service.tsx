import { Container } from 'react-bootstrap';
import Head from 'next/head';
import TermsOfService from 'components/TermsOfService';
import { type NextPage } from 'next';

/**
 * Page containing our terms of service / acceptable use policy.
 */
const TermsOfServicePage: NextPage = () => (
    <>
        <Head>
            <title>Acceptable Use Policy</title>
        </Head>
        <Container>
            <TermsOfService />
        </Container>
    </>
);

export default TermsOfServicePage;
