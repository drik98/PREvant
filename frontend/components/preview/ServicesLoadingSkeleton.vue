<script setup lang="ts">
defineProps<{
  numberOfServices: number
}>()
</script>

<template>
  <div class="grid grid-nogutter">
    <div
      v-for="index in numberOfServices"
      :key="index"
      class="col-12"
    >
      <ServiceInfoSkeleton :class="{ 'border-top-1 surface-border': index > 1 }" />
    </div>
  </div>
</template>
