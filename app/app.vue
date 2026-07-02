<template>
  <div>
    <NuxtPage />
  </div>
</template>


<style>
/* 这里与 nuxt.config.ts 文件下的 app.pageTransition 配置有关 */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

/* 这里与 nuxt.config.ts 文件下的 app.layoutTranstion 配置有关 */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
</style>