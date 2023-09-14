import { type FC } from 'react';
import { type Result } from '@eosc-perf/eosc-perf-client';

type SiteColumnProps = { result: Result };

/**
 * Column to display execution site
 *
 * @param props
 * @param props.result
 */
const SiteColumn: FC<SiteColumnProps> = ({ result }) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{result.site.name}</>
);

export default SiteColumn;
