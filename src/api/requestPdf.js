import request from '@/utils/request'
//获取pdf文件流
export function getPdf(url) {
  return request({
    url: url,
    method: 'get',
    responseType: 'blob',
  })
}
