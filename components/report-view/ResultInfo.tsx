import { type FC, useState } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import { Button } from 'react-bootstrap';
import JsonPreviewModal from 'components/JsonPreviewModal';
import { benchmarkLinkDisplay, truthyOrNoneTag } from 'components/utility';
import useApi from 'lib/useApi';

type ResultInfoProps = { id: string };
const ResultInfo: FC<ResultInfoProps> = ({ id }) => {
    const api = useApi();

    const result = useQuery(['result', id], () => api.results.getResult(id));

    const [showPreview, setShowPreview] = useState(false);

    return (
        <>
            {result.isLoading && <LoadingOverlay />}
            {result.isSuccess && (
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
};

export default ResultInfo;
