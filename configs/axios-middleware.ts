/**
 * Axios-compatible fetch wrapper middleware.
 * Auto-attaches the Bearer token from localStorage.
 * Handles 401 by clearing stored credentials.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.itfixer199.com'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

interface RequestConfig {
  method?: string
  headers?: Record<string, string>
  body?: string
}

async function request(url: string, config: RequestConfig = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config.headers || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...config,
    headers,
  })

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh')
      localStorage.removeItem('user')
    }
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw { response: { status: response.status, data } }

  return { data, status: response.status }
}

const axiosInstance = {
  get: (url: string, config?: any) => request(url, { method: 'GET', ...config }),
  post: (url: string, body?: any, config?: any) =>
    request(url, { method: 'POST', body: JSON.stringify(body), ...config }),
  put: (url: string, body?: any, config?: any) =>
    request(url, { method: 'PUT', body: JSON.stringify(body), ...config }),
  patch: (url: string, body?: any, config?: any) =>
    request(url, { method: 'PATCH', body: JSON.stringify(body), ...config }),
  delete: (url: string, config?: any) => request(url, { method: 'DELETE', ...config }),
}

export default axiosInstance
