import { type ReactElement } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import ResultInfo from './ResultInfo';
import { truthyOrNoneTag } from 'components/utility';
import { Badge } from 'react-bootstrap';
import useApi from 'lib/useApi';
import { type Claim } from '@eosc-perf/eosc-perf-client';
import useUser from 'lib/useUser';

type ClaimInfoProps = { id: string; claim: undefined } | { id: undefined; claim: Claim };

export const ClaimInfo: React.FC<ClaimInfoProps> = (props): ReactElement => {
    const auth = useUser();
    const api = useApi(auth.token);

    const claim = useQuery(
        ['claim', props.id],
        () => api.reports.getClaim(props.id ?? props.claim.id),
        {
            enabled: props.claim === undefined,
        }
    );

    // use local copy if available
    let claimData: Claim | undefined = props.claim;
    if (props.claim === undefined && props.id !== undefined && claim.isSuccess && claim.data) {
        claimData = claim.data.data;
    }

    return (
        <>
            {props.id === undefined && props.claim === undefined && (
                <Badge bg="danger">No claim data available</Badge>
            )}
            {claim.isLoading && <LoadingOverlay />}
            {claim.isSuccess && claimData && (
                <>
                    Message: {truthyOrNoneTag(claimData.message)} <br />
                    Claimant: {claimData.uploader.email} <br />
                    {claimData.resource_type === 'result' && (
                        <ResultInfo id={claimData.resource_id} />
                    )}
                </>
            )}
        </>
    );
};
