# Contributing

Contributions are welcome, and they are greatly appreciated!
When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.


## Reporting bugs
Report bugs at https://github.com/EOSC-synergy/eosc-perf-frontend/issues

If you are reporting a bug, please include:

* Your operating system name and version.
* Any details about your local setup that might be helpful in troubleshooting.
* If you can, provide detailed steps to reproduce the bug.
* If you don't have steps to reproduce the bug, just note your observations in
  as much detail as you can. Questions to start a discussion about the issue
  are welcome.

### Submit Feedback
The best way to send feedback is to file an issue at the follwing URL:

https://github.com/EOSC-synergy/eosc-perf-frontend/issues

If you are proposing a feature:

* Explain in detail how it would work.
* Keep the scope as narrow as possible, to make it easier to implement.
* Remember that this is a volunteer-driven project, and that contributions
  are welcome :)

## Pull Request Process

You are welcome to open Pull Requests for either fixing a bug, adding a new feature, contributing to the documentation, etc.

1. Fork the repository and create a new branch from `main`.
2. If you’ve fixed a bug or added code that should be tested, add tests!
3. Document your code using [jsdoc](https://jsdoc.app/index.html).
4. Ensure the test suite passes: `yarn test`.
5. Make sure your code lints (for example via `yarn lint`).
6. Ensure your code is formatted using [prettier](https://prettier.io/).
7. Update the README.md with details of changes, e.g. new environment variables, exposed ports, container parameters etc.
8. Name your commits using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
9. Push the changes to your fork.
10. Create a Pull Request to this repository.
11. Review and address comments on your pull request.


## Coding Standards
* [prettier](https://prettier.io/) is used for formatting
* [yarn](https://yarnpkg.com/) is our package manager
* The app is built on [next.js](https://nextjs.org/)
* Tests are run using [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
* [axios](https://axios-http.com/docs/intro) and [react-query](https://react-query-v3.tanstack.com/) used for API communication
* The UI is built on [bootstrap](https://getbootstrap.com/) and [react-bootstrap](https://react-bootstrap.github.io/)
* Comparison diagrams are generated using [Apache ECharts](https://echarts.apache.org/en/index.html) and [Chart.js](https://www.chartjs.org/)
* [oidc-client-ts](https://github.com/authts/oidc-client-ts) is used for authentication
