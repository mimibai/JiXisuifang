<!--移动终端免秘钥登录-->
<template>
  <div />
</template>
<script>
import { getTerminalUrlLogon } from '@/api/padApplication'
import { Message, MessageBox } from 'element-ui'
export default {
  data() {
    return {

    }
  },
  created() {
    const checkKey = this.$route.query.checkKey
    if (checkKey) {
      this.getTerminalUrlLogon({ checkKey })
    } else {
      this.$router.push({
        path: '/padApplication'
      })
    }
  },
  methods: {
    getTerminalUrlLogon(param) {
      getTerminalUrlLogon(param).then((res) => {
        const { Data } = res
        const { isCanJump, pcClientId, secretKeyToken } = Data
        // 是否可跳转
        // 如果可跳转，跳转至进入终端首页
        if (isCanJump === true) {
          // 保存秘钥到vuex和cookie
          this.$store
            .dispatch('terminal/saveTerminalToken', secretKeyToken)
            .then((res) => {
              Message({
                message: '秘钥认证成功！前往评测',
                type: 'success',
                duration: 5 * 1000
              })
            })
          this.$router.push({
            path: '/padApplication/index',
            query: {
              pcClientId
            }
          })
        } else {
          this.$router.push({
            path: '/'
          })
        }
      }).catch((err) => {
        const { Code, Msg } = err
        if (Code === 0 || Code === 20) {
          this.$router.push({
            path: '/padApplication/checkSecretKey'
          })
        } else if (Code === 21) {
          MessageBox.confirm(Msg, '警告！', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            const newParam = Object.assign(param, { isConfirmRequest: true })
            this.getTerminalUrlLogon(newParam)
          }).catch(() => {
            this.$router.push({
              path: '/padApplication'
            })
          })
        } else {
          Message({
            message: Msg || '错误',
            type: 'error',
            duration: 5 * 1000
          })
          this.$router.push({
            path: '/padApplication'
          })
        }
      })
    }
  }
}
</script>

