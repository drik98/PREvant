import { Service } from '~/generated/types/prevant'

const order = {
  [Service.type.INSTANCE]: 0,
  [Service.type.REPLICA]: 1,
  [Service.type.SERVICE_COMPANION]: 2,
  [Service.type.APP_COMPANION]: 3,
}

export default function (services: Service[]): Service[] {
  return [...services].sort((service1, service2) => order[service1.type] - order[service2.type])
}
