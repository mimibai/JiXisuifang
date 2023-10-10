// pad端癌筛评测
import request from '@/utils/request'
// 终端入口验证
export function startEntranceGet(data) {
  return request({
    url: '/FrontInterfaces/Terminal/StartEntrance',
    method: 'Get',
    headers: { 'SecretKeyToken': data.secretKeyToken || '' }
  })
}
// 终端入口验证
export function startEntrancePost(data) {
  return request({
    url: '/FrontInterfaces/Terminal/StartEntrance',
    method: 'Post',
    headers: { 'SecretKeyToken': data.secretKeyToken || '' },
    data
  })
}
// 免密钥登录
export function getTerminalUrlLogon(data) {
  return request({
    url: '/FrontInterfaces/Terminal/UrlLogon',
    method: 'Get',
    params: data
  })
}
// 验证密钥（Get）
export function getCheckSecretKey() {
  return request({
    url: '/FrontInterfaces/Terminal/CheckSecretKey',
    method: 'Get'
  })
}
// 提交秘钥
export function postCheckSecretKey(data) {
  return request({
    url: '/FrontInterfaces/Terminal/CheckSecretKey',
    method: 'Post',
    data
  })
}
// 获取该终端下可填写的参与测评信息
export function getCaseJoinList(data) {
  return request({
    url: '/FrontInterfaces/Terminal/GetCaseJoinList',
    method: 'Post',
    headers: { 'SecretKeyToken': data.secretKeyToken || '' },
    data
  })
}
// 查看ip
export function getIp() {
  return request({
    url: '/FrontInterfaces/Terminal/GetTerminalIP',
    method: 'Get'
  })
}
