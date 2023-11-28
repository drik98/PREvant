<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import type { EnvModel } from '~/types/modelValues'
import configurationTransfomer from '~/utils/configurationTransfomer'

const props = defineProps<{
  modelValue: EnvModel[]
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: EnvModel[]): void
}>()

function addEnv() {
  emit('update:modelValue', [
    ...props.modelValue,
    { id: uuidv4(), envKey: '', envValue: '', templated: false, replicate: true },
  ])
}

const selectedEnvs = ref<EnvModel[]>([])

function deleteSelectedEnvs() {
  emit(
    'update:modelValue',
    props.modelValue.filter(({ id }) => !selectedEnvs.value.some(selectedEnv => selectedEnv.id === id)),
  )
  selectedEnvs.value = []
}

function updateEnv(currentValue: EnvModel, payload: Partial<Omit<EnvModel, 'id'>>) {
  emit(
    'update:modelValue',
    props.modelValue.map((env) => {
      if (env.id !== currentValue.id)
        return env

      return { ...env, ...payload }
    }),
  )
}

function updateConfigKeyOfEnv(currentValue: EnvModel, configKey: string) {
  updateEnv(currentValue, { configKey, envKey: configurationTransfomer(configKey) })
}

function toggleConfigKeyDisabled(env: EnvModel, enabled: boolean) {
  updateEnv(env, { configKey: enabled ? '' : null })
}

const { enableConfigToEnv } = useAppConfiguration()
</script>

<template>
  <PrimeDataTable
    v-model:selection="selectedEnvs"
    resizable-columns
    data-key="id"
    :value="modelValue"
  >
    <template #header>
      <div class="flex flex-wrap justify-content-between gap-2">
        <span class="text-xl text-900 font-bold flex-grow-1">Environment Variables</span>
        <PrimeButton
          v-tooltip="'Click to add an environment variable.'"
          raised
          rounded
          icon="pi pi-plus"
          label="Add"
          :disabled="disabled"
          @click="addEnv"
        />
        <PrimeButton
          v-tooltip="'Click to remove all selected environment variables.'"
          raised
          rounded
          icon="pi pi-trash"
          label="Remove"
          :disabled="disabled || selectedEnvs.length <= 0"
          @click="deleteSelectedEnvs"
        />
      </div>
    </template>

    <template #empty>
      There is currently no environment variable present. Click on the "Add"-Button to add one.
    </template>

    <PrimeColumn
      header-style="width: 3rem"
      selection-mode="multiple"
    />

    <PrimeColumn header="Environment Variable Key">
      <template #body="slotProps">
        <PrimeInputGroup>
          <PrimeInputGroupAddon>
            <i class="pi pi-key" />
          </PrimeInputGroupAddon>
          <PrimeInputText
            v-tooltip.bottom="'Enter the key of the environment variable'"
            placeholder="MYSQL_USER"
            :model-value="slotProps.data.envKey"
            :disabled="disabled || slotProps.data.configKey != null"
            @update:model-value="envKey => updateEnv(slotProps.data, { envKey })"
          />
        </PrimeInputGroup>
      </template>
    </PrimeColumn>

    <PrimeColumn
      v-if="enableConfigToEnv"
      header="Configuration Key"
    >
      <template #body="slotProps">
        <PrimeInputGroup>
          <PrimeInputGroupAddon>
            <PrimeCheckbox
              v-tooltip.bottom="'Some services offer the possibility to use enviroment variables to overwrite the configurations. You can use this field to enter the key of the respective configuration value and it will be used to determine the environment variable key.'"
              binary
              :model-value="slotProps.data.configKey != null"
              :disabled="disabled"
              @input="enabled => toggleConfigKeyDisabled(slotProps.data, enabled)"
            />
          </PrimeInputGroupAddon>
          <PrimeInputText
            v-tooltip="'Enter the key of the configuration file'"
            placeholder="javax.persistence.jdbc.user"
            :model-value="slotProps.data.configKey"
            :disabled="disabled || slotProps.data.configKey == null"
            @update:model-value="configKey => updateConfigKeyOfEnv(slotProps.data, configKey)"
          />
        </PrimeInputGroup>
      </template>
    </PrimeColumn>

    <PrimeColumn header="Environment Variable Value">
      <template #body="slotProps">
        <PrimeInputGroup>
          <PrimeInputGroupAddon>
            <i class="pi pi-database" />
          </PrimeInputGroupAddon>
          <PrimeInputText
            v-model="slotProps.data.envValue"
            v-tooltip.bottom="'Enter the value of the environment variable'"
            placeholder="admin"
            :disabled="disabled"
            @update:model-value="envValue => updateEnv(slotProps.data, { envValue })"
          />
        </PrimeInputGroup>
      </template>
    </PrimeColumn>

    <PrimeColumn header="Templated">
      <template #body="slotProps">
        <PrimeCheckbox
          v-model="slotProps.data.templated"
          v-tooltip.left="'This should be checked when the value of the environment variable contains placeholders.'"
          binary
          :disabled="disabled"
          @input="templated => updateEnv(slotProps.data, { templated })"
        />
      </template>
    </PrimeColumn>

    <PrimeColumn header="Replicate">
      <template #body="slotProps">
        <PrimeCheckbox
          v-model="slotProps.data.replicate"
          v-tooltip.left="'This should be checked when the environment variable should also be applied when a new preview is created and is replicated from the preview that your are currently creating.'"
          binary
          :disabled="disabled"
          @input="replicate => updateEnv(slotProps.data, { replicate })"
        />
      </template>
    </PrimeColumn>
  </PrimeDataTable>
</template>
