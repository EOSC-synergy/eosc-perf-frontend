import { type FC } from 'react';
import { useMutation } from 'react-query';
import { Button } from 'react-bootstrap';
import { type Submit, SubmitResourceTypeEnum } from '@eosc-perf/eosc-perf-client';
import useApi from 'lib/useApi';
import useUser from 'lib/useUser';

type SubmitInteractionProps = {
    submit: Submit;
    refetch: () => void;
    approveText?: string;
    rejectText?: string;
};
const SubmitInteraction: FC<SubmitInteractionProps> = ({
    submit,
    refetch,
    approveText,
    rejectText,
}) => {
    const auth = useUser();
    const api = useApi(auth.token);

    const { mutate: approve } = useMutation(
        () => {
            switch (submit.resource_type) {
                case SubmitResourceTypeEnum.Flavor:
                    return api.flavors.approveFlavor(submit.resource_id);
                case SubmitResourceTypeEnum.Claim:
                    return api.reports.approveClaim(submit.resource_id);
                case SubmitResourceTypeEnum.Site:
                    return api.sites.approveSite(submit.resource_id);
                case SubmitResourceTypeEnum.Benchmark:
                    return api.benchmarks.approveBenchmark(submit.resource_id);
            }
        },
        {
            onSuccess: () => refetch(),
        }
    );

    const { mutate: reject } = useMutation(
        () => {
            switch (submit.resource_type) {
                case SubmitResourceTypeEnum.Flavor:
                    return api.flavors.rejectFlavor(submit.resource_id);
                case SubmitResourceTypeEnum.Claim:
                    return api.reports.rejectClaim(submit.resource_id);
                case SubmitResourceTypeEnum.Site:
                    return api.sites.rejectSite(submit.resource_id);
                case SubmitResourceTypeEnum.Benchmark:
                    return api.benchmarks.rejectBenchmark(submit.resource_id);
            }
        },
        {
            onSuccess: refetch,
        }
    );

    return (
        <div className="mt-2">
            <Button variant="success" onClick={() => approve()} className="me-1">
                {approveText ?? 'Approve'}
            </Button>
            <Button variant="danger" onClick={() => reject()}>
                {rejectText ?? 'Reject'}
            </Button>
        </div>
    );
};

export default SubmitInteraction;
