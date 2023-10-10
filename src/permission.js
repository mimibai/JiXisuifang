import router from './router'
import store from './store'
import {
  Message,
  MessageBox
} from 'element-ui'
import NProgress from 'nprogress' // 顶部进度条
import 'nprogress/nprogress.css' // 顶部进度条样式
import {
  getToken
} from '@/utils/auth' // 从sessionStorlage中获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken('userToken')
  if (hasToken) {
    if (to.path === '/login' || to.path === '/register') {
      // if is logged in, redirect to the home page
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息并将用户信息加在vux中
          const {
            roleList
          } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', roleList)
          router.addRoutes(accessRoutes)
          next({
            ...to,
            replace: true
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || '出现错误')
          // next(`/login?redirect=${to.path}`)
          next({
            path: '/'
          })
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (to.meta.needLogin === false) {
      // 如果不需要登录, 则继续
      next()
    } else {
      // 如果需要登录则重定向到登录页
      MessageBox.confirm('当前页面需要登录后才能访问，是否前往登录？', '需要登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }).catch(() => {
        next(from.path)
        NProgress.done()
      })
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
