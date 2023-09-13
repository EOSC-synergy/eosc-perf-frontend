import { type Benchmark } from '@eosc-perf/eosc-perf-client';

export type SchemaField = {
    type?: string;
    suggestToUser?: boolean;
    description?: string;
};

export type SchemaObject = SchemaField & {
    properties: Record<string, SchemaField>;
};

export type Suggestion = {
    field: string;
    description?: string;
};

export const parseSuggestions = (benchmark: Benchmark): Suggestion[] => {
    const recurser = ([key, field]: [string, SchemaField]): Suggestion[] => {
        if (field.suggestToUser && field.type !== 'object') {
            return [{ field: key, description: field.description }];
        }

        if (field.type === 'object') {
            return Object.entries((field as SchemaObject).properties)
                .map(recurser) // get all interesting children
                .reduce((acc: Suggestion[], arr: Suggestion[]) => [...acc, ...arr]) // make one array
                .map((suggestion: Suggestion) => ({
                    ...suggestion,
                    field: `${key}.${suggestion.field}`,
                })); // prefix current key
        }
        return [];
    };

    const schema = benchmark.json_schema as SchemaObject;

    // TODO: safer typing
    if (schema === undefined || schema.properties === undefined) {
        return [];
    }

    return Object.entries(schema.properties)
        .map(recurser)
        .reduce((acc: Suggestion[], arr: Suggestion[]) => [...acc, ...arr]);
};
