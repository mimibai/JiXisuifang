import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import LayoutPatient from '@/views/patient/layout'

/* Router Modules */
/* 当路由页过长的时候可以将整个路由切成小块*/
import doctor from './modules/doctor'
import mine from './modules/mine'
import padApplication from './modules/padApplication'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，则不会在navbar中显示
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * displayLocation                1为alluser  2为doctor  3为英文版 4为patient
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 *  needLogin:true/false          是否需要登录，true为需要登录，false不需要登录
    roles: ['1','2','4','5','6','8','9']          控制页面角色(1为admin，2为Doctor,4为Patient,5为SystemAdmin,6为CaseManager,7为EarlyCancerManager,8为PeManager)
    title: 'title'                页面、面包屑标题， (recommend set)
    icon: 'svg-name'/'el-icon-x'  sidebar图标
    breadcrumb: false            如果设置为false，则该项将隐藏在面包屑中（默认值为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示设置的路径
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * 所有权限可以访问
 */
export const constantRoutes = [{
  path: '/',
  name: 'Boot',
  component: () =>
    import('@/views/boot/index'),
  meta: {
    title: '引导页',
    needLogin: false
  },
  displayLocation: 1
},
padApplication,
{
  path: '/patient',
  name: 'Patient',
  component: LayoutPatient,
  redirect: '/patient/home',
  children: [{
    path: '/patient/home',
    name: 'Home',
    component: () =>
      import('@/views/patient/home/index'),
    meta: {
      title: '首页',
      needLogin: false
    },
    hidden: false,
    index: 1
  }, {
    path: '/patient/screening',
    name: 'Screening',
    component: () =>
      import('@/views/patient/screening/index'),
    meta: {
      title: '风险评估',
      needLogin: true
    },
    hidden: false,
    index: 3
  },
  // {
  //   path: '/test1',
  //   name: '',
  //   component: () =>
  //     import('@/views/building'),
  //   meta: {
  //     title: '小惠助手',
  //     needLogin: false
  //   },
  //   hidden: false,
  //   index: 6
  // }, {
  //   path: '/test2',
  //   name: '',
  //   component: () =>
  //     import('@/views/building'),
  //   meta: {
  //     title: '个人健康档案',
  //     needLogin: true,
  //     roles: [1]
  //   },
  //   hidden: false,
  //   index: 7
  // },
  {
    path: '/patient/health',
    name: 'Health',
    component: () =>
      import('@/views/patient/health/index'),
    meta: {
      title: '健康科普',
      needLogin: false
    },
    hidden: true,
    index: 8
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import('@/views/login/index'),
    meta: {
      title: '登录',
      needLogin: false
    },
    hidden: true
  },
  {
    path: '/LogonByThirdParty',
    name: 'LogonByThirdParty',
    component: () =>
      import('@/views/login/logonByThirdParty'),
    meta: {
      title: '登录',
      needLogin: false
    },
    hidden: true
  },
  {
    path: '/register',
    name: 'Register',
    component: () =>
      import('@/views/login/register'),
    meta: {
      title: '注册',
      needLogin: false
    },
    hidden: true
  },
  {
    path: '/bindAccount',
    name: 'BindAccount',
    component: () =>
      import('@/views/login/bindAccount'),
    meta: {
      title: '绑定用户',
      needLogin: false
    },
    hidden: true
  }
  ],
  displayLocation: 1
},
{
  path: '/patient/health/propaganda',
  name: 'Propaganda',
  component: LayoutPatient,
  redirect: '/patient/health/propaganda/special',
  children: [{
    path: '/patient/health/propaganda/special',
    component: () =>
      import('@/views/patient/health/propaganda/special'),
    meta: {
      title: '健康宣教',
      needLogin: false
    },
    hidden: false
  }
  ],
  hidden: false
},
{
  path: '/patient/article',
  name: 'article',
  component: LayoutPatient,
  redirect: '/patient/article/index/:id',
  children: [{
    path: '/patient/article/index/:id',
    name: 'Article',
    component: () =>
      import('@/views/patient/article/index'),
    meta: {
      title: '文章页',
      needLogin: false
    },
    hidden: true,
    displayLocation: 2
  },
  {
    path: '/patient/article/list/:columnId',
    name: 'ArticleList',
    component: () =>
      import('@/views/patient/article/list'),
    meta: {
      title: '文章列表页',
      needLogin: false
    },
    hidden: true,
    displayLocation: 2
  }
  ]
},
{
  path: '/patient/video',
  name: 'video',
  component: LayoutPatient,
  redirect: '/patient/video',
  children: [{
    path: '/patient/video/index/:videoId',
    name: 'VideoIndex',
    component: () =>
      import('@/views/patient/video/index'),
    meta: {
      title: '视频页',
      needLogin: false
    },
    hidden: true,
    displayLocation: 2
  },
  {
    path: '/patient/video/list',
    name: 'VideoList',
    component: () =>
      import('@/views/patient/video/list'),
    meta: {
      title: '视频页',
      needLogin: false
    },
    hidden: true,
    displayLocation: 2
  }
  ]
},
{
  path: '/building',
  name: 'Building',
  component: () =>
    import('@/views/building'),
  meta: {
    title: '建设中',
    needLogin: false
  },
  hidden: true,
  displayLocation: 1
},
{
  path: '/401',
  name: '401',
  component: LayoutPatient,
  redirect: '/patient/401',
  children: [{
    path: '/patient/401',
    name: 'patient401',
    component: () =>
      import('@/views/401'),
    meta: {
      title: '无权限',
      needLogin: false
    },
    hidden: true,
    displayLocation: 1
  }]
},
{
  path: '/404',
  name: '404',
  component: () =>
    import('@/views/404'),
  meta: {
    title: '404',
    needLogin: false
  },
  hidden: true,
  displayLocation: 1
}
]
// test
export const asyncRoutes = [
  // 患者端癌筛评测
  {
    path: '/patient/summaryHome',
    name: 'SummaryHome',
    component: LayoutPatient,
    redirect: '/patient/screening',
    meta: {
      title: '早癌筛查问卷',
      needLogin: true
    },
    children: [{
      path: '/patient/summary',
      name: 'Summary',
      component: () =>
        import('@/views/patient/summary/index'),
      meta: {
        title: '专科版早癌筛查问卷',
        needLogin: true
      }
    },
    {
      path: '/patient/summary/selectPatient',
      name: 'SelectPatient',
      component: () =>
        import('@/views/patient/summary/selectPatient/index'),
      meta: {
        title: '选择就诊人',
        needLogin: true
      }
    },
    {
      path: '/patient/summary/survey',
      name: 'Survey',
      component: () =>
        import('@/views/patient/summary/survey/index'),
      meta: {
        title: '问卷填写',
        needLogin: true
      }
    },
    {
      path: '/patient/summary/result',
      name: 'Result',
      component: () =>
        import('@/views/patient/summary/result/index'),
      meta: {
        title: '问卷结果页',
        needLogin: true
      }
    }
    ],
    hidden: true,
    displayLocation: 1
  },
  // 患者端早癌筛查
  {
    path: '/patient/peAppointment',
    name: 'PeAppointment',
    component: LayoutPatient,
    redirect: '/patient/peAppointment/list',
    meta: {
      title: '早癌筛查',
      needLogin: true
    },
    children: [{
      path: '/patient/peAppointment/list',
      name: 'PeAppointmentList',
      component: () =>
        import('@/views/patient/peAppointment/list'),
      meta: {
        title: '套餐列表',
        needLogin: true
      }
    }, {
      path: '/patient/peAppointment/detail/:pePackageId',
      name: 'PeAppointmentDetail',
      component: () =>
        import('@/views/patient/peAppointment/detail'),
      meta: {
        title: '套餐详情',
        needLogin: true
      }
    }, {
      path: '/patient/peAppointment/registration',
      name: 'PeAppointmentRegistration',
      component: () =>
        import('@/views/patient/peAppointment/registration'),
      meta: {
        title: '预约挂号',
        needLogin: true
      }
    }, {
      path: '/patient/peAppointment/choseDate',
      name: 'PeAppointmentChoseDate',
      component: () =>
        import('@/views/patient/peAppointment/choseDate'),
      meta: {
        title: '选择日期',
        needLogin: true
      }
    }],
    hidden: true,
    displayLocation: 1
  },
  // 个人中心
  mine,
  // 医生端
  doctor,
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/401',
    hidden: true
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
