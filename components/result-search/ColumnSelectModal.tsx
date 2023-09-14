import { type FC, useState } from 'react';
import { Button, CloseButton, Col, ListGroup, Modal, Row } from 'react-bootstrap';
import InputWithSuggestions from 'components/InputWithSuggestions';
import { type Suggestion } from './jsonSchema';

type ColumnSelectModalProps = {
    show: boolean;
    closeModal: () => void;
    columns: string[];
    setColumns: (columns: string[]) => void;
    suggestions?: Suggestion[];
};

const ColumnSelectModal: FC<ColumnSelectModalProps> = ({
    show,
    closeModal,
    columns,
    setColumns,
    suggestions,
}) => {
    const [newColumn, setNewColumn] = useState('');
    const [activeColumns, setActiveColumns] = useState(columns);

    const addColumn = () => {
        if (newColumn.length > 0) {
            setActiveColumns([...activeColumns, newColumn]);
        }
    };

    const removeColumn = (column: string) => {
        setActiveColumns(activeColumns.filter((c) => c !== column));
    };

    return (
        <Modal show={show} onHide={closeModal} centered>
            <Modal.Header>
                <Modal.Title>Choose columns to display{/*(drag &amp; drop)*/}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        Displayed columns:
                        <ListGroup>
                            {/* TODO: draggable/sortable */}
                            {activeColumns.length === 0 && (
                                <ListGroup.Item>
                                    <div className="text-muted">No columns</div>
                                </ListGroup.Item>
                            )}
                            {activeColumns.map((column) => (
                                <ListGroup.Item key={column}>
                                    <Row>
                                        <Col>{column}</Col>
                                        <Col md="auto">
                                            <CloseButton onClick={() => removeColumn(column)} />
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col>
                        Add column
                        <InputWithSuggestions
                            setInput={(input) => setNewColumn(input)}
                            placeholder="JSON.path.to"
                            suggestions={suggestions}
                        >
                            <Button variant="outline-success" onClick={addColumn}>
                                +
                            </Button>
                        </InputWithSuggestions>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    data-dismiss="modal"
                    onClick={() => {
                        closeModal();
                        setColumns(activeColumns);
                        setNewColumn('');
                    }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ColumnSelectModal;
