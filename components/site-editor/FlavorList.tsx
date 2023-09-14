import { useQuery } from 'react-query';
import { Card, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { LoadingOverlay } from 'components/loadingOverlay';
import FlavorEditor from './FlavorEditor';
import { type FC, useState } from 'react';
import NewFlavor from './NewFlavor';
import Paginator from 'components/Paginator';
import useApi from 'lib/useApi';
import { type Flavor, type Site } from '@eosc-perf/eosc-perf-client';

type FlavorListProps = { site: Site };

const FlavorList: FC<FlavorListProps> = ({ site }) => {
    const api = useApi();
    const [page, setPage] = useState(1);

    const flavors = useQuery(
        ['flavors', site.id],
        () => api.sites.listFlavors(site.id, undefined, undefined, undefined, undefined, page),
        {
            refetchOnMount: 'always',
        },
    );

    return (
        <Form.Group className="mb-3">
            <Form.Label>Flavors:</Form.Label>
            <Card style={{ maxHeight: '16rem' }} className="overflow-auto">
                <LoadingOverlay loading={flavors.isLoading} />
                {flavors.isSuccess &&
                    flavors.data.data.items.map((flavor: Flavor) => (
                        <FlavorEditor flavor={flavor} key={flavor.id} refetch={flavors.refetch} />
                    ))}

                <ListGroup.Item key="new-flavor">
                    <Row>
                        <Col>
                            <NewFlavor site={site} />{' '}
                        </Col>
                        {flavors.isSuccess && flavors.data.data.pages > 0 && (
                            <Col md="auto">
                                <Paginator
                                    pagination={flavors.data.data}
                                    navigateTo={(p) => setPage(p)}
                                />
                            </Col>
                        )}
                    </Row>
                </ListGroup.Item>
            </Card>
        </Form.Group>
    );
};

export default FlavorList;
