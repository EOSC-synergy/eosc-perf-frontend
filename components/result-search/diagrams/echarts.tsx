import { type ChangeEvent, type FC, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Row } from 'react-bootstrap';
import { type Suggestion } from 'components/result-search/jsonSchema';
import {
    type DataPoint,
    type DataPointCollection,
    generateDataPoints,
    type RejectedResult,
    XAxis,
    YAxis,
} from './helpers';

import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import { DatasetComponent, GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// @ts-expect-error old library without modern type annotations
import { transform } from 'echarts-stat';
import { getSubkeyName } from 'components/result-search/jsonKeyHelpers';
import { Save } from 'react-bootstrap-icons';
import { type Result, type Site } from '@eosc-perf/eosc-perf-client';

echarts.use([
    TooltipComponent,
    GridComponent,
    ScatterChart,
    CanvasRenderer,
    LineChart,
    DatasetComponent,
    BarChart,
]);
echarts.registerTransform(transform.regression);

enum Scale {
    Linear,
    Logarithmic,
}

enum GraphMode {
    Scatter = 'scatter',
    Line = 'line',
    Bar = 'bar',
}

enum Regression {
    None = '',
    Linear = 'linear',
    Exponential = 'exponential',
    Logarithmic = 'logarithmic',
    Polynomial = 'polynomial',
}

type RegressionSelectProps = {
    setRegressionMode: (mode: Regression) => void;
    regressionMode: string;
    disabled: boolean;
    polyRegressionOrder: number;
    setPolyRegressionOrder: (num: number) => void;
    className?: string;
};
const RegressionSelect: FC<RegressionSelectProps> = ({
    setRegressionMode,
    regressionMode,
    disabled,
    polyRegressionOrder,
    setPolyRegressionOrder,
    className,
}) => (
    <Form.Group className={className}>
        <Form.Label>Regression</Form.Label>
        {disabled || (
            <Form.Select
                onChange={(e) => setRegressionMode(e.target.value as Regression)}
                value={regressionMode}
                disabled={disabled}
            >
                <option value={Regression.None} />
                <option value={Regression.Linear}>Linear</option>
                <option value={Regression.Exponential}>Exponential</option>
                <option value={Regression.Polynomial}>Polynomial</option>
                <option value={Regression.Logarithmic}>Logarithmic</option>
            </Form.Select>
        )}
        {disabled && (
            <Form.Select disabled>
                <option>All results must be from the same site</option>
            </Form.Select>
        )}
        {regressionMode === Regression.Polynomial && (
            <Form.Select
                onChange={(e) => setPolyRegressionOrder(parseInt(e.target.value))}
                size="sm"
                value={polyRegressionOrder}
                disabled={regressionMode !== Regression.Polynomial}
            >
                {/* 1 - 10 */}
                {[...Array(10).keys()].map((n) => (
                    <option value={n + 1} key={n + 1}>
                        {n + 1}
                    </option>
                ))}
            </Form.Select>
        )}
    </Form.Group>
);

type GraphModeSelectProps = {
    setGraphMode: (value: string) => void;
    graphMode: string;
    className?: string;
};
const GraphModeSelect: FC<GraphModeSelectProps> = ({ graphMode, setGraphMode, className }) => (
    <Form.Group className={className}>
        <Form.Label>Graph mode</Form.Label>
        <Form.Select onChange={(e) => setGraphMode(e.target.value)} value={graphMode}>
            <option value={GraphMode.Scatter}>Scatter</option>
            <option value={GraphMode.Line}>Line</option>
            <option value={GraphMode.Bar}>Bar</option>
        </Form.Select>
    </Form.Group>
);

type XAxisModeSelectProps = {
    setXAxisMode: (value: Scale) => void;
    xAxisMode: Scale;
    className?: string;
};
const XAxisModeSelect: FC<XAxisModeSelectProps> = ({ xAxisMode, setXAxisMode, className }) => (
    <Form.Group className={className}>
        <Form.Label>X Scale</Form.Label>
        <Form.Select onChange={(e) => setXAxisMode(parseInt(e.target.value))} value={xAxisMode}>
            <option value={Scale.Linear}>Linear</option>
            <option value={Scale.Logarithmic}>Logarithmic</option>
        </Form.Select>
    </Form.Group>
);

type YAxisModeSelectProps = {
    setYAxisMode: (value: Scale) => void;
    yAxisMode: Scale;
    className?: string;
};
const YAxisModeSelect: FC<YAxisModeSelectProps> = ({ setYAxisMode, yAxisMode, className }) => (
    <Form.Group className={className}>
        <Form.Label>Y Scale</Form.Label>
        <Form.Select onChange={(e) => setYAxisMode(parseInt(e.target.value))} value={yAxisMode}>
            <option value={Scale.Linear}>Linear</option>
            <option value={Scale.Logarithmic}>Logarithmic</option>
        </Form.Select>
    </Form.Group>
);

type EChartsDiagramProps = {
    results: Result[];
    suggestions?: Suggestion[];
};

/**
 * Chart displaying a line diagram following the results' ordering
 *
 * @param props
 * @param props.results results to render
 * @param props.suggestions List of diagram keys to suggest to user for axes
 */
const EChartsDiagram: FC<EChartsDiagramProps> = ({ results, suggestions }) => {
    const saveDiagramAsPng = (transparent = false) => {
        const elements = document.getElementsByClassName('echarts-for-react');
        if (elements.length <= 0) {
            console.error('Could not find echarts-for-react div!');
            return;
        }
        const echartsWrapper = elements[0];
        const chartWrapper = echartsWrapper.children[0];
        const canvas = chartWrapper.children[0] as HTMLCanvasElement;
        if (transparent) {
            const download = document.createElement('a');
            download.href = canvas.toDataURL('image/png');
            download.download = 'diagram.png';
            download.click();
        } else {
            const whiteCanvas = document.createElement('canvas');
            whiteCanvas.width = canvas.width;
            whiteCanvas.height = canvas.height;
            const context = whiteCanvas.getContext('2d');
            if (context) {
                context.fillStyle = 'white';
                context.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);
                context.drawImage(canvas, 0, 0);
                const download = document.createElement('a');
                download.href = whiteCanvas.toDataURL('image/png');
                download.download = 'diagram.png';
                download.click();
            } else {
                console.error('Could not create 2d canvas context!!');
            }
        }
    };

    const [xAxisMode, setXAxisMode] = useState(Scale.Linear);
    const [yAxisMode, setYAxisMode] = useState(Scale.Linear);

    const [graphMode, setGraphMode] = useState<string>(GraphMode.Line);
    const [regressionMode, setRegressionMode] = useState<Regression>(Regression.None);
    const [polyRegressionOrder, setPolyRegressionOrder] = useState<number>(2);

    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');

    const labelSet = new Set<number>();

    let dataPoints: DataPointCollection = new Map<string, { site: Site; data: DataPoint[] }>();
    let rejected: RejectedResult[] = [];
    let siteCount = 0;

    // if axes entered, parse data by x and y
    if (xAxis.length && yAxis.length) {
        [dataPoints, rejected] = generateDataPoints(results, xAxis, yAxis);
        for (const site of dataPoints.values()) {
            for (const dataPoint of site.data) {
                labelSet.add(dataPoint.x);
            }
            siteCount++;
        }
    }

    const datasets: ({ source: number[][] } | { transform: unknown })[] = [];
    const series = [];
    for (const dataSet of dataPoints.values()) {
        datasets.push({ source: dataSet.data.map((d) => [d.x, d.y]) });
        series.push({
            type: graphMode,
            name: dataSet.site.name,
            datasetIndex: datasets.length - 1,
        });
    }

    const regressionDataset = {
        transform: {
            type: 'ecStat:regression',
            config: {
                method: regressionMode,
                // 'end' by default
                // formulaOn: 'start'
                order: polyRegressionOrder,
            },
        },
    };
    const regressionSeries = {
        name: 'Regression',
        type: 'line',
        smooth: true,
        datasetIndex: datasets.length,
        symbolSize: 0.1,
        symbol: 'circle',
        label: { show: true, fontSize: 16 },
        labelLayout: {
            rotate: 0,
            x: '15%',
            y: '010%',
            fontSize: 12,
        },
        encode: { label: 2, tooltip: 1 },
    };

    const enableRegression = regressionMode !== Regression.None && siteCount === 1;
    if (enableRegression) {
        datasets.push(regressionDataset);
        series.push(regressionSeries);
    }

    const options = {
        dataset: [...datasets],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
            },
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                },
            },
            type: xAxisMode === Scale.Logarithmic ? 'log' : 'value',
            name: getSubkeyName(xAxis),
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                },
            },
            type: yAxisMode === Scale.Logarithmic ? 'log' : 'value',
            name: getSubkeyName(yAxis),
            nameRotate: 90,
        },
        series: [...series],
        animation: false,
    };

    return (
        <>
            <GraphModeSelect setGraphMode={setGraphMode} graphMode={graphMode} className="mb-2" />
            <Row className="mb-2">
                <Col xs={12} xl={6}>
                    <XAxisModeSelect setXAxisMode={setXAxisMode} xAxisMode={xAxisMode} />
                </Col>
                <Col xs={12} xl={6}>
                    <YAxisModeSelect setYAxisMode={setYAxisMode} yAxisMode={yAxisMode} />
                </Col>
            </Row>
            <RegressionSelect
                setRegressionMode={setRegressionMode}
                regressionMode={regressionMode}
                polyRegressionOrder={polyRegressionOrder}
                setPolyRegressionOrder={setPolyRegressionOrder}
                disabled={siteCount !== 1}
                className="mb-2"
            />
            <Row>
                <Col xs={12} xl={6}>
                    <XAxis setXAxis={setXAxis} suggestions={suggestions} />
                </Col>
                <Col xs={12} xl={6}>
                    <YAxis setYAxis={setYAxis} suggestions={suggestions} />
                </Col>
            </Row>

            {rejected.length > 0 && (
                <div className="my-1">
                    {datasets.length > 0 &&
                        rejected.map((rejected) => (
                            <Alert variant="warning" key={rejected.result.id}>
                                Result {rejected.result.id} not displayed due to: {rejected.reason}
                            </Alert>
                        ))}
                    {datasets.length === 0 && (
                        <Alert variant="danger">
                            No displayable result selected. One of your axes may not be referencing
                            numeric data!
                        </Alert>
                    )}
                </div>
            )}
            {xAxis.length > 0 && yAxis.length > 0 && datasets.length > 0 && (
                <>
                    <div
                        style={{
                            resize: 'both',
                            height: '30em',
                            maxWidth: '100%',
                            minWidth: '500px',
                            minHeight: '200px',
                        }}
                        className="overflow-hidden mt-2"
                    >
                        <ReactEChartsCore
                            echarts={echarts}
                            option={options}
                            style={{ height: '100%' }}
                            notMerge
                        />
                    </div>
                    <Row className="align-items-center w-100 justify-content-center">
                        <Col xs="auto">
                            <Button variant="secondary" onClick={() => saveDiagramAsPng(false)}>
                                <Save /> Save as PNG
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button variant="secondary" onClick={() => saveDiagramAsPng(true)}>
                                <Save /> Save as PNG (transparent)
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

const EChartsMeta = {
    element: EChartsDiagram,
    name: 'Apache ECharts',
    id: 'apache-echarts',
};

export default EChartsMeta;
