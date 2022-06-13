import React, { ReactElement, useContext } from 'react';
import { useMutation } from 'react-query';
import { Button } from 'react-bootstrap';
import { UserContext } from 'components/userContext';
import { Claim } from '@eosc-perf/eosc-perf-client';
import useApi from '../../utils/useApi';

export function ClaimInteraction(props: {
    claim: Claim;
    refetch: () => void;
    deleteText?: string;
}): ReactElement {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const { mutate: deleteClaim } = useMutation((id: string) => api.reports.rejectClaim(id), {
        onSuccess: () => {
            props.refetch();
        },
    });

    return (
        <div className="mt-2">
            <Button
                variant="danger"
                onClick={() => {
                    deleteClaim(props.claim.id);
                }}
            >
                {props.deleteText || 'Delete'}
            </Button>
        </div>
    );
}
