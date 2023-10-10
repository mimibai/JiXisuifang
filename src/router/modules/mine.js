import LayoutPatient from '@/views/patient/layout'
const mine = {
  path: '/patient/mine',
  name: 'Mine',
  redirect: '/patient/mine/index',
  component: LayoutPatient,
  meta: {
    title: '个人中心',
    roles: [4]
  },
  children: [{
    path: '/patient/mine/index',
    name: 'MineIndex',
    redirect: '/patient/account/userInfo',
    component: () =>
      import('@/views/patient/mine/index'),
    meta: {
      title: '账号管理',
      icon: 'el-icon-user-solid',
      needLogin: true,
      roles: [4]
    },
    children: [{
      path: '/patient/account/userInfo',
      name: 'UserInfo',
      component: () =>
        import('@/views/patient/mine/account/userInfo'),
      meta: {
        title: '账号信息',
        needLogin: true,
        roles: [4]
      }
    },
    {
      path: '/patient/account/changeAccount',
      name: 'ChangeAccount',
      component: () =>
        import('@/views/patient/mine/account/changeAccount'),
      meta: {
        title: '修改密码',
        needLogin: true,
        roles: [4]
      }
    },
    {
      path: '/patient/account/agreementDes',
      name: 'AgreementDes',
      component: () =>
        import('@/views/patient/mine/account/agreementDes'),
      meta: {
        title: '协议和说明',
        needLogin: true,
        roles: [4]
      }
    },
    {
      path: '/patient/account/modifyMobile',
      name: 'ModifyMobile',
      component: () =>
        import('@/views/patient/mine/account/modifyMobile'),
      meta: {
        title: '修改绑定手机号',
        needLogin: true,
        roles: [4]
      },
      hidden: true
    },
    {
      path: '/patient/account/agreementDesDetail',
      name: 'AgreementDesDetail',
      component: () =>
        import('@/views/patient/mine/account/agreementDesDetail'),
      meta: {
        title: '协议和说明详情',
        needLogin: true,
        roles: [4]
      },
      hidden: true
    }
    ]
  },

  {
    path: '/patient/mine/personal',
    name: 'Personal',
    component: () =>
      import('@/views/patient/mine/index'),
    redirect: '/patient/mine/personal/patientInfo',
    meta: {
      title: '个人健康档案管理',
      icon: 'el-icon-s-order',
      needLogin: true,
      roles: [4]
    },
    children: [
      // {
      //   path: '/patient/mine/personal/patientInfo',
      //   name: 'PersonalIndex',
      //   component: () =>
      //     import('@/views/patient/mine/personal/patientInfo'),
      //   meta: {
      //     title: '个人基本信息',
      //     needLogin: true,
      //     roles: [4]
      //   },
      // },
      {
        path: '/patient/mine/records',
        name: 'Records',
        component: () =>
          import('@/views/patient/mine/records/index'),
        meta: {
          title: '住院记录',
          needLogin: true,
          roles: [4]
        }
      }
    ]
  },
  {
    path: '/patient/mine/patients',
    name: 'Patients',
    component: () =>
      import('@/views/patient/mine/index'),
    redirect: '/patient/mine/patients/list',
    meta: {
      title: '就诊人管理',
      icon: 'el-icon-s-custom',
      needLogin: true,
      roles: [4]
    },
    children: [{
      path: '/patient/mine/patients/list',
      name: 'PatientsList',
      component: () =>
        import('@/views/patient/mine/patients/list'),
      meta: {
        title: '就诊人列表',
        needLogin: true,
        roles: [4]
      }
    },
    {
      path: '/patient/mine/patients/editPatient',
      name: 'EditPatient',
      component: () =>
        import('@/views/patient/mine/patients/editPatient'),
      meta: {
        title: '编辑就诊人',
        needLogin: true,
        roles: [4]
      },
      hidden: true
    }
    ]
  },
  {
    path: '/patient/mine/cancerRecords/index',
    name: '',
    component: () =>
      import('@/views/patient/mine/index'),
    redirect: '/patient/mine/cancerRecords/index',
    meta: {
      title: '癌筛测评',
      icon: 'el-icon-s-claim',
      needLogin: true,
      roles: [4]
    },
    children: [{
      path: '/patient/screening',
      redirect: '/patient/screening',
      meta: {
        title: '早癌筛查',
        needLogin: true,
        roles: [4]
      }
    }, {
      path: '/patient/mine/cancerRecords',
      name: 'CancerRecords',
      component: () =>
        import('@/views/patient/mine/cancerRecords/index'),
      meta: {
        title: '癌筛测评记录',
        needLogin: true,
        roles: [4]
      }
    }

    ]
  },
  {
    path: '/patient/mine/peOrder',
    name: 'PeOrder',
    component: () =>
      import('@/views/patient/mine/index'),
    redirect: '/patient/mine/peOrder/list',
    meta: {
      title: '体检管理',
      icon: 'el-icon-s-order',
      needLogin: true,
      roles: [4]
    },
    children: [{
      path: '/patient/mine/peOrder/list',
      name: 'PeOrderList',
      component: () =>
        import('@/views/patient/mine/peOrder/list'),
      meta: {
        title: '体检订单',
        needLogin: true,
        roles: [4]
      }
    },
    {
      path: '/patient/mine/peOrder/detail/:peReserveId',
      name: 'PeOrderDetail',
      component: () =>
        import('@/views/patient/mine/peOrder/detail'),
      meta: {
        title: '体检订单详情',
        needLogin: true,
        roles: [4]
      },
      hidden: true
    }
    ]
  }
  ],
  hidden: true,
  displayLocation: 4
}
export default mine
