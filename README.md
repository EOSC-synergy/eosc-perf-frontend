# EOSC-Performance Frontend

[![Build Status](https://jenkins.eosc-synergy.eu/job/eosc-synergy-org/job/eosc-perf-frontend/job/master/badge/icon)](https://jenkins.eosc-synergy.eu/job/eosc-synergy-org/job/eosc-perf-frontend/job/master/)

## Intro

![](public/images/eosc-perf-logo.4.svg)

EOSC-Perf is a webapp made to host, search, compare and analyze benchmark results from many very diverse university
server clusters.

## Instructions

#### To run the frontend separately:

1. Set up a .npmrc file as follows:
```
registry=https://registry.npmjs.org/
@eosc-perf-automation:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<create a token at https://github.com/settings/tokens with read:packages>
```
2. (optional) Set up a `.env.local` file, overriding any values from .env
3. Install dependencies: `npm install`
4. 
- If deploying as production: Add `NEXT_PUBLIC_APP_ENV=production` to .env.local, `npm run build`, `npm run start`
- If developing: `npm run dev`

#### To run the whole EOSC Performance Platform

Please refer to the [central repository](https://github.com/EOSC-synergy/eosc-perf) for more information.
