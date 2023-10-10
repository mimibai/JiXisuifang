import request from '@/utils/request'
// 获取体检订单列表
export function GetPEReserves(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/GetPEReserves',
    method: 'get',
    params: data
  })
}
// 获取体检订单详情
export function GetPEReserve(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/GetPEReserve',
    method: 'get',
    params: data
  })
}

// 获取导检详细信息
export function GetPEGuidedInspection(data) {
  return request({
    url: '/FrontInterfaces/PEGuidedInspection/GetPEGuidedInspection',
    method: 'get',
    params: data
  })
}
// 根据体检人获取所有体检预约
export function GetAllPEReserves(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetPEReserves',
    method: 'get',
    params: data
  })
}

// 新增体检预约
export function CreatePEReserve(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/CreatePEReserve',
    method: 'post',
    data: data
  })
}

// 提交预约订单
export function SubmitPEReserve(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/SubmitPEReserve',
    method: 'post',
    data: data
  })
}
// 取消预约
export function CancelPEReserve(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/CancelPEReserve',
    method: 'post',
    data: data
  })
}

// 获取医院地址
export function GetHospitalLoacation(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/GetHospitalLoacation',
    method: 'get',
    params: data
  })
}
// 预约排期查询
export function PeriodList(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/PeriodList',
    method: 'get',
    params: data
  })
}
// 按照预约日期获取预约时间段
export function PeriodDayList(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/PeriodDayList',
    method: 'get',
    params: data
  })
}
// 预约改期提交
export function UpdateReserveTime(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/UpdateReserveTime',
    method: 'post',
    data: data
  })
}
// 医生端新建体检预约
// 体检预约表单获取
export function getCreatePEReserveByDoctor(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/CreatePEReserveByDoctor',
    method: 'get',
    params: data
  })
}
// 体检预约提交
export function postCreatePEReserveByDoctor(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/CreatePEReserveByDoctor',
    method: 'post',
    data
  })
}

// 添加备注信息
export function postUpdateDoctorRemark(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/UpdateDoctorRemark',
    method: 'post',
    data
  })
}
// 同步团检预约订单
export function asyncOrgOrderInfo(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/OrgOrderInfo',
    method: 'post',
    data,
    timeout: 80000
  })
}
