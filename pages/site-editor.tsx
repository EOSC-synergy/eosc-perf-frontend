import { useEffect, useState } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import SiteEditor from 'components/site-editor/SiteEditor';
import Paginator from 'components/Paginator';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SiteSelect from 'components/site-editor/SiteSelect';
import useApi from 'lib/useApi';
import { type Site } from '@eosc-perf/eosc-perf-client';
import { type NextPage } from 'next';
import useUser from 'lib/useUser';

/**
 * Admin-only page to edit sites in the database and add flavors.
 */
const SitesEditor: NextPage = () => {
    const router = useRouter();

    const auth = useUser();
    const api = useApi(auth.token);

    const [page, setPage] = useState(1);

    // if user is not admin, redirect them away
    useEffect(() => {
        if (!auth.loading && !auth.admin) {
            router.push('/');
        }
    }, [router, auth.admin, auth.loading]);

    const sites = useQuery('sites', () =>
        api.sites.listSites(undefined, undefined, undefined, undefined, page)
    );

    const [activeSite, setActiveSite] = useState<Site | null>(null);

    function SiteList() {
        return (
            <>
                <ListGroup>
                    {sites.isLoading && <LoadingOverlay />}
                    {sites.isSuccess && sites.data.data.items.length === 0 && 'No sites found!'}
                    {sites.isSuccess &&
                        sites.data.data.items.map((site: Site) => (
                            <SiteSelect site={site} setActiveSite={setActiveSite} key={site.id} />
                        ))}
                </ListGroup>
                {sites.isSuccess && sites.data.data.pages > 0 && (
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
};

export default SitesEditor;
