import { type FC } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from 'public/images/eosc-perf-logo.4.svg';
import { useAuth } from 'react-oidc-context';
import { Wrench } from 'react-bootstrap-icons';
import Link from 'next/link';
import Image from 'next/image';
import useUser from 'lib/useUser';

/**
 * Navigation header rendered at the top of every page
 */
const NavHeader: FC = () => {
    const auth = useUser();
    const authentication = useAuth();

    return (
        <header>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Brand href="/" className="ms-4">
                    <Image src={logo} height={36} width={66} alt="EOSC-Performance" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
                <Navbar.Collapse id="basic-navbar-nav" className="mx-3">
                    <Nav className="me-auto ">
                        <Nav.Link as={Link} href="/search/result">
                            Search
                        </Nav.Link>
                        <NavDropdown title="Submit" id="base-submit-dropdown">
                            <NavDropdown.Item as={Link} href="/submit/result">
                                Results
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} href="/submit/benchmark">
                                Benchmarks
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} href="/submit/site">
                                Sites
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Instructions" id="base-instructions-dropdown">
                            <NavDropdown.Item as={Link} href="/code-guidelines">
                                Code guidelines
                            </NavDropdown.Item>
                            <NavDropdown.Item href="https://perf.readthedocs.io/">
                                Service Documentation
                            </NavDropdown.Item>
                            <NavDropdown.Item href="https://perf-api.readthedocs.io/">
                                API Documentation
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/api/v1/">API Reference</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link
                            as={Link}
                            href="https://appsgrycap.i3m.upv.es:31443/im-dashboard/login"
                        >
                            Infrastructure Manager
                        </Nav.Link>
                        {auth.admin && (
                            <NavDropdown title="Admin" id="base-admin-dropdown">
                                <NavDropdown.Item as={Link} href="/report-view">
                                    Report view
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} href="/site-editor">
                                    Site editor
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                    <Nav>
                        <NavDropdown
                            id="base-login-dropdown"
                            title={
                                <>
                                    {auth.loading
                                        ? 'Loading...'
                                        : auth.loggedIn && !auth.registered
                                        ? 'Not registered'
                                        : auth.email ?? 'Not logged in'}{' '}
                                    {auth.admin && (
                                        <div title="Administrator" style={{ display: 'inline' }}>
                                            <Wrench style={{ color: 'red' }} />
                                        </div>
                                    )}
                                </>
                            }
                            className="justify-content-end"
                        >
                            {!auth.loading && auth.loggedIn && (
                                <>
                                    <NavDropdown.Item onClick={() => authentication.removeUser()}>
                                        Logout
                                    </NavDropdown.Item>
                                    {!auth.registered && (
                                        <NavDropdown.Item href="/registration">
                                            Register
                                        </NavDropdown.Item>
                                    )}
                                </>
                            )}
                            {auth.loading && (
                                <NavDropdown.Item
                                    onClick={() => authentication.signinRedirect()}
                                    className="text-muted"
                                    disabled
                                >
                                    Loading...
                                </NavDropdown.Item>
                            )}

                            {!auth.loading && !auth.loggedIn && (
                                <NavDropdown.Item onClick={() => authentication.signinRedirect()}>
                                    Login
                                </NavDropdown.Item>
                            )}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
};

export default NavHeader;
