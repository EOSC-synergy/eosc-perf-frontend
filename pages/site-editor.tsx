import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import { SiteEditor } from 'components/siteEditor/siteEditor';
import { Paginator } from '../components/pagination';
import Head from 'next/head';
import { UserContext } from '../components/userContext';
import { useRouter } from 'next/router';
import { SiteSelect } from '../components/siteEditor/siteSelect';
import useApi from '../utils/useApi';
import { Site } from '@eosc-perf/eosc-perf-client';

/**
 * Admin-only page to edit sites in the database and add flavors.
 *
 * @returns {React.ReactElement}
 * @constructor
 */
function SitesEditor(): ReactElement {
    const router = useRouter();

    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const [page, setPage] = useState(1);

    // if user is not admin, redirect them away
    useEffect(() => {
        if (!auth.loading && !auth.admin) {
            router.push('/');
        }
    }, [router, auth.admin, auth.loading]);

    const sites = useQuery(
        'sites',
        () => api.sites.listSites(undefined, undefined, undefined, undefined, page),

        {
            refetchOnWindowFocus: false, // do not spam queries
        }
    );

    const [activeSite, setActiveSite] = useState<Site | null>(null);

    function SiteList() {
        return (
            <>
                <ListGroup>
                    {sites.isLoading && <LoadingOverlay />}
                    {sites.isSuccess &&
                        sites.data &&
                        sites.data.data.items.length === 0 &&
                        'No sites found!'}
                    {sites.isSuccess &&
                        sites.data &&
                        sites.data.data.items.map((site: Site) => (
                            <SiteSelect site={site} setActiveSite={setActiveSite} key={site.id} />
                        ))}
                </ListGroup>
                {sites.isSuccess && sites.data && sites.data.data.pages > 0 && (
                    <div className="mt-2">
                        <Paginator pagination={sites.data.data} navigateTo={(p) => setPage(p)} />
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Site Editor</title>
            </Head>
            <Container>
                <Row>
                    <Col>{auth.admin && <SiteList />}</Col>
                    <Col>
                        {activeSite != null && (
                            <SiteEditor
                                key={activeSite.id}
                                site={activeSite}
                                refetch={sites.refetch}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SitesEditor;
