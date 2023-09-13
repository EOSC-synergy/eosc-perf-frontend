import { FC } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

type ResultsPerPageSelectionProps = {
    onChange: (resultsPerPage: number) => void;
    currentSelection: number;
};

/**
 * Dropdown component to select the number of items to display in a page
 * @param props
 * @param props.onChange callback to be called with the new number of items per page
 * @param props.currentSelection the current number of items displayed per page
 */
const ResultsPerPageSelection: FC<ResultsPerPageSelectionProps> = ({
    onChange,
    currentSelection,
}) => {
    const options = [10, 15, 20, 50, 100];

    return (
        <Form.Group as={Row}>
            <Form.Label column>Results per page:</Form.Label>
            <Col>
                <Form.Select
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    value={currentSelection}
                >
                    {options.map((n: number) => (
                        <option value={n.toString()} key={n.toString()}>
                            {n.toString()}
                        </option>
                    ))}
                </Form.Select>
            </Col>
        </Form.Group>
    );
};

export default ResultsPerPageSelection;
