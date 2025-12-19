// plugins/theme.ts
import { defineNuxtPlugin } from '#app';
import { useTheme } from '~/composables/useTheme';

export default defineNuxtPlugin(() => {
  // 客户端初始化：恢复上次保存的主题
  if (process.client) {
    const { restoreTheme } = useTheme();
    // DOM加载完成后执行（确保html元素已存在）
    window.addEventListener('DOMContentLoaded', restoreTheme);
  }
});