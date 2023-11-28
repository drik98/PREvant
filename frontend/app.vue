<template>
  <NuxtPage />
</template>

<style>
html {
  font-size: 14px;
}

.p-tooltip {
  width: 100em;
  max-width: fit-content;
}

label.required::after {
  content: '*';
  color: red;
  display: inline-block;
  margin-inline: .1em;
}
</style>
