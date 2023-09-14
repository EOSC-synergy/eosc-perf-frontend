import { type FC } from 'react';
import { useQuery } from 'react-query';
import { LoadingOverlay } from 'components/loadingOverlay';
import SiteInfo from 'components/report-view/SiteInfo';
import { truthyOrNoneTag } from 'components/utility';
import useApi from 'lib/useApi';

type FlavorInfoProps = {
    id: string;
};
const FlavorInfo: FC<FlavorInfoProps> = ({ id }) => {
    const api = useApi();

    const flavor = useQuery(['flavor', id], () => api.flavors.getFlavor(id));

    const site = useQuery(['site-for', id], () => api.flavors.getFlavorSite(id), {
        enabled: flavor.isSuccess,
    });

    return (
        <>
            {flavor.isLoading && <LoadingOverlay />}
            {flavor.isSuccess && (
                <>
                    Name: {flavor.data.data.name}
                    <br />
                    Description: {truthyOrNoneTag(flavor.data.data.description)}
                    <br />
                    Submitted on: {new Date(flavor.data.data.upload_datetime).toLocaleString()}
                    <hr />
                    Site:
                    <br />
                    {site.isSuccess && <SiteInfo id={site.data.data.id} />}
                </>
            )}
        </>
    );
};

export default FlavorInfo;
