import Cookies from 'js-cookie'

const TokenKey = 'access_token'
const RefreshTokenKey = 'refresh_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return localStorage.getItem(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return localStorage.setItem(RefreshTokenKey, token)
}

export function removeRefreshToken() {
  return localStorage.removeItem(RefreshTokenKey)
}
