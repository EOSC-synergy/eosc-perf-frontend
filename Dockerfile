FROM node:18 as git-version

WORKDIR /app
COPY utils utils
COPY ["package.json", "yarn.lock", "next.config.js", "next-env.d.ts", "tsconfig.json", ".eslintrc.json", ".prettierrc", "./"]

# determine footer version
COPY .git/ ./.git/
RUN yarn git-info

FROM node:18 as base
# new base because we don't want .git

WORKDIR /app

COPY ["package.json", "yarn.lock", "next.config.js", "next-env.d.ts", "tsconfig.json", ".eslintrc.json", ".prettierrc", "./"]
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn install
# copy necessary files
COPY [".env", "./"]
COPY public public
COPY styles styles
COPY pages pages
COPY components components
COPY utils utils

COPY --from=git-version /app/utils/generatedGitInfo.json utils/generatedGitInfo.json

FROM base as production
ENV NODE_ENV=production

EXPOSE 3000
#RUN npm run build
# move build command into CMD to take into account run-time env vars for static pages
CMD ["/bin/sh", "-c", "yarn build && yarn start"]

FROM base as development
ENV NODE_ENV=development

EXPOSE 3000
CMD [ "yarn", "dev" ]
