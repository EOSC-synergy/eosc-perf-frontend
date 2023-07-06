import React, { FC, useContext, useState } from 'react';
import { Button, Dropdown, Modal, SplitButton } from 'react-bootstrap';
import { ResultCallbacks } from 'components/resultSearch/resultCallbacks';
import { UserContext } from 'components/userContext';
import { useMutation } from 'react-query';
import { Result } from '@eosc-perf/eosc-perf-client';
import useApi from 'utils/useApi';

type ResultDeleterProps = { result: Result; onDelete: () => void };
const ResultDeleter: FC<ResultDeleterProps> = ({ result, onDelete }) => {
    const auth = useContext(UserContext);
    const api = useApi(auth.token);

    const [showModal, setShowModal] = useState(false);

    const { mutate: deleteResult } = useMutation(() => api.results.deleteResult(result.id), {
        onSuccess: onDelete,
    });

    return (
        <>
            <Dropdown.Item as="button" onClick={() => setShowModal(true)}>
                Delete
            </Dropdown.Item>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* display JSON? */}
                    Are you sure you want to delete this result?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => {
                            deleteResult();
                            setShowModal(false);
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowModal(false);
                        }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

type ActionColumnProps = {
    result: Result;
    callbacks: ResultCallbacks;
};
/**
 * Column with buttons to interact with result
 * @param result
 * @param callbacks Callbacks for the operations
 */
const ActionColumn: FC<ActionColumnProps> = ({ result, callbacks }) => {
    // TODO: CSS: figure out why button group taller than it should be
    const auth = useContext(UserContext);

    return (
        <SplitButton
            variant="secondary"
            title="View"
            size="sm"
            onClick={() => callbacks.display(result)}
        >
            <Dropdown.Item
                as="button"
                onClick={() => {
                    if (auth.loggedIn) {
                        callbacks.report(result);
                    } else {
                        if (auth.login) {
                            auth.login();
                        }
                    }
                }}
            >
                Report {!auth.loggedIn && ' (login required)'}
            </Dropdown.Item>
            {auth.loggedIn && auth.admin && (
                <>
                    <ResultDeleter result={result} onDelete={callbacks.reload} />
                    <Dropdown.Item as="button" onClick={() => callbacks.edit(result)}>
                        Edit
                    </Dropdown.Item>
                </>
            )}
        </SplitButton>
    );
};

export default ActionColumn;
