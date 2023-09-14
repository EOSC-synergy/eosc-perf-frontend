import { type FC } from 'react';
import { type Result } from '@eosc-perf/eosc-perf-client';

type SiteFlavorColumnProps = { result: Result };

/**
 * Column to display execution site machine flavor
 *
 * @param props
 * @param props.result
 */
const SiteFlavorColumn: FC<SiteFlavorColumnProps> = ({ result }) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{result.flavor.name}</>
);

export default SiteFlavorColumn;
