import { type FC, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import actionable from 'styles/actionable.module.css';
import SiteInfo from './SiteInfo';
import FlavorInfo from './FlavorInfo';
import BenchmarkInfo from './BenchmarkInfo';
import SubmitInteraction from './SubmitInteraction';
import { type Submit } from '@eosc-perf/eosc-perf-client';

type SubmitViewProps = { submit: Submit; refetch: () => void };
const SubmitView: FC<SubmitViewProps> = ({ submit, refetch }) => {
    const [opened, setOpened] = useState(false);

    return (
        <ListGroup.Item>
            <div className={actionable['actionable']} onClick={() => setOpened(!opened)}>
                <div className="w-100 d-flex justify-content-between">
                    <h5 className="mb-1">{submit.resource_type}</h5>
                    <small>{submit.upload_datetime}</small>
                </div>
                <small className="text-muted">Submitted by {submit.uploader.email}</small>
            </div>
            {opened && (
                <>
                    <hr />
                    {submit.resource_type === 'site' && <SiteInfo id={submit.resource_id} />}
                    {submit.resource_type === 'flavor' && <FlavorInfo id={submit.resource_id} />}
                    {submit.resource_type === 'benchmark' && (
                        <BenchmarkInfo id={submit.resource_id} />
                    )}
                    {/*props.submit.resource_type === 'claim' && (
                        <ClaimInfo id={props.submit.resource_id} />
                    )*/}
                    <SubmitInteraction submit={submit} refetch={refetch} />
                </>
            )}
        </ListGroup.Item>
    );
};

export default SubmitView;
