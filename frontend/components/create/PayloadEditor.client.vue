<script setup lang="ts">
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import JsonEditorVue from 'json-editor-vue'
import { createAjvValidator } from 'vanilla-jsoneditor'
import type { JSONSchema, JSONSchemaDefinitions, ValidationError, Validator } from 'vanilla-jsoneditor'
import payloadJsonSchema from '~/generated/json-schema/ServiceConfiguration.json'
import type { ServiceConfiguration } from '~/generated/types/prevant'

const props = defineProps<{
  payload: ServiceConfiguration[]
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update:payload', payload: ServiceConfiguration[]): void,
}>()

const jsonModelValue = ref()
watch(props.payload, payload=> {
  jsonModelValue.value = payload;
}, {immediate: true})

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

// This is a wrapper function so that we can save the current validation errors so we can be sure that the
// current entered value is actually correctly typed
function wrappedValidator(json: Parameters<Validator>[0]): ValidationError[] {
  validationErrors.value = ajvValidator(json)
  return validationErrors.value
}

function onUpdate() {
  if(hasValidationErrors.value) {
    return;
  }
  emit("update:payload", JSON.parse(jsonModelValue.value ));
}

</script>

<template>
    <JsonEditorVue
      v-model="jsonModelValue"
      ask-to-format
      class="jse-theme-dark"
      mode="text"
      :main-menu-bar="false"
      :validator="wrappedValidator"
      :read-only="disabled"
      @update:modelValue="onUpdate"
    />
</template>
