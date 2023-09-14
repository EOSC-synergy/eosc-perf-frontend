import { type FC, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import {
    ActionColumn,
    BenchmarkColumn,
    CheckboxColumn,
    CustomColumn,
    SiteColumn,
    SiteFlavorColumn,
    TagsColumn,
} from 'components/result-search/columns';
import type ResultCallbacks from 'components/result-search/ResultCallbacks';
import { ChevronDown, ChevronUp, Pencil } from 'react-bootstrap-icons';
import ColumnSelectModal from 'components/result-search/ColumnSelectModal';
import { type Sorting, SortMode } from 'components/result-search/sorting';
import { type Suggestion } from './jsonSchema';
import { type Result } from '@eosc-perf/eosc-perf-client';
import ExecutionDateColumn from './columns/ExecutionDateColumn';

type SortingTableHeaderProps = {
    label: string;
    sortKey: string;
    sorting: Sorting;
    setSorting: (sort: Sorting) => void;
};

const SortingTableHeader: FC<SortingTableHeaderProps> = ({
    label,
    sortKey,
    sorting,
    setSorting,
}) => {
    const updateSortOrder = () => {
        if (sorting.key === sortKey) {
            // sort in reverse
            if (sorting.mode === SortMode.Ascending) {
                setSorting({ ...sorting, mode: SortMode.Descending });
            }
            // unsort
            else {
                setSorting({ mode: SortMode.Disabled, key: '' });
            }
        }
        // sorting by something else
        else {
            setSorting({ mode: SortMode.Ascending, key: sortKey });
        }
    };

    return (
        <th onClick={() => updateSortOrder()}>
            {label}{' '}
            {sorting.key === sortKey && (
                <>
                    {sorting.mode === SortMode.Ascending && <ChevronDown />}
                    {sorting.mode === SortMode.Descending && <ChevronUp />}
                </>
            )}
        </th>
    );
};

type ResultTableProps = {
    results: Result[];
    pageOffset: number;
    ops: ResultCallbacks;
    suggestions?: Suggestion[];
    sorting: Sorting;
    setSorting: (sort: Sorting) => void;
    customColumns: string[];
    setCustomColumns: (customColumns: string[]) => void;
};
const ResultTable: FC<ResultTableProps> = ({
    results,
    pageOffset,
    ops,
    suggestions,
    sorting,
    setSorting,
    customColumns,
    setCustomColumns,
}) => {
    // TODO: toggleable main columns
    const [benchmarkColumnEnabled, setBenchmarkColumnEnabled] = useState(true);
    const [siteColumnEnabled, setSiteColumnEnabled] = useState(true);
    const [siteFlavorColumnEnabled, setSiteFlavorColumnEnabled] = useState(true);
    const [tagsColumnEnabled, setTagsColumnEnabled] = useState(true);
    const [executionDateColumnEnabled, setExecutionDateColumnEnabled] = useState(true);

    // column selection modal
    const [showColumnSelection, setShowColumnSelection] = useState(false);

    return (
        <>
            <Table className="mb-0">
                <thead>
                    <tr>
                        <th>
                            <Form>
                                <Form.Check
                                    type="switch"
                                    onChange={() => {
                                        results.every((r) => ops.isSelected(r))
                                            ? ops.unselectMultiple(results)
                                            : ops.selectMultiple(
                                                  results.map((r, i) => ({
                                                      ...r,
                                                      orderIndex: i + pageOffset,
                                                  }))
                                              );
                                    }}
                                    checked={results.every((r) => ops.isSelected(r))}
                                />
                            </Form>
                        </th>
                        {benchmarkColumnEnabled && (
                            <SortingTableHeader
                                label="Benchmark"
                                sortKey="benchmark_name"
                                sorting={sorting}
                                setSorting={setSorting}
                            />
                        )}
                        {siteColumnEnabled && (
                            <SortingTableHeader
                                label="Site"
                                sortKey="site_name"
                                sorting={sorting}
                                setSorting={setSorting}
                            />
                        )}
                        {siteFlavorColumnEnabled && (
                            <SortingTableHeader
                                label="Site flavor"
                                sortKey="flavor_name"
                                sorting={sorting}
                                setSorting={setSorting}
                            />
                        )}
                        {tagsColumnEnabled && <th>Tags</th>}
                        {executionDateColumnEnabled && <th>Execution date</th>}
                        {/* TODO: hover */}
                        {customColumns.map((column) => (
                            <SortingTableHeader
                                label={column}
                                sortKey={`json.${column}`}
                                sorting={sorting}
                                setSorting={setSorting}
                                key={column}
                            />
                        ))}
                        <th>
                            {/* TODO: move this to hot-bar above table? */}
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setShowColumnSelection(true)}
                            >
                                <Pencil /> Columns
                            </Button>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {results.map((result) => (
                        <tr key={result.id}>
                            <td>
                                <CheckboxColumn result={result} callbacks={ops} />
                            </td>
                            {benchmarkColumnEnabled && (
                                <td>
                                    <BenchmarkColumn result={result} />
                                </td>
                            )}
                            {siteColumnEnabled && (
                                <td>
                                    <SiteColumn result={result} />
                                </td>
                            )}
                            {siteFlavorColumnEnabled && (
                                <td>
                                    <SiteFlavorColumn result={result} />
                                </td>
                            )}
                            {tagsColumnEnabled && (
                                <td>
                                    <TagsColumn result={result} />
                                </td>
                            )}
                            {executionDateColumnEnabled && (
                                <td>
                                    <ExecutionDateColumn result={result} />
                                </td>
                            )}
                            {customColumns.map((column) => (
                                <td key={column}>
                                    <CustomColumn result={result} jsonKey={column} />
                                </td>
                            ))}
                            <td>
                                <ActionColumn result={result} callbacks={ops} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ColumnSelectModal
                show={showColumnSelection}
                closeModal={() => setShowColumnSelection(false)}
                columns={customColumns}
                setColumns={setCustomColumns}
                suggestions={suggestions}
            />
        </>
    );
};

export default ResultTable;
