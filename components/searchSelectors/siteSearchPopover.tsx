import React, { ReactElement, useState } from 'react';
import { SiteSubmissionModal } from 'components/submissionModals/siteSubmissionModal';
import { SearchingSelector } from './index';
import { useQuery } from 'react-query';
import useApi from '../../utils/useApi';
import { Site } from '@eosc-perf-automation/eosc-perf-client';

type SiteSearchPopoverProps = {
    site?: Site;
    initialSiteId?: string;
    initSite?: (site?: Site) => void;
    setSite: (site?: Site) => void;
};

export const SiteSearchPopover: React.FC<SiteSearchPopoverProps> = (props): ReactElement => {
    const api = useApi();

    useQuery(
        ['initial-site', props.initialSiteId],
        () => {
            if (props.initialSiteId) {
                return api.sites.getSite(props.initialSiteId);
            }
            throw 'tried to get side with no id';
        },
        {
            enabled: props.initialSiteId !== undefined,
            refetchOnWindowFocus: false, // do not spam queries
            onSuccess: (data) => {
                if (props.initSite) {
                    props.initSite(data.data);
                } else {
                    props.setSite(data.data);
                }
            },
        }
    );

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
