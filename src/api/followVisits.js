import request from '@/utils/request'
// 获取就诊人参与随访方案列表
export function getCaseJoinFollowVisitList(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/GetCaseJoinFollowVisitList',
    method: 'Get',
    params: data
  })
}
// 开启当前参与随访方案
export function openCaseJoinFollowVisit(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/OpenCaseJoinFollowVisit',
    method: 'Post',
    data
  })
}
// 删除当前参与随访方案
export function delCaseJoinFollowVisit(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/DelCaseJoinFollowVisit',
    method: 'Post',
    data
  })
}
// 获取参与随访方案关联随访计划
export function getCaseFollowVisitTaskByCaseJoinVisitIdList(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/GetCaseFollowVisitTaskByCaseJoinVisitIdList',
    method: 'Get',
    params: data
  })
}
// 获取参与随访方案关联随访任务
export function getCaseFollowVisitTaskDetailByCaseJoinVisitIdList(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/GetCaseFollowVisitTaskDetailByCaseJoinVisitIdList',
    method: 'Get',
    params: data
  })
}
// 删除真实随访任务
export function delCaseFollowVisitDetail(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/DelCaseFollowVisitDetail',
    method: 'Post',
    data
  })
}
// 新建、复制参与随访方案（Get）
export function getCreateCaseJoinFollowVisit(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/CreateCaseJoinFollowVisit',
    method: 'Get',
    params: data
  })
}
// 新建、复制参与随访方案（Post）
export function postCreateCaseJoinFollowVisit(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/CreateCaseJoinFollowVisit',
    method: 'Post',
    data
  })
}
// 校验当前选择随访方案是否存在今天之前的任务
export function isExistPreviousTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/IsExistPreviousTask',
    method: 'Post',
    data
  })
}
// 随访管理公共任务
export function getTaskPoolList(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/GetTaskPoolList',
    method: 'Get',
    params: data
  })
}

// 领取随访任务
export function claimTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/ClaimTask',
    method: 'Post',
    data
  })
}
// 获取随访任务详情
export function getTaskDetailForDoctor(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/GetTaskDetailForDoctor',
    method: 'Get',
    params: data
  })
}
// 新增异常回访记录
export function createAbnormalRecord(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/CreateAbnormalRecord',
    method: 'Post',
    data
  })
}
// 终止当前参与随访方案（Get）
export function getTerminationCaseJoinFollowVisit(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/TerminationCaseJoinFollowVisit',
    method: 'Get',
    params: data
  })
}
// 终止当前参与随访方案（Post）
export function postTerminationCaseJoinFollowVisit(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/TerminationCaseJoinFollowVisit',
    method: 'Post',
    data
  })
}
// 随访问卷提交
export function subFollowVisitVote(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/SubVote',
    method: 'Post',
    data
  })
}
// 随访任务完成状态修改
export function modifyTaskDetailState(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/ModifyTaskDetailState',
    method: 'Post',
    data
  })
}
// 是否本院体检状态修改
export function modifyIsCheckUpInOurHos(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/ModifyIsCheckUpInOurHos',
    method: 'Post',
    data
  })
}
//反写体检预约信息至随访任务
export function rememberPEReserveId(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/RememberPEReserveId',
    method: 'Post',
    data
  })
}
// 新建、编辑随访计划（Get）
export function getCreateCaseFollowVisitTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/CreateCaseFollowVisitTask',
    method: 'Get',
    params: data
  })
}
// 新建、编辑随访计划（Post）
export function postCreateCaseFollowVisitTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/CreateCaseFollowVisitTask',
    method: 'Post',
    data
  })
}
// 停用随访计划
export function cancelCaseFollowVisitTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/CancelCaseFollowVisitTask',
    method: 'Post',
    data
  })
}
//上移随访计划
export function moveUpCaseFollowVisitTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/MoveUpCaseFollowVisitTask',
    method: 'Post',
    data
  })
}
//下移随访计划
export function moveDownCaseFollowVisitTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/MoveDownCaseFollowVisitTask',
    method: 'Post',
    data
  })
}
//删除随访计划
export function delCaseFollowVisitTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/DelCaseFollowVisitTask',
    method: 'Post',
    data
  })
}
// 随访管理个人任务列表
export function getCaseDetailByPersonalList(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/GetCaseDetailByPersonalList',
    method: 'Get',
    params: data
  })
}
// 随访管理个人任务退回
export function sendBackTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/SendBackTask',
    method: 'Post',
    data
  })
}
// 随访管理个人任务重新发送任务提醒
export function repeatCaseTaskDetailRemind(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/RepeatCaseTaskDetailRemind',
    method: 'Post',
    data
  })
}

// 随访管理个人任务作废
export function terminationCaseFollowVisitDetailGet(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/TerminationCaseFollowVisitDetail',
    method: 'Get',
    params: data
  })
}
export function terminationCaseFollowVisitDetail(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/TerminationCaseFollowVisitDetail',
    method: 'Post',
    data
  })
}

// 随访个人任务新增、编辑
export function createCaseFollowVisitTaskDetailGet(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/CreateCaseFollowVisitTaskDetail',
    method: 'Get',
    params: data
  })
}
export function createCaseFollowVisitTaskDetailPost(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/CreateCaseFollowVisitTaskDetail',
    method: 'Post',
    data
  })
}

// 随访方案列表
export function getPlanList(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/GetPlanList',
    method: 'Get',
    params: data
  })
}
// 停用随访方案
export function closeVisitPlan(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/CloseVisitPlan',
    method: 'Post',
    data
  })
}
// 启用随访方案
export function openVisitPlan(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/OpenVisitPlan',
    method: 'Post',
    data
  })
}
// 新增、编辑随访方案
export function createVisitPlanGet(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/CreateVisitPlan',
    method: 'Get',
    params: data
  })
}
export function createVisitPlanPost(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/CreateVisitPlan',
    method: 'Post',
    data
  })
}
// 随访方案关联随访任务
export function getTaskList(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/GetTaskList',
    method: 'Get',
    params: data
  })
}

// 随访方案中的任务停用
export function closeVisitTask(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/CloseVisitTask',
    method: 'Post',
    data
  })
}

// 随访方案中的任务开启
export function openVisitTask(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/OpenVisitTask',
    method: 'Post',
    data
  })
}

// 随访任务编辑、新建
export function createVisitTaskGet(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/CreateVisitTask',
    method: 'Get',
    params: data
  })
}
export function createVisitTaskPost(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/CreateVisitTask',
    method: 'Post',
    data
  })
}
//获取当前就诊人下运行中参与随访方案记录
export function getCaseJoinVisitByPatientId(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/GetCaseJoinVisitByPatientId',
    method: 'Get',
    params: data
  })
}
// 随访任务上移
export function moveUpVisitTask(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/MoveUpVisitTask',
    method: 'Post',
    data
  })
}

// 随访任务下移
export function moveDownVisitTask(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/MoveDownVisitTask',
    method: 'Post',
    data
  })
}

// 随访问卷列表
export function getVoteList(data) {
  return request({
    url: '/FrontInterfaces/Votes/GetVoteList',
    method: 'Post',
    data
  })
}
// 随访问卷停用
export function closeVote(data) {
  return request({
    url: '/FrontInterfaces/Votes/CloseVote',
    method: 'Post',
    data
  })
}
// 随访问卷开启
export function openVote(data) {
  return request({
    url: '/FrontInterfaces/Votes/OpenVote',
    method: 'Post',
    data
  })
}
// 随访问卷删除
export function delVote(data) {
  return request({
    url: '/FrontInterfaces/Votes/DelVote',
    method: 'Post',
    data
  })
}
// 随访问卷编辑、新建
export function createVoteGet(data) {
  return request({
    url: '/FrontInterfaces/Votes/CreateVote',
    method: 'Get',
    params: data
  })
}
export function createVotePost(data) {
  return request({
    url: '/FrontInterfaces/Votes/CreateVote',
    method: 'Post',
    data
  })
}
// 随访问卷关联题目集合
export function getVoteItemList(data) {
  return request({
    url: '/FrontInterfaces/Votes/GetVoteItemList',
    method: 'Get',
    params: data
  })
}
// 随访问卷关联题目上移
export function moveUpVoteItem(data) {
  return request({
    url: '/FrontInterfaces/Votes/MoveUpVoteItem',
    method: 'Post',
    data
  })
}

// 随访问卷关联题目下移
export function moveDownVoteItem(data) {
  return request({
    url: '/FrontInterfaces/Votes/MoveDownVoteItem',
    method: 'Post',
    data
  })
}
// 随访问卷关联题目停用
export function closeVoteItem(data) {
  return request({
    url: '/FrontInterfaces/Votes/CloseVoteItem',
    method: 'Post',
    data
  })
}
// 随访问卷关联题目开启
export function openVoteItem(data) {
  return request({
    url: '/FrontInterfaces/Votes/OpenVoteItem',
    method: 'Post',
    data
  })
}
// 随访问卷关联题目删除
export function delVoteItem(data) {
  return request({
    url: '/FrontInterfaces/Votes/DelVoteItem',
    method: 'Post',
    data
  })
}
// 随访问卷关联题目新建、编辑
export function createVoteItemGet(data) {
  return request({
    url: '/FrontInterfaces/Votes/CreateVoteItem',
    method: 'Get',
    params: data
  })
}
export function createVoteItemPost(data) {
  return request({
    url: '/FrontInterfaces/Votes/CreateVoteItem',
    method: 'Post',
    data
  })
}
// 随访问卷关联题目明细集合
export function getVoteDetailList(data) {
  return request({
    url: '/FrontInterfaces/Votes/GetVoteDetailList',
    method: 'Get',
    params: data
  })
}
// 随访问卷关联题目明细上移
export function moveUpVoteDetail(data) {
  return request({
    url: '/FrontInterfaces/Votes/MoveUpVoteDetail',
    method: 'Post',
    data
  })
}

// 随访问卷关联题目明细下移
export function moveDownVoteDetail(data) {
  return request({
    url: '/FrontInterfaces/Votes/MoveDownVoteDetail',
    method: 'Post',
    data
  })
}

// 随访问卷关联题目明细删除
export function delVoteDetail(data) {
  return request({
    url: '/FrontInterfaces/Votes/DelVoteDetail',
    method: 'Post',
    data
  })
}

// 随访问卷编辑、新建
export function createVoteDetailGet(data) {
  return request({
    url: '/FrontInterfaces/Votes/CreateVoteDetail',
    method: 'Get',
    params: data
  })
}
export function createVoteDetailPost(data) {
  return request({
    url: '/FrontInterfaces/Votes/CreateVoteDetail',
    method: 'Post',
    data
  })
}
//批量删除随访计划
export function batchDelCaseFollowVisitTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/BatchDelCaseFollowVisitTask',
    method: 'Post',
    data
  })
}
//批量停用随访计划
export function batchCancelCaseFollowVisitTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/BatchCancelCaseFollowVisitTask',
    method: 'Post',
    data
  })
}
// 随访方案详情
export function GetPlanDetail(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/GetPlanDetail',
    method: 'Get',
    params: data
  })
}
// 随访方案任务详情
export function GetTaskDetail(data) {
  return request({
    url: '/FrontInterfaces/FollowVisit/GetTaskDetail',
    method: 'Get',
    params: data
  })
}
// 随访问卷详情
export function GetVoteDetails(data) {
  return request({
    url: '/FrontInterfaces/Votes/GetVoteDetails',
    method: 'Get',
    params: data
  })
}
// 随访问卷题目详情
export function GetVoteItemDetails(data) {
  return request({
    url: '/FrontInterfaces/Votes/GetVoteItemDetails',
    method: 'Get',
    params: data
  })
}
// 随访问卷题目明细详情
export function GetVoteDetailDetails(data) {
  return request({
    url: '/FrontInterfaces/Votes/GetVoteDetailDetails',
    method: 'Get',
    params: data
  })
}
// 获取可以复用的随访计划
export function BatchDelCaseFollowVisitTask(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinFollowVisits/GetAllowReuseTaskList',
    method: 'Get',
    params: data
  })
}