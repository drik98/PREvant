import { defineStore } from 'pinia'
import type { ServiceConfiguration, State, Ticket } from '~/generated/types/prevant'
import { AppClient } from '~/generated/types/prevant'
import { type App, AppState } from '~/types/apps'

export type TicketById = Record<string, Ticket>

export const useAppsStore = defineStore('apps', () => {
  const appClient = new AppClient({
    BASE: '/api',
  })

  const apps = ref<App[]>([])
  const tickets = ref<TicketById>({})

  const appByAppName = computed(() => {
    const appByAppName: Record<string, App> = {}
    for (const app of apps.value)
      appByAppName[app.appName] = app

    return appByAppName
  })

  const appNames = computed(() => {
    return apps.value.map(app => app.appName );
  })

  const averageNumberOfServices = computed(() => {
    const appsWithServices = apps.value.filter(app => app.services !== null)
    return Math.ceil(appsWithServices.flatMap(app => app.services).length / appsWithServices.length)
  })

  async function fetchApps() {
    const servicesByAppName = await appClient.default.getApps()
    apps.value = Object.entries(servicesByAppName).map(([appName, services]) => ({
      appName,
      services,
      state: AppState.running,
    }))
    return apps.value
  }

  async function fetchTickets() {
    tickets.value = await appClient.default.getAppsTickets() ?? {}
    return tickets.value
  }

  async function createApp( appName: string, payload: ServiceConfiguration[], replicateFrom: string ) {
    apps.value.push({
      appName,
      state: AppState.starting,
    })

    const services = await appClient.default.postApps(appName, payload, replicateFrom)

    const newApp = appByAppName.value[appName]
    if (typeof services !== 'string' && newApp)
      newApp.services = services
    newApp.state = AppState.running
  }

  async function duplicateApp(appName: string, newAppName: string) {
    return createApp(newAppName, [], appName );
  }

  async function removeApp(appName: string) {
    const app = appByAppName.value[appName]
    if (app)
      app.state = AppState.stopping

    await appClient.default.deleteApps(appName)
    apps.value = apps.value.filter(apps => apps.appName !== appName)
  }

  async function toggleServiceState(appName: string, serviceName: string, state: State) {
    await appClient.default.putAppsStates(appName, serviceName, state)

    const service = appByAppName.value[appName]?.services?.find(service => service.name === serviceName)
    if (service)
      service.state = state
  }

  return {
    apps,
    tickets,
    appNames,
    averageNumberOfServices,
    fetchApps,
    fetchTickets,
    createApp,
    duplicateApp,
    removeApp,
    toggleServiceState,
  }
})
