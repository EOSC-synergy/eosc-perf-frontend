import { type ChangeEvent, type FC, useState } from 'react';
import { Badge, Card, Col, Form, Row } from 'react-bootstrap';
import charts from './diagrams';
import { type Suggestion } from './jsonSchema';
import { type Benchmark, type Result } from '@eosc-perf/eosc-perf-client';

type DiagramCardProps = {
    results: Result[];
    benchmark?: Benchmark;
    suggestions?: Suggestion[];
};

const DiagramCard: FC<DiagramCardProps> = ({ results, benchmark, suggestions }) => {
    const [selectedDiagram, setSelectedDiagram] = useState(charts.EChartsMeta.id);

    return (
        <Card>
            <Card.Header>
                <Row>
                    <Form.Group>
                        <Row>
                            <Col className="align-self-center">
                                <Form.Label style={{ marginBottom: 0 }}>Diagram</Form.Label>
                            </Col>
                            <Col md="auto">
                                {benchmark !== undefined && (
                                    <Form.Select
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setSelectedDiagram(e.target.value);
                                        }}
                                        className="custom-select"
                                        size="sm"
                                        value={selectedDiagram}
                                    >
                                        <option>None</option>
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
            </Card.Header>
            {benchmark !== undefined && (
                <Card.Body>
                    {charts.all.map((chart) => (
                        <div key={chart.id}>
                            {chart.id === selectedDiagram && (
                                <chart.element results={results} suggestions={suggestions} />
                            )}
                        </div>
                    ))}
                </Card.Body>
            )}
        </Card>
    );
};

export default DiagramCard;
