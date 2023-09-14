import axios, { type AxiosError } from 'axios';
import { type FC } from 'react';
import JsonHighlight from 'components/JsonHighlight';

type ErrorMessageProps = {
    error: Error | AxiosError | unknown;
};
const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            switch (error.response.status) {
                case 409:
                    return (
                        <>
                            An entry like this already exists! If you have submitted this before, it
                            may still be pending approval. If you do not get a response within due
                            time, feel free to contact us at our support email!
                        </>
                    );

                case 422:
                default:
                    return (
                        <>
                            Server could not process our submission:
                            <JsonHighlight>
                                {JSON.stringify(error.response.data, null, 4)}
                            </JsonHighlight>
                            Your input may be malformed or wrong, please verify if everything is
                            correct. If you believe this to be a bug, please submit an issue about
                            it on{' '}
                            <a href="https://github.com/EOSC-synergy/eosc-perf/issues">GitHub</a>!
                        </>
                    );
            }
        } else if (error.request) {
            return <>No response from the server</>;
        } else {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <>{error.message}</>;
        }
    }

    return (
        <>
            Unknown error, please check the console and report the issue at{' '}
            <a href="https://github.com/EOSC-synergy/eosc-perf/issues">GitHub</a>!
        </>
    );
};

export default ErrorMessage;
