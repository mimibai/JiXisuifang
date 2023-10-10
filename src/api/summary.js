import request from '@/utils/request'
//获取当前方案是否开启医生指摘
export function CheckIsShowDoctorCensure(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/CheckIsShowDoctorCensure',
        method: 'get',
        params: data
    })
}
//新建就诊人参与方案(get)
export function CaseJoinProtocol(data) {
    return request({
        url: '/FrontInterfaces/CaseJoinProtocol/Create',
        method: 'get',
        params: data
    })
}
//新建就诊人参与方案(post)
export function CaseJoinProtocolPost(data) {
    return request({
        url: '/FrontInterfaces/CaseJoinProtocol/Create',
        method: 'Post',
        data
    })
}
//获取癌筛问卷详情页
export function getMINIPage(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetMINIPage',
        method: 'Get',
        params: data,
    })
}
/*患者端癌筛问卷接口优化部分开始*/
//获取癌筛问卷详情页
export function getNewMINIPage(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetNewMINIPage',
        method: 'Get',
        params: data,
    })
}
//获取当前页面所用到的触发事件
export function getFollowupMINITriggerEventsByTopicCode(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetFollowupMINITriggerEventsByTopicCode',
        method: 'Get',
        params: data,
    })
}
//生成当前填写页面真实题目信息
export function postGenerateFillTopic(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GenerateFillTopic',
        method: 'Post',
        data,
    })
}
//当前页面填写题目信息提交
export function postFilledPageSub(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/FilledPageSub',
        method: 'Post',
        data,
    })
}
/*患者端癌筛问卷接口优化部分结束*/
//获取就诊人参与方案下阶段菜单
export function getCaseProgressPeriodList(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetCaseProgressPeriodList',
        method: 'Get',
        params: data,
    })
}
//获取就诊人参与方案下问卷菜单
export function getFollowupMINIPageList(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetFollowupMINIPageList',
        method: 'Get',
        params: data,
    })
}
//获取知情同意书
export function getConsent(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetConsent',
        method: 'Get',
        params: data,
    })
}
//修改知情同意书状态
export function updateConsentState(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/UpdateConsentState',
        method: 'Post',
        data,
    })
}
//提交单题数据
export function topicSub(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/TopicSub',
        method: 'post',
        data,
    })
}
//修改问卷完成标记
export function updateFinishState(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/UpdateFinishState',
        method: 'Post',
        data,
    })
}
//锁定就诊人填写问卷
export function lockCaseJoinProtocol(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/LockCaseJoinProtocol',
        method: 'Post',
        data,
    })
}
//获取医生建议
export function getDoctorAdvice(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetDoctorAdvice',
        method: 'Get',
        params: data,
    })
}
//获取随访方案列表
export function getSurveyList(data) {
    return request({
        url: 'FrontPatientInterfaces/FollowupProtocol/GetList',
        method: 'Get',
        params: data,
    })
}
//获取就诊人参与方案列表
export function getCaseJoinProtocolList(data) {
    return request({
        url: '/FrontInterfaces/CaseJoinProtocol/GetList',
        method: 'Get',
        params: data,
    })
}
//获取就诊人参与方案列表分页页码
export function GetPageCount(data) {
    return request({
        url: '/FrontInterfaces/CaseJoinProtocol/GetPageCount',
        method: 'Get',
        params: data,
    })
}
//检查当前就诊人是否存在未完成的方案
export function checkIsExistNotSucProtocal(data) {
    return request({
        url: '/FrontInterfaces/CaseJoinProtocol/CheckIsExistNotSucProtocal',
        method: 'Get',
        params: data,
    })
}
//获取终检结果
export function getSurveyResult(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetResult',
        method: 'Get',
        params: data,
    })
}
//获取医生指摘
export function getDoctorCensure(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetDoctorCensure',
        method: 'Get',
        params: data,
    })
}
//pad和自助端问卷填写
//获取该终端下可填写的参与测评信息
export function getTerminalCaseJoinList(data) {
    return request({
        url: '/FrontInterfaces/Terminal/GetCaseJoinList',
        method: 'Post',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        data: { code: data.code, }
    })
}
//获取该终端下就诊人参与方案下阶段菜单
export function getTerminalCaseProgressPeriodList(data) {
    return request({
        url: '/FrontInterfaces/Terminal/GetCaseProgressPeriodList',
        method: 'Post',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        data,
    })
}
//获取该终端下知情同意书
export function getTerminalConsent(data) {
    return request({
        url: '/FrontInterfaces/Terminal/GetConsent',
        method: 'Get',
        params: data,
    })
}
//修改该终端下知情同意书状态
export function updateTerminalConsentState(data) {
    return request({
        url: '/FrontInterfaces/Terminal/UpdateConsentState',
        method: 'Post',
        data,
    })
}
//获取该终端就诊人参与方案下问卷菜单
export function getTerminalFollowupMINIPageList(data) {
    return request({
        url: '/FrontInterfaces/Terminal/GetFollowupMINIPageList',
        method: 'Get',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        params: data,
    })
}
//获取该终端癌筛问卷详情页
export function getTerminalMINIPage(data) {
    return request({
        url: '/FrontInterfaces/Terminal/GetMINIPage',
        method: 'Get',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        params: data,
    })
}
//提交该终端单题数据
export function terminaltopicSub(data) {
    return request({
        url: '/FrontInterfaces/Terminal/TopicSub',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        method: 'post',
        data,
    })
}
/*终端癌筛问卷接口优化部分开始*/
/*获取终端癌筛问卷详情页*/
export function getTerminalNewMINIPage(data) {
    return request({
        url: '/FrontInterfaces/Terminal/GetNewMINIPage',
        method: 'Get',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        params: data,
    })
}
/*生成当前填写页面真实题目信息*/
export function generateTerminalFillTopic(data) {
    return request({
        url: '/FrontInterfaces/Terminal/GenerateFillTopic',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        method: 'post',
        data,
    })
}
/*获取当前页面所用到的触发事件*/
export function getTerminalFollowupMINITriggerEventsByTopicCode(data) {
    return request({
        url: '/FrontInterfaces/Terminal/GetFollowupMINITriggerEventsByTopicCode',
        method: 'Get',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        params: data,
    })
}
/*当前页面填写题目信息提交*/
export function terminalFilledPageSub(data) {
    return request({
        url: '/FrontInterfaces/Terminal/FilledPageSub',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        method: 'post',
        data,
    })
}
/*终端癌筛问卷接口优化部分结束*/
//修改该终端问卷完成标记
export function updateTerminalFinishState(data) {
    return request({
        url: '/FrontInterfaces/Terminal/UpdateFinishState',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        method: 'Post',
        data,
    })
}
//锁定该终端就诊人填写问卷
export function lockTerminalCaseJoinProtocol(data) {
    return request({
        url: '/FrontInterfaces/Terminal/LockCaseJoinProtocol',
        headers: { 'SecretKeyToken': data.secretKeyToken || '' },
        method: 'Post',
        data,
    })
}
//单独获取癌筛项目
export function GetCheckItemData(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/GetCheckItemData',
        method: 'Get',
        params: data,
    })
}
//获取加项列表
export function GetAddItemByTPMutexTypeCode(data) {
    return request({
        url: '/FrontInterfaces/PEItem/GetAddItemByTPMutexTypeCode',
        method: 'Get',
        params: data,
    })
}
//获取终检报告
export function FinalReport(data) {
    return request({
        url: '/FrontInterfaces/FollowupMINIInformation/FinalReport',
        method: 'Get',
        params: data,
    })
}
//查询报告
export function GetReportResulto(data) {
    return request({
        url: '/FrontInterfaces/PEReserve/GetReportResulto',
        method: 'Get',
        params: data,
    })
}