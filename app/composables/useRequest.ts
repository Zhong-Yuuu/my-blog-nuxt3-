/**
 * Nuxt3 请求封装
 * 基于原生 $fetch + ArcoDesign 全局提示
 */
import { Message } from '@arco-design/web-vue';

// 统一请求配置
const requestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 核心请求函数
 * @param url 接口地址（比如 /login）
 * @param options 请求配置（method、body 等）
 * @param showLoading 是否显示加载状态（默认 true）
 */
export const useRequest = async <T = any>(
  url: string,
  options: any = {},
  showLoading = true
) => {
  // 1. 加载状态
  let loadingInstance: any = null;
  if (showLoading) {
    loadingInstance = Message.loading({
      content: '处理中...',
      duration: 0,
      closable: false
    });
  }

  try {
    // 2. 合并默认配置 + 接口自定义配置
    const res = await $fetch<T>(url, {
      ...requestConfig,
      ...options,
      // 统一响应拦截：只返回 data，过滤外层包装
      onResponse({ response }) {
        if (response._data.code !== 200) {
          throw createError({
            statusCode: response._data.code,
            message: response._data.message || '请求失败',
          });
        }
        return response._data;
      },
      // 统一错误拦截
      onResponseError({ response }) {
        const msg = response._data?.message || `请求失败（${response.status}）`;
        Message.error({
          content: msg,
          duration: 3000,
          closable: true
        });
        // 特殊处理：401 未登录，自动跳回登录页
        if (response.status === 401) {
          const router = useRouter();
          router.push('/login');
        }
      },
    });

    // 请求成功提示
    if (res?.message) {
      Message.success({
        content: res.message,
        duration: 2000
      });
    }

    return res;
  } catch (error) {
    // 3. 统一异常捕获
    const errMsg = (error as Error).message || '服务器异常';
    Message.error({
      content: errMsg,
      duration: 3000,
      closable: true
    });
    console.error('请求异常：', url, error);
    throw error;
  } finally {
    // 4. 关闭加载状态
    if (showLoading && loadingInstance) {
      loadingInstance.close();
    }
  }
};

// 封装常用的 GET/POST 方法（简化调用）
export const useGet = <T = any>(url: string, params?: any, showLoading = true) => {
  return useRequest<T>(url, { method: 'GET', params }, showLoading);
};

export const usePost = <T = any>(url: string, data?: any, showLoading = true) => {
  return useRequest<T>(url, { method: 'POST', body: data }, showLoading);
};