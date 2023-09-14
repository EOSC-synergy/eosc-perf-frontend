import { type FC, type PropsWithChildren, useState } from 'react';
import { Dropdown, FormControl, InputGroup } from 'react-bootstrap';
import { type Suggestion } from 'components/result-search/jsonSchema';
import { truthyOrNoneTag } from './utility';

type InputWithSuggestionsProps = {
    setInput: (input: string) => void;
    suggestions?: Suggestion[];
    placeholder?: string;
    value?: string;
};

const InputWithSuggestions: FC<PropsWithChildren<InputWithSuggestionsProps>> = ({
    setInput,
    suggestions,
    placeholder,
    value,
    children,
}) => {
    const [input, setLocalInput] = useState(value);

    const updateInput = (newInput: string) => {
        setLocalInput(newInput);
        setInput(newInput);
    };

    return (
        <Dropdown as={InputGroup} onSelect={(k) => updateInput(k ?? '')} align="end">
            <FormControl
                placeholder={placeholder}
                aria-label={placeholder ?? 'Input field with suggestions'}
                value={input}
                onChange={(e) => updateInput(e.target.value)}
            />
            {suggestions !== undefined && suggestions.length > 0 && (
                <>
                    <Dropdown.Toggle split variant="outline-secondary" />
                    <Dropdown.Menu>
                        {suggestions.map((suggestion) => (
                            <Dropdown.Item key={suggestion.field} eventKey={suggestion.field}>
                                {suggestion.field}
                                <br />
                                <small>
                                    {truthyOrNoneTag(
                                        suggestion.description,
                                        'No description given.'
                                    )}
                                </small>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </>
            )}
            {/* TODO: clean up, find alternative for this (this is used in filters) */}
            {children}
        </Dropdown>
    );
};

export default InputWithSuggestions;
