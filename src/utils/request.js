import axios from 'axios'
import router from '@/router'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken, setToken, removeToken

} from '@/utils/auth'
// 是否正在刷新标记
let isRefreshing = false
// 同时请求的队列
let requestList = []
// 刷新token方法
function refreshToken(response, service) {
  const refreshtoken = getToken('refreshToken')
  // 如果没有refreshtoken，直接清空token,并且返回到登录页
  if (!refreshtoken) {
    // Message({
    //   message: "登录已过期，请重新登录！",
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    store.dispatch('user/resetToken').then(() => {
      // location.reload()
      router.push({
        path: '/login'
      })
    })
  }
  return axios({
    method: 'post',
    url: '/FrontInterfaces/Main/CreateToken',
    data: {
      refreshToken: refreshtoken
    }
  }).then((res) => {
    const { data } = res
    const { Code, Data } = data
    // 重新请求之前token过期的接口
    if (Code !== 1) {
      return Promise.reject(Data)
    } else {
      // vuex,locallstorage更新token
      store.dispatch('user/setUserToken', Data)
      response.config.headers['Authorization'] = Data.sessionKey
      // 用新的token去执行requestList队列中的请求
      requestList.forEach(cb => cb(Data.sessionKey))
      // 执行完毕清空
      requestList = []
      return service(response.config)
    }
  }).catch(() => {
    // 如果请求出错，重新登录
    // Message({
    //   message: "登录已过期，请重新登录！",
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    store.dispatch('user/resetToken').then(() => {
      // location.reload()
      router.push({
        path: '/login'
      })
    })
  }).finally((fina) => {
    isRefreshing = false
  })
}
// 自定义axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 40000 // request timeout
})

// 请求拦截器interceptors.request为axios固定方法
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // 让每一次请求都携带token
      // ['Authorization'] 是一个与开发端协定好的header
      // 可以根据实际情况修改
      config.headers['Authorization'] = getToken('userToken')
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(response);
    const res = response.data
    // console.log(res.constructor);
    // 如果返回为blob文件流，则视为正确
    // 如果返回code不是1，则视为错误
    if (res.constructor === Blob) {
      return res
    } else if (res.Code !== 1) {
      // 6为token过期需重新刷新token
      if (res.Code === 6) {
        const { config } = res
        // 当前是否有正在刷新token，防止多次请求刷新token
        if (!isRefreshing) {
          // 没有则请求刷新token
          isRefreshing = true
          return refreshToken(response, service)
        } else {
          // 如果有则将请求加入队列中，将返回一个未执行resolve的promise
          return new Promise((resolve) => {
            // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
            requestList.push((token) => {
              config.headers['Authorization'] = token
              resolve(service(config))
            })
          })
        }
      }
      // 7无权限访问，跳转至无权限页
      if (res.Code === 7) {
        // to re-login
        console.log(res)
        router.push({
          path: '/401'
        })
      }
      if (res.Code === 8) {
        return res
      }
      if (res.Code === 12 || res.Code === 13) {
        const { Data } = res
        let errorStr = ''
        if (Data != null && Data.length > 0) {
          const errorArr = Data.map((list) => {
            return list.errorMsg
          })
          errorStr = errorArr.join(',')
        }
        Message({
          message: res.Msg || errorStr || '错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
      if (res.Code === 0 || res.Code === 15) {
        return res
      }
      // 参数错误
      if (res.Code === 99 || res.Code === 20 || res.Code === 21 || res.Code === 22) {
        return Promise.reject(res)
      }
      return Promise.reject(new Error(res.Msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '请求超时，请稍后重试！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
