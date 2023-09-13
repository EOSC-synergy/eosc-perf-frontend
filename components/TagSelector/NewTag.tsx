import { type FC, useState } from 'react';
import { useMutation } from 'react-query';
import { Button, Form, InputGroup } from 'react-bootstrap';
import useApi from 'lib/useApi';
import { type CreateTag } from '@eosc-perf/eosc-perf-client';
import useUser from 'lib/useUser';

type NewTagProps = { onSubmit: () => void };

/**
 * Form component to submit new tags
 *
 * @param props
 * @param props.onSubmit callback to be called when a new tag is submitted
 */
const NewTag: FC<NewTagProps> = ({ onSubmit }) => {
    const [customTagName, setCustomTagName] = useState('');
    const auth = useUser();
    const api = useApi(auth.token);

    const { mutate } = useMutation((data: CreateTag) => api.tags.createTag(data), {
        onSuccess: () => onSubmit(),
    });

    const addTag = () => {
        mutate({
            name: customTagName,
            description: '',
        });
    };

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
};

export default NewTag;
