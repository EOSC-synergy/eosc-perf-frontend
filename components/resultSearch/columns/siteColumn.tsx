import React, { ReactElement } from 'react';
import { Result } from '@eosc-perf-automation/eosc-perf-client';

/**
 * Column to display execution site
 * @param {Result} result
 * @returns {React.ReactElement}
 * @constructor
 */
export function SiteColumn({ result }: { result: Result }): ReactElement {
    return <>{result.site.name}</>;
}
