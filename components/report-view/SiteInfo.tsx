import { type FC } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import { truthyOrNoneTag } from 'components/utility';
import useApi from 'lib/useApi';

type SiteInfoProps = { id: string };
const SiteInfo: FC<SiteInfoProps> = ({ id }) => {
    const api = useApi();

    const site = useQuery(['site', id], () => api.sites.getSite(id));

    return (
        <>
            <LoadingOverlay loading={site.isLoading} />
            {site.isSuccess && (
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
};

export default SiteInfo;
