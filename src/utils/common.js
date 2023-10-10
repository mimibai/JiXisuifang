import {
    MessageBox,
    Message
} from 'element-ui'
import store from '@/store'
import router from '@/router'
import {
    getToken, setToken, removeToken
} from '@/utils/auth'
//判断当前账号否有去医生端权限
export function checkLogin(path) {
    const hasToken = getToken('userToken')
    // 从sessionStorlage中获取token,如果有则证明已登录
    if (hasToken) {
        store.dispatch('user/getInfo').then((res) => {
            const { roleList } = res
            //判断当前登录人员角色，如果为患者提示无权限
            let roleArr = roleList.map((list) => {
                return list.roleId
            })
            //如果有2证明有医生端权限，可以跳转
            if (roleArr.includes(2)) {
                router.push({ path: '/doctor' })
            } else {
                MessageBox.confirm(
                    '账号无权限访问该页面，您是否切换账号重新登录？',
                    '系统提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).then(() => {
                    //退出登录
                    store.dispatch('user/logout')
                    // 有医生端权限，登录后跳转至医生端 LoginOff判断用户名隐藏
                    router.push({ path: '/Login?redirect=%2Fdoctor', query: { LoginOff: true } })
                })
            }
        })
    } else {
        router.push({ path: '/doctor' })
    }

}