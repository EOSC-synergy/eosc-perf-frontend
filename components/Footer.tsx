import { type FC } from 'react';
import Link from 'next/link';
import generatedGitInfo from 'lib/generatedGitInfo.json';

/**
 * Static footer component rendered at the bottom of every page
 */
const Footer: FC = () => (
    <footer className="footer mt-auto py-3 bg-light">
        <div className="text-center">
            <ul className="list-unstyled list-inline my-0">
                <li className="list-inline-item mx-5">
                    <Link href="/terms-of-service" className="text-muted">
                        Terms of service
                    </Link>
                </li>
                <li className="list-inline-item mx-5">
                    <Link href="/privacy-policy" className="text-muted">
                        Privacy policy
                    </Link>
                </li>
                <li className="list-inline-item mx-5">
                    <a href="mailto:perf-support@lists.kit.edu" className="text-muted">
                        Email Support
                    </a>
                </li>
            </ul>
            <ul className="list-unstyled list-inline my-0">
                <li className="list-inline-item mx-5 text-muted">
                    <small>{generatedGitInfo.gitTag}</small>
                </li>
            </ul>
        </div>
    </footer>
);

export default Footer;
