export default function () {
  const runtimeConfig = useRuntimeConfig()

  return {
    ...runtimeConfig.public,
    dockerImageByServiceName: parseDockerImageByServiceName(runtimeConfig.public.dockerImageByServiceName),
    enableConfigToEnv: String(runtimeConfig.public.enableConfigToEnv) === 'true',
  }
}

function parseDockerImageByServiceName(dockerImageByServiceNameEnv: string): Record<string, string> {
  const dockerImageByServiceName: Record<string, string> = {}

  if (!dockerImageByServiceNameEnv.trim().length)
    return dockerImageByServiceName

  dockerImageByServiceNameEnv
    .split(',')
    .forEach((serviceNameDockerImagePair) => {
      const [serviceName, dockerImage] = serviceNameDockerImagePair
        .split(':')
        .map(elements => elements.trim())

      dockerImageByServiceName[serviceName] = dockerImage ?? serviceName
      return dockerImageByServiceName
    },
    )

  return dockerImageByServiceName
}
