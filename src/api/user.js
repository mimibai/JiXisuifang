import request from '@/utils/request'
// 登录
export function login(data) {
  return request({
    url: '/FrontInterfaces/Main/Logon',
    method: 'post',
    data
  })
}
// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/FrontInterfaces/Main/GetUserInformation',
    method: 'get',
    params: {
      token
    }
  })
}
// 获取系统支持登录方式
export function getLogonType() {
  return request({
    url: '/FrontInterfaces/Main/GetLogonType',
    method: 'get'
  })
}
// 生成手机动态码（手机号登录或通过手机号绑定时使用）
export function GenerateMobileNumVerification(data) {
  return request({
    url: '/FrontInterfaces/Main/GenerateMobileNumVerification',
    method: 'post',
    data
  })
}
// 获取登录二维码
export function getWeiChatQrCode() {
  return request({
    url: '/FrontInterfaces/Main/WeiXin_GetQrCode',
    method: 'get'
  })
}
// 二维码扫描
export function checkScanResult(data) {
  return request({
    url: '/FrontInterfaces/Main/WeiXin_CheckScanResult',
    method: 'post',
    data
  })
}
// 微信绑定账户
export function bindAccount(data) {
  return request({
    url: '/FrontInterfaces/Main/WeiXin_BindAccount',
    method: 'post',
    data
  })
}
// 微信进行创建登录账户并登录
export function wechatNewCreate(data) {
  return request({
    url: '/FrontInterfaces/Main/WeiXin_NewCreate',
    method: 'post',
    data
  })
}
// 第三方登录
export function logonByThirdParty(data) {
  return request({
    url: '/FrontInterfaces/Main/LogonByThirdParty',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-AjaxPro-Method': 'ShowList'
    },
    data: data
  })
}
// 注册
export function register(userInfo) {
  return request({
    url: '/FrontInterfaces/Main/Register',
    method: 'post',
    data: userInfo
  })
}
// 用户使用协议拼接展示
export function getUserUseProtocol(data) {
  return request({
    url: '/FrontInterfaces/Main/GetUserUseProtocol',
    method: 'get',
    // axios get请求只能用param传参
    params: data
  })
}
// 协议和说明列表
export function getUserUseProtocolList(data) {
  return request({
    url: '/FrontInterfaces/Main/GetUserUseProtocolList',
    method: 'get',
    // axios get请求只能用param传参
    params: data
  })
}
// 获取协议详情
export function getUserUseProtocolDetail(data) {
  return request({
    url: '/FrontInterfaces/Main/GetUserUseProtocolDetail',
    method: 'get',
    // axios get请求只能用param传参
    params: data
  })
}
// 注销账号
export function unregisterRemind(data) {
  return request({
    url: '/FrontInterfaces/Main/UnregisterRemind',
    method: 'get',
    // axios get请求只能用param传参
    params: data
  })
}
// 获取用户注册密码限制相关信息
export function GetPwdLimitInformation(data) {
  return request({
    url: '/FrontInterfaces/Main/GetPwdLimitInformation',
    method: 'get',
    // axios get请求只能用param传参
    params: data
  })
}
// 跳转至管理端
export function admin() {
  return request({
    url: '/FrontInterfaces/Main/GetManagerKey',
    method: 'get'
  })
}
// 注销
export function logout() {
  return request({
    url: '/FrontInterfaces/Main/LogOff',
    method: 'post'
  })
}
// 账户名修改
export function ChangeUserName(userNameInfo) {
  return request({
    url: '/FrontInterfaces/Main/ChangeUserName',
    method: 'post',
    data: userNameInfo
  })
}
// 密码修改
export function changePassword(pwdInfo) {
  return request({
    url: '/FrontInterfaces/Main/ChangePassword',
    method: 'post',
    data: pwdInfo
  })
}
// 绑定手机号修改
export function ChangeMobileNumberGet(data) {
  return request({
    url: '/FrontInterfaces/Main/ModifyMobileNum',
    method: 'get',
    // axios get请求只能用param传参
    params: data
  })
}
// 绑定手机号修改post
export function ChangeMobileNumberPost(data) {
  return request({
    url: '/FrontInterfaces/Main/ModifyMobileNum',
    method: 'post',
    data: data
  })
}
// 获取手机号短信验证码
export function GenerateVerificationByLogon(data) {
  return request({
    url: '/FrontInterfaces/Main/GenerateVerificationByLogon',
    method: 'get',
    params: data
  })
}
// 绑定邮箱修改
export function ChangeEmail(emailInfo) {
  return request({
    url: '/FrontInterfaces/Main/ChangeEmail',
    method: 'post',
    data: emailInfo
  })
}
// 校验是否绑定微信
export function isBindWX() {
  return request({
    url: '/FrontInterfaces/Main/IsBindWX',
    method: 'get'
  })
}
// 解绑
export function weiXinUnbundling() {
  return request({
    url: '/FrontInterfaces/Main/WeiXinUnbundling',
    method: 'post'
  })
}
