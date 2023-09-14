import { type FC, useState } from 'react';
import { useMutation } from 'react-query';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { Check, PencilSquare } from 'react-bootstrap-icons';
import useApi from 'lib/useApi';
import { type Flavor } from '@eosc-perf/eosc-perf-client';
import useUser from 'lib/useUser';

type FlavorEditorProps = { flavor: Flavor; refetch: () => void };

const FlavorEditor: FC<FlavorEditorProps> = ({ flavor, refetch }) => {
    const auth = useUser();
    const api = useApi(auth.token);

    const [name, setName] = useState<string>(flavor.name);
    const [desc, setDesc] = useState<string>(flavor.description ? flavor.description : '');

    const [editing, setEditing] = useState(false);

    const updateEditing = (newEditing: boolean) => {
        if (newEditing) {
            setName(flavor.name);
            setDesc(flavor.description ? flavor.description : '');
        }
        setEditing(newEditing);
    };

    const { mutate } = useMutation((data: Flavor) => api.flavors.updateFlavor(flavor.id, data), {
        onSuccess: () => {
            setEditing(false);
            refetch();
        },
    });

    return (
        <ListGroup.Item key={flavor.id} id={flavor.id}>
            <InputGroup>
                <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly={!editing}
                />
                <Button
                    onClick={() => {
                        mutate({
                            name,
                            description: desc.length ? desc : undefined,
                            id: flavor.id,
                            upload_datetime: flavor.upload_datetime,
                        });
                    }}
                    disabled={!editing}
                >
                    <Check />
                </Button>
                <Button onClick={() => updateEditing(!editing)}>
                    <PencilSquare />
                </Button>
            </InputGroup>
            <Form.Control
                as="textarea"
                onChange={(e) => setDesc(e.target.value)}
                readOnly={!editing}
                value={desc}
            />
        </ListGroup.Item>
    );
};

export default FlavorEditor;
