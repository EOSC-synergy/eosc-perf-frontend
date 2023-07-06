import React, { ReactElement, ReactNode, useState } from 'react';
import { useQuery } from 'react-query';
import { SearchForm } from 'components/searchSelectors/searchForm';
import { Table } from 'components/searchSelectors/table';
import { LoadingOverlay } from 'components/loadingOverlay';
import { Paginated, Paginator } from 'components/pagination';
import { Button, Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { Identifiable } from 'components/identifiable';
import useApi from '../../utils/useApi';
import { AxiosResponse } from 'axios';

export function SearchingSelector<Item extends Identifiable>(props: {
    queryKeyPrefix: string;
    tableName: string;
    queryCallback: (terms: string[]) => Promise<AxiosResponse<Paginated<Item>>> | undefined;
    item?: Item;
    setItem: (item?: Item) => void;
    display: (item?: Item) => ReactNode;
    displayRow: (item: Item) => ReactNode;
    submitNew?: () => void;
    disabled?: boolean;
}): ReactElement {
    const api = useApi();
    //const [resultsPerPage, setResultsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const [searchString, setSearchString] = useState<string>('');

    const [show, setShow] = useState<boolean>(false);

    const items = useQuery(
        [props.queryKeyPrefix, page, searchString],
        () => {
            const response = props.queryCallback(searchString.split(' '));
            if (response !== undefined) {
                return response;
            }
            throw 'no data';
        },
        {
            enabled: !props.disabled,
        }
    );

    function onToggle(show: boolean) {
        setShow(show);
    }

    function setItem(item?: Item) {
        props.setItem(item);
        setShow(false);
    }

    const popover = (
        <Popover id="benchmarkSelect" style={{ maxWidth: '576px', width: 'auto' }}>
            <Popover.Header as="h3">{props.tableName} Search</Popover.Header>
            <Popover.Body>
                <SearchForm setSearchString={setSearchString} />
                <div style={{ position: 'relative' }}>
                    {items.isLoading && (
                        <>
                            <Table<Item>
                                setItem={() => undefined}
                                items={[]}
                                tableName={props.tableName}
                                displayItem={() => {
                                    return <></>;
                                }}
                            />
                            <LoadingOverlay />
                        </>
                    )}
                    {items.isError && <div>Failed to fetch benchmarks!</div>}
                    {items.isSuccess && (
                        <Table<Item>
                            items={items.data.data.items}
                            setItem={setItem}
                            tableName={props.tableName}
                            displayItem={props.displayRow}
                        />
                    )}
                </div>
                <Row>
                    {items.isSuccess && (
                        <Col>
                            <Paginator pagination={items.data.data} navigateTo={setPage} />
                        </Col>
                    )}
                    <Col md="auto">
                        <Button
                            className="m-1"
                            variant="secondary"
                            onClick={() => setItem(undefined)}
                        >
                            Deselect
                        </Button>
                        {/* TODO: hide popover if submit button is pressed */}
                        {props.submitNew && (
                            <Button className="m-1" onClick={props.submitNew}>
                                + New
                            </Button>
                        )}
                    </Col>
                </Row>
            </Popover.Body>
        </Popover>
    );

    return (
        <Row className="align-items-center">
            <Col>{props.display(props.item)} </Col>
            <Col md="auto">
                <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={popover}
                    rootClose
                    show={show}
                    onToggle={onToggle}
                >
                    <Button variant="success" size="sm" disabled={props.disabled}>
                        Select
                    </Button>
                </OverlayTrigger>
            </Col>
        </Row>
    );
}
