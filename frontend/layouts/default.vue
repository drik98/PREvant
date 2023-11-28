<template>
  <PrimeToast />
  <PrimeConfirmDialog />
  <div class="flex flex-column gap-2">
    <slot name="navbar">
      <NavigationBar />
    </slot>

    <slot />
  </div>
</template>
