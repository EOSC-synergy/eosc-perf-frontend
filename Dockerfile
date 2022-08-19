FROM node:17 as base

WORKDIR /app
COPY ["package.json", "package-lock.json*", "next.config.js", "next-env.d.ts", "tsconfig.json", ".eslintrc.json", ".prettierrc", "./"]
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --development
# copy necessary files. special case: .env.local is copied if exists; vk@220112
COPY [".env", ".env.loca[l]", "./"]
COPY public public
COPY styles styles
COPY pages pages
COPY components components
COPY utils utils
# needed for footer version
# TODO: better workaround?
COPY .git/ ./.git/

FROM base as production
ENV NODE_ENV=production

EXPOSE 3000
#RUN npm run build
# move build command into CMD to take into account run-time env vars for static pages
CMD ["/bin/sh", "-c", "npm run build && npm run start"]

FROM base as development
ENV NODE_ENV=development

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
