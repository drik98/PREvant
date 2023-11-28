<script setup lang="ts">
import type { ServiceConfiguration } from '~/generated/types/prevant'
import type { ServiceConfigModel } from '~/types/modelValues'

const props = defineProps<{
  serviceConfigurations: ServiceConfigModel[]
}>()

const emit = defineEmits<{
  (e: 'import', serviceConfigurations: ServiceConfiguration[]): void
}>()
</script>

<template>
  <div class="flex gap-2">
    <ExportConfigButton :service-configurations="props.serviceConfigurations" />
    <ImportConfigButton @import="serviceConfigurations => $emit('import', serviceConfigurations)" />
  </div>
</template>
