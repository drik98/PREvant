<script setup lang="ts">
import { Service, State } from '~/generated/types/prevant'

const props = defineProps<Service>()

const emit = defineEmits<{
  (e: 'update:state', status: State): void
}>()

const iconSize = ref('24px')

const serviceTypeIcon = computed(() => {
  if (props.name.endsWith('openid'))
    return 'pi-shield'

  if (props.name.endsWith('-proxy'))
    return 'pi-directions'

  if (props.name.endsWith('-frontend'))
    return 'pi-globe'

  if (props.name.endsWith('-service'))
    return 'pi-inbox'

  if (props.name.endsWith('-api'))
    return 'pi-cloud-download'

  if (props.name.endsWith('-db') || props.name.endsWith('-database'))
    return 'pi-database'

  return 'pi-server'
})

const serviceStatusIcon = computed(() => {
  switch (props.state?.status) {
    case State.status.PAUSED:
      return 'pi pi-play'
    case State.status.RUNNING:
      return 'pi pi-pause'
    default:
      return undefined
  }
})

const formattedBuildDateTime = computed(() => {
  if (!props.version?.dateModified)
    return null

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(props.version.dateModified))
})

function onToggleState() {
  const status = props.state?.status !== State.status.RUNNING
    ? State.status.RUNNING
    : State.status.PAUSED

  emit('update:state', { status })
}
</script>

<template>
  <div
    class="flex flex-row align-items-stretch p-3 gap-4"
    :class="{
      'opacity-50': props.state?.status !== State.status.RUNNING,
    }"
  >
    <div class="flex flex-column align-items-center justify-content-center gap-2">
      <i
        class="pi"
        :class="serviceTypeIcon"
        :style="{ width: iconSize, height: iconSize }"
      />
      <PrimeButton
        v-if="state?.status"
        outlined
        rounded
        severity="secondary"
        :icon="serviceStatusIcon"
        :style="{ width: iconSize, height: iconSize }"
        @click="onToggleState"
      />
    </div>

    <div class="flex flex-column flex-grow-1 gap-2">
      <NuxtLink :to="props.url">
        {{ props.name }}
      </NuxtLink>

      <span class="flex flex-row gap-2 align-items-center">
        <NuxtLink
          v-if="props.openApiUrl"
          :to="props.openApiUrl"
        >API Documentation</NuxtLink>
        <NuxtLink
          :to="props.openApiUrl"
        >Logs</NuxtLink>
      </span>

      <span v-if="formattedBuildDateTime">
        {{ formattedBuildDateTime }}
      </span>
    </div>

    <div class="flex flex-column justify-content-between align-items-end">
      <PrimeTag
        class="uppercase"
        :class="{
          'opacity-80': props.type !== Service.type.INSTANCE,
        }"
        :value="props.type"
      />
      <span v-if="props.version?.softwareVersion">
        {{ props.version.softwareVersion }}
      </span>
    </div>
  </div>
</template>
