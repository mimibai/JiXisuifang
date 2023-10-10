import request from '@/utils/request'
// 获取随访方案列表
export function getSurveyList(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupProtocol/GetList',
    method: 'Get',
    params: data
  })
}
// 获取就诊人参与方案列表
export function getCaseJoinProtocolList(data) {
  return request({
    url: '/FrontPatientInterfaces/CaseJoinProtocol/GetList',
    method: 'Get',
    params: data
  })
}
// 新建就诊人参与方案(get)
export function CaseJoinProtocol(data) {
  return request({
    url: '/FrontPatientInterfaces/CaseJoinProtocol/Create',
    method: 'get',
    data
  })
}
// 新建就诊人参与方案(post)
export function CaseJoinProtocolPost(data) {
  return request({
    url: '/FrontPatientInterfaces/CaseJoinProtocol/Create',
    method: 'Post',
    data
  })
}

export function getPatientDetail(data) {
  return request({
    url: '/FrontPatientInterfaces/CaseJoinProtocol/GetPatientCaseJoinProtocol',
    method: 'Get',
    // axios get请求只能用param传参
    params: data
  })
}
// 检查当前就诊人是否存在未完成的方案
export function checkIsExistNotSucProtocal(data) {
  return request({
    url: '/FrontPatientInterfaces/CaseJoinProtocol/CheckIsExistNotSucProtocal',
    method: 'Get',
    params: data
  })
}
// 2022/3/29
// 获取癌筛问卷详情页
export function getNewMINIPage(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/GetNewMINIPage',
    method: 'Get',
    params: data
  })
}
// 当前页面填写题目信息提交
export function postFilledPageSub(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/FilledPageSub',
    method: 'Post',
    data
  })
}
// 获取当前页面所用到的触发事件
export function getFollowupMINITriggerEventsByTopicCode(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/GetFollowupMINITriggerEventsByTopicCode',
    method: 'Get',
    params: data
  })
}
// 生成当前填写页面真实题目信息
export function postGenerateFillTopic(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/GenerateFillTopic',
    method: 'Post',
    data
  })
}
// 获取癌筛问卷详情页
export function getMINIPage(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/GetMINIPage',
    method: 'Get',
    params: data
  })
}
// 获取就诊人参与方案下阶段菜单
export function getCaseProgressPeriodList(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/GetCaseProgressPeriodList',
    method: 'Get',
    params: data
  })
}
// 获取就诊人参与方案下问卷菜单
export function getFollowupMINIPageList(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/GetFollowupMINIPageList',
    method: 'Get',
    params: data
  })
}
// 获取知情同意书
export function getConsent(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/GetConsent',
    method: 'Get',
    params: data
  })
}
// 修改知情同意书状态
export function updateConsentState(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/UpdateConsentState',
    method: 'Post',
    data
  })
}
// 提交单题数据
export function topicSub(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/TopicSub',
    method: 'post',
    data
  })
}
// 修改问卷完成标记
export function updateFinishState(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/UpdateFinishState',
    method: 'Post',
    data
  })
}
// 锁定就诊人填写问卷
export function lockCaseJoinProtocol(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/LockCaseJoinProtocol',
    method: 'Post',
    data
  })
}
// 获取终检结果
export function getPatientSurveyResult(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/GetResult',
    method: 'Get',
    params: data
  })
}
// 单独获取癌筛项目
export function GetCheckItemData(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/GetCheckItemData',
    method: 'Get',
    params: data
  })
}
// 获取终检报告
export function FinalReport(data) {
  return request({
    url: '/FrontPatientInterfaces/FollowupMINIInformation/FinalReport',
    method: 'Get',
    params: data
  })
}
