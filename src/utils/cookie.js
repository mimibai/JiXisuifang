import Cookies from 'js-cookie'
export function getCookieToken(tokenKey) {
  return Cookies.get(tokenKey)
}
export function setCookieToken(tokenKey, token) {
  console.log(tokenKey, token)
  return Cookies.set(tokenKey, token, {
    // token在Cookie中存储的天数，默认1天
    expires: 7
  })
}
export function removeCookieToken(tokenKey) {
  return Cookies.remove(tokenKey)
}
