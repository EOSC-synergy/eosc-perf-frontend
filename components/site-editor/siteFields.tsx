import { Form } from 'react-bootstrap';
import { type FC, useState } from 'react';
import { type Site } from '@eosc-perf/eosc-perf-client';

type SiteIdProps = { site: Site };
export const SiteId: FC<SiteIdProps> = ({ site }) => (
    <Form.Group className="mb-3">
        <Form.Label>Identifier:</Form.Label>
        <Form.Control type="text" value={site.id} readOnly />
    </Form.Group>
);

type SiteNameProps = { site: Site; update: (newName: string) => void };
export const SiteName: FC<SiteNameProps> = ({ site, update }) => {
    const [name, setName] = useState(site.name);

    return (
        <Form.Group className="mb-3">
            <Form.Label>Name:</Form.Label>
            <Form.Control
                onChange={(e) => {
                    setName(e.target.value);
                    update(e.target.value);
                }}
                value={name}
                readOnly={false}
            />
        </Form.Group>
    );
};

type DescriptionProps = {
    site: Site;
    update: (description: string) => void;
};
export const Description: FC<DescriptionProps> = ({ site, update }) => {
    const [description, setDescription] = useState(site.description ?? '');

    return (
        <Form.Group className="mb-3">
            <Form.Label>Description:</Form.Label>
            <Form.Control
                as="textarea"
                onChange={(e) => {
                    setDescription(e.target.value);
                    update(e.target.value);
                }}
                value={description}
            />
        </Form.Group>
    );
};

type NetAddressProps = { site: Site; update: (address: string) => void };
export const NetAddress: FC<NetAddressProps> = ({ site, update }) => {
    const [address, setAddress] = useState(site.address);

    return (
        <Form.Group className="mb-3">
            <Form.Label>Network address:</Form.Label>
            <Form.Control
                onChange={(e) => {
                    setAddress(e.target.value);
                    update(e.target.value);
                }}
                value={address}
            />
        </Form.Group>
    );
};
