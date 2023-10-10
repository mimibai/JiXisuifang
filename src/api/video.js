import request from '@/utils/request'
//获取视频详情
export function getVideoDetail(data) {
    return request({
        url: '/FrontInterfaces/ArticleAndVideo/GetVideoById',
        method: 'Post',
        //axios get请求只能用param传参
        data: data
    })
}
//获取视频列表
export function getVideoList(data) {
    return request({
        url: '/FrontInterfaces/ArticleAndVideo/GetVideoColumn',
        method: 'Post',
        //axios get请求只能用param传参
        data: data
    })
}
//获取关联视频
export function getVideo(data) {
    return request({
        url: '/FrontInterfaces/ArticleAndVideo/GetVideo',
        method: 'Post',
        //axios get请求只能用param传参
        data: data
    })
}
//获取视频栏目
export function getVideoColumn(data) {
    return request({
        url: '/FrontInterfaces/ArticleAndVideo/GetVideoColumn',
        method: 'Post',
        //axios get请求只能用param传参
        data: data
    })
}
//获取视频
export function getVideoArticle(data) {
    return request({
        url: '/FrontInterfaces/ArticleAndVideo/GetVideoArticle',
        method: 'Post',
        //axios get请求只能用param传参
        data: data
    })
}
//获取宣教头部菜单
export function getVideoConfiguration(data) {
    return request({
        url: '/FrontInterfaces/Main/GetVideoConfiguration',
        method: 'get',
        params: data
    })
}
//获取科室相关列表
export function getDepartmentVideo(data) {
    return request({
        url: '/FrontInterfaces/Department/GetDepartmentVideo',
        method: 'Post',
        //axios get请求只能用param传参
        data: data
    })
}
//获取医生相关列表
export function getDoctorVideo(data) {
    return request({
        url: '/FrontInterfaces/Doctor/GetDoctorVideo',
        method: 'Post',
        //axios get请求只能用param传参
        data: data
    })
}
//获取疾病相关列表
export function getDiseaseVideo(data) {
    return request({
        url: '/FrontInterfaces/Disease/GetDiseaseVideo',
        method: 'Post',
        //axios get请求只能用param传参
        data: data
    })
}