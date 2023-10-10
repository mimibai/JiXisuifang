import request from '@/utils/request'
//获取省份列表
export function getProvinceList() {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetProvinceList',
    method: 'get',
  })
}
//获取市列表
export function getCityList(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetCityList',
    method: 'get',
    params: data
  })
}
//获取县列表
export function getCountyList(data) {
  return request({
    url: '/FrontInterfaces/Auxiliary/GetCountyList',
    method: 'get',
    params: data
  })
}
