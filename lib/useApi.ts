import {
    BenchmarksApiFactory,
    Configuration,
    FlavorsApiFactory,
    ReportsApiFactory,
    ResultsApiFactory,
    SitesApiFactory,
    TagsApiFactory,
    UsersApiFactory,
} from '@eosc-perf/eosc-perf-client';
import getApiRoute from './getApiRoute';
import { useMemo } from 'react';
import qs from 'qs';

export const BASE_CONFIGURATION_PARAMS = {
    basePath: getApiRoute(),
    baseOptions: {
        paramsSerializer: (params: unknown) => qs.stringify(params, { arrayFormat: 'repeat' }),
    },
};

const useApi = (token?: string) =>
    useMemo(() => {
        const configuration = new Configuration({
            ...BASE_CONFIGURATION_PARAMS,
            accessToken: token,
        });
        return {
            benchmarks: BenchmarksApiFactory(configuration),
            flavors: FlavorsApiFactory(configuration),
            reports: ReportsApiFactory(configuration),
            results: ResultsApiFactory(configuration),
            sites: SitesApiFactory(configuration),
            tags: TagsApiFactory(configuration),
            users: UsersApiFactory(configuration),
        };
    }, [token]);

export default useApi;
