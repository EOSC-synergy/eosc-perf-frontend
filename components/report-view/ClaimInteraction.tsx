import { type FC } from 'react';
import { useMutation } from 'react-query';
import { Button } from 'react-bootstrap';
import { type Claim } from '@eosc-perf/eosc-perf-client';
import useApi from 'lib/useApi';
import useUser from 'lib/useUser';

type ClaimInteractionProps = {
    claim: Claim;
    refetch: () => void;
    deleteText?: string;
};

const ClaimInteraction: FC<ClaimInteractionProps> = ({ claim, refetch, deleteText }) => {
    const auth = useUser();
    const api = useApi(auth.token);

    const { mutate: deleteClaim } = useMutation((id: string) => api.reports.rejectClaim(id), {
        onSuccess: refetch,
    });

    return (
        <div className="mt-2">
            <Button variant="danger" onClick={() => deleteClaim(claim.id)}>
                {deleteText ?? 'Delete'}
            </Button>
        </div>
    );
};

export default ClaimInteraction;
