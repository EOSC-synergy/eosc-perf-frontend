import React, { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import actionable from '../../styles/actionable.module.css';
import { ClaimInfo } from './claimInfo';
import { ClaimInteraction } from './claimInteraction';
import { Claim } from '@eosc-perf-automation/eosc-perf-client';

export function ClaimView(props: { claim: Claim; refetch: () => void }) {
    const [opened, setOpened] = useState(false);

    return (
        <ListGroup.Item>
            <div
                className={actionable.actionable}
                onClick={() => {
                    setOpened(!opened);
                }}
            >
                <div className="w-100 d-flex justify-content-between">
                    <h5 className="mb-1">{props.claim.resource_type}</h5>
                    <small>{props.claim.upload_datetime}</small>
                </div>
                <p className="mb-1">{props.claim.message}</p>
                <small className="text-muted">For {props.claim.resource_id}</small>
            </div>
            {opened && (
                <>
                    <hr />
                    <ClaimInfo claim={props.claim} id={undefined} />
                    <ClaimInteraction claim={props.claim} refetch={props.refetch} />
                </>
            )}
        </ListGroup.Item>
    );
}
