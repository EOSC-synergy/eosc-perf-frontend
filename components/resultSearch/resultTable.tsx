import React, { ReactElement, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import {
    ActionColumn,
    BenchmarkColumn,
    CheckboxColumn,
    CustomColumn,
    SiteColumn,
    SiteFlavorColumn,
    TagsColumn,
} from 'components/resultSearch/columns';
import { ResultCallbacks } from 'components/resultSearch/resultCallbacks';
import { ChevronDown, ChevronUp, Pencil } from 'react-bootstrap-icons';
import { ColumnSelectModal } from 'components/resultSearch/columnSelectModal';
import { Sorting, SortMode } from 'components/resultSearch/sorting';
import { Suggestion } from './jsonSchema';
import { Result } from '@eosc-perf/eosc-perf-client';

function SortingTableHeader(props: {
    label: string;
    sortKey: string;
    sorting: Sorting;
    setSorting: (sort: Sorting) => void;
}) {
    function updateSortOrder() {
        if (props.sorting.key === props.sortKey) {
            // sort in reverse
            if (props.sorting.mode === SortMode.Ascending) {
                props.setSorting({ ...props.sorting, mode: SortMode.Descending });
            }
            // unsort
            else {
                props.setSorting({ mode: SortMode.Disabled, key: '' });
            }
        }
        // sorting by something else
        else {
            props.setSorting({ mode: SortMode.Ascending, key: props.sortKey });
        }
    }

    return (
        <th onClick={() => updateSortOrder()}>
            {props.label}{' '}
            {props.sorting.key === props.sortKey && (
                <>
                    {props.sorting.mode === SortMode.Ascending && <ChevronDown />}
                    {props.sorting.mode === SortMode.Descending && <ChevronUp />}
                </>
            )}
        </th>
    );
}

export function ResultTable(props: {
    results: Result[];
    pageOffset: number;
    ops: ResultCallbacks;
    suggestions?: Suggestion[];
    sorting: Sorting;
    setSorting: (sort: Sorting) => void;
    customColumns: string[];
    setCustomColumns: (customColumns: string[]) => void;
}): ReactElement {
    const [benchmarkColumnEnabled, setBenchmarkColumnEnabled] = useState(true);
    const [siteColumnEnabled, setSiteColumnEnabled] = useState(true);
    const [siteFlavorColumnEnabled, setSiteFlavorColumnEnabled] = useState(true);
    const [tagsColumnEnabled, setTagsColumnEnabled] = useState(true);

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
                                        props.results.every((r) => props.ops.isSelected(r))
                                            ? props.ops.unselectMultiple(props.results)
                                            : props.ops.selectMultiple(
                                                  props.results.map((r, i) => {
                                                      return {
                                                          ...r,
                                                          orderIndex: i + props.pageOffset,
                                                      };
                                                  })
                                              );
                                    }}
                                    checked={props.results.every((r) => props.ops.isSelected(r))}
                                />
                            </Form>
                        </th>
                        {benchmarkColumnEnabled && (
                            <SortingTableHeader
                                label="Benchmark"
                                sortKey="benchmark_name"
                                sorting={props.sorting}
                                setSorting={props.setSorting}
                            />
                        )}
                        {siteColumnEnabled && (
                            <SortingTableHeader
                                label="Site"
                                sortKey="site_name"
                                sorting={props.sorting}
                                setSorting={props.setSorting}
                            />
                        )}
                        {siteFlavorColumnEnabled && (
                            <SortingTableHeader
                                label="Site flavor"
                                sortKey="flavor_name"
                                sorting={props.sorting}
                                setSorting={props.setSorting}
                            />
                        )}
                        {tagsColumnEnabled && <th>Tags</th>}
                        {/* TODO: hover */}
                        {props.customColumns.map((column) => (
                            <SortingTableHeader
                                label={column}
                                sortKey={'json.' + column}
                                sorting={props.sorting}
                                setSorting={props.setSorting}
                                key={column}
                            />
                        ))}
                        <th>
                            {/* TODO: move this to hotbar above table? */}
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
                    {props.results.map((result, index) => {
                        return (
                            <tr key={result.id}>
                                <td>
                                    <CheckboxColumn result={result} callbacks={props.ops} />
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
                                {props.customColumns.map((column) => (
                                    <td key={column}>
                                        <CustomColumn result={result} jsonKey={column} />
                                    </td>
                                ))}
                                <td>
                                    <ActionColumn result={result} callbacks={props.ops} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <ColumnSelectModal
                show={showColumnSelection}
                closeModal={() => setShowColumnSelection(false)}
                columns={props.customColumns}
                setColumns={props.setCustomColumns}
                suggestions={props.suggestions}
            />
        </>
    );
}
