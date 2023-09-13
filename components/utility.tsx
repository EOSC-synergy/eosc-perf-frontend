import { type Benchmark } from '@eosc-perf/eosc-perf-client';

/**
 * If a specified string is falsy, replace it with a muted gray "None" text or similar
 *
 * @param value input String to evaluate
 * @param altText Text to display instead of "None"
 * @returns Either a div with gray None text or the original string.
 */
export const truthyOrNoneTag = (value: string | undefined | null, altText = 'None') => {
    if (!value) {
        return (
            <div className="text-muted" style={{ display: 'inline' }}>
                {altText}
            </div>
        );
    }
    return value;
};

/**
 * Display a label for a benchmark with image and tag, with a link to the docker hub
 *
 * @param benchmark Benchmark to display label for
 */
export const benchmarkLinkDisplay = (benchmark: Benchmark) => {
    const dockerHubLink = `https://hub.docker.com/r/${benchmark.docker_image}`;

    return (
        <>
            <a href={dockerHubLink} style={{ display: 'inline' }}>
                {benchmark.docker_image}
            </a>
            {`:${benchmark.docker_tag}`}
        </>
    );
};
