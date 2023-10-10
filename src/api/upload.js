import request from '@/utils/request'
// 上传附件
export function uploadImg(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/ImageUpload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
// 上传癌筛报告
export function SendReport(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/SendReport',
    method: 'post',
    data
  })
}
// 上传问卷信息汇总

export function SendDoctorCensure(data) {
  return request({
    url: '/FrontInterfaces/PEReserve/SendDoctorCensure',
    method: 'post',
    data
  })
}
