import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { UserContext } from 'components/userContext';
import { JsonHighlight } from 'components/jsonHighlight';
import TagSelector from './tagSelector';
import { Result, Tag, TagsIds } from '@eosc-perf/eosc-perf-client';
import useApi from '../utils/useApi';

export function ResultEditModal({
    result,
    show,
    closeModal,
}: {
    result: Result;
    show: boolean;
    closeModal: () => void;
}) {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    useEffect(() => {
        setSelectedTags(result?.tags ?? []);
    }, [result]);

    const { mutate } = useMutation((data: TagsIds) => api.results.updateResult(result.id, data), {
        onSuccess: () => {
            closeModal();
        },
    });

    function submitEdit() {
        mutate({ tags_ids: selectedTags.map((tag) => tag.id) });
    }

    return (
        <Modal show={show} scrollable={true} size="lg" onHide={closeModal}>
            <Modal.Header>
                <Modal.Title>Edit result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Tags</h4>
                <TagSelector selected={selectedTags} setSelected={setSelectedTags} />
                {result !== null && (
                    <>
                        <h4>Data</h4>
                        <JsonHighlight>{JSON.stringify(result.json, null, 4)}</JsonHighlight>
                    </>
                )}
                {result == null && <div className="text-muted">Loading...</div>}
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
}
