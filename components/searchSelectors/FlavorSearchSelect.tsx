import { type FC, type ReactElement, useState } from 'react';
import FlavorSubmissionModal from 'components/submissionModals/FlavorSubmissionModal';
import { SearchingSelector } from './index';
import { truthyOrNoneTag } from 'components/utility';
import { type Flavor, type Site } from '@eosc-perf/eosc-perf-client';
import useApi from 'lib/useApi';
import { Col, Row } from 'react-bootstrap';

type FlavorSearchSelectProps = {
    flavor?: Flavor;
    site?: Site;
    setFlavor: (flavor?: Flavor) => void;
};

const FlavorSearchSelect: FC<FlavorSearchSelectProps> = (props): ReactElement => {
    const api = useApi();

    const display = (flavor?: Flavor) => (
        <Row>
            <Col xs="auto">Flavor: {truthyOrNoneTag(flavor?.name, 'None')}</Col>
            {props.site === undefined && (
                <>
                    <Col />
                    <Col xs="auto">
                        <span className="text-muted">Select a site first.</span>
                    </Col>
                </>
            )}
        </Row>
    );

    const displayRow = (flavor: Flavor) => (
        <>
            {flavor.name}
            <p>{flavor.description}</p>
        </>
    );

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <>
            <SearchingSelector<Flavor>
                queryKeyPrefix={`flavor-for-${props.site?.id}`}
                tableName="Flavor"
                queryCallback={(terms) =>
                    props.site?.id ? api.sites.searchFlavor(props.site.id, terms) : undefined
                }
                item={props.flavor}
                setItem={props.setFlavor}
                display={display}
                displayRow={displayRow}
                submitNew={() => setShowSubmitModal(true)}
                disabled={props.site === undefined}
            />
            {props.site !== undefined && (
                <FlavorSubmissionModal
                    show={showSubmitModal}
                    onHide={() => setShowSubmitModal(false)}
                    site={props.site}
                />
            )}
        </>
    );
};

export default FlavorSearchSelect;
