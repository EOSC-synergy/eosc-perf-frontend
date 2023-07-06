import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export function QueryClientWrapper(props: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {props.children} <ReactQueryDevtools />
        </QueryClientProvider>
    );
}
