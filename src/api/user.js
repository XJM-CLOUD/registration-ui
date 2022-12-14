import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function refreshToken(refreshToken) {
  return request({
    url: '/token/refreshToken',
    method: 'post',
    params: { refreshToken }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
