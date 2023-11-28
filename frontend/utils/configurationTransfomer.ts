export default function (configKey: string): string {
  const { envConfigPrefix } = useAppConfiguration()

  let envKey = envConfigPrefix

  // Counts successive characters of same case
  let k = 0

  for (let i = 0; i < configKey.length; ++i) {
    const ch = configKey.charAt(i)

    if (isLetter(ch)) {
      if (isLowerCase(ch)) {
        if (k > 0 && isUpperCase(configKey.charAt(i - 1))) {
          envKey += '_'
          k = 0
        }
        else {
          ++k
        }
      }
      else if (k > 0 && isLowerCase(configKey.charAt(i - 1))) {
        envKey += '_'
        k = 0
      }
      else {
        ++k
      }
      envKey += ch.toUpperCase()
    }
    else {
      envKey += '_'
      k = 0
    }
  }

  return envKey
}

function isLetter(str: string): boolean {
  return !!str.match(/[a-z0-9]/i)?.length
}

function isLowerCase(str: string): boolean {
  return str.toLocaleLowerCase() === str
}

function isUpperCase(str: string): boolean {
  return str.toUpperCase() === str
}
