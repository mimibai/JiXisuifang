import request from '@/utils/request'
//获取个案患者列表
export function GetPatientList(data) {
  return request({
    url: '/FrontInterfaces/IndividualCase/GetPatientList',
    method: 'get',
    params: data
  })
}
//获取就诊人列表页码信息
export function GetPageCountPatient(data) {
  return request({
    url: '/FrontInterfaces/IndividualCase/GetPageCount',
    method: 'get',
    params: data
  })
}
//新建个案患者Get
export function CreatePatientGet(data) {
  return request({
    url: '/FrontInterfaces/IndividualCase/Create',
    method: 'get',
    params: data
  })
}
//获取个案患者详情
export function GetPatientDetail(data) {
  return request({
    url: '/FrontInterfaces/IndividualCase/GetPatientDetail',
    method: 'get',
    params: data
  })
}
//新建个案患者Post
export function CreatePatientPost(data) {
  return request({
    url: '/FrontInterfaces/IndividualCase/Create',
    method: 'post',
    params: data
  })
}
//移除个案患者
export function RemovePatientPost(data) {
  return request({
    url: '/FrontInterfaces/IndividualCase/Remove',
    method: 'post',
    params: data
  })
}
//获取住院记录
export function GetInpatientRecordList(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/GetInpatientRecordList',
    method: 'get',
    params: data
  })
}

//新建住院记录（Get）
export function CreateRecordGet(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/CreateInpatientRecord',
    method: 'get',
    params: data
  })
}
//新建住院记录（Post）
export function CreateRecordPost(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/CreateInpatientRecord',
    method: 'post',
    params: data
  })
}
//编辑住院记录（Get）
export function EditRecordGet(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/CreateInpatientRecord',
    method: 'get',
    params: data
  })
}
//编辑住院记录（Post）
export function EditRecordPost(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/CreateInpatientRecord',
    method: 'post',
    params: data
  })
}
//登记实际入院时间(Get)
export function RegisterInpatientDatetimeGet(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/RegisterInpatientDatetime',
    method: 'get',
    params: data
  })
}
//登记实际入院时间(Get)
export function RegisterInpatientDatetimePost(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/RegisterInpatientDatetime',
    method: 'post',
    params: data
  })
}
//登记出院时间(Get)
export function LeaveDatetimeGet(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/RegisterLeaveDatetime',
    method: 'get',
    params: data
  })
}
//登记出院时间(Get)
export function LeaveDatetimePost(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/RegisterLeaveDatetime',
    method: 'post',
    params: data
  })
}
//维护入院登记信息(Get)
export function CreateInpatientRegistrationRecord(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/CreateInpatientRegistrationRecord',
    method: 'get',
    params: data
  })
}
//维护入院登记信息(Post)
export function CreateInpatientRegistrationRecordPost(data) {
  return request({
    url: '/FrontInterfaces/InpatientRecords/CreateInpatientRegistrationRecord',
    method: 'post',
    params: data
  })
}

