
const addTokenKey = 'screeningforcancer-jingxi'//起加密作用

export function getToken(TokenKey) {
  return localStorage.getItem(TokenKey + addTokenKey)
}

export function setToken(TokenKey, token) {
  return localStorage.setItem(TokenKey + addTokenKey, token)
}

export function removeToken(TokenKey) {
  return localStorage.removeItem(TokenKey + addTokenKey)
}
