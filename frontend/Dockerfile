FROM node:18.17.0-slim 

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

RUN pnpm install
RUN pnpm run build

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

CMD [ "node", ".output/server/index.mjs" ]