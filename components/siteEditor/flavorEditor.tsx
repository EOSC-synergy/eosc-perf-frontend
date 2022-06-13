import React, { ReactElement, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { Check, PencilSquare } from 'react-bootstrap-icons';
import { UserContext } from 'components/userContext';
import useApi from '../../utils/useApi';
import { Flavor } from '@eosc-perf/eosc-perf-client';

export function FlavorEditor(props: { flavor: Flavor; refetch: () => void }): ReactElement {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const [name, setName] = useState<string>(props.flavor.name);
    const [desc, setDesc] = useState<string>(
        props.flavor.description ? props.flavor.description : ''
    );

    const [editing, setEditing] = useState(false);

    function updateEditing(editing: boolean) {
        if (editing) {
            setName(props.flavor.name);
            setDesc(props.flavor.description ? props.flavor.description : '');
        }
        setEditing(editing);
    }

    const { mutate } = useMutation(
        (data: Flavor) => api.flavors.updateFlavor(props.flavor.id, data),
        {
            onSuccess: () => {
                setEditing(false);
                props.refetch();
            },
        }
    );

    return (
        <ListGroup.Item key={props.flavor.id} id={props.flavor.id}>
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
                            id: props.flavor.id,
                            upload_datetime: props.flavor.upload_datetime,
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
}
