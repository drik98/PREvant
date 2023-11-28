<script setup lang="ts">
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import JsonEditorVue from 'json-editor-vue'
import { createAjvValidator } from 'vanilla-jsoneditor'
import type { JSONSchema, JSONSchemaDefinitions, ValidationError, Validator } from 'vanilla-jsoneditor'
import payloadJsonSchema from '~/generated/json-schema/ServiceConfiguration.json'
import type { ServiceConfiguration } from '~/generated/types/prevant'

const emit = defineEmits<{
  (e: 'import', value: ServiceConfiguration[]): void
}>()

const visible = ref(false)
const importJson = ref()

const validationErrors = ref<ValidationError[]>([])
const hasValidationErrors = computed<boolean>(() => validationErrors.value.length > 0)

const schema: JSONSchema = {
  type: 'array',
  items: {
    $ref: 'ServiceConfiguration',
  },
}

const schemaDefinitions: JSONSchemaDefinitions = {
  ServiceConfiguration: payloadJsonSchema,
}

const ajvValidator = createAjvValidator({ schema, schemaDefinitions })

// This is a wrapper function so that we can save the current validation errors so we can have control
// over the disabled status of the import button
function wrappedValidator(json: Parameters<Validator>[0]): ValidationError[] {
  validationErrors.value = ajvValidator(json)
  return validationErrors.value
}

function handleImport() {
  if (hasValidationErrors.value)
    return

  emit('import', JSON.parse(importJson.value))
  visible.value = false
  onHide()
}

function onHide() {
  importJson.value = undefined
}
</script>

<template>
  <PrimeButton
    v-tooltip.left="'Click on this button to open a dialog to import an existing service config payload.'"
    raised
    rounded
    icon="pi pi-upload"
    label="Import"
    @click="visible = true"
  />

  <PrimeDialog
    v-model:visible="visible"
    modal
    header="Import existing payload"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :style="{ width: '50rem' }"
    @hide="onHide"
  >
    <p>
      Just copy and paste your json file into this text area and click on the "Import" button.
      If there are any problems the editor will tell you and try to fix them.
    </p>
    <JsonEditorVue
      v-model="importJson"
      ask-to-format
      class="jse-theme-dark"
      mode="text"
      :main-menu-bar="false"
      :validator="wrappedValidator"
    />

    <template #footer>
      <PrimeButton
        autofocus
        icon="pi pi-upload"
        label="Import"
        :disabled="hasValidationErrors || !importJson?.length"
        @click="handleImport"
      />
    </template>
  </PrimeDialog>
</template>
