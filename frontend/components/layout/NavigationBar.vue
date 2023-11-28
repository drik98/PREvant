<script setup lang="ts">
const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        route: '/'
    },
    {
        label: 'Create App',
        icon: 'pi pi-plus-circle',
        route: '/create-app'
    },
    {
        label: 'Source Code',
        icon: 'pi pi-github',
        url: 'https://github.com/aixigo/PREvant'
    }
]);
</script>

<template>
  <PrimeMenubar :model="items">
    <template #start>
      <div class="flex align-items-center mr-4">
        <img
          alt="Logo of the PREvant Payload Producer"
          src="/logo.svg"
          :style="{ height: '40px' }"
        >
      </div>
    </template>

    <template #item="{ item }">
      <NuxtLink class="p-menuitem-link" v-ripple :to="item.route || item.url" :target="item.url ? '_blank': ''">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
      </NuxtLink>
    </template>

    <template #end>
      <slot name="end"/>
    </template>
  </PrimeMenubar>
</template>

<style scoped>
a {
   text-decoration: none;
}
.p-menuitem-link.router-link-exact-active {
  font-weight: bolder;
}
</style>
