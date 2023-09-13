import { type ChangeEvent, type FC, useState } from 'react';
import type Filter from 'components/result-search/Filter';
import { CloseButton, Col, Form, Row } from 'react-bootstrap';
import InputWithSuggestions from 'components/InputWithSuggestions';
import { type Suggestion } from './jsonSchema';

type FilterEditProps = {
    filter: Filter;
    setFilter: (id: string, key: string, mode: string, value: string) => void;
    deleteFilter: (id: string) => void;
    suggestions?: Suggestion[];
};
const FilterEdit: FC<FilterEditProps> = ({ filter, setFilter, deleteFilter, suggestions }) => {
    const [key, setKey] = useState(filter.key);
    const [mode, setMode] = useState(filter.mode);
    const [value, setValue] = useState(filter.value);

    return (
        <Row>
            <Col>
                <InputWithSuggestions
                    suggestions={suggestions}
                    setInput={(e) => {
                        setKey(e);
                        setFilter(filter.id, e, mode, value);
                    }}
                    placeholder="JSON Key"
                    value={key}
                >
                    <Form.Select
                        value={mode}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            // TODO: why do they say it's a FormEvent and we have to assert ChangeEvent??
                            setMode(e.target.value);
                            setFilter(filter.id, key, e.target.value, value);
                        }}
                    >
                        <option value=">">&gt;</option>
                        <option value=">=">≥</option>
                        <option value="==">=</option>
                        <option value="<=">≤</option>
                        <option value="<">&lt;</option>
                    </Form.Select>
                    <Form.Control
                        aria-label="Value"
                        placeholder="Value"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setFilter(filter.id, key, mode, e.target.value);
                        }}
                    />
                </InputWithSuggestions>
            </Col>
            <Col md="auto">
                <CloseButton onClick={() => deleteFilter(filter.id)} />
            </Col>
        </Row>
    );
};

export default FilterEdit;
