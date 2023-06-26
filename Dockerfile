FROM quay.io/centerforopenscience/ember-base

COPY ./package.json ./yarn.lock ./.yarnrc ./
RUN yarn --frozen-lockfile --ignore-engines

COPY ./ ./

ARG GIT_COMMIT=
ENV GIT_COMMIT ${GIT_COMMIT}

ARG APP_ENV=production
ENV APP_ENV ${APP_ENV}
ARG BACKEND=local
ENV BACKEND ${BACKEND}
RUN ./node_modules/.bin/ember build --env ${APP_ENV}

CMD ["yarn", "test"]
