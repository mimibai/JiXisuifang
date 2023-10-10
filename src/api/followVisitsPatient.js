import request from '@/utils/request'
// 获取就诊人参与随访方案列表
export function getCaseJoinFollowVisitList(data) {
    return request({
        url: '/FrontPatientInterfaces/CaseJoinFollowVisits/GetCaseJoinFollowVisitList',
        method: 'Get',
        params: data
    })
}
// 随访任务完成状态修改
export function modifyTaskDetailState(data) {
    return request({
        url: '/FrontPatientInterfaces/CaseJoinFollowVisits/ModifyTaskDetailState',
        method: 'Post',
        data
    })
}
// 是否本院体检状态修改
export function modifyIsCheckUpInOurHos(data) {
    return request({
        url: '/FrontPatientInterfaces/CaseJoinFollowVisits/ModifyIsCheckUpInOurHos',
        method: 'Post',
        data
    })
}
// 随访问卷提交
export function subFollowVisitVote(data) {
    return request({
        url: '/FrontPatientInterfaces/CaseJoinFollowVisits/SubVote',
        method: 'Post',
        data
    })
}