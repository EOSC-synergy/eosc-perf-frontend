import { type FC, type ReactNode, useState } from 'react';
import { useQuery } from 'react-query';
import { Card, Col, Form, Row } from 'react-bootstrap';
import PlaceholderTag from './PlaceholderTag';
import UnselectedTag from './UnselectedTag';
import SelectedTag from './SelectedTag';
import NewTag from './NewTag';
import { type Tag } from '@eosc-perf/eosc-perf-client';
import useApi from 'lib/useApi';
import { LoadingOverlay } from 'components/loadingOverlay';

type TagSelectorProps = {
    selected: Tag[];
    setSelected: (tags: Tag[]) => void;
    addTags?: boolean;
    label?: ReactNode;
};

const TagSelector: FC<TagSelectorProps> = ({
    selected,
    setSelected,
    addTags = false,
    label = 'Search',
}) => {
    const api = useApi();

    const [searchString, setSearchString] = useState<string>('');
    const tags = useQuery(
        ['tags', searchString],
        () => api.tags.searchTag(searchString.split(' ')),
        {
            keepPreviousData: true,
        }
    );

    const select = (newTag: Tag) => {
        if (selected.some((tag) => tag.id === newTag.id)) {
            return;
        }
        setSelected([...selected, newTag]);
    };

    const unselect = (oldTag: Tag) => {
        setSelected(selected.filter((tag) => tag.id !== oldTag.id));
    };

    return (
        <div className="d-inline-block">
            <Form.Group className="mb-1" as={Row}>
                <Form.Label column sm={3}>
                    {label}
                </Form.Label>
                <Col sm={9}>
                    <Form.Control
                        type="text"
                        placeholder="Keywords..."
                        onChange={(search) => setSearchString(search.target.value)}
                    />
                </Col>
            </Form.Group>
            <Card className="mb-1">
                <Card.Body>
                    <small className="text-muted">Selected</small>
                    <div className="d-flex">
                        {selected.map((tag) => (
                            <SelectedTag tag={tag} unselect={unselect} key={tag.id} />
                        ))}
                    </div>
                    {selected.length === 0 && (
                        <div className="text-muted" style={{ display: 'inline' }}>
                            No tags selected
                        </div>
                    )}
                    <hr />
                    <small className="text-muted">Available</small>
                    <div className="position-relative">
                        {tags.isFetching && tags.isPreviousData && tags.data && (
                            <div className="d-flex">
                                {tags.data.data.items
                                    .filter(
                                        (tag) =>
                                            !selected.some((otherTag) => otherTag.id === tag.id)
                                    )
                                    .map((tag) => (
                                        <PlaceholderTag key={tag.id} />
                                    ))}
                            </div>
                        )}
                        {(tags.isFetching || tags.isLoading || tags.isRefetching) &&
                            !tags.isPreviousData && <LoadingOverlay />}
                        {tags.isSuccess && !tags.isPreviousData && (
                            <>
                                <div className="d-flex">
                                    {tags.data.data.items
                                        .filter(
                                            (tag) =>
                                                !selected.some((otherTag) => otherTag.id === tag.id)
                                        )
                                        .map((tag) => (
                                            <UnselectedTag tag={tag} select={select} key={tag.id} />
                                        ))}
                                </div>
                                {tags.data.data.total === 0 && searchString.length > 0 && (
                                    <div className="text-muted" style={{ display: 'inline' }}>
                                        No tags match the keywords
                                    </div>
                                )}
                                {tags.data.data.total === 0 && searchString.length === 0 && (
                                    <div className="text-muted" style={{ display: 'inline' }}>
                                        No tags available
                                    </div>
                                )}
                                {tags.data.data.has_next && (
                                    <div className="text-muted">
                                        <small>More tags hidden, use search terms</small>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>
            {addTags && <NewTag onSubmit={() => tags.refetch().then(() => undefined)} />}
        </div>
    );
};

export default TagSelector;
