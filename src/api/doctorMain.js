import request from '@/utils/request'
// 医生端首页接口汇总
//获取日历详情
export function getDailyInformation(data) {
    return request({
        url: '/FrontInterfaces/DoctorHomeManager/GetDailyInformation',
        method: 'Get',
        params: data
    })
}
//获取随访任务统计
export function getFollowVisitStatics(data) {
    return request({
        url: '/FrontInterfaces/DoctorHomeManager/GetFollowVisitStatics',
        method: 'Get',
        params: data
    })
}
//快捷操作
export function getShortcutOperations(data) {
    return request({
        url: '/FrontInterfaces/DoctorHomeManager/ShortcutOperations',
        method: 'Get',
        params: data
    })
}
//预约统计
export function getPEStatics(data) {
    return request({
        url: '/FrontInterfaces/DoctorHomeManager/GetPEStatics',
        method: 'Get',
        params: data
    })
}
//癌筛统计
export function getCaseJoinProtocolStatics(data) {
    return request({
        url: '/FrontInterfaces/DoctorHomeManager/GetCaseJoinProtocolStatics',
        method: 'Get',
        params: data
    })
}
//满意度调查统计
export function getVoteStatics(data) {
    return request({
        url: '/FrontInterfaces/DoctorHomeManager/GetVoteStatics',
        method: 'Get',
        params: data
    })
}
export function deleteCase(data) {
    return request({
        url: '/FrontInterfaces/CaseJoinProtocol/Delete',
        method: 'Post',
        data
    })
}
//我的随访任务列表
export function getCaseDetailByPersonalList(data) {
    return request({
        url: '/FrontInterfaces/DoctorHomeManager/GetCaseDetailByPersonalList',
        method: 'Get',
        params: data
    })
}
//今日癌筛预约列表
export function getPEReserves(data) {
    return request({
        url: '/FrontInterfaces/DoctorHomeManager/GetPEReserves',
        method: 'Get',
        params: data
    })
}



