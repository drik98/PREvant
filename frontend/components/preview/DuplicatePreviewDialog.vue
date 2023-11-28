<script setup lang="ts">
defineProps<{
  visible: boolean
  appName: string
}>()

const emit = defineEmits<{
  (e: 'duplicate', newAppName: string): void
  (e: 'update:visible', visible: boolean): void
}>()

const newAppName = ref('')

function onDuplicate() {
  emit('duplicate', newAppName.value)
  emit('update:visible', false)
}
</script>

<template>
  <PrimeDialog
    modal
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :header="`Duplicate ${appName}`"
    :style="{ width: '50rem' }"
    :visible="visible"
    @hide="newAppName = ''"
    @update:visible="visible => emit('update:visible', visible)"
  >
    <div class="flex flex-column gap-2">
      <label for="newAppName">Name for duplicated preview</label>
      <PrimeInputGroup>
        <PrimeInputGroupAddon>
          <i class="pi pi-id-card" />
        </PrimeInputGroupAddon>
        <PrimeInputText
          id="newAppName"
          v-model.trim="newAppName"
          auto-focus
          :placeholder="`duplicate-of-${appName}`"
        />
      </PrimeInputGroup>
    </div>

    <template #footer>
      <PrimeButton
        icon="pi pi-copy"
        label="Duplicate"
        :disabled="!newAppName.length"
        @click="onDuplicate"
      />
    </template>
  </PrimeDialog>
</template>
