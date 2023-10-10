import request from '@/utils/request'
//获取友情链接
export function getFriendLinkList(data) {
    return request({
        url: '/FrontInterfaces/FriendlyLinks/GetList',
        method: 'Get',
        //axios get请求只能用param传参
        data: data
    })
}