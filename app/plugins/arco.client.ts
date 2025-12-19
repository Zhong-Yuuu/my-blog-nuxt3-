// plugins/arco.client.ts
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css'; // 引入样式

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ArcoVue);
});