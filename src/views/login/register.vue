<template>
  <div class="login">
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">注册</h3>
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="账号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="checkPasswordType"
            ref="checkPassword"
            v-model="loginForm.checkPassword"
            :type="checkPasswordType"
            placeholder="确认密码"
            name="checkPassword"
            tabindex="2"
            auto-complete="on"
          />
          <span
            class="show-pwd"
            @click="showCheckPwd"
          >
            <svg-icon
              :icon-class="
                checkPasswordType === 'password' ? 'eye' : 'eye-open'
              "
            />
          </span>
        </el-form-item>
        <el-form-item prop="mobileNumber">
          <span class="svg-container">
            <svg-icon icon-class="phone" />
          </span>
          <el-input
            ref="mobileNumber"
            v-model="loginForm.mobileNumber"
            placeholder="手机号码"
            name="mobileNumber"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item prop="email">
          <span class="svg-container">
            <svg-icon icon-class="email" />
          </span>
          <el-input
            ref="email"
            v-model="loginForm.email"
            placeholder="邮箱"
            name="email"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <div class="register-term">
          <el-checkbox v-model="registerChecked" />
          <div class="register-term-box">
            <span> {{ prefixStr }}</span>
            <span v-for="(item,index) in registerTermList" :key="index">
              <span class="register-term-link" @click="showRegisterTermDialog(item.id)">
                {{ item.title }}
              </span>
            </span>
            <span> {{ suffixStr }}</span>
          </div>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          :disabled="registerChecked === true ? false: true"
          @click.native.prevent="handleRegister"
        >注册</el-button>
        <div class="tips">
          <span style="margin-right: 20px">
            <router-link
              key="login"
              to="/login"
            >登录</router-link>
          </span>
        </div>
      </el-form>
    </div>
    <el-dialog
      :title="registerTermDialogContent.title"
      :visible.sync="registerTermDialog"
      destroy-on-close="true"
      width="55%"
    >
      <div v-loading="registerTermDialogContentLoading" class="registerTermDialog-content" v-html="registerTermDialogContent.content" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="registerTermDialog = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  validUsername,
  validMobileNumber
} from '@/utils/validate'
import { register, GetPwdLimitInformation, getUserUseProtocol, getUserUseProtocolDetail } from '@/api/user'
export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      var e = value
      var n = 0
      return (
        e.match(/[a-z]/g) && n++,
        e.match(/[A-Z]/g) && n++,
        e.match(/[0-9]/g) && n++,
        e.match(/[^a-zA-Z0-9]/g) && n++,
        (n = n > 3 ? 3 : n),
        (e.length < 6 || /^\d{1,6}$/.test(e)) && (n = 0),
        e.length < 8 && n > 1 && (n = 1),
        // 获取用户注册密码限制相关信息
        GetPwdLimitInformation().then((res) => {
          if (n >= res.Data.level) {
            callback()
          } else {
            callback(new Error(res.Data.tips))
          }
        })
      )
    }
    const validatePassword2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.loginForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateMobileNumber = (rule, value, callback) => {
      if (!validMobileNumber(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        checkPassword: '',
        mobileNumber: '',
        email: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        checkPassword: [
          { required: true, trigger: 'blur', validator: validatePassword2 }
        ],
        mobileNumber: [
          { required: true, trigger: 'blur', validator: validateMobileNumber }
        ],
        email: [
          { required: false, message: '请输入正确的邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      },
      registerChecked: false,
      prefixStr: '',
      suffixStr: '',
      registerTermList: [],
      registerTermDialog: false, // 注册条款弹窗
      registerTermDialogContent: {
        title: '',
        content: ''
      },
      registerTermDialogContentLoading: true,
      loading: false,
      passwordType: 'password',
      checkPasswordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getUserUseProtocol({ typeId: 1 })
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showCheckPwd() {
      if (this.checkPasswordType === 'password') {
        this.checkPasswordType = ''
      } else {
        this.checkPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.checkPassword.focus()
      })
    },
    // 获取注册条款
    getUserUseProtocol(param) {
      getUserUseProtocol(param).then((res) => {
        const { Data } = res
        this.prefixStr = Data.prefixStr
        this.suffixStr = Data.suffixStr
        this.registerTermList = Data.dataList
      }).catch((err) => {
        console.log(err)
      })
    },
    // 打开协议弹窗
    async showRegisterTermDialog(param) {
      const id = param
      this.registerTermDialog = true
      this.registerTermDialogContentLoading = true
      await getUserUseProtocolDetail({ id }).then((res) => {
        const { Data } = res
        this.registerTermDialogContent.title = Data.title
        this.registerTermDialogContent.content = Data.content
        this.registerTermDialogContentLoading = false
      })
    },
    handleRegister() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const formData = this.loginForm
          // 删除确认密码
          delete formData['checkPassword']
          register(formData)
            .then((res) => {
              const { Code, Msg } = res
              if (Code === 1) {
                this.$message({
                  message: '注册成功,前往登录',
                  type: 'success'
                })
                this.$router.push({ path: '/login' })
              } else {
                this.$message({
                  message: Msg,
                  type: 'error'
                })
              }
            })
            .catch((err) => {
              console.log(err)
              const { Msg } = err
              this.$message({
                message: Msg,
                type: 'error'
              })
              // this.$refs.loginForm.resetFields()
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/login.scss';
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.login {
  .login-container {
    .login-form {
      width: 450px;
      max-width: 100%;
      padding: 35px 35px 0;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
      background-color: #fff;
    }
    .tips {
      font-size: 14px;
      color: $bg;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $bg;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $bg;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $bg;
      cursor: pointer;
      user-select: none;
    }
    .register-term{
      margin-bottom: 22px;
      display: flex;
      .register-term-box{
        font-size: 14px;
        padding-left: 10px;
      }
      .register-term-link{
        cursor: pointer;
        color: $bg;
      }
    }
  }
  .registerTermDialog-content{
        min-height: 500px;
        max-height: 500px;
        overflow-y: scroll;
      }
      ::-webkit-scrollbar {
    /*高宽分别对应横竖滚动条的尺寸*/
    width: 8px;
    height: 8px;
}

/*滚动条里面小方块*/
::-webkit-scrollbar-thumb {
    border-radius: 10px !important;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
    /* 颜色 */
    /* background:#b6b6b6!important; */
    /* 线性渐变背景 */
    background-color:$bg;
}

/*滚动条轨道*/
::-webkit-scrollbar-track {
    border-radius: 10px !important;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
    background: #EDEDED !important;
}
}
</style>
