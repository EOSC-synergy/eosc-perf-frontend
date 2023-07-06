import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Stack } from 'react-bootstrap';
import { LoadingOverlay } from 'components/loadingOverlay';
import { useQuery } from 'react-query';
import { JsonPreviewModal } from 'components/jsonPreviewModal';
import { ResultsPerPageSelection } from 'components/resultsPerPageSelection';
import Head from 'next/head';
import { ResultTable } from 'components/resultSearch/resultTable';
import { Paginator } from 'components/pagination';
import { DiagramCard } from 'components/resultSearch/diagramCard';
import { ResultReportModal } from 'components/resultReportModal';
import { ResultEditModal } from 'components/resultEditModal';
import { v4 as uuidv4 } from 'uuid';
import { Filter } from 'components/resultSearch/filter';
import { FilterEdit } from 'components/resultSearch/filterEdit';

import { parseSuggestions } from 'components/resultSearch/jsonSchema';
import { SiteSearchPopover } from 'components/searchSelectors/siteSearchPopover';
import { BenchmarkSearchSelect } from 'components/searchSelectors/benchmarkSearchSelect';
import { FlavorSearchSelect } from 'components/searchSelectors/flavorSearchSelect';
import { Sorting, SortMode } from 'components/resultSearch/sorting';
import { useRouter } from 'next/router';
import { Funnel, Save2, X } from 'react-bootstrap-icons';
import { fetchSubkey, Json } from '../../components/resultSearch/jsonKeyHelpers';
import {
    Benchmark,
    BenchmarksApi,
    Configuration,
    Flavor,
    FlavorsApi,
    Result,
    Results,
    ResultsApi,
    Site,
    SitesApi,
    Tag,
} from '@eosc-perf/eosc-perf-client';
import useApi, { BASE_CONFIGURATION_PARAMS } from '../../utils/useApi';
import { GetServerSideProps } from 'next';
import TagSelector from '../../components/tagSelector';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function saveFile(contents: string, filename: string = 'export.csv') {
    const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
    let a = document.createElement('a'),
        url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

const getStoredColumns = (benchmarkId: string) => {
    const benchmarkColumnsJson = localStorage.getItem('benchmarkColumns');
    if (benchmarkColumnsJson != null) {
        const benchmarkColumns = JSON.parse(benchmarkColumnsJson);
        if (benchmarkId in benchmarkColumns) {
            return benchmarkColumns[benchmarkId];
        }
    }

    return [];
};

const storeBenchmarkColumns = (benchmarkId: string, columns: string[]) => {
    const benchmarkColumnsJson = localStorage.getItem('benchmarkColumns');
    let benchmarkColumns: Record<string, string[]> = {};
    if (benchmarkColumnsJson != null) {
        benchmarkColumns = JSON.parse(benchmarkColumnsJson);
    }
    benchmarkColumns[benchmarkId] = columns;
    localStorage.setItem('benchmarkColumns', JSON.stringify(benchmarkColumns));
};

const serializeFilters = (filters: Map<string, Filter>): string[] =>
    [...filters.keys()].flatMap((k) => {
        const filter = filters.get(k);
        if (filter === undefined || filter.key.length === 0 || filter.value.length === 0) {
            return [];
        }
        return [filter.key + ' ' + filter.mode + ' ' + filter.value];
    });

const deserializeFilters = (serialized: string | string[] | undefined): Map<string, Filter> => {
    if (serialized == undefined) {
        return new Map<string, Filter>();
    }

    if (!Array.isArray(serialized)) {
        serialized = [serialized];
    }

    const filters = new Map<string, Filter>();
    serialized.forEach((filter) => {
        const parts = filter.split(' ');
        const id = uuidv4();
        filters.set(id, {
            id,
            key: parts[0],
            mode: parts[1],
            value: parts[2],
        });
    });

    return filters;
};

function noFuture(d: Date) {
    return d < new Date();
}

/**
 * Read localtime date and return as if it would be if read as UTC time
 * @param d date
 */
function readLocalDateAsUtc(d: Date): Date {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDay()));
}

/**
 * Return ISO date part only (no time)
 * @param d date
 */
function formatIsoDate(d: Date): string {
    return d.toISOString().split('T')[0];
}

const DEFAULT_RESULTS_PER_PAGE = 20;

type PageProps = {
    benchmark?: Benchmark;
    site?: Site;
    flavor?: Flavor;
    columns?: string[];
    results: Results;
};

/**
 * Search page for ran benchmarks
 * @returns {React.ReactElement}
 * @constructor
 */
const ResultSearch: FC<PageProps> = (props: PageProps) => {
    const router = useRouter();
    const api = useApi();

    const [benchmark, setBenchmark] = useState<Benchmark | undefined>(props.benchmark);
    const [site, setSite] = useState<Site | undefined>(props.site);
    const [flavor, setFlavor] = useState<Flavor | undefined>(props.flavor);

    const [tags, setTags] = useState<Tag[]>([]);

    const [filters, setFilters] = useState<Map<string, Filter>>(new Map());

    const [browserLoaded, setBrowserLoaded] = useState<boolean>(false);

    useEffect(() => {
        setBrowserLoaded(true);
    }, []);

    useEffect(() => {
        if (router.isReady) {
            setFilters(deserializeFilters(router.query.filters));
        }
    }, [router.isReady]);

    const [sorting, setSorting] = useState<Sorting>({
        mode: SortMode.Disabled,
        key: '',
    });

    function addFilter() {
        const newMap = new Map(filters); // shallow copy
        const id = uuidv4();
        newMap.set(id, {
            id,
            key: '',
            mode: '>',
            value: '',
        });
        updateFilters(newMap);
    }

    function setFilter(id: string, key: string, mode: string, value: string) {
        const newMap = new Map(filters); // shallow copy
        newMap.set(id, {
            id,
            key,
            mode,
            value,
        });
        updateFilters(newMap);
    }

    function deleteFilter(id: string) {
        const newMap = new Map(filters); // shallow copy
        newMap.delete(id);
        updateFilters(newMap);
    }

    const suggestedFields = benchmark ? parseSuggestions(benchmark) : undefined;

    const [resultsPerPage, setResultsPerPage_] = useState(DEFAULT_RESULTS_PER_PAGE);
    const [page, setPage] = useState(1);
    // json preview modal
    const [showJSONPreview, setShowJSONPreview] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedResults, setSelectedResults] = useState<Result[]>([]);

    const [previewResult, setPreviewResult] = useState<Result>();
    const [reportedResult, setReportedResult] = useState<Result>();
    const [editedResult, setEditedResult] = useState<Result>();

    const [beforeDate, setBeforeDate] = useState<Date | undefined>(undefined);
    const [afterDate, setAfterDate] = useState<Date | undefined>(undefined);

    //
    const [customColumns, setCustomColumns] = useState<string[]>(props.columns ?? []);

    function setResultsPerPage(results: number) {
        setResultsPerPage_(results);
        setPage(1);
    }

    // helpers for subelements
    const resultOps = {
        select: function (result: Result) {
            if (!this.isSelected(result)) {
                // cannot call setSelectedResults directly, need to put in variable first
                const arr = [...selectedResults, result];
                setSelectedResults(arr);
            }
        },
        selectMultiple: function (results: Result[]) {
            const newResults = results.filter((r) => !resultOps.isSelected(r));
            if (newResults.length === 0) {
                return;
            }
            const combined = [...selectedResults, ...newResults];
            setSelectedResults(combined);
        },
        unselect: function (result: Result) {
            setSelectedResults(selectedResults.filter((r) => r.id !== result.id));
        },
        unselectMultiple: function (results: Result[]) {
            setSelectedResults(
                selectedResults.filter(
                    (selected) => !results.some((unselected) => unselected.id === selected.id)
                )
            );
        },
        isSelected: function (result: Result) {
            return selectedResults.some((r) => r.id === result.id);
        },
        reload: function () {
            results.refetch();
        },
        display: function (result: Result) {
            setPreviewResult(result);
            setShowJSONPreview(true);
        },
        report: function (result: Result) {
            setReportedResult(result);
            setShowReportModal(true);
        },
        edit: function (result: Result) {
            setEditedResult(result);
            setShowEditModal(true);
        },
    };

    // hash used for queryKey to not have to add a dozen strings
    const results = useQuery(
        [
            'results',
            resultsPerPage,
            page,
            benchmark?.id,
            site?.id,
            site !== undefined ? flavor?.id : undefined,
            sorting.mode === SortMode.Ascending
                ? '+' + sorting.key
                : sorting.mode === SortMode.Descending
                ? '-' + sorting.key
                : undefined,
            tags,
            serializeFilters(filters),
            beforeDate,
            afterDate,
        ],
        () =>
            api.results.listResults(
                undefined,
                undefined,
                resultsPerPage,
                page,
                beforeDate ? formatIsoDate(readLocalDateAsUtc(beforeDate)) : undefined,
                afterDate ? formatIsoDate(readLocalDateAsUtc(afterDate)) : undefined,
                benchmark?.id,
                site?.id,
                site !== undefined ? flavor?.id : undefined,
                tags.map((t) => t.id),
                serializeFilters(filters),
                sorting.mode === SortMode.Ascending
                    ? '+' + sorting.key
                    : sorting.mode === SortMode.Descending
                    ? '-' + sorting.key
                    : undefined
            ),
        {
            select: (response) => response.data,
            initialData: props.results
                ? {
                      status: 200,
                      statusText: 'OK',
                      data: props.results,
                      headers: {},
                      config: {},
                  }
                : undefined,
        }
    );

    function refreshLocation(
        benchmark: Benchmark | undefined,
        site: Site | undefined,
        flavor: Flavor | undefined,
        columns: string[] | undefined,
        filters: Map<string, Filter>
    ) {
        let query = {};
        if (benchmark && benchmark.id) {
            query = { ...query, benchmarkId: benchmark.id };
            if (columns) {
                query = { ...query, columns: JSON.stringify(columns) };
            }
        }
        if (site && site.id) {
            query = { ...query, siteId: site.id };
        }
        if (flavor && flavor.id) {
            query = { ...query, flavorId: flavor.id };
        }
        if (filters.size) {
            query = {
                ...query,
                filters: serializeFilters(filters),
            };
        }
        router.push({ pathname: '/search/result', query }, undefined, { shallow: true });
    }

    function updateBenchmark(benchmark?: Benchmark) {
        setBenchmark(benchmark);
        setSelectedResults([]);
        if (benchmark) {
            setCustomColumns(getStoredColumns(benchmark.id));
        } else {
            setCustomColumns([]);
        }

        refreshLocation(benchmark, site, flavor, customColumns, filters);
    }

    function updateCustomColumns(columns: string[]) {
        setCustomColumns(columns);
        refreshLocation(benchmark, site, flavor, columns, filters);
        if (benchmark) {
            storeBenchmarkColumns(benchmark.id, columns);
        }
    }

    function updateSite(site?: Site) {
        setSite(site);
        setFlavor(undefined);

        refreshLocation(benchmark, site, flavor, customColumns, filters);
    }

    function updateFlavor(flavor?: Flavor) {
        setFlavor(flavor);

        refreshLocation(benchmark, site, flavor, customColumns, filters);
    }

    function updateFilters(filters: Map<string, Filter>) {
        setFilters(filters);
        refreshLocation(benchmark, site, flavor, customColumns, filters);
    }

    function exportResults() {
        let lines = [];
        let header = 'id,site,flavor,benchmark';
        if (customColumns.length !== 0) {
            header = header.concat(',', customColumns.join(','));
        }
        lines.push(header);
        for (const result of selectedResults) {
            // let entry = `${result.id},${result.site.id},${result.flavor.id},${result.benchmark.id}`;
            // let entry = `${result.id}`;
            let entry = `${result.id},${result.site.name},${result.flavor.name},${
                result.benchmark.docker_image + ':' + result.benchmark.docker_tag
            }`;
            for (const column of customColumns) {
                // .map.join?
                entry = entry.concat(',' + fetchSubkey(result.json as Json, column));
            }
            lines.push(entry);
        }

        saveFile(lines.join('\n'), 'export.csv');
    }

    return (
        <>
            <Head>
                <title>Search</title>
            </Head>
            <Container fluid="xl">
                <Stack gap={2}>
                    <DiagramCard
                        results={selectedResults}
                        benchmark={benchmark}
                        suggestions={suggestedFields}
                    />
                    <Card>
                        <Card.Body>
                            {browserLoaded && router.isReady && (
                                <Row>
                                    <Col xl={true}>
                                        <Stack
                                            gap={2}
                                            className="mb-xl-0 mb-2 d-flex justify-content-center h-100"
                                        >
                                            <BenchmarkSearchSelect
                                                benchmark={benchmark}
                                                setBenchmark={updateBenchmark}
                                            />
                                            <SiteSearchPopover site={site} setSite={updateSite} />
                                            <FlavorSearchSelect
                                                site={site}
                                                flavor={flavor}
                                                setFlavor={updateFlavor}
                                            />
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <Col xs="auto">Executed after:</Col>
                                                        <Col xs="auto">
                                                            <DatePicker
                                                                selected={afterDate}
                                                                onChange={(date: Date | null) =>
                                                                    setAfterDate(date ?? undefined)
                                                                }
                                                                dateFormat="MMMM d, yyyy"
                                                                filterDate={noFuture}
                                                                isClearable
                                                            />
                                                        </Col>
                                                        <Col />
                                                    </Row>
                                                </Col>
                                                <Col>
                                                    <Row>
                                                        <Col xs="auto">and before:</Col>
                                                        <Col xs="auto">
                                                            <DatePicker
                                                                selected={beforeDate}
                                                                onChange={(date: Date | null) =>
                                                                    setBeforeDate(date ?? undefined)
                                                                }
                                                                dateFormat="MMMM d, yyyy"
                                                                filterDate={noFuture}
                                                                isClearable
                                                            />
                                                        </Col>
                                                        <Col />
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Stack>
                                    </Col>
                                    <Col xl="auto" className="d-none d-xl-flex justify-content-end">
                                        <div className="vr h-100" />
                                    </Col>
                                    <Col xl="auto">
                                        <TagSelector
                                            selected={tags}
                                            setSelected={setTags}
                                            label="Tags"
                                        />
                                    </Col>
                                </Row>
                            )}
                            <hr />
                            <Stack gap={2}>
                                <Stack gap={1}>
                                    {[...filters.keys()].flatMap((key, index) => {
                                        const filter = filters.get(key);
                                        if (filter === undefined) {
                                            return [];
                                        }

                                        return [
                                            <FilterEdit
                                                key={index}
                                                filter={filter}
                                                setFilter={setFilter}
                                                deleteFilter={deleteFilter}
                                                suggestions={suggestedFields}
                                            />,
                                        ];
                                    })}
                                </Stack>
                                <Row>
                                    <Col xs="auto" className="my-auto">
                                        <h4 className="ms-2 my-0">
                                            {filters.size > 0 ||
                                            benchmark !== undefined ||
                                            site !== undefined ||
                                            flavor !== undefined
                                                ? 'Results'
                                                : 'Recently uploaded results'}
                                        </h4>
                                    </Col>
                                    <Col />
                                    <Col md="auto">
                                        <Stack direction="horizontal" gap={2}>
                                            <Button
                                                variant="secondary"
                                                onClick={() => setSelectedResults([])}
                                                disabled={selectedResults.length == 0}
                                            >
                                                <X /> Clear selection
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                disabled={selectedResults.length === 0}
                                                onClick={exportResults}
                                            >
                                                <Save2 /> Export
                                            </Button>
                                            <Button variant="success" onClick={addFilter}>
                                                + Add filter
                                            </Button>
                                            <Button
                                                variant="warning"
                                                onClick={() => results.refetch()}
                                            >
                                                <Funnel /> Apply Filters
                                            </Button>
                                        </Stack>
                                    </Col>
                                </Row>
                                <Stack gap={2}>
                                    <div
                                        className="position-relative"
                                        style={{ overflowX: 'auto' }}
                                    >
                                        {(results.isLoading ||
                                            results.isFetching ||
                                            results.isRefetching) && <LoadingOverlay />}
                                        {results.isSuccess && results && results.data.total > 0 && (
                                            <ResultTable
                                                results={results.data.items}
                                                pageOffset={
                                                    results.data.per_page * results.data.page
                                                }
                                                ops={resultOps}
                                                suggestions={suggestedFields}
                                                sorting={sorting}
                                                setSorting={(sort) => {
                                                    setSorting(sort);
                                                }}
                                                customColumns={customColumns}
                                                setCustomColumns={updateCustomColumns}
                                            />
                                        )}
                                        {results.isSuccess && results.data.total === 0 && (
                                            <div className="text-muted m-2">
                                                No results found! :(
                                            </div>
                                        )}
                                        {results.isError && 'Error while loading results'}
                                    </div>
                                    {results.isSuccess && (
                                        <Row className="mx-2">
                                            <Col xs={true} sm={7} md={5} xl={4} xxl={3}>
                                                <ResultsPerPageSelection
                                                    onChange={setResultsPerPage}
                                                    currentSelection={resultsPerPage}
                                                />
                                            </Col>
                                            <Col />
                                            <Col sm={true} md="auto">
                                                <Paginator
                                                    pagination={results.data}
                                                    navigateTo={setPage}
                                                />
                                            </Col>
                                        </Row>
                                    )}
                                </Stack>
                            </Stack>
                        </Card.Body>
                    </Card>
                </Stack>
            </Container>
            {previewResult && (
                <JsonPreviewModal
                    show={showJSONPreview}
                    closeModal={() => {
                        setShowJSONPreview(false);
                    }}
                    result={previewResult}
                />
            )}
            {reportedResult && (
                <ResultReportModal
                    show={showReportModal}
                    closeModal={() => {
                        setShowReportModal(false);
                    }}
                    result={reportedResult}
                />
            )}
            {editedResult && (
                <ResultEditModal
                    show={showEditModal}
                    closeModal={() => {
                        results.refetch();
                        setShowEditModal(false);
                    }}
                    result={editedResult}
                />
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const configuration = new Configuration(BASE_CONFIGURATION_PARAMS);
    let props: Partial<PageProps> = {};
    if (context.query.benchmarkId && !Array.isArray(context.query.benchmarkId)) {
        await new BenchmarksApi(configuration)
            .getBenchmark(context.query.benchmarkId)
            .then((response) => {
                props.benchmark = response.data;
            })
            .catch((error) => {
                console.error(error);
            });

        if (context.query.columns && !Array.isArray(context.query.columns)) {
            props.columns = JSON.parse(context.query.columns);
        }
    }
    if (context.query.siteId && !Array.isArray(context.query.siteId)) {
        await new SitesApi(configuration)
            .getSite(context.query.siteId)
            .then((response) => {
                props.site = response.data;
            })
            .catch((error) => {
                console.error(error);
            });

        if (context.query.flavorId && !Array.isArray(context.query.flavorId)) {
            await new FlavorsApi(configuration)
                .getFlavor(context.query.flavorId)
                .then((response) => {
                    props.flavor = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    await new ResultsApi(configuration)
        .listResults(
            undefined,
            undefined,
            DEFAULT_RESULTS_PER_PAGE,
            1,
            undefined,
            undefined,
            Array.isArray(context.query.benchmarkId) ? undefined : context.query.benchmarkId,
            Array.isArray(context.query.siteId) ? undefined : context.query.siteId,
            Array.isArray(context.query.siteId) || Array.isArray(context.query.flavorId)
                ? undefined
                : context.query.siteId && context.query.flavorId,
            undefined,
            [],
            undefined
        )
        .then((response) => {
            props.results = response.data;
        })
        .catch((error) => console.error(error));

    return {
        props,
    };
};

export default ResultSearch;
