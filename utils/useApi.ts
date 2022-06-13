import {
    BenchmarksApi,
    Configuration,
    FlavorsApi,
    ReportsApi,
    ResultsApi,
    SitesApi,
    TagsApi,
    UsersApi,
} from '@eosc-perf/eosc-perf-client';
import getApiRoute from './getApiRoute';
import { useMemo } from 'react';
import qs from 'qs';

export const useApi = (token?: string) => {
    return useMemo(() => {
        const configuration = new Configuration({
            basePath: getApiRoute(),
            baseOptions: {
                paramsSerializer: (params: unknown) =>
                    qs.stringify(params, { arrayFormat: 'repeat' }),
            },
            accessToken: token,
        });
        return {
            benchmarks: new BenchmarksApi(configuration),
            flavors: new FlavorsApi(configuration),
            reports: new ReportsApi(configuration),
            results: new ResultsApi(configuration),
            sites: new SitesApi(configuration),
            tags: new TagsApi(configuration),
            users: new UsersApi(configuration),
        };
    }, [token]);
};

export default useApi;
