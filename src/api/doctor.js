import request from '@/utils/request'
//新建就诊人【医生工作站】（Get）
export function CreatePatientGet(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/CreatePatient',
    method: 'Get',
    // axios get请求只能用param传参
    params: data
  })
}
//新建就诊人【医生工作站】（Post）
export function CreatePatientPost(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/CreatePatient',
    method: 'Post',
    data
  })
}
//根据证件类型、证件号查询系统就诊人
export function GetPatientByDocumentType(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetPatientByDocumentType',
    method: 'Get',
    // axios get请求只能用param传参
    params: data
  })
}
export function getPatientDetail(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/GetPatientCaseJoinProtocol',
    method: 'Get',
    // axios get请求只能用param传参
    params: data
  })
}
// 获取当前医生就诊人分页页码
export function getPageCount() {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/GetPageCount',
    method: 'Get'
  })
}
// 删除
export function deleteCase(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/Delete',
    method: 'Post',
    data
  })
}
// 终端下机
export function susPend(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/Suspend',
    method: 'Post',
    data
  })
}
// 终端重新上机
export function restart(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/Restart',
    method: 'Get',
    params: data
  })
}
// 终端重新上机提交
export function restartPost(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/Restart',
    method: 'Post',
    data
  })
}
// 获取可用医院信息
export function getHospitalList(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetHospitalList',
    method: 'Get',
    params: data
  })
}
// 获取可用科室信息
export function getDepartmentList(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetDepartmentList',
    method: 'Get',
    params: data
  })
}
// 获取可用医生信息
export function getDoctorList(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetDoctorList',
    method: 'Get',
    params: data
  })
}
// 提交编辑后早筛信息
export function postCaseInfo(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/Edit',
    method: 'Post',
    data
  })
}
// 更改报告公开方案
export function changeState(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/UpdatePublicResultState',
    method: 'Post',
    data
  })
}
//终检报告补充资料get
export function getSupplementInformation(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/SupplementInformation',
    method: 'Get',
    params: data
  })
}
//终检报告补充资料post
export function postSupplementInformation(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/SupplementInformation',
    method: 'Post',
    data
  })
}
// 医生建议get请求
export function getDocAdvice(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/DoctorAdvice',
    method: 'Get',
    params: data
  })
}
// 医生建议post请求
export function postDocAdvice(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/DoctorAdvice',
    method: 'Post',
    data
  })
}

// 新增早筛患者页
// 获取所有就诊人集合
export function getAllPatientList(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetAllPatientList',
    method: 'Get',
    // axios get请求只能用param传参
    params: data
  })
}
//获取当前就诊人详情
export function getPatientInfo(data) {
  return request({
    url: '/FrontInterfaces/PatientManagement/GetPatient',
    method: 'get',
    params: data
  })
}
//根据身份证号查询系统就诊人
export function getPatientByIDCardNo(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetPatientByIDCardNo',
    method: 'Get',
    // axios get请求只能用param传参
    params: data
  })
}
// 新建或编辑就诊人(get)。
export function creatPatient(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/Create',
    method: 'Get',
    // axios get请求只能用param传参
    params: data
  })
}
// 新建当前医院就诊人(医生端)
export function createPatientByHos(data) {
  return request({
    url: '/FrontInterfaces/IndividualCase/CreatePatientByHos',
    method: 'Post',
    data
  })
}
// 新建就诊人(post)
export function creatPatientPost(data) {
  return request({
    url: '/FrontInterfaces/CaseJoinProtocol/Create',
    method: 'Post',
    data
  })
}

