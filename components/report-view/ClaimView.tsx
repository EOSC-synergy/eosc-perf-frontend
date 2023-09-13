import { type FC, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import actionable from 'styles/actionable.module.css';
import { ClaimInfo } from './claimInfo';
import ClaimInteraction from './ClaimInteraction';
import { type Claim } from '@eosc-perf/eosc-perf-client';

type ClaimViewProps = {
    claim: Claim;
    refetch: () => void;
};

const ClaimView: FC<ClaimViewProps> = ({ claim, refetch }) => {
    const [opened, setOpened] = useState(false);

    return (
        <ListGroup.Item>
            <div
                className={actionable['actionable']}
                onClick={() => {
                    setOpened(!opened);
                }}
            >
                <div className="w-100 d-flex justify-content-between">
                    <h5 className="mb-1">{claim.resource_type}</h5>
                    <small>{claim.upload_datetime}</small>
                </div>
                <p className="mb-1">{claim.message}</p>
                <small className="text-muted">For {claim.resource_id}</small>
            </div>
            {opened && (
                <>
                    <hr />
                    <ClaimInfo claim={claim} id={undefined} />
                    <ClaimInteraction claim={claim} refetch={refetch} />
                </>
            )}
        </ListGroup.Item>
    );
};

export default ClaimView;
