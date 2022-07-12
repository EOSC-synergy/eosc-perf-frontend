# EOSC-Performance Frontend

[![Build Status](https://jenkins.eosc-synergy.eu/job/eosc-synergy-org/job/eosc-perf-frontend/job/main/badge/icon)](https://jenkins.eosc-synergy.eu/job/eosc-synergy-org/job/eosc-perf-frontend/job/main/)

## Intro

![](public/images/eosc-perf-logo.4.svg)

EOSC-Perf is a webapp made to host, search, compare and analyze benchmark results from many very diverse university
server clusters.

## Instructions

#### To run the frontend separately:

1. (optional) Set up a `.env.local` file, overriding any values from .env
   Available fields to overwrite: 
   ```
   NEXT_PUBLIC_OAUTH_AUTHORITY=<any url>
   NEXT_PUBLIC_OIDC_CLIENT_ID=<any oauth client id registered on the authority>
   NEXT_PUBLIC_API_ROUTE=development | production | <any url>
   NEXT_PUBLIC_OIDC_REDIRECT_HOST=<any url>
   ```
3. Install dependencies: `npm install`
4. 
- If deploying as production: `npm run build`, `npm run start`
- If developing: `npm run dev`

#### To run the whole EOSC Performance Platform

Please refer to the [central repository](https://github.com/EOSC-synergy/eosc-perf) for more information.
