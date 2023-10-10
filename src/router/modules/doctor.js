import LayoutDoctor from '@/views/doctor/layout'
const doctor = {
  path: '/doctor',
  name: 'Doctor',
  component: LayoutDoctor,
  redirect: '/doctor/index',
  meta: {
    roles: [2]
  },
  children: [{
    path: '/doctor/index',
    name: 'doctorIndex',
    component: () =>
      import('@/views/doctor/home/index'),
    meta: {
      title: '医生首页',
      icon: 'doctor',
      needLogin: true,
      roles: [2]
    },
    hidden: false
  },

  {
    path: '/doctor/messageCenter',
    name: 'MessageCenter',
    component: () =>
      import('@/views/doctor/messageCenter/index'),
    meta: {
      title: '通知公告',
      icon: 'message',
      needLogin: true,
      roles: [2]
    },
    hidden: false
  },
  {
    path: '/doctor/article/index/:id',
    name: 'DocArticle',
    component: () =>
      import('@/views/doctor/article/index'),
    meta: {
      title: '文章页',
      needLogin: true,
      roles: [2]
    },
    hidden: true
  },
  {
    path: '/doctor/mine',
    name: 'Mine',
    redirect: '/doctor/mine/index',
    component: () =>
      import('@/views/doctor/mine/index'),
    meta: {
      title: '账号管理',
      icon: 'user',
      needLogin: true,
      roles: [2]
    },
    children: [{
      path: '/doctor/mine/account/userInfo',
      name: 'UserInfo',
      component: () =>
        import('@/views/doctor/mine/account/userInfo'),
      meta: {
        title: '账号信息',
        needLogin: true,
        roles: [2]
      }
    },
    {
      path: '/doctor/mine/account/changeAccount',
      name: 'ChangeAccount',
      component: () =>
        import('@/views/doctor/mine/account/changeAccount'),
      meta: {
        title: '修改密码',
        needLogin: true,
        roles: [2]
      }
    },
    {
      path: '/doctor/mine/account/modifyMobile',
      name: 'ModifyMobileDoctor',
      component: () =>
        import('@/views/doctor/mine/account/modifyMobile'),
      meta: {
        title: '修改绑定手机号',
        needLogin: true,
        roles: [2]
      },
      hidden: true
    }
    ],
    hidden: true
  },
  {
    path: '/doctor/caseManagement',
    name: 'CaseManagement',
    component: () =>
      import('@/views/doctor/caseManagement/index'),
    meta: {
      title: '个案管理',
      icon: 'management',
      needLogin: true,
      roles: [6, 13, 14]
    },
    hidden: false
  },
  {
    path: '/doctor/caseManagement/patientDetail',
    name: 'CaseManagementPatientDetail',
    component: () =>
      import('@/views/doctor/caseManagement/patient/index'),
    meta: {
      title: '个案详情',
      needLogin: true,
      roles: [6, 13, 14]
    },
    hidden: true
  },
  {
    path: '/doctor/caseManagement/recordList',
    name: 'RecordList',
    component: () =>
      import('@/views/doctor/caseManagement/recordList'),
    meta: {
      title: '住院记录',
      needLogin: true,
      roles: [6, 13, 14]
    },
    hidden: true
  },
  {
    path: '/doctor/caseManagement/register',
    name: 'Registers',
    component: () =>
      import('@/views/doctor/caseManagement/register'),
    meta: {
      title: '入院登记',
      needLogin: true,
      roles: [6, 13, 14]
    },
    hidden: true
  },
  {
    path: '/doctor/screeningManagement',
    name: 'DoctorScreening',
    component: () =>
      import('@/views/doctor/screeningManagement/index'),
    redirect: '/doctor/screeningManagement/cancerRecord',
    meta: {
      title: '早癌筛查',
      icon: 'el-icon-s-order',
      needLogin: true,
      roles: [7, 8, 11, 12, 15, 16]
    },
    children: [
      {
        path: '/doctor/screeningManagement/addScreeningPatient',
        name: 'addScreeningPatient',
        component: () =>
          import('@/views/doctor/screeningManagement/addScreeningPatient/index'),
        meta: {
          title: '新建癌筛记录',
          needLogin: true,
          roles: [7, 12]
        },
        hidden: false
      }, {
        path: '/doctor/screeningManagement/cancerRecord',
        name: 'screeningManagement',
        component: () =>
          import('@/views/doctor/screeningManagement/cancerRecord/index'),
        meta: {
          title: '风险评估记录',
          needLogin: true,
          roles: [7, 11, 12]
        },
        hidden: false
      },
      {
        path: '/doctor/screeningManagement/auxiliary',
        name: 'screeningManagement',
        component: () =>
          import('@/views/doctor/screeningManagement/cancerRecord/auxiliary'),
        meta: {
          title: '辅助癌筛记录',
          needLogin: true,
          roles: [7, 11, 12]
        },
        hidden: false
      },
      {
        path: '/doctor/screeningManagement/addScreeningPatient/edit',
        name: 'editScreeningPatient',
        component: () =>
          import('@/views/doctor/screeningManagement/addScreeningPatient/edit'),
        meta: {
          title: '编辑癌筛记录',
          needLogin: true,
          roles: [7, 12]
        },
        hidden: true
      },
      {
        path: '/doctor/screeningManagement/survey',
        name: 'survey',
        component: () =>
          import('@/views/doctor/screeningManagement/cancerRecord/survey'),
        meta: {
          title: '填写明细',
          needLogin: true,
          roles: [7, 11, 12]
        },
        hidden: true
      },
      {
        path: '/doctor/screeningManagement/peOrders',
        name: 'PeOrders',
        component: () =>
          import('@/views/doctor/screeningManagement/peOrders/index'),
        meta: {
          title: '预约订单',
          needLogin: true,
          roles: [8, 15, 16]
        },
        hidden: false
      },
      {
        path: '/doctor/screeningManagement/peOrders/detail/:peReserveId',
        name: 'PeOrdersDetail',
        component: () =>
          import('@/views/doctor/screeningManagement/peOrders/detail'),
        meta: {
          title: '订单详情',
          needLogin: true,
          roles: [8, 15, 16]
        },
        hidden: true
      }
    ],
    hidden: false
  },
  {
    path: '/doctor/followVisit',
    name: 'FollowVisit',
    component: () =>
      import('@/views/doctor/followVisit/index'),
    redirect: '/doctor/followVisit/myPlan',
    meta: {
      title: '随访管理',
      icon: 'follow-visit',
      needLogin: true,
      roles: [6, 13, 14]
    },
    children: [{
      path: '/doctor/followVisit/caseJoinFollowVisit',
      name: 'CaseJoinFollowVisit',
      component: () =>
        import('@/views/doctor/followVisit/caseJoinFollowVisit/index'),
      meta: {
        title: '随访记录',
        needLogin: true,
        roles: [6, 13, 14]
      },
      hidden: false
    },
    {
      path: '/doctor/followVisit/schemePlan',
      name: 'schemePlan',
      component: () =>
        import('@/views/doctor/followVisit/schemePlan/index'),
      meta: {
        title: '随访方案',
        needLogin: true,
        roles: [6, 13, 14]
      },
      hidden: false
    },
    {
      path: '/doctor/followVisit/schemeEdit',
      name: 'addSchemePlan',
      component: () =>
        import('@/views/doctor/followVisit/schemePlan/edit'),
      meta: {
        title: '随访方案编辑',
        needLogin: true,
        roles: [6, 14]
      },
      hidden: true
    },
    {
      path: '/doctor/followVisit/schemeDetail',
      name: 'schemePlanDetail',
      component: () =>
        import('@/views/doctor/followVisit/schemePlan/detail'),
      meta: {
        title: '随访方案详情',
        needLogin: true,
        roles: [6, 13, 14]
      },
      hidden: true
    },
    {
      path: '/doctor/followVisit/myPlan',
      name: 'MyPlan',
      component: () =>
        import('@/views/doctor/followVisit/myPlan/index'),
      meta: {
        title: '我的任务',
        needLogin: true,
        roles: [6, 14]
      },
      hidden: false
    },
    {
      path: '/doctor/followVisit/myPlan/detail',
      name: 'MyPlanDetail',
      component: () =>
        import('@/views/doctor/followVisit/myPlan/detail'),
      meta: {
        title: '任务详情',
        needLogin: true,
        roles: [6, 13, 14]
      },
      hidden: true
    },
    {
      path: '/doctor/followVisit/pubilcPlan',
      name: 'PubilcPlan',
      component: () =>
        import('@/views/doctor/followVisit/pubilcPlan/index'),
      meta: {
        title: '公众任务',
        needLogin: true,
        roles: [6, 13, 14]
      },
      hidden: false
    },
    {
      path: '/doctor/followVisit/pubilcPlan/detail',
      name: 'PubilcPlanDetail',
      component: () =>
        import('@/views/doctor/followVisit/pubilcPlan/detail'),
      meta: {
        title: '任务详情',
        needLogin: true,
        roles: [6, 13, 14]
      },
      hidden: true
    },
    {
      path: '/doctor/followVisit/votePlan',
      name: 'votePlan',
      component: () =>
        import('@/views/doctor/followVisit/votePlan/index'),
      meta: {
        title: '随访问卷',
        needLogin: true,
        roles: [6, 13, 14]
      },
      hidden: false
    },
    {
      path: '/doctor/followVisit/votePlan/detail',
      name: 'VotePlanDetail',
      component: () =>
        import('@/views/doctor/followVisit/votePlan/detail'),
      meta: {
        title: '随访问卷详情',
        needLogin: true,
        roles: [6, 13, 14]
      },
      hidden: true
    }
    ],
    hidden: false
  }
  ],

  displayLocation: 3
}
export default doctor
