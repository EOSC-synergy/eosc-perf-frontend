import { type FC, type PropsWithChildren, useEffect } from 'react';

import prism from 'prismjs';
import 'prismjs/components/prism-json';

/**
 * Display JSON text with syntax highlighting
 *
 * @param props
 * @param props.children
 */
const JsonHighlight: FC<PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        prism.highlightAll();
    }, []);

    return (
        <pre>
            <code className="language-json">{children}</code>
        </pre>
    );
};

export default JsonHighlight;
