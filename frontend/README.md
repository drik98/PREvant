# PREvant Payload Producer

P³ is a highly specialized tool which can be used to produce payload for
[PREvant](https://github.com/aixigo/PREvant)s POST requests

## Requirements

* Node >= v18.17.0 (see [.nvmrc](./.nvmrc))
* pnpm >= 8.1.0

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

This is also necessary because in the postinstall step types will be auto generated from the PREvant openAPI
specs. Moreover the corresponding json schema is also generated from the generated types and will be used to
validate the imported payloads.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

## Production

Build a static site which can be deployed for example with any static hosting:

```bash
pnpm run generate
```

Build a ready to run node server:

```bash
pnpm run build
```

## Configuration

It is possible to configure the app by providing some environment variables during the build:

| Environment Variable              | Description                                                                                                                                                                                                                                                                                                                                                                 | Default Value                                                            |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| NUXT_PUBLIC_DOCKER_IMAGE_BY_SERVICE_NAME | Defines a lookup map for services that will be often deployed. It expects a comma-separated list of colon-separated key value pairs of the service name and the image (without the tag).  The service names will be used as suggestions when entering a service name and when such a service is entered the corresponding docker image will also be automatically selected. | `kafka:docker.io/confluentinc/cp-kafka,prevant:docker.io/aixigo/prevant` |
| NUXT_PUBLIC_ENABLE_CONFIG_TO_ENV         | The application offers the possibility to optionally enter a configuration key (e.g. `javax.persistence.jdbc.user`) and it will automatically try to turn it into an environment variable key (e.g. `JAVAX_PERSISTENCE_JDBC_USER`).  See also `NUXT_PUBLIC_ENV_CONFIG_PREFIX`.                                                                                                      | `false`                                                                  |
| NUXT_PUBLIC_ENV_CONFIG_PREFIX            | As some tools like nuxt expect environment variables to be prefixed you can further use this env variable to add a prefix to the automagically determined  environment variable key (see `NUXT_PUBLIC_ENABLE_CONFIG_TO_ENV`).                                                                                                                                                      | `NUXT_`                                                                  |

As you probably noticed each variable has to be prefixed with `NUXT_PUBLIC_`. See [nuxt docs](https://nuxt.com/docs/api/composables/use-runtime-config).

## Docker

In addition to using static side generation it is also possible to deploy this app via docker. The docker
image can be build using the provided [Dockerfile](./Dockerfile) by running the command

```bash
docker build -t prevant-payload-producer .
```

Using the following docker-compose file and the command `docker compose up -d` you can start the application
and it will be available at [localhost:3000](http://localhost:3000). You can make use of the environment
variables described in [Configuration](#configuration) to customize your app.

```yaml
# docker-compose.yml

services:
  prevant-payload-producer:
    image: hendriksmtz/prevant-payload-producer:latest
    ports:
      - 3000:3000 
    environment:
      - "NUXT_PUBLIC_ENABLE_CONFIG_TO_ENV=true"
```
