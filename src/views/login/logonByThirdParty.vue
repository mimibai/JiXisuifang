<template>
  <div
    class="login"
    v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-background="transparent"
  >
    <div class="login-container"></div>
  </div>
</template>
<script>
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  name: 'LogonByThirdParty',
  data() {
    return {
      loading: true,
      loadingText: '登录中，请稍后...',
      userParm: {},
    }
  },
  created() {
    let pid = this.$route.query.pid,
      pkey = this.$route.query.pkey,
      parm = this.$route.query.parm
    if (pid && pkey && parm) {
      this.userParm = {
        pid: pid,
        pkey: pkey,
        parm: parm,
        userId: '',
      }
      this.getUserToken()
    } else {
      this.$router.push({ path: '/' })
      return false
    }
  },
  methods: {
    async getUserToken() {
      const hasToken = getToken('userToken')
      if (hasToken) {
        //如果有token，判断当前已登录人是否与第三方请求登录人匹配
        const { userId } = await store.dispatch('user/getInfo')
        this.userParm.userId = userId
        this.logIn(this.userParm)
      } else {
        //如果无token，通过传入第三方请求登录参数实现登录
        this.logIn(this.userParm)
      }
    },
    logIn(userParm) {
      let userParmJson = `{"pid":"${userParm.pid.trim()}","pkey": "${userParm.pkey.trim()}","userId": "${
        userParm.userId
      }","parm":"${userParm.parm.trim()}"}`
      this.$store
        .dispatch('user/logonByThirdParty', userParmJson)
        .then((res) => {
          //如果有返回值代表登录失败
          if (res != null) {
            const { Msg } = res
            console.log(res)
            Message({
              message: Msg || '登录失败！',
              type: 'error',
              duration: 5 * 1000,
            })
            this.$router.push({ path: '/' })
          } else {
            //无返回值，登录成功跳转到医生首页
            this.$router.push({ path: '/doctor/index' })
          }
        })
        .catch((err) => {
          const { Msg } = err
          Message({
            message: Msg || '登录失败！',
            type: 'error',
            duration: 5 * 1000,
          })
          this.$router.push({ path: '/' })
        })
    },
  },
}
</script>
<style lang="scss" scope>
.login {
  width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 380px);
  .login-container {
    padding: 45px 50px;
    background: none;
  }
}
</style>