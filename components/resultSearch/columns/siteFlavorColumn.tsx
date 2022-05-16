import React, { ReactElement } from 'react';
import { Result } from '@eosc-perf-automation/eosc-perf-client';

/**
 * Column to display execution site machine flavor
 * @param {Result & {orderIndex: number}} result
 * @returns {React.ReactElement}
 * @constructor
 */
export function SiteFlavorColumn({ result }: { result: Result }): ReactElement {
    return <>{result.flavor.name}</>;
}
