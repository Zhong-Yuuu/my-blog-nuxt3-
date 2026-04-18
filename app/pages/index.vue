<template>
  <h1>根页面</h1>
</template>

<script setup>
const nuxtApp = useNuxtApp()
console.log('nuxtApp', nuxtApp);

const runtimeConfig = useRuntimeConfig()
console.log('runtimeConfig', runtimeConfig);

const appConfig = useAppConfig()
console.log('appConfig', appConfig);
</script>

<style scoped>

</style>