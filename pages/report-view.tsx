import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { UserContext } from '../components/userContext';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { SubmitView } from '../components/reportView/submitView';
import { Paginator } from '../components/pagination';
import { ClaimView } from '../components/reportView/claimView';
import Head from 'next/head';
import useApi from '../utils/useApi';

/**
 * Admin-only page to view pending reports and submissions.
 *
 * @returns {React.ReactElement}
 * @constructor
 */
function ReportsView(): ReactElement {
    const router = useRouter();

    const auth = useContext(UserContext);
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
            refetchOnWindowFocus: false, // do not spam queries
        }
    );
    const claims = useQuery(
        ['claims', claimsPage],
        () => api.reports.listClaims(undefined, undefined, undefined, undefined, claimsPage),
        {
            enabled: !!auth.token,
            refetchOnWindowFocus: false, // do not spam queries
        }
    );

    function SubmitsList() {
        return (
            <>
                <ListGroup>
                    {submits.isSuccess &&
                        submits.data &&
                        submits.data.data.items.map((submit) => (
                            <SubmitView
                                submit={submit}
                                key={submit.resource_id}
                                refetch={submits.refetch}
                            />
                        ))}
                    {submits.isSuccess && submits.data.data.total === 0 && (
                        <>No submits to display!</>
                    )}
                    {submits.isError && <>Failed to fetch submits!</>}
                </ListGroup>
                {submits.isSuccess && submits.data && submits.data.data.pages > 0 && (
                    <div className="mt-2">
                        <Paginator
                            pagination={submits.data.data}
                            navigateTo={(p) => setSubmitsPage(p)}
                        />
                    </div>
                )}
            </>
        );
    }

    function ClaimsList() {
        return (
            <>
                <ListGroup>
                    {claims.isSuccess &&
                        claims.data &&
                        claims.data.data.items.map((claim) => (
                            <ClaimView
                                claim={claim}
                                key={claim.resource_id}
                                refetch={claims.refetch}
                            />
                        ))}
                    {claims.isSuccess && claims.data.data.total === 0 && <>No claims to display!</>}
                    {claims.isError && <>Failed to fetch claims!</>}
                </ListGroup>
                {claims.isSuccess && claims.data && claims.data.data.pages > 0 && (
                    <div className="mt-2">
                        <Paginator
                            pagination={claims.data.data}
                            navigateTo={(p) => setClaimsPage(p)}
                        />
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Reports View</title>
            </Head>
            <Container>
                {auth.admin && (
                    <>
                        <Row className="my-3">
                            <Col>
                                <h1>Submits</h1>
                                <SubmitsList />
                            </Col>
                            <Col>
                                <h1>Claims</h1>
                                <ClaimsList />
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </>
    );
}

export default ReportsView;
