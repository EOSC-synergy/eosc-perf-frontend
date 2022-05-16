import React, { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import { truthyOrNoneTag } from 'components/utility';
import useApi from '../../utils/useApi';

export function SiteInfo(props: { id: string }): ReactElement {
    const api = useApi();

    const site = useQuery(['site', props.id], () => api.sites.getSite(props.id), {
        refetchOnWindowFocus: false, // do not spam queries
    });

    return (
        <>
            {site.isLoading && <LoadingOverlay />}
            {site.isSuccess && site.data && (
                <>
                    Name: {site.data.data.name}
                    <br />
                    Address: {site.data.data.address}
                    <br />
                    Description: {truthyOrNoneTag(site.data.data.description)}
                    <br />
                    Submitted on: {new Date(site.data.data.upload_datetime).toLocaleString()}
                </>
            )}
        </>
    );
}
