import TermsOfServiceCheck from './TermsOfServiceCheck';
import { act, render, screen } from '@testing-library/react';

describe('terms of service check', () => {
    test('check', () => {
        const onClick = jest.fn();
        render(<TermsOfServiceCheck accepted={false} setAccepted={onClick} />);
        act(() => {
            screen.getByRole('checkbox').click();
        });
        expect(onClick).toHaveBeenCalledWith(true);
    });
    test('uncheck', () => {
        const onClick = jest.fn();
        render(<TermsOfServiceCheck accepted setAccepted={onClick} />);
        act(() => {
            screen.getByRole('checkbox').click();
        });
        expect(onClick).toHaveBeenCalledWith(false);
    });
});
