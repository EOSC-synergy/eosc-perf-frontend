import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FlavorSubmissionModal } from 'components/submissionModals/flavorSubmissionModal';
import { Site } from '@eosc-perf-automation/eosc-perf-client';

export function NewFlavor(props: { site: Site }) {
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <>
            <Button variant="success" onClick={() => setShowSubmitModal(true)}>
                New
            </Button>
            <FlavorSubmissionModal
                show={showSubmitModal}
                onHide={() => setShowSubmitModal(false)}
                site={props.site}
            />
        </>
    );
}
