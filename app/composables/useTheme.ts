// composables/useTheme.ts
/**
 * 主题切换工具函数：按时间判断主题 + 全局类名控制 + 持久化
 */
export const useTheme = () => {
  // 仅在客户端执行（避免SSR操作DOM报错）
  if (!process.client) return { initThemeByTime: () => {}, restoreTheme: () => {} };

  // 1. 判断当前时间是否为暗黑模式（18:00-次日6:00）
  const isDarkMode = (): boolean => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  };

  // 2. 设置全局主题类名（核心：给html加类名，触发CSS变量切换）
  const setThemeClass = (isDark: boolean) => {
    const html = document.documentElement;
    // 移除旧类名，添加新类名
    html.classList.remove('light-theme', 'dark-theme');
    html.classList.add(isDark ? 'dark-theme' : 'light-theme');
    // 持久化到本地存储（刷新不丢失）
    localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
  };

  // 3. 登录时初始化主题（按时间）
  const initThemeByTime = () => {
    const dark = isDarkMode();
    setThemeClass(dark);
  };

  // 4. 页面加载时恢复主题（全局调用）
  const restoreTheme = () => {
    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme) {
      setThemeClass(savedTheme === 'dark');
    } else {
      // 未登录时默认亮色（避免未登录时全站暗黑）
      setThemeClass(false);
    }
  };

  return { initThemeByTime, restoreTheme };
};