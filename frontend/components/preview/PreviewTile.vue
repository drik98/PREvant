<script setup lang="ts">
import PrimeMenu from 'primevue/menu'
import { useConfirm } from 'primevue/useconfirm'
import { State, type Ticket } from '~/generated/types/prevant'
import { type App, AppState } from '~/types/apps'

const props = defineProps<{
  app: App
  ticket?: Ticket
  averageNumberOfServices: number
}>()

const emit = defineEmits<{
  (e: 'duplicateApp', newAppName: string): void
  (e: 'removeApp'): void
  (e: 'toggleServiceState', serviceName: string, state: State): void
}>()

const sortedServices = computed(() => {
  if (!props.app.services)
    return null

  return sortServicesByType(props.app.services)
})

const menu = ref<InstanceType<typeof PrimeMenu>>()
const duplicateDialogVisible = ref(false)
const confirm = useConfirm()

const items = ref([
  {
    label: 'Versions',
    icon: 'pi pi-book',
  },
  {
    label: 'Duplicate',
    icon: 'pi pi-copy',
    command() {
      duplicateDialogVisible.value = true
    },
  },
  {
    separator: true,
  },
  {
    label: 'Shutdown',
    icon: 'pi pi-trash',
    command() {
      confirm.require({
        message: `Do you really want to shutdown ${props.app.appName}?`,
        header: 'Shutdown preview',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-text p-button-text',
        acceptClass: 'p-button-danger p-button-text',
        accept: () => {
          emit('removeApp')
        },
      })
    },
  },
])

function toggle(event: Event) {
  menu.value?.toggle(event)
}
</script>

<template>
  <PrimePanel
    class="preview-tile min-w-min max-w-30rem"
    :class="{
      'opacity-40': app.state === AppState.stopping,
    }"
  >
    <template #header>
      <div class="flex flex-column gap-2 w-full">
        <div class="flex justify-content-between align-items-center">
          <NuxtLink :to="ticket?.link">
            {{ app.appName }}
          </NuxtLink>

          <button
            class="p-panel-header-icon p-link mr-2"
            :disabled="app.state !== AppState.running"
            @click="toggle"
          >
            <span class="pi pi-ellipsis-v" />
          </button>
          <PrimeMenu
            id="config_menu"
            ref="menu"
            popup
            :model="items"
          />
        </div>

        <div
          v-if="ticket"
          class="flex justify-content-between"
        >
          <span
            v-tooltip="ticket.summary"
            class="text-overflow-ellipsis overflow-hidden white-space-nowrap max-w-22rem"
          >{{ ticket.summary }}</span>
          <PrimeTag
            class="uppercase white-space-nowrap"
            :value="ticket.status"
          />
        </div>
      </div>
    </template>

    <PrimeDataView
      v-if="sortedServices"
      :value="sortedServices"
    >
      <template #list="slotProps">
        <div class="grid grid-nogutter">
          <div
            v-for="(service, index) in slotProps.items"
            :key="service.name"
            class="col-12"
          >
            <ServiceInfo
              v-bind="service"
              :class="{ 'border-top-1 surface-border': index !== 0 }"
              @update:state="state => emit('toggleServiceState', service.name, state)"
            />
          </div>
        </div>
      </template>
    </PrimeDataView>

    <ServicesLoadingSkeleton
      v-else
      :number-of-services="averageNumberOfServices"
    />
  </PrimePanel>

  <DuplicatePreviewDialog
    v-model:visible="duplicateDialogVisible"
    :app-name="app.appName"
    @duplicate="newAppName => emit('duplicateApp', newAppName)"
  />
</template>

<style>
.preview-tile .p-panel-content{
  padding: 0.25rem 1.25rem !important;
}
</style>
