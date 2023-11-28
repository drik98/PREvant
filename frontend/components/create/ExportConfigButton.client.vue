<script setup lang="ts">
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import JsonEditorVue from 'json-editor-vue'
import { useToast } from 'primevue/usetoast'
import { toPrevantServiceConfigs } from '~/types/modelValues'
import type { ServiceConfigModel } from '~/types/modelValues'

const props = defineProps<{
  serviceConfigurations: ServiceConfigModel[]
}>()

const prevantServiceConfigurations = computed(() => toPrevantServiceConfigs(props.serviceConfigurations))
const exportJson = computed(() => JSON.stringify(prevantServiceConfigurations.value, null, 2))

const visible = ref(false)

const toast = useToast()

async function copyToClipboard() {
  await navigator.clipboard.writeText(exportJson.value)
  toast.add({ severity: 'info', summary: 'Payload copied to clipboard', life: 3000 })
}

function downloadJsonFile() {
  const fileName = `${(new Date()).toISOString()}--PREvant-payload.json`

  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(exportJson.value)}`)
  element.setAttribute('download', fileName)

  element.click()
}
</script>

<template>
  <PrimeButton
    v-tooltip.left="'Click on this button to open a dialog to export the generated service config payload.'"
    raised
    rounded
    icon="pi pi-download"
    label="Export"
    @click="visible = true"
  />

  <PrimeDialog
    v-model:visible="visible"
    modal
    header="Export generated payload"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :style="{ width: '50rem' }"
  >
    <p>
      The field below displays the generated payload in a read only state. Any field that was not filled out
      is omitted. Using the buttons below it can be exported to your clipboard or downloaded as a json file.
    </p>
    <JsonEditorVue
      read-only
      class="jse-theme-dark"
      mode="text"
      :main-menu-bar="false"
      :model-value="prevantServiceConfigurations"
    />

    <template #footer>
      <PrimeButton
        v-tooltip.bottom="'When clicking on this button the payload will be copied to your clipboard so that you can just paste it where you need it (e.g. the in the payload field of the PREvant openAPI).'"
        autofocus
        icon="pi pi-copy"
        label="Copy to clipboard"
        @click="copyToClipboard"
      />
      <PrimeButton
        v-tooltip.bottom="'When clicking on this buttom you will trigger a download of the generated payload as a json file.'"
        autofocus
        icon="pi pi-download"
        label="Download"
        @click="downloadJsonFile"
      />
    </template>
  </PrimeDialog>
</template>
