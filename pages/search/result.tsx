import React, { type FC, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Stack } from 'react-bootstrap';
import { LoadingOverlay } from 'components/loadingOverlay';
import { useQuery } from 'react-query';
import JsonPreviewModal from 'components/JsonPreviewModal';
import ResultsPerPageSelection from 'components/ResultsPerPageSelection';
import Head from 'next/head';
import ResultTable from 'components/result-search/ResultTable';
import Paginator from 'components/Paginator';
import DiagramCard from 'components/result-search/DiagramCard';
import ResultReportModal from 'components/ResultReportModal';
import ResultEditModal from 'components/ResultEditModal';
import { v4 as uuidv4 } from 'uuid';
import type Filter from 'components/result-search/Filter';
import FilterEdit from 'components/result-search/FilterEdit';

import { parseSuggestions } from 'components/result-search/jsonSchema';
import SiteSearchPopover from 'components/searchSelectors/SiteSearchPopover';
import BenchmarkSearchSelect from 'components/searchSelectors/BenchmarkSearchSelect';
import FlavorSearchSelect from 'components/searchSelectors/FlavorSearchSelect';
import { type Sorting, SortMode } from 'components/result-search/sorting';
import { useRouter } from 'next/router';
import { Funnel, Save2, X } from 'react-bootstrap-icons';
import { fetchSubkey, type Json } from 'components/result-search/jsonKeyHelpers';
import {
    type Benchmark,
    BenchmarksApi,
    Configuration,
    type Flavor,
    FlavorsApi,
    type Result,
    type Results,
    ResultsApi,
    type Site,
    SitesApi,
    type Tag,
} from '@eosc-perf/eosc-perf-client';
import useApi, { BASE_CONFIGURATION_PARAMS } from 'lib/useApi';
import { type GetServerSideProps } from 'next';
import TagSelector from 'components/TagSelector';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type ResultCallbacks from 'components/result-search/ResultCallbacks';

const saveFile = (contents: string, filename = 'export.csv') => {
    const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'),
        url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
};

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
        return [`${filter.key} ${filter.mode} ${filter.value}`];
    });

const deserializeFilters = (serialized: string | string[] | undefined): Map<string, Filter> => {
    if (serialized === undefined) {
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

const noFuture = (d: Date) => d < new Date();

/**
 * Read localtime date and return as if it would be if read as UTC time
 * @param d date
 */
const readLocalDateAsUtc = (d: Date): Date =>
    new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDay()));

/**
 * Return ISO date part only (no time)
 * @param d date
 */
const formatIsoDate = (d: Date) => d.toISOString().split('T')[0];

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
            setFilters(deserializeFilters(router.query['filters']));
        }
    }, [router.isReady]);

    const [sorting, setSorting] = useState<Sorting>({
        mode: SortMode.Disabled,
        key: '',
    });

    const addFilter = () => {
        const newMap = new Map(filters); // shallow copy
        const id = uuidv4();
        newMap.set(id, {
            id,
            key: '',
            mode: '>',
            value: '',
        });
        updateFilters(newMap);
    };

    const setFilter = (id: string, key: string, mode: string, value: string) => {
        const newMap = new Map(filters); // shallow copy
        newMap.set(id, {
            id,
            key,
            mode,
            value,
        });
        updateFilters(newMap);
    };

    const deleteFilter = (id: string) => {
        const newMap = new Map(filters); // shallow copy
        newMap.delete(id);
        updateFilters(newMap);
    };

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

    const setResultsPerPage = (results: number) => {
        setResultsPerPage_(results);
        setPage(1);
    };

    // helpers for subelements
    const resultOps: ResultCallbacks = {
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
                ? `+${sorting.key}`
                : sorting.mode === SortMode.Descending
                ? `-${sorting.key}`
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
                    ? `+${sorting.key}`
                    : sorting.mode === SortMode.Descending
                    ? `-${sorting.key}`
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

    const refreshLocation = (
        newBenchmark: Benchmark | undefined,
        newSite: Site | undefined,
        newFlavor: Flavor | undefined,
        columns: string[] | undefined,
        newFilters: Map<string, Filter>
    ) => {
        let query = {};
        if (newBenchmark?.id) {
            query = { ...query, benchmarkId: newBenchmark.id };
            if (columns) {
                query = { ...query, columns: JSON.stringify(columns) };
            }
        }
        if (newSite?.id) {
            query = { ...query, siteId: newSite.id };
        }
        if (newFlavor?.id) {
            query = { ...query, flavorId: newFlavor.id };
        }
        if (newFilters.size) {
            query = {
                ...query,
                filters: serializeFilters(newFilters),
            };
        }
        router.push({ pathname: '/search/result', query }, undefined, { shallow: true });
    };

    const updateBenchmark = (newBenchmark?: Benchmark) => {
        setBenchmark(newBenchmark);
        setSelectedResults([]);
        if (newBenchmark) {
            setCustomColumns(getStoredColumns(newBenchmark.id));
        } else {
            setCustomColumns([]);
        }

        refreshLocation(newBenchmark, site, flavor, customColumns, filters);
    };

    const updateCustomColumns = (columns: string[]) => {
        setCustomColumns(columns);
        refreshLocation(benchmark, site, flavor, columns, filters);
        if (benchmark) {
            storeBenchmarkColumns(benchmark.id, columns);
        }
    };

    const updateSite = (newSite?: Site) => {
        setSite(newSite);
        setFlavor(undefined);

        refreshLocation(benchmark, newSite, flavor, customColumns, filters);
    };

    const updateFlavor = (newFlavor?: Flavor) => {
        setFlavor(newFlavor);

        refreshLocation(benchmark, site, newFlavor, customColumns, filters);
    };

    const updateFilters = (newFilters: Map<string, Filter>) => {
        setFilters(newFilters);
        refreshLocation(benchmark, site, flavor, customColumns, newFilters);
    };

    const exportResults = () => {
        const lines = [];
        let header = 'id,site,flavor,benchmark';
        if (customColumns.length !== 0) {
            header = header.concat(',', customColumns.join(','));
        }
        lines.push(header);
        for (const result of selectedResults) {
            // let entry = `${result.id},${result.site.id},${result.flavor.id},${result.benchmark.id}`;
            // let entry = `${result.id}`;
            let entry = `${result.id},${result.site.name},${result.flavor.name},${result.benchmark.docker_image}:${result.benchmark.docker_tag}`;
            for (const column of customColumns) {
                // .map.join?
                entry = entry.concat(`,${fetchSubkey(result.json as Json, column)}`);
            }
            lines.push(entry);
        }

        saveFile(lines.join('\n'), 'export.csv');
    };

    return (
        <Container fluid="xl">
            <Head>
                <title>Search</title>
            </Head>
            <h1>Search</h1>
            <Card>
                <Card.Body>
                    {browserLoaded && router.isReady && (
                        <Row>
                            <Col xl>
                                <Row className="d-flex justify-content-center mb-4">
                                    <Col xl={4}>
                                        <BenchmarkSearchSelect
                                            benchmark={benchmark}
                                            setBenchmark={updateBenchmark}
                                        />
                                    </Col>
                                    <Col xl={4}>
                                        <SiteSearchPopover site={site} setSite={updateSite} />
                                    </Col>
                                    <Col xl={4}>
                                        <FlavorSearchSelect
                                            site={site}
                                            flavor={flavor}
                                            setFlavor={updateFlavor}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={6}>
                                        <Row className="mb-2">
                                            <Col
                                                xs="auto"
                                                style={{
                                                    minWidth: '10em',
                                                }}
                                            >
                                                Executed after:
                                            </Col>
                                            <Col xs={8}>
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
                                        </Row>
                                        <Row className="mb-2">
                                            <Col
                                                xs="auto"
                                                style={{
                                                    minWidth: '10em',
                                                }}
                                            >
                                                and before:
                                            </Col>
                                            <Col xs={8}>
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
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xl="auto" className="d-none d-xl-flex justify-content-end">
                                <div className="vr h-100" />
                            </Col>
                            <Col xl="auto">
                                <TagSelector selected={tags} setSelected={setTags} label="Tags" />
                            </Col>
                        </Row>
                    )}
                    <hr />
                    <DiagramCard
                        results={selectedResults}
                        benchmark={benchmark}
                        suggestions={suggestedFields}
                    />
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
                                        disabled={selectedResults.length === 0}
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
                                    <Button variant="warning" onClick={() => results.refetch()}>
                                        <Funnel /> Apply Filters
                                    </Button>
                                </Stack>
                            </Col>
                        </Row>
                        <Stack gap={2}>
                            <div className="position-relative" style={{ overflowX: 'auto' }}>
                                {(results.isLoading ||
                                    results.isFetching ||
                                    results.isRefetching) && <LoadingOverlay />}
                                {results.isSuccess && results.data.total > 0 && (
                                    <ResultTable
                                        results={results.data.items}
                                        pageOffset={results.data.per_page * results.data.page}
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
                                    <div className="text-muted m-2">No results found! :(</div>
                                )}
                                {results.isError && 'Error while loading results'}
                            </div>
                            {results.isSuccess && (
                                <Row className="mx-2">
                                    <Col xs sm={7} md={5} xl={4} xxl={3}>
                                        <ResultsPerPageSelection
                                            onChange={setResultsPerPage}
                                            currentSelection={resultsPerPage}
                                        />
                                    </Col>
                                    <Col />
                                    <Col sm md="auto">
                                        <Paginator pagination={results.data} navigateTo={setPage} />
                                    </Col>
                                </Row>
                            )}
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card>
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
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const configuration = new Configuration(BASE_CONFIGURATION_PARAMS);
    const props: Partial<PageProps> = {};
    if (context.query['benchmarkId'] && !Array.isArray(context.query['benchmarkId'])) {
        await new BenchmarksApi(configuration)
            .getBenchmark(context.query['benchmarkId'])
            .then((response) => {
                props.benchmark = response.data;
            })
            .catch((error) => {
                console.error(error);
            });

        if (context.query['columns'] && !Array.isArray(context.query['columns'])) {
            props.columns = JSON.parse(context.query['columns']);
        }
    }
    if (context.query['siteId'] && !Array.isArray(context.query['siteId'])) {
        await new SitesApi(configuration)
            .getSite(context.query['siteId'])
            .then((response) => {
                props.site = response.data;
            })
            .catch((error) => {
                console.error(error);
            });

        if (context.query['flavorId'] && !Array.isArray(context.query['flavorId'])) {
            await new FlavorsApi(configuration)
                .getFlavor(context.query['flavorId'])
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
            Array.isArray(context.query['benchmarkId']) ? undefined : context.query['benchmarkId'],
            Array.isArray(context.query['siteId']) ? undefined : context.query['siteId'],
            Array.isArray(context.query['siteId']) || Array.isArray(context.query['flavorId'])
                ? undefined
                : context.query['siteId'] && context.query['flavorId'],
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
