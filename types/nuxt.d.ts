// 这个文件是用来扩展 Nuxt 的全局类型定义的

// 1. 定义 logger 的类型（和你插件里的 logger 结构一致）
// 如果后续修改了 logger 的结构（比如新增 warn 方法），需要同步更新 CustomLogger 接口：
interface CustomLogger {
  info: (msg: string) => void
  error: (msg: string) => void
}

// 2. 扩展 NuxtApp 接口，添加自定义属性
declare module '#app' {
  interface NuxtApp {
    // 对应插件里的 $logger
    $logger: CustomLogger
    // 对应插件里的 $quickLog
    $quickLog: (msg: string) => void
  }
}

// 3. 让全局类型生效（必须加这行，否则 TS 不会合并接口）
export {}