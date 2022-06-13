# EOSC-Performance Frontend

[![Build Status](https://jenkins.eosc-synergy.eu/job/eosc-synergy-org/job/eosc-perf-frontend/job/main/badge/icon)](https://jenkins.eosc-synergy.eu/job/eosc-synergy-org/job/eosc-perf-frontend/job/main/)

## Intro

![](public/images/eosc-perf-logo.4.svg)

EOSC-Perf is a webapp made to host, search, compare and analyze benchmark results from many very diverse university
server clusters.

## Instructions

#### To run the frontend separately:

1. (optional) Set up a `.env.local` file, overriding any values from .env
2. Install dependencies: `npm install`
3. 
- If deploying as production: Add `NEXT_PUBLIC_APP_ENV=production` to .env.local, `npm run build`, `npm run start`
- If developing: `npm run dev`

#### To run the whole EOSC Performance Platform

Please refer to the [central repository](https://github.com/EOSC-synergy/eosc-perf) for more information.
