import React, { ReactElement, useState } from 'react';
import { SiteSubmissionModal } from 'components/submissionModals/siteSubmissionModal';
import { SearchingSelector } from './index';
import useApi from '../../utils/useApi';
import { Site } from '@eosc-perf/eosc-perf-client';

type SiteSearchPopoverProps = {
    site?: Site;
    setSite: (site?: Site) => void;
};

export const SiteSearchPopover: React.FC<SiteSearchPopoverProps> = (props): ReactElement => {
    const api = useApi();

    function display(site?: Site) {
        return (
            <>
                Site:{' '}
                {site ? (
                    <>{site.name}</>
                ) : (
                    <div className="text-muted" style={{ display: 'inline-block' }}>
                        None
                    </div>
                )}
            </>
        );
    }

    function displayRow(site: Site) {
        return (
            <>
                {site.name}
                <div>
                    {site.description}
                    <br />
                </div>
            </>
        );
    }

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <>
            <SearchingSelector<Site>
                queryKeyPrefix="site"
                tableName="Site"
                queryCallback={(terms) => api.sites.searchSites(terms)}
                item={props.site}
                setItem={props.setSite}
                display={display}
                displayRow={displayRow}
                submitNew={() => setShowSubmitModal(true)}
            />
            <SiteSubmissionModal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} />
        </>
    );
};
