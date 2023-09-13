import { type FC } from 'react';
import { type Result } from '@eosc-perf/eosc-perf-client';

type SiteFlavorColumnProps = { result: Result };

/**
 * Column to display execution site machine flavor
 *
 * @param props
 * @param props.result
 */
const SiteFlavorColumn: FC<SiteFlavorColumnProps> = ({ result }) => <>{result.flavor.name}</>;

export default SiteFlavorColumn;
