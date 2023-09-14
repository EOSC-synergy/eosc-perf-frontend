import { type FC, useState } from 'react';
import { Badge, Col, Form, Row } from 'react-bootstrap';
import charts from './diagrams';
import { type Suggestion } from './jsonSchema';
import { type Benchmark, type Result } from '@eosc-perf/eosc-perf-client';
import clsx from 'clsx';

const NO_CHART = 'NO_CHART_SELECTED';

type DiagramCardProps = {
    results: Result[];
    benchmark?: Benchmark;
    suggestions?: Suggestion[];
    className?: string;
};

const DiagramCard: FC<DiagramCardProps> = ({ results, benchmark, suggestions, className }) => {
    const [selectedDiagram, setSelectedDiagram] = useState(charts.EChartsMeta.id);

    return (
        <>
            <Row>
                <Form.Group>
                    <Row className={clsx(selectedDiagram !== NO_CHART && 'mb-2')}>
                        <Col md="auto">
                            <Form.Label as="h2" style={{ marginBottom: 0 }} className="h4">
                                Diagram
                            </Form.Label>
                        </Col>
                        <Col md="auto">
                            {benchmark !== undefined && (
                                <Form.Select
                                    onChange={(e) => {
                                        setSelectedDiagram(e.target.value);
                                    }}
                                    className="custom-select"
                                    size="sm"
                                    value={selectedDiagram}
                                >
                                    <option value={NO_CHART}>None</option>
                                    {charts.all.map((chart) => (
                                        <option value={chart.id} key={chart.id}>
                                            {chart.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            )}
                            {benchmark === undefined && (
                                <Badge bg="danger">Please select a benchmark</Badge>
                            )}
                        </Col>
                    </Row>
                </Form.Group>
            </Row>
            {benchmark !== undefined &&
                selectedDiagram !== NO_CHART &&
                charts.all.map((chart) => (
                    <div key={chart.id}>
                        {chart.id === selectedDiagram && (
                            <chart.element results={results} suggestions={suggestions} />
                        )}
                    </div>
                ))}
        </>
    );
};

export default DiagramCard;
