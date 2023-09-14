import { type ReactElement, type ReactNode, useState } from 'react';
import { useQuery } from 'react-query';
import SearchForm from './SearchForm';
import Table from './Table';
import { LoadingOverlay } from 'components/loadingOverlay';
import Paginator, { type Paginated } from 'components/Paginator';
import { Button, Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import type Identifiable from 'components/Identifiable';
import { type AxiosResponse } from 'axios';

type SearchingSelectorProps<Item> = {
    queryKeyPrefix: string;
    tableName: string;
    queryCallback: (terms: string[]) => Promise<AxiosResponse<Paginated<Item>>> | undefined;
    setItem: (item?: Item) => void;
    displayRow: (item: Item) => ReactNode;
    submitNew?: () => void;
    disabled?: boolean;
    toggle: ReactElement;
};

export function SearchingSelector<Item extends Identifiable>({
    queryKeyPrefix,
    tableName,
    queryCallback,
    setItem,
    displayRow,
    submitNew,
    disabled,
    toggle,
}: SearchingSelectorProps<Item>): ReactElement {
    //const [resultsPerPage, setResultsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const [searchString, setSearchString] = useState<string>('');

    const [show, setShow] = useState<boolean>(false);

    const items = useQuery(
        [queryKeyPrefix, page, searchString],
        () => {
            const response = queryCallback(searchString.split(' '));
            if (response !== undefined) {
                return response;
            }
            throw new Error('no data');
        },
        {
            enabled: !disabled,
        },
    );

    const updateItem = (item?: Item) => {
        setItem(item);
        setShow(false);
    };

    const popover = (
        <Popover id="benchmarkSelect" style={{ maxWidth: '576px', width: 'auto' }}>
            <Popover.Header as="h3">{tableName} Search</Popover.Header>
            <Popover.Body>
                <SearchForm setSearchString={setSearchString} />
                <div style={{ position: 'relative' }}>
                    {items.isError && <div>Failed to fetch benchmarks!</div>}
                    {(items.isSuccess || items.isLoading) && (
                        <>
                            {items.isLoading ? (
                                <Table<Item>
                                    setItem={() => undefined}
                                    items={[]}
                                    tableName={tableName}
                                    displayItem={() => null}
                                />
                            ) : (
                                <Table<Item>
                                    items={items.data.data.items}
                                    setItem={updateItem}
                                    tableName={tableName}
                                    displayItem={displayRow}
                                />
                            )}
                            <LoadingOverlay loading={items.isLoading} />
                        </>
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
                            onClick={() => updateItem(undefined)}
                        >
                            Deselect
                        </Button>
                        {/* TODO: hide popover if submit button is pressed */}
                        {submitNew && (
                            <Button className="m-1" onClick={submitNew}>
                                + New
                            </Button>
                        )}
                    </Col>
                </Row>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={popover}
            rootClose
            show={show}
            onToggle={setShow}
        >
            {toggle}
        </OverlayTrigger>
    );
}
