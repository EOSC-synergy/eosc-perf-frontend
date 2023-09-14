import { type FC } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import ResultInfo from './ResultInfo';
import { truthyOrNoneTag } from 'components/utility';
import useApi from 'lib/useApi';
import { type Claim } from '@eosc-perf/eosc-perf-client';
import useUser from 'lib/useUser';

type ClaimInfoProps = { id: string; claim: undefined } | { id: undefined; claim: Claim };

const ClaimInfo: FC<ClaimInfoProps> = ({ id, claim: claimCache }) => {
    const auth = useUser();
    const api = useApi(auth.token);

    const claim = useQuery(['claim', id], () => api.reports.getClaim(id ?? claimCache.id), {
        enabled: claimCache === undefined,
    });

    // use local copy if available
    const claimData =
        claimCache !== undefined ? claimCache : claim.isSuccess ? claim.data.data : undefined;

    return (
        <>
            <LoadingOverlay loading={claim.isLoading} />
            {claimData && (
                <>
                    Message: {truthyOrNoneTag(claimData.message)} <br />
                    Claimant: {claimData.uploader.email} <br />
                    {
                        //claimData.resource_type === 'result' && (
                        <ResultInfo id={claimData.resource_id} />
                        //)
                    }
                </>
            )}
        </>
    );
};

export default ClaimInfo;
