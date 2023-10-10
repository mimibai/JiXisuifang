import request from '@/utils/request'
// 获取体检套餐详情
export function GetPEPackage(data) {
  return request({
    url: '/FrontInterfaces/PEPackage/GetPEPackage',
    method: 'get',
    params: data
  })
}
// 体检预约
export function CreatePEReserve(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/CreatePEReserve',
    method: 'get',
    params: data
  })
}
