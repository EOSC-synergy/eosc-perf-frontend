import React, { ReactElement, useState } from 'react';
import { FlavorSubmissionModal } from 'components/submissionModals/flavorSubmissionModal';
import { SearchingSelector } from './index';
import { useQuery } from 'react-query';
import { truthyOrNoneTag } from '../utility';
import { Flavor, Site } from '@eosc-perf/eosc-perf-client';
import useApi from '../../utils/useApi';

type FlavorSearchSelectProps = {
    flavor?: Flavor;
    initialFlavorId?: string;
    site?: Site;
    initFlavor?: (flavor?: Flavor) => void;
    setFlavor: (flavor?: Flavor) => void;
};

export const FlavorSearchSelect: React.FC<FlavorSearchSelectProps> = (props): ReactElement => {
    const api = useApi();

    useQuery(
        ['initial-flavor', props.initialFlavorId],
        () => {
            if (props.initialFlavorId) {
                return api.flavors.getFlavor(props.initialFlavorId);
            }
            throw 'tried to get flavor without id';
        },
        {
            enabled: props.initialFlavorId !== undefined,
            refetchOnWindowFocus: false, // do not spam queries
            onSuccess: (data) => {
                if (props.initFlavor) {
                    props.initFlavor(data.data);
                } else {
                    props.setFlavor(data.data);
                }
            },
        }
    );

    function display(flavor?: Flavor) {
        return (
            <>
                Flavor:{' '}
                {truthyOrNoneTag(
                    flavor?.name,
                    props.site === undefined ? 'Select a site first!' : 'None'
                )}
            </>
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
