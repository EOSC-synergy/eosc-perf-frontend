import { type FC } from 'react';
import { type Result } from '@eosc-perf/eosc-perf-client';

type SiteColumnProps = { result: Result };

/**
 * Column to display execution site
 *
 * @param props
 * @param props.result
 */
const SiteColumn: FC<SiteColumnProps> = ({ result }) => <>{result.site.name}</>;

export default SiteColumn;
