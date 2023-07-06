import React, { FC } from 'react';
import { Result } from '@eosc-perf/eosc-perf-client';

type SiteFlavorColumnProps = { result: Result };

/**
 * Column to display execution site machine flavor
 * @param result
 */
const SiteFlavorColumn: FC<SiteFlavorColumnProps> = ({ result }) => <>{result.flavor.name}</>;

export default SiteFlavorColumn;
