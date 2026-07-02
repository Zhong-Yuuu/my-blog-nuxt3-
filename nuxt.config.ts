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
  app: {
    head: {
      title: 'My Blog',
      titleTemplate: '%s - ZhongYu@gmail.com',
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
        
      ],
      style: [],
      htmlAttrs: {
        lang: 'zh-CN'
      },
      bodyAttrs: {
        
      }
    },
    // 页面过渡效果(需要在 app.vue 文件中设置相关样式)
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    // 布局过渡效果(需要在 app.vue 文件中设置相关样式)
    layoutTransition: {
      name: 'layout',
      mode: 'in-out'
    }
  },
  // 环境变量配置
  env: {
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || '/api'
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

  $development: {
    // 开发环境配置
  },
  $production: {
    // 生产环境配置
  },
  $env: {
    // 自定义环境配置
    staging: {    // 自定义[预发布环境]名称
      
    }
  }
})
