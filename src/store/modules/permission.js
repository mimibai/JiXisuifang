import {
  asyncRoutes,
  constantRoutes
} from '@/router'

/**
 * 使用meta.role确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      /* roles为角色集合
       * 1:admin
       * 2:Doctor
       * 4:Patient
       * 5:SystemAdmin
       * 6:CaseManager
       * 8:EarlyCancerManager
       * 9:PeManager
       */
      // 如果为医生，直接可以进所有的医生页
      // nRoles为二维数组，需遍历
      const nRoles = roles.map((user) => {
        return user.roleId
      })
      // 管理员拥有所有页面权限
      // if (nRoles.includes(1)) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, nRoles)
      // }
      accessedRoutes = filterAsyncRoutes(asyncRoutes, nRoles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
