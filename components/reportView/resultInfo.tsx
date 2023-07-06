import React, { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import { Button } from 'react-bootstrap';
import { JsonPreviewModal } from 'components/jsonPreviewModal';
import { benchmarkLinkDisplay, truthyOrNoneTag } from 'components/utility';
import useApi from '../../utils/useApi';

export function ResultInfo(props: { id: string }): ReactElement {
    const api = useApi();

    const result = useQuery(['result', props.id], () => api.results.getResult(props.id));

    const [showPreview, setShowPreview] = useState(false);

    return (
        <>
            {result.isLoading && <LoadingOverlay />}
            {result.isSuccess && result.data && (
                <>
                    Site: {result.data.data.site.name}
                    <br />
                    Benchmark: {benchmarkLinkDisplay(result.data.data.benchmark)}
                    <br />
                    Tags: {truthyOrNoneTag(result.data.data.tags.map((tag) => tag.name).join(', '))}
                    <br />
                    <Button onClick={() => setShowPreview(true)} size="sm" className="mb-1">
                        View JSON
                    </Button>
                    <br />
                    {showPreview && (
                        <JsonPreviewModal
                            result={result.data.data}
                            show={showPreview}
                            closeModal={() => setShowPreview(false)}
                        />
                    )}
                </>
            )}
        </>
    );
}
