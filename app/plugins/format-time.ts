// 通用插件(客户端 + 服务端均可运行)
export default defineNuxtPlugin({
    // 1.插件名称(例如该插件就用于打印日志)
    name: 'custom-logger',
    // 2.优先级(pre 表示在所有插件之前运行)
    enforce: 'pre',
    // 3.核心逻辑
    async setup(nuxtApp) {
        // 3.1 暴露全局日志
        const logger = {
            info: (msg: string) => {
                console.log(`INFO ${new Date()}: ${msg}`)
            },
            error: (msg: string) => {
                console.error(`ERROR ${new Date()}: ${msg}`)
            }
        }

        // 3.2 暴露到全局(方式一)
        nuxtApp.provide('logger', logger)

        // 3.2 暴露到全局(方式二)
        return {
            provide: {
                quickLog: (msg: string) => console.log(`快速日志：${msg}`)
            }
        }
    },

    // 4.可以直接在这里注册 Nuxt 应用运行时钩子
    hooks: {
        // 4.1 在应用创建完成时执行
        'app:created': () => {
            console.log('app created');
        },
        'app:beforeMount': () => {
            console.log('app beforeMount')
        },
        // 4.2 在应用挂载后
        'app:mounted': () => {
            console.log('app mounted')

            const nuxtApp = useNuxtApp()
            nuxtApp.$logger.info('app mounted')
        },
        // 4.3 在页面开始渲染时执行
        'page:start': () => {
            // useNuxtApp().$logger.info('页面开始渲染')
        },
    },

    // 5.环境控制：允许在岛屿组件中运行（默认true）
    env: {
        // 如果你不希望插件在仅服务端渲染或岛屿组件时运行，将该值设置为 `false`。
        islands: false
    },

    // 6.使 Nuxt 不必等到该插件执行完毕就开始加载下一个插件（默认false）
    parallel: true,

    // 7.如果一个插件需要等待另一个插件完成才能运行
    // dependsOn: ['custom-logger']
})