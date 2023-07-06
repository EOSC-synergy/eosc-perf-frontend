import React, { ReactElement, useState } from 'react';
import { FlavorSubmissionModal } from 'components/submissionModals/flavorSubmissionModal';
import { SearchingSelector } from './index';
import { truthyOrNoneTag } from '../utility';
import { Flavor, Site } from '@eosc-perf/eosc-perf-client';
import useApi from '../../utils/useApi';
import { Col, Row } from 'react-bootstrap';

type FlavorSearchSelectProps = {
    flavor?: Flavor;
    site?: Site;
    setFlavor: (flavor?: Flavor) => void;
};

export const FlavorSearchSelect: React.FC<FlavorSearchSelectProps> = (props): ReactElement => {
    const api = useApi();

    function display(flavor?: Flavor) {
        return (
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
    }

    function displayRow(flavor: Flavor) {
        return (
            <>
                {flavor.name}
                <div>
                    {flavor.description}
                    <br />
                </div>
            </>
        );
    }

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    return (
        <>
            <SearchingSelector<Flavor>
                queryKeyPrefix={'flavor-for-' + props.site?.id}
                tableName="Flavor"
                queryCallback={(terms) => {
                    if (props.site?.id) {
                        return api.sites.searchFlavor(props.site?.id, terms);
                    }
                    return undefined;
                }}
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
