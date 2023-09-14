import { type FC, type ReactElement, useState } from 'react';
import SiteSubmissionModal from 'components/submissionModals/siteSubmissionModal';
import { SearchingSelector } from './index';
import useApi from 'lib/useApi';
import { type Site } from '@eosc-perf/eosc-perf-client';
import { Button, InputGroup } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

type SiteSearchPopoverProps = {
    site?: Site;
    setSite: (site?: Site) => void;
};

const SiteSearchPopover: FC<SiteSearchPopoverProps> = ({ site, setSite }): ReactElement => {
    const api = useApi();

    const displayRow = (rowSite: Site) => (
        <>
            {rowSite.name}
            <p>{rowSite.description}</p>
        </>
    );

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <div>
            Site:
            <InputGroup className="w-100 flex-nowrap">
                <SearchingSelector<Site>
                    queryKeyPrefix="site"
                    tableName="Site"
                    queryCallback={(terms) => api.sites.searchSites(terms)}
                    setItem={setSite}
                    displayRow={displayRow}
                    submitNew={() => setShowSubmitModal(true)}
                    toggle={
                        <Button
                            variant={site ? 'primary' : 'outline-primary'}
                            className="d-block flex-grow-1"
                        >
                            {site ? site.name : 'None'}
                        </Button>
                    }
                />
                {site && (
                    <Button variant="secondary" onClick={() => setSite(undefined)}>
                        <X />
                    </Button>
                )}
            </InputGroup>
            <SiteSubmissionModal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} />
        </div>
    );
};

export default SiteSearchPopover;
