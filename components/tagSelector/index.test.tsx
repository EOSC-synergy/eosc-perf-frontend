import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import TagSelector from 'components/tagSelector';
import { QueryClient, QueryClientProvider } from 'react-query';

import { tag, tags } from '../testData';
import { Tags } from '@eosc-perf-automation/eosc-perf-client';
import getApiRoute from '../../utils/getApiRoute';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient();

test('select', async () => {
    server.use(
        rest.get(getApiRoute() + '/tags:search', (req, res, ctx) => {
            return res(ctx.json<Tags>(tags));
        })
    );
    const setSelected = jest.fn();

    render(
        <QueryClientProvider client={queryClient}>
            <TagSelector selected={[]} setSelected={setSelected} />
        </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText(tag.name)).toBeInTheDocument(), {});
    act(() => screen.getByText(tag.name).click());
    expect(setSelected).toHaveBeenCalledWith([tag]);
});

test('unselect', async () => {
    server.use(
        rest.get(getApiRoute() + '/tags:search', (req, res, ctx) => {
            return res(ctx.json<Tags>(tags));
        })
    );
    const setSelected = jest.fn();
    render(
        <QueryClientProvider client={queryClient}>
            <TagSelector selected={[tag]} setSelected={setSelected} />
        </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText(tag.name)).toBeInTheDocument(), {});
    act(() => {
        (screen.getByText(tag.name).querySelector('div') as HTMLElement | null)?.click();
    });
    expect(setSelected).toHaveBeenCalledWith([]);
});

// TODO: search
// TODO: submit
