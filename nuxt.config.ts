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
  runtimeConfig: {
    // 服务器端可见（私钥）
    mysqlHost: process.env.NUXT_MYSQL_HOST,
    mysqlPort: process.env.NUXT_MYSQL_PORT,
    mysqlUser: process.env.NUXT_MYSQL_USER,
    mysqlPassword: process.env.NUXT_MYSQL_PASSWORD,
    mysqlDatabase: process.env.NUXT_MYSQL_DATABASE,
    mysqlConnectionLimit: process.env.NUXT_MYSQL_CONNECTION_LIMIT,
    // 客户端可见（公钥，这里无需暴露数据库信息）
    public: {},
  },
})
