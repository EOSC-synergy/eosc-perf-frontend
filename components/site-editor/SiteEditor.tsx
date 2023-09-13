import { useMutation } from 'react-query';
import { type FC, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Description, NetAddress, SiteId, SiteName } from './siteFields';
import FlavorList from './FlavorList';
import useApi from 'lib/useApi';
import { type Site } from '@eosc-perf/eosc-perf-client';
import useUser from 'lib/useUser';

type SiteEditorProps = { site: Site; refetch: () => void };

const SiteEditor: FC<SiteEditorProps> = (props: { site: Site; refetch: () => void }) => {
    const auth = useUser();
    const api = useApi(auth.token);

    const { mutate } = useMutation((data: Site) => api.sites.updateSite(props.site.id, data), {
        onSuccess: () => props.refetch(),
    });

    const [name, setName] = useState(props.site.name);
    const [description, setDescription] = useState(props.site.description ?? '');
    const [address, setAddress] = useState(props.site.address);

    return (
        <Form>
            <SiteId site={props.site} />
            <SiteName site={props.site} update={(newName: string) => setName(newName)} />
            <Description
                site={props.site}
                update={(newDescription: string) => setDescription(newDescription)}
            />
            <NetAddress site={props.site} update={(newAddress: string) => setAddress(newAddress)} />
            <Form.Group className="mb-3">
                <Button
                    variant="success"
                    onClick={() => {
                        mutate({
                            name,
                            description: description.length ? description : undefined,
                            address,
                            id: props.site.id,
                            upload_datetime: props.site.upload_datetime,
                        });
                    }}
                >
                    Submit
                </Button>
            </Form.Group>
            <FlavorList site={props.site} />
        </Form>
    );
};

export default SiteEditor;
