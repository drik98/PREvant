<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { State } from '~/generated/types/prevant'
import { useAppsStore } from '~/stores/apps'
import type { App } from '~/types/apps'

const toast = useToast()

const store = useAppsStore()
await useAsyncData('apps', () => store.fetchApps())
await useAsyncData('tickets', () => store.fetchTickets())


const searchFilter = ref('');
const filteredApps = computed(() => {
  return store.apps.filter(app => app.appName.includes(searchFilter.value));
})

const categorizedApps = computed(() => {
  const categorizedApps: Record<string, App[]> = {
    previews: [],
    features: [],
  }

  for (const app of filteredApps.value) {
    if (app.appName in store.tickets) {
      categorizedApps.features.push(app)
      continue
    }
    categorizedApps.previews.push(app)
  }
  return categorizedApps
})

async function onRemoveApp(appName: string) {
  try {
    await store.removeApp(appName)
    toast.add({
      severity: 'success',
      summary: 'Shutdown preview',
      detail: `Preview ${appName} has been shut down.`,
      life: 5000,
    })
  }
  catch {
    toast.add({
      severity: 'error',
      summary: 'Shutdown failed',
      detail: `Preview ${appName} could not be shut down.`,
      life: 5000,
    })
  }
}

async function onToggleServiceState(appName: string, serviceName: string, state: State) {
  try {
    await store.toggleServiceState(appName, serviceName, state)
    toast.add({
      severity: 'success',
      summary: 'Service status has been changed',
      detail: `Status of service ${serviceName} from the preview ${appName} has been succesfully changed to ${state.status}.`,
      life: 3000,
    })
  }
  catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Service status could not be changed',
      detail: `Failed to change status of service ${serviceName} from the preview ${appName} to ${state.status}.`,
      life: 3000,
    })
  }
}
</script>

<template>
  <NuxtLayout>
    <template #navbar>
      <NavigationBar>
        <template #end>
          <div class="flex align-items-center gap-2">
            <PrimeInputGroup>
              <PrimeInputGroupAddon>
                  <i class="pi pi-search"></i>
              </PrimeInputGroupAddon>
              <PrimeInputText v-model.trim="searchFilter" type="text" class="w-8rem sm:w-auto" placeholder="Filter Apps" />
          </PrimeInputGroup>

        </div>
        </template>
      </NavigationBar>
    </template>

    <template
      v-for="[category, apps] in Object.entries(categorizedApps)"
      :key="category"
    >
      <h1
        v-if="apps.length"
        class="capitalize"
      >
        {{ category }}
      </h1>
      <div class="flex flex-wrap gap-2">
        <PreviewTile
          v-for="app in apps"
          :key="app.appName"
          :app="app"
          :average-number-of-services="store.averageNumberOfServices"
          :ticket="tickets?.[app.appName]"
          @duplicate-app="(newAppName) => store.duplicateApp(app.appName, newAppName)"
          @remove-app="() => onRemoveApp(app.appName)"
          @toggle-service-state="(serviceName, state) => onToggleServiceState(app.appName, serviceName, state)"
        />
      </div>
    </template>
  </NuxtLayout>
</template>
