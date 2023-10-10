import request from '@/utils/request'
// 获取当前登录账户下就诊人集合
export function getPatientList() {
  return request({
    url: '/FrontPatientInterfaces/PatientManagement/GetList',
    method: 'Get'
  })
}
// 获取当前就诊人详情
export function getPatientInfo(data) {
  return request({
    url: '/FrontPatientInterfaces/PatientManagement/GetPatient',
    method: 'get',
    params: data
  })
}
// 新建或编辑就诊人(get)。operatTypeId 1、新建 3、编辑
export function creatPatient(data) {
  return request({
    url: '/FrontPatientInterfaces/PatientManagement/Create',
    method: 'get',
    // axios get请求只能用param传参
    params: data
  })
}
// 新建就诊人(post)
export function creatPatientPost(data) {
  return request({
    url: '/FrontPatientInterfaces/PatientManagement/Create',
    method: 'post',
    data
  })
}
// 修改默认就诊人
export function modifyDefultPatient(data) {
  return request({
    url: '/FrontPatientInterfaces/PatientManagement/ModifyDefultPatient',
    method: 'post',
    data
  })
}
// 删除就诊人
export function delPatient(data) {
  return request({
    url: '/FrontPatientInterfaces/PatientManagement/DelPatient',
    method: 'post',
    data
  })
}
