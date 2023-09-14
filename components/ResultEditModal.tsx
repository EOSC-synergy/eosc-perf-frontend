import { type FC, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useMutation } from 'react-query';
import JsonHighlight from 'components/JsonHighlight';
import TagSelector from './TagSelector';
import { type Result, type Tag, type TagsIds } from '@eosc-perf/eosc-perf-client';
import useApi from 'lib/useApi';
import useUser from 'lib/useUser';

type ResultEditModalProps = {
    result: Result;
    show: boolean;
    closeModal: () => void;
};

const ResultEditModal: FC<ResultEditModalProps> = ({ result, show, closeModal }) => {
    const auth = useUser();
    const api = useApi(auth.token);

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    useEffect(() => {
        setSelectedTags(result.tags);
    }, [result]);

    const { mutate } = useMutation((data: TagsIds) => api.results.updateResult(result.id, data), {
        onSuccess: () => {
            closeModal();
        },
    });

    const submitEdit = () => {
        mutate({ tags_ids: selectedTags.map((tag) => tag.id) });
    };

    // TODO: this is checking for result = null: why?

    return (
        <Modal show={show} scrollable size="lg" onHide={closeModal}>
            <Modal.Header>
                <Modal.Title>Edit result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Tags</h4>
                <TagSelector selected={selectedTags} setSelected={setSelectedTags} />
                <h4>Data</h4>
                <JsonHighlight>{JSON.stringify(result.json, null, 4)}</JsonHighlight>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={submitEdit}>
                    Edit
                </Button>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ResultEditModal;
