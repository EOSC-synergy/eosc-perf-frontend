const DEV_API_HOST = 'https://perf.test.fedcloud.eu/api/v1';
const PROD_API_HOST = 'https://performance.services.fedcloud.eu/api/v1';

const getApiRoute = (env = process.env.NEXT_PUBLIC_API_ROUTE): string => {
    let host = env ?? DEV_API_HOST;

    if (env === 'production') {
        host = PROD_API_HOST;
    } else if (env === 'development') {
        host = DEV_API_HOST;
    }

    return host;
};

export default getApiRoute;
