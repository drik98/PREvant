<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { fromPrevantServiceConfigs } from '~/types/modelValues'
import type { ServiceConfigModel } from '~/types/modelValues'
import type { ServiceConfiguration } from '~/generated/types/prevant'

import { useToast } from 'primevue/usetoast'
const toast = useToast();

const serviceConfigurations = ref<ServiceConfigModel[]>([])
addServiceConfig()

function addServiceConfig() {
  serviceConfigurations.value.push({
    id: uuidv4(),
    serviceName: '',
    image: '',
    env: [],
  })
}

const expertMode = ref(false);
const appName = ref('');
const replicateFrom = ref('');
const payload = ref<ServiceConfiguration[]>([{
  serviceName: '',
  image: '',
  env: {

  }
}]);

const areAllMandatoryFieldsFilled = computed( () => {
  return appName.value.length > 0 && payload.value.every( serviceConfig => {
    return serviceConfig.serviceName.trim().length > 0;
  })
})

const store = useAppsStore()
await useAsyncData('apps', () => store.fetchApps())
const { setFilter, filteredSuggestions } = useAutoCompletionSuggestions(store.appNames)

function handleImport(prevantServiceConfigs: ServiceConfiguration[]) {
  payload.value = prevantServiceConfigs;
}

const appCreationInProgress = ref(false);

async function onCreateApp() {
  appCreationInProgress.value = true;
  try {
    await store.createApp(appName.value, payload.value, replicateFrom.value)
    // toast.add({
    //   severity: 'success',
    //   summary: 'Shutdown preview',
    //   detail: `Preview ${appName} has been shut down.`,
    //   life: 5000,
    // })
  }
  catch {
    toast.add({
      severity: 'error',
      summary: 'Creation failed',
      detail: `Preview ${appName.value} could not be created.`,
      life: 5000,
    })
  } finally {
    appCreationInProgress.value = false;
  }
}
</script>

<template>
  <NuxtLayout>
    <template #navbar>
      <NavigationBar>
        <template #end>
          <span class="flex flex-row gap-4 align-items-center">
            <label for="expertModeSwitch">Expert Mode</label>
            <PrimeInputSwitch v-model="expertMode" input-id="expertModeSwitch"/>
          </span>
        </template>
      </NavigationBar>
    </template>

    <h1>App Creation</h1>

<div class="flex flex-column gap-4 p-2">
    <div class="flex flex-column gap-2">
    <label for="appName" class="required">App Name</label>
    <PrimeInputGroup>
      <PrimeInputGroupAddon>
        <i class="pi pi-id-card" />
      </PrimeInputGroupAddon>
      <PrimeInputText
        v-model.trim="appName"
        input-id="appName"
        placeholder="release-3.4.x"
        :disabled="appCreationInProgress"
      />
    </PrimeInputGroup>
  </div>

  <div class="flex flex-column gap-2">
    <label for="replicateFrom">Replicate From</label>
    <PrimeInputGroup>
      <PrimeInputGroupAddon>
        <i class="pi pi-copy" />
      </PrimeInputGroupAddon>
      <PrimeAutoComplete
        v-model.trim="replicateFrom"
        v-tooltip.bottom="'When any of the existing apps is entered the services will be replicated from this preview.'"
        input-id="replicateFrom"
        placeholder="master"
        :suggestions="filteredSuggestions"
        :disabled="appCreationInProgress"
        @complete="({ query }) => setFilter(query)"
      />
    </PrimeInputGroup>
  </div>

    <PrimePanel header="Service Configurations">
      <template #icons>
        <ServiceConfigButtons
          :service-configurations="serviceConfigurations"
          @import="handleImport"
        />
      </template>

      <template #footer>
        <ServiceConfigButtons
          class="justify-content-end"
          :service-configurations="serviceConfigurations"
          @import="handleImport"
        />
      </template>

      <PayloadEditor v-if="expertMode" v-model:payload="payload" :disabled="appCreationInProgress" />
      <PayloadConfigurator v-else v-model:payload="payload" :disabled="appCreationInProgress"></PayloadConfigurator>

    </PrimePanel> 

    <PrimeButton
        autofocus
        icon="pi pi-copy"
        label="Create App"
        :disabled="appCreationInProgress || !areAllMandatoryFieldsFilled"
        @click="onCreateApp"
      >

<PrimeProgressSpinner v-if="appCreationInProgress" />
      </PrimeButton>
    </div>
  </NuxtLayout>
</template>
