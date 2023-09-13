import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import SubmitView from 'components/report-view/SubmitView';
import Paginator from 'components/Paginator';
import ClaimView from 'components/report-view/ClaimView';
import Head from 'next/head';
import useApi from 'lib/useApi';
import useUser from 'lib/useUser';
import { type NextPage } from 'next';

/**
 * Admin-only page to view pending reports and submissions.
 */
const ReportsView: NextPage = () => {
    const router = useRouter();

    const auth = useUser();
    const api = useApi(auth.token);

    const [submitsPage, setSubmitsPage] = useState(1);
    const [claimsPage, setClaimsPage] = useState(1);

    // if user is not admin, redirect them away
    useEffect(() => {
        if (!auth.loading && !auth.admin) {
            router.push('/');
        }
    }, [router, auth.admin, auth.loading]);

    const submits = useQuery(
        ['submits', submitsPage],
        () => api.reports.listSubmits(undefined, undefined, undefined, submitsPage),
        {
            enabled: !!auth.token,
        }
    );
    const claims = useQuery(
        ['claims', claimsPage],
        () => api.reports.listClaims(undefined, undefined, undefined, undefined, claimsPage),
        {
            enabled: !!auth.token,
        }
    );

    const submitsList = (
        <>
            <ListGroup>
                {submits.isSuccess &&
                    submits.data.data.items.map((submit) => (
                        <SubmitView
                            submit={submit}
                            key={submit.resource_id}
                            refetch={submits.refetch}
                        />
                    ))}
                {submits.isSuccess && submits.data.data.total === 0 && <>No submits to display!</>}
                {submits.isError && <>Failed to fetch submits!</>}
            </ListGroup>
            {submits.isSuccess && submits.data.data.pages > 0 && (
                <div className="mt-2">
                    <Paginator
                        pagination={submits.data.data}
                        navigateTo={(p) => setSubmitsPage(p)}
                    />
                </div>
            )}
        </>
    );

    const claimsList = (
        <>
            <ListGroup>
                {claims.isSuccess &&
                    claims.data.data.items.map((claim) => (
                        <ClaimView claim={claim} key={claim.resource_id} refetch={claims.refetch} />
                    ))}
                {claims.isSuccess && claims.data.data.total === 0 && <>No claims to display!</>}
                {claims.isError && <>Failed to fetch claims!</>}
            </ListGroup>
            {claims.isSuccess && claims.data.data.pages > 0 && (
                <div className="mt-2">
                    <Paginator pagination={claims.data.data} navigateTo={(p) => setClaimsPage(p)} />
                </div>
            )}
        </>
    );

    return (
        <>
            <Head>
                <title>Reports View</title>
            </Head>
            <Container>
                {auth.admin && (
                    <Row className="my-3">
                        <Col>
                            <h1>Submits</h1>
                            {submitsList}
                        </Col>
                        <Col>
                            <h1>Claims</h1>
                            {claimsList}
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
};

export default ReportsView;
