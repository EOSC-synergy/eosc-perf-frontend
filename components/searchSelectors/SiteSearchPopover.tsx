import { type FC, type ReactElement, useState } from 'react';
import SiteSubmissionModal from 'components/submissionModals/siteSubmissionModal';
import { SearchingSelector } from './index';
import useApi from 'lib/useApi';
import { type Site } from '@eosc-perf/eosc-perf-client';

type SiteSearchPopoverProps = {
    site?: Site;
    setSite: (site?: Site) => void;
};

const SiteSearchPopover: FC<SiteSearchPopoverProps> = ({ site, setSite }): ReactElement => {
    const api = useApi();

    const display = (site?: Site) => (
        <>
            Site:{' '}
            {site ? (
                site.name
            ) : (
                <div className="text-muted" style={{ display: 'inline-block' }}>
                    None
                </div>
            )}
        </>
    );

    const displayRow = (site: Site) => (
        <>
            {site.name}
            <p>{site.description}</p>
        </>
    );

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <>
            <SearchingSelector<Site>
                queryKeyPrefix="site"
                tableName="Site"
                queryCallback={(terms) => api.sites.searchSites(terms)}
                item={site}
                setItem={setSite}
                display={display}
                displayRow={displayRow}
                submitNew={() => setShowSubmitModal(true)}
            />
            <SiteSubmissionModal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} />
        </>
    );
};

export default SiteSearchPopover;
