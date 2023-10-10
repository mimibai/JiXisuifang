import request from '@/utils/request'
// 获取文章列表
export function getArticleList(data) {
  return request({
    url: '/FrontInterfaces/ArticleAndVideo/GetArticle',
    method: 'Post',
    // axios get请求只能用param传参
    data: data
  })
}
// 医生端通知公告
export function getInInsideMail(data) {
  return request({
    url: '/FrontInterfaces/ArticleAndVideo/GetInInsideMail',
    method: 'Get',
    // axios get请求只能用param传参
    params: data
  })
}
