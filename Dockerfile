FROM node:18 as git-version

WORKDIR /app
COPY lib lib
COPY ["package.json", "yarn.lock", "next.config.mjs", "next-env.d.ts", "tsconfig.json", ".eslintrc.json", ".prettierrc", "./"]

# determine footer version
COPY .git/ ./.git/
RUN yarn git-info

FROM node:18 as base
# new base because we don't want .git

WORKDIR /app

COPY ["package.json", "yarn.lock", "next.config.mjs", "next-env.d.ts", "tsconfig.json", ".eslintrc.json", ".prettierrc", "./"]
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn install
# copy necessary files
COPY [".env", "./"]
COPY public public
COPY styles styles
COPY pages pages
COPY components components
COPY lib lib

COPY --from=git-version /app/lib/generatedGitInfo.json lib/generatedGitInfo.json

# regular public image that allows changing env variables at run-time
FROM base as production
ENV NODE_ENV=production

EXPOSE 3000
#RUN npm run build
# move build command into CMD to take into account run-time env vars for static pages
CMD ["/bin/sh", "-c", "yarn build && yarn start"]

# internal image with fixed env, allowing for smaller builds
FROM base as production-static-build
ARG OIDC_CLIENT_ID=eosc-performance
ARG DOMAIN=performance.services.fedcloud.eu
ARG API_ROUTE=/api/v1
ARG OAUTH_AUTHORITY=https://aai.egi.eu/auth/realms/egi
ENV NEXT_PUBLIC_OIDC_CLIENT_ID=${OIDC_CLIENT_ID}
ENV NEXT_PUBLIC_OIDC_REDIRECT_HOST=https://${DOMAIN}
ENV NEXT_PUBLIC_API_ROUTE=https://${DOMAIN}${API_ROUTE}
ENV NEXT_PUBLIC_OAUTH_AUTHORITY=${OAUTH_AUTHORITY}

RUN yarn build

FROM node:18-alpine as production-static
ENV NODE_ENV=production

WORKDIR /app
COPY --from=production-static-build /app/package.json .
COPY --from=production-static-build /app/yarn.lock .
COPY --from=production-static-build /app/next.config.js .
COPY --from=production-static-build /app/public ./public
COPY --from=production-static-build /app/.next/static ./.next/static
COPY --from=production-static-build /app/.next/standalone ./

EXPOSE 3000
CMD ["node", "server.js"]

# development environment, should you want to run the app in docker, though requires mounting the source code for updates
FROM base as development
ENV NODE_ENV=development

EXPOSE 3000
CMD [ "yarn", "dev" ]
