import { type FC } from 'react';
import { ListGroup } from 'react-bootstrap';
import { type Site } from '@eosc-perf/eosc-perf-client';

type SiteSelectProps = {
    site: Site;
    setActiveSite: (site: Site) => void;
};
const SiteSelect: FC<SiteSelectProps> = ({ site, setActiveSite }) => (
    <ListGroup.Item onClick={() => setActiveSite(site)} action>
        <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{site.name}</h5>
            <small>{site.id}</small>
        </div>
        <p className="mb-1">{site.description}</p>
        <small>{site.address}</small>
    </ListGroup.Item>
);

export default SiteSelect;
