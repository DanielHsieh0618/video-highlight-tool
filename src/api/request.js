import axios from 'axios'
const timeout = 20000

export const instance = axios.create({
  baseURL: '/api/',
  timeout
})

instance.interceptors.response.use(
  function (response) {
    return response
  },

  async function (error) {
    const response = error?.response
    const status = response?.status
    const errorCode = error.code

    const STATUS_MESSAGES = {
      400: '發生錯誤，請再重新嘗試',
      401: '尚未登入系統，請登入',
      403: '沒有權限',
      404: '資源不存在',
      405: 'HTTP 請求方法錯誤',
      410: '資源已過期',
      500: '伺服器異常',
      502: '伺服器服務異常',
      503: '伺服器暫時無法處理請求',
      504: '伺服器沒有回應，請稍後再試',
      default: '發生意外錯誤，請稍後再試'
    }

    if (errorCode === 'ECONNABORTED') return '網路請求超時，請重新嘗試'

    error.message = STATUS_MESSAGES[status] || STATUS_MESSAGES.default
    error.status = error?.response?.status || '--'
    error.code = error?.response?.data?.code || '--'

    return Promise.reject(error)
  }
)
