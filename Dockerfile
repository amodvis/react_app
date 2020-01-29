FROM node:8.16.0-alpine AS builder

ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
ARG BUILD_ENV
ENV BUILD_ENV=${BUILD_ENV}

WORKDIR /srv
COPY . .

RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc \
   && npm install \
   && npm run build:${BUILD_ENV}

FROM nginx:alpine AS final-build

WORKDIR /srv

COPY --from=builder /srv/dist/. .
