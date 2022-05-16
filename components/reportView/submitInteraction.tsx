import React, { ReactElement, useContext } from 'react';
import { useMutation } from 'react-query';
import { Button } from 'react-bootstrap';
import { UserContext } from 'components/userContext';
import { Submit } from '@eosc-perf-automation/eosc-perf-client';
import useApi from '../../utils/useApi';
import { SubmitResourceTypeEnum } from '@eosc-perf-automation/eosc-perf-client';
import ensureUnreachable from '../../utils/ensureUnreachable';

export function SubmitInteraction(props: {
    submit: Submit;
    refetch: () => void;
    approveText?: string;
    rejectText?: string;
}): ReactElement {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const { mutate: approve } = useMutation(
        () => {
            switch (props.submit.resource_type) {
                case SubmitResourceTypeEnum.Flavor:
                    return api.flavors.approveFlavor(props.submit.resource_id);
                case SubmitResourceTypeEnum.Claim:
                    return api.reports.approveClaim(props.submit.resource_id);
                case SubmitResourceTypeEnum.Site:
                    return api.sites.approveSite(props.submit.resource_id);
                case SubmitResourceTypeEnum.Benchmark:
                    return api.benchmarks.approveBenchmark(props.submit.resource_id);
            }
            ensureUnreachable(props.submit.resource_type);
        },
        {
            onSuccess: () => {
                props.refetch();
            },
        }
    );

    const { mutate: reject } = useMutation(
        () => {
            switch (props.submit.resource_type) {
                case SubmitResourceTypeEnum.Flavor:
                    return api.flavors.rejectFlavor(props.submit.resource_id);
                case SubmitResourceTypeEnum.Claim:
                    return api.reports.rejectClaim(props.submit.resource_id);
                case SubmitResourceTypeEnum.Site:
                    return api.sites.rejectSite(props.submit.resource_id);
                case SubmitResourceTypeEnum.Benchmark:
                    return api.benchmarks.rejectBenchmark(props.submit.resource_id);
            }
            ensureUnreachable(props.submit.resource_type);
        },
        {
            onSuccess: () => {
                props.refetch();
            },
        }
    );

    return (
        <div className="mt-2">
            <Button
                variant="success"
                onClick={() => {
                    approve();
                }}
                className="me-1"
            >
                {props.approveText || 'Approve'}
            </Button>
            <Button
                variant="danger"
                onClick={() => {
                    reject();
                }}
            >
                {props.rejectText || 'Reject'}
            </Button>
        </div>
    );
}
