const padApplication = {

  path: '/padApplication',
  name: 'PadApplication',
  component: () =>
    import('@/views/padApplication/index'),
  redirect: '/padApplication/index',
  meta: {
    title: '癌筛评测多端系统',
    needLogin: false,
    isTerminal: true
  },
  children: [{
    path: '/padApplication/index',
    name: 'PadApplicationIndex',
    component: () =>
      import('@/views/padApplication/survey/index'),
    meta: {
      title: '癌筛评测多端系统',
      needLogin: false,
      isTerminal: true
    },
    hidden: true,
    index: 1
  },
  {
    path: '/padApplication/directLogin',
    name: 'PadApplicationDirectLogin',
    component: () =>
      import('@/views/padApplication/survey/directLogin'),
    meta: {
      title: '癌筛评测多端登录验证',
      needLogin: false,
      isTerminal: true
    },
    hidden: true,
    index: 1
  },
  {
    path: '/padApplication/checkSecretKey',
    name: 'PadApplicationCheckSecretKey',
    component: () =>
      import('@/views/padApplication/survey/checkSecretKey'),
    meta: {
      title: '秘钥验证',
      needLogin: false,
      isTerminal: true
    },
    hidden: true,
    index: 1
  },
  {
    path: '/padApplication/list',
    name: 'PadApplicationList',
    component: () =>
      import('@/views/padApplication/survey/list'),
    meta: {
      title: '癌筛评测列表',
      needLogin: false,
      isTerminal: true
    },
    hidden: true,
    index: 1
  },
  {
    path: '/padApplication/detail',
    name: 'PadApplicationDetail',
    component: () =>
      import('@/views/padApplication/survey/detail'),
    meta: {
      title: '癌筛评测详情页',
      needLogin: false,
      isTerminal: true
    },
    hidden: true,
    index: 1
  },
  {
    path: '/padApplication/result',
    name: 'PadApplicationResult',
    component: () =>
      import('@/views/padApplication/survey/result'),
    meta: {
      title: '填写成功',
      needLogin: false,
      isTerminal: true
    },
    hidden: true,
    index: 1
  }
  ],
  displayLocation: 1
}
export default padApplication
