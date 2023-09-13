import { type FC, useState } from 'react';
import { Button } from 'react-bootstrap';
import FlavorSubmissionModal from 'components/submissionModals/FlavorSubmissionModal';
import { type Site } from '@eosc-perf/eosc-perf-client';

type NewFlavorProps = { site: Site };
const NewFlavor: FC<NewFlavorProps> = ({ site }) => {
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <>
            <Button variant="success" onClick={() => setShowSubmitModal(true)}>
                New
            </Button>
            <FlavorSubmissionModal
                show={showSubmitModal}
                onHide={() => setShowSubmitModal(false)}
                site={site}
            />
        </>
    );
};

export default NewFlavor;
