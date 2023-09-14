import withBundleAnalyzer from '@next/bundle-analyzer';
import transpileModules from 'next-transpile-modules';

/** @typedef  {import('next').NextConfig} NextConfig */

let bundleAnalyzer;
try {
    bundleAnalyzer = withBundleAnalyzer({
        enabled: process.env.ANALYZE === 'true',
    });
} catch (e) {
    console.log('No @next/bundle-analyzer, assuming production');
    bundleAnalyzer = x => x;
}

const withTM = transpileModules(['echarts', 'zrender']);

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer(withTM({
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/search/result',
                permanent: true,
            },
        ];
    },
    output: 'standalone',
}));

export default nextConfig;
