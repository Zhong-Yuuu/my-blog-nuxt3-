/**
 * Nuxt3 请求封装
 * 基于原生 $fetch + ArcoDesign 全局提示
 */
import { Message } from '@arco-design/web-vue';

// 统一请求配置
const requestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {},
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
    // 2. 动态处理请求体和 Content-Type
    const requestOptions = { ...requestConfig, ...options };
    
    // 核心优化：自动适配 Content-Type
    if (requestOptions.body) {
      // 情况1：FormData（文件上传/表单）→ 自动设为 multipart/form-data
      if (requestOptions.body instanceof FormData) {
        requestOptions.headers = {
          ...requestOptions.headers,
          // 不手动设置 Content-Type，让浏览器自动加 boundary
        };
      }
      // 情况2：普通对象 → 设为 application/json（兼容原有逻辑）
      else if (typeof requestOptions.body === 'object' && !ArrayBuffer.isView(requestOptions.body)) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'Content-Type': 'application/json',
        };
        requestOptions.body = JSON.stringify(requestOptions.body);
      }
      // 情况3：URLSearchParams → 设为 application/x-www-form-urlencoded
      else if (requestOptions.body instanceof URLSearchParams) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        };
      }
      // 情况4：其他类型（字符串/二进制）→ 不处理，保持原生
    }

    // 3. 从本地存储获取 Token，自动添加到请求头（补充之前漏的 Token 逻辑）
    const token = localStorage.getItem('adminToken');
    if (token) {
      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // 4. 发起请求
    const res = await $fetch<T>(url, {
      ...requestOptions,
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
          localStorage.removeItem('adminToken'); // 清除无效 Token
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
    // 5. 统一异常捕获
    const errMsg = (error as Error).message || '服务器异常';
    Message.error({
      content: errMsg,
      duration: 3000,
      closable: true
    });
    console.error('请求异常：', url, error);
    throw error;
  } finally {
    // 6. 关闭加载状态
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

// 新增：封装上传文件的方法
export const useUpload = <T = any>(url: string, formData: FormData, showLoading = true) => {
  return useRequest<T>(url, { method: 'POST', body: formData }, showLoading);
};