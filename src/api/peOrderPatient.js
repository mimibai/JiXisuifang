import request from '@/utils/request'
// 获取体检订单列表
export function GetPEReserves(data) {
    return request({
        url: '/FrontPatientInterfaces/PEReserve/GetPEReserves',
        method: 'get',
        params: data
    })
}