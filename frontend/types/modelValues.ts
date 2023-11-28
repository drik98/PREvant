import { v4 as uuidv4 } from 'uuid'
import type { EnvironmentConfiguration, ServiceConfiguration } from '../generated/types/prevant'

export interface EnvModel {
  id: string
  envKey: string
  envValue: string
  replicate: boolean
  templated: boolean
  configKey?: string | null
}

export interface ServiceConfigModel {
  id: string
  serviceName: string
  image: string
  env: EnvModel[]
  files?: unknown
}

export function fromPrevantServiceConfigs(prevantServiceConfigs: ServiceConfiguration[]): ServiceConfigModel[] {
  return prevantServiceConfigs.map(fromPrevantServiceConfig)
}

export function fromPrevantServiceConfig(prevantServiceConfig: ServiceConfiguration): ServiceConfigModel {
  return {
    id: uuidv4(),
    serviceName: prevantServiceConfig.serviceName,
    image: prevantServiceConfig.image ?? '',
    env: fromPrevantEnv(prevantServiceConfig.env),
    files: prevantServiceConfig.files ?? prevantServiceConfig.volumes,
  }
}

export function fromPrevantEnv(env?: EnvironmentConfiguration): EnvModel[] {
  if (!env)
    return []

  if (Array.isArray(env)) {
    return env.map((keyValuePair) => {
      const [envKey, envValue = ''] = keyValuePair.split('=').map(value => value.trim())
      return {
        id: uuidv4(),
        envKey,
        envValue,
        replicate: false,
        templated: false,
      }
    })
  }

  return Object.entries(env).map(([envKey, value]) => {
    if (typeof value === 'string') {
      return {
        id: uuidv4(),
        envKey,
        envValue: value,
        replicate: false,
        templated: false,
      }
    }
    return {
      id: uuidv4(),
      envKey,
      envValue: value.value,
      replicate: value.replicate ?? false,
      templated: value.templated ?? false,
    }
  })
}

export function toPrevantServiceConfigs(serviceConfigModels: ServiceConfigModel[]): ServiceConfiguration[] {
  return serviceConfigModels.map(toPrevantServiceConfig)
}

export function toPrevantServiceConfig({ serviceName, image, env, files }: ServiceConfigModel): ServiceConfiguration {
  const serviceConfiguration: ServiceConfiguration = { serviceName }

  if (image.trim().length > 0)
    serviceConfiguration.image = image

  if (env.length > 0)
    serviceConfiguration.env = toPrevantEnv(env)

  if (files != null)
    serviceConfiguration.files = files

  return serviceConfiguration
}

export function toPrevantEnv(envModels: EnvModel[]): EnvironmentConfiguration {
  const env: EnvironmentConfiguration = {}

  for (const envModel of envModels) {
    if (!envModel.envKey.trim().length)
      continue

    env[envModel.envKey] = {
      value: envModel.envValue,
      replicate: envModel.replicate,
      templated: envModel.templated,
    }
  }

  return env
}
