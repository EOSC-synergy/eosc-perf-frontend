import ResultsPerPageSelection from './ResultsPerPageSelection';
import { render } from '@testing-library/react';

describe('results per page selection', () => {
    test('valid option', () => {
        const onChange = jest.fn();
        const { container } = render(
            <ResultsPerPageSelection onChange={onChange} currentSelection={50} />
        );
        const option = container.querySelector('option:checked') as HTMLOptionElement | null;
        expect(option?.value).toBe('50');
    });
    test('invalid option', () => {
        const onChange = jest.fn();
        const { container } = render(
            <ResultsPerPageSelection onChange={onChange} currentSelection={621} />
        );
        const option = container.querySelector('option:checked') as HTMLOptionElement | null;
        expect(option?.value).toBe('10');
    });
});
