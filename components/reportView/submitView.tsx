import {Submit} from "../../model";
import React, {useState} from "react";
import {ListGroup} from "react-bootstrap";
import actionable from "../../styles/actionable.module.css";
import {SiteInfo} from "./siteInfo";
import {FlavorInfo} from "./flavorInfo";
import {BenchmarkInfo} from "./benchmarkInfo";
import {SubmitInteraction} from "./submitInteraction";

export function SubmitView(props: { submit: Submit; refetch: () => void }) {
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
                    <h5 className="mb-1">{props.submit.resource_type}</h5>
                    <small>{props.submit.upload_datetime}</small>
                </div>
                <small className="text-muted">Submitted by {props.submit.uploader.email}</small>
            </div>
            {opened && (
                <>
                    <hr/>
                    {props.submit.resource_type === 'site' && (
                        <SiteInfo id={props.submit.resource_id}/>
                    )}
                    {props.submit.resource_type === 'flavor' && (
                        <FlavorInfo id={props.submit.resource_id}/>
                    )}
                    {props.submit.resource_type === 'benchmark' && (
                        <BenchmarkInfo id={props.submit.resource_id}/>
                    )}
                    {/*props.submit.resource_type === 'claim' && (
                        <ClaimInfo id={props.submit.resource_id} />
                    )*/}
                    <SubmitInteraction submit={props.submit} refetch={props.refetch}/>
                </>
            )}
        </ListGroup.Item>
    );
}