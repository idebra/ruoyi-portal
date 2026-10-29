// 与若依后端的通信层。/prod-api 由本服务的 nginx 反代到 app:8080（与后台前端同一通道）。
const BASE = '/prod-api'

async function call(method, path, data, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  })
  return res.json()
}

export const api = {
  captcha: () => call('GET', '/captchaImage'),
  login: (username, password, code, uuid) =>
    call('POST', '/login', { username, password, code, uuid }),
  register: (username, password, code, uuid) =>
    call('POST', '/register', { username, password, code, uuid }),
  getInfo: (token) => call('GET', '/getInfo', null, token),
  logout: (token) => call('POST', '/logout', null, token)
}

const TOKEN_KEY = 'portal_token'
const GUEST_KEY = 'portal_guest'

export const session = {
  token: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(GUEST_KEY)
  },
  asGuest: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.setItem(GUEST_KEY, '1')
  },
  isGuest: () => localStorage.getItem(GUEST_KEY) === '1'
}

// 管理后台地址：与门户同一台机器，端口段 8091→8090（InstaBox 发布域名规律）；本地开发时退化为同主机 8080。
export function adminUrl() {
  const { protocol, hostname } = window.location
  if (/^8091-/.test(hostname)) return `${protocol}//${hostname.replace(/^8091-/, '8090-')}`
  if (hostname === 'localhost' || hostname === '127.0.0.1') return `${protocol}//${hostname}:8080`
  return `${protocol}//${hostname.replace(/^8091-/, '8090-')}`
}
