import React, { type FC, type ReactElement, useState } from 'react';
import FlavorSubmissionModal from 'components/submissionModals/FlavorSubmissionModal';
import { SearchingSelector } from './index';
import { type Flavor, type Site } from '@eosc-perf/eosc-perf-client';
import useApi from 'lib/useApi';
import { Button, InputGroup } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

type FlavorSearchSelectProps = {
    flavor?: Flavor;
    site?: Site;
    setFlavor: (flavor?: Flavor) => void;
};

const FlavorSearchSelect: FC<FlavorSearchSelectProps> = ({
    flavor,
    site,
    setFlavor,
}): ReactElement => {
    const api = useApi();

    const displayRow = (flavor: Flavor) => (
        <>
            {flavor.name}
            <p>{flavor.description}</p>
        </>
    );

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <div>
            Flavor:
            <InputGroup className="w-100 flex-nowrap">
                <SearchingSelector<Flavor>
                    queryKeyPrefix={`flavor-for-${site?.id}`}
                    tableName="Flavor"
                    queryCallback={(terms) =>
                        site?.id ? api.sites.searchFlavor(site.id, terms) : undefined
                    }
                    setItem={setFlavor}
                    displayRow={displayRow}
                    submitNew={() => setShowSubmitModal(true)}
                    disabled={site === undefined}
                    toggle={
                        <Button
                            variant={flavor ? 'primary' : 'outline-primary'}
                            className="d-block flex-grow-1"
                            disabled={site === undefined}
                        >
                            {flavor ? flavor.name : site ? 'None' : 'Select site first'}
                        </Button>
                    }
                />
                {flavor && (
                    <Button variant="secondary" onClick={() => setFlavor(undefined)}>
                        <X />
                    </Button>
                )}
            </InputGroup>
            {site !== undefined && (
                <FlavorSubmissionModal
                    show={showSubmitModal}
                    onHide={() => setShowSubmitModal(false)}
                    site={site}
                />
            )}
        </div>
    );
};

export default FlavorSearchSelect;
