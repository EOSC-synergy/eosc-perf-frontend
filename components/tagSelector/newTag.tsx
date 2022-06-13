import React, { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { useMutation } from 'react-query';
import { Button, Form, InputGroup } from 'react-bootstrap';
import useApi from '../../utils/useApi';
import { CreateTag } from '@eosc-perf/eosc-perf-client';

/**
 * Form component to submit new tags
 * @param props.onSubmit callback to be called when a new tag is submitted
 * @constructor
 */
export function NewTag(props: { onSubmit: () => void }) {
    const [customTagName, setCustomTagName] = useState('');
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const { mutate } = useMutation((data: CreateTag) => api.tags.createTag(data), {
        onSuccess: () => {
            props.onSubmit();
        },
    });

    function addTag() {
        mutate({
            name: customTagName,
            description: '',
        });
    }

    return (
        <Form.Group>
            <InputGroup>
                <Form.Control
                    id="custom-tag"
                    placeholder="tensor"
                    onChange={(e) => setCustomTagName(e.target.value)}
                />
                <Button
                    variant="success"
                    disabled={!auth.token || customTagName.length < 1}
                    onClick={addTag}
                    className="reset-z-index"
                >
                    Add Tag
                </Button>
            </InputGroup>
        </Form.Group>
    );
}
