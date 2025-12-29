import { defineNuxtPlugin } from "#app";

// 1. 定义一个 Vue 插件对象（必须包含 install 方法）
const datePlugin = {
  // 2. install 是 Vue 插件的核心方法，Vue 调用 app.use(插件) 时会自动执行这个方法
  //    - app：Vue 应用实例（对应 Nuxt 中的 nuxtApp.vueApp）
  //    - options：调用 use 时传入的配置参数，这里设置了默认值 { format: 'YYYY-MM-DD' }
  install(app: any, options: { format: string } = { format: 'YYYY-MM-DD' }) {
    // 3. 给 Vue 全局属性挂载一个 $formatDate 方法
    //    app.config.globalProperties 是 Vue 3 中挂载全局方法/属性的地方
    app.config.globalProperties.$formatDate = (date: Date) => {
      // 4. 日期格式化逻辑：把 Date 对象转成 "年-月-日" 格式
      const year = date.getFullYear(); // 获取年份（如 2025）
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份（+1 因为月份从 0 开始），不足 2 位补 0
      const day = String(date.getDate()).padStart(2, '0'); // 日期，不足 2 位补 0
      return `${year}-${month}-${day}`; // 返回格式化后的字符串（如 2025-12-29）
    };
  }
};

export default defineNuxtPlugin((nuxtApp) => {
  // 5. 使用插件
  nuxtApp.vueApp.use(datePlugin);
})