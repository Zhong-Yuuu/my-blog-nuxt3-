// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '~/assets/styles/theme-vars.less', // 1. 主题变量（优先级最高）
    '~/assets/styles/global.less',      // 2. 全局重置+基础样式
  ],
  plugins: [
    { src: '~/plugins/theme.ts', mode: 'client' }, // 主题插件（仅客户端）
  ],
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  },
  nitro: {
    preset: 'node-server'
  },
})
