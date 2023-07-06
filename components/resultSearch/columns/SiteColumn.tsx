import React, { FC } from 'react';
import { Result } from '@eosc-perf/eosc-perf-client';

type SiteColumnProps = { result: Result };

/**
 * Column to display execution site
 * @param result
 */
const SiteColumn: FC<SiteColumnProps> = ({ result }) => <>{result.site.name}</>;

export default SiteColumn;
