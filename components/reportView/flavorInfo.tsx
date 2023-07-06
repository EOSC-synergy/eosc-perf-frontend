import React, { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import { SiteInfo } from 'components/reportView/siteInfo';
import { truthyOrNoneTag } from 'components/utility';
import useApi from '../../utils/useApi';

export function FlavorInfo(props: { id: string }): ReactElement {
    const api = useApi();

    const flavor = useQuery(['flavor', props.id], () => api.flavors.getFlavor(props.id));

    const site = useQuery(['site-for', props.id], () => api.flavors.getFlavorSite(props.id), {
        enabled: flavor.isSuccess,
    });

    return (
        <>
            {flavor.isLoading && <LoadingOverlay />}
            {flavor.isSuccess && flavor.data && (
                <>
                    Name: {flavor.data.data.name}
                    <br />
                    Description: {truthyOrNoneTag(flavor.data.data.description)}
                    <br />
                    Submitted on: {new Date(flavor.data.data.upload_datetime).toLocaleString()}
                    <hr />
                    Site:
                    <br />
                    {site.isSuccess && site.data && <SiteInfo id={site.data.data.id} />}
                </>
            )}
        </>
    );
}
