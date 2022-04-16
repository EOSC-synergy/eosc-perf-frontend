import {Site} from "../../model";
import React, {ReactElement} from "react";
import {ListGroup} from "react-bootstrap";

export function SiteSelect(props: { site: Site; setActiveSite: (site: Site) => void }): ReactElement {
    return (
        <ListGroup.Item onClick={() => props.setActiveSite(props.site)} action>
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{props.site.name}</h5>
                <small>{props.site.id}</small>
            </div>
            <p className="mb-1">{props.site.description}</p>
            <small>{props.site.address}</small>
        </ListGroup.Item>
    );
}