<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { fromPrevantServiceConfigs, toPrevantServiceConfigs } from '~/types/modelValues'
import type { ServiceConfigModel } from '~/types/modelValues'
import type { ServiceConfiguration } from '~/generated/types/prevant'

const props = defineProps<{
  payload: ServiceConfiguration[]
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update:payload', payload: ServiceConfiguration[]): void,
}>()

const serviceConfigurations = ref<ServiceConfigModel[]>([])
watch(props.payload, payload=> {
  serviceConfigurations.value = fromPrevantServiceConfigs(payload);
}, {immediate: true})

watch(() => serviceConfigurations.value, serviceConfigurations=> {
  emit("update:payload", toPrevantServiceConfigs(serviceConfigurations ));
}, {deep: true})

function removeServiceConfig(serviceConfig: ServiceConfigModel) {
  serviceConfigurations.value = serviceConfigurations.value.filter(({ id }) => id !== serviceConfig.id)
}

</script>

<template>
 
      <div class="flex flex-column gap-3">
        <template v-if="!serviceConfigurations.length">
          There is currently no service to configure present. Click on one of the "Add"-Buttons to add one.
        </template>
        <SeviceConfigurationForm
          v-for="serviceConfig in serviceConfigurations"
          v-else
          :key="serviceConfig.id"
          v-bind="serviceConfig"
          v-model:env="serviceConfig.env"
          v-model:image="serviceConfig.image"
          v-model:serviceName="serviceConfig.serviceName"
          :disabled="disabled"
          @remove="() => removeServiceConfig(serviceConfig)"
        />
      </div>
</template>
