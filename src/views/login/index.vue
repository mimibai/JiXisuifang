<template>
  <div class="login">
    <div class="login-container">
      <el-row type="flex">
        <el-col :span="24">
          <el-tabs v-model="activeName">
            <el-tab-pane
              label=""
              name="first"
            >
              <el-row
                type="flex"
                justify="space-around"
                class="login-box"
              >
                <el-col
                  v-if="isOpenWeiXinLogin"
                  v-loading="qrCodeLoading"
                  :span="10"
                  element-loading-background="rgba(255, 255, 255, 0.95)"
                >
                  <div class="login-container-codebox">
                    <h4 class="login-container-codebox-tite">微信登录</h4>
                    <div class="login-container-codebox-code">
                      <div class="login-container-codebox-imgcon">
                        <img
                          :src="qrCodeUrl"
                          alt="微信扫一扫登录"
                          class="defaut_qr"
                        >
                      </div>
                    </div>
                    <div
                      v-if="qrCodeSuccess"
                      class="login-container-codebox-desc"
                    >
                      <div>
                        <p>请使用微信扫描二维码登录</p>
                        <p>“佰惠早筛”</p>
                      </div>
                    </div>
                    <div
                      v-else
                      class="login-container-codebox-desc warning"
                    >
                      <i class="el-icon-warning" />
                      <div>
                        <p>此次登录已取消</p>
                        <p>请刷新页面再次扫描登录</p>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="10">
                  <el-tabs v-model="LoginName">
                    <el-tab-pane
                      label="普通登录"
                      name="patientFirst"
                    >
                      <el-form
                        ref="loginForm"
                        :model="loginForm"
                        :rules="loginRules"
                        class="login-form"
                        auto-complete="on"
                        label-position="left"
                        style="padding: 15px 0"
                      >
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
                            @keyup.enter.native="handleLogin"
                          />
                          <span
                            class="show-pwd"
                            @click="showPwd"
                          >
                            <svg-icon
                              :icon-class="
                                passwordType === 'password' ? 'eye' : 'eye-open'
                              "
                            />
                          </span>
                        </el-form-item>

                        <el-button
                          :loading="loading"
                          type="primary"
                          style="width: 100%; margin-bottom: 30px"
                          @click.native.prevent="handleLogin"
                        >登录</el-button>
                        <div class="tips">
                          <!-- <span style="margin-right: 20px">
                <a href="javascript:void(0);">忘记密码？</a>
              </span> -->
                          <span style="margin-right: 20px">
                            <router-link
                              key="register"
                              to="/register"
                            >注册</router-link>
                          </span>
                        </div>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane
                      label="手机号码登录"
                      name="patientSecond"
                    >
                      <el-form
                        ref="loginMobileForm"
                        :model="loginMobileForm"
                        :rules="loginRules"
                        class="login-form"
                        auto-complete="on"
                        label-position="left"
                        style="padding: 15px 0"
                      >
                        <el-form-item prop="mobileNumber">
                          <span class="svg-container">
                            <svg-icon icon-class="phone" />
                          </span>
                          <el-input
                            ref="mobileNumber"
                            v-model="loginMobileForm.mobileNumber"
                            placeholder="手机号"
                            name="mobileNumber"
                            type="text"
                            tabindex="1"
                            auto-complete="on"
                          />
                        </el-form-item>
                        <el-form-item prop="DynamicCode">
                          <span class="svg-container">
                            <svg-icon icon-class="password" />
                          </span>
                          <el-input
                            ref="DynamicCode"
                            v-model="loginMobileForm.DynamicCode"
                            placeholder="验证码"
                            name="DynamicCode"
                            type="text"
                            tabindex="1"
                            auto-complete="on"
                          />
                        </el-form-item>
                        <el-button
                          type="primary"
                          style="width: 100%; margin-bottom: 20px"
                          :disabled="codeDisabled"
                          @click.native.prevent="handleMobileCode"
                        >{{ codeText }}</el-button>
                        <el-button
                          :loading="loading"
                          type="primary"
                          style="width: 100%; margin-bottom: 30px; margin-left: 0"
                          @click.native.prevent="handleMobileLogin"
                        >登录</el-button>
                      </el-form>
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane
              label=""
              name="second"
            >
              <el-row
                type="flex"
                justify="space-around"
                class="login-box"
              >
                <el-col
                  v-if="isOpenWeiXinLogin"
                  v-loading="qrCodeLoading"
                  :span="10"
                >
                  <div class="login-container-codebox">
                    <h4 class="login-container-codebox-tite">微信登录</h4>
                    <div class="login-container-codebox-code">
                      <div class="login-container-codebox-imgcon">
                        <img
                          :src="qrCodeUrl"
                          alt="微信扫一扫登录"
                          class="defaut_qr"
                        >
                      </div>
                    </div>
                    <div class="login-container-codebox-desc">
                      <p>请使用微信扫描二维码登录</p>
                      <p>“佰惠早筛”</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="10">
                  <el-tabs v-model="docLoginName">
                    <el-tab-pane
                      label="普通登录"
                      name="docFirst"
                    >
                      <el-form
                        ref="loginForm"
                        :model="loginForm"
                        :rules="loginRules"
                        class="login-form"
                        auto-complete="on"
                        label-position="left"
                        style="padding: 15px 0"
                      >
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
                            @keyup.enter.native="handleLogin"
                          />
                          <span
                            class="show-pwd"
                            @click="showPwd"
                          >
                            <svg-icon
                              :icon-class="
                                passwordType === 'password' ? 'eye' : 'eye-open'
                              "
                            />
                          </span>
                        </el-form-item>

                        <el-button
                          :loading="loading"
                          type="primary"
                          style="width: 100%; margin-bottom: 30px"
                          @click.native.prevent="handleLogin"
                        >登录</el-button>
                        <div class="tips">
                          <!-- <span style="margin-right: 20px">
                <a href="javascript:void(0);">忘记密码？</a>
              </span> -->
                          <!-- <span style="margin-right: 20px">
                    <router-link key="register" to="/register"
                      >注册</router-link
                    >
                  </span> -->
                        </div>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane
                      label="手机号码登录"
                      name="docSecond"
                    >
                      <el-form
                        ref="loginMobileForm"
                        :model="loginMobileForm"
                        :rules="loginRules"
                        class="login-form"
                        auto-complete="on"
                        label-position="left"
                        style="padding: 15px 0"
                      >
                        <el-form-item prop="mobileNumber">
                          <span class="svg-container">
                            <svg-icon icon-class="phone" />
                          </span>
                          <el-input
                            ref="mobileNumber"
                            v-model="loginMobileForm.mobileNumber"
                            placeholder="手机号"
                            name="mobileNumber"
                            type="text"
                            tabindex="1"
                            auto-complete="on"
                          />
                        </el-form-item>
                        <el-form-item prop="DynamicCode">
                          <span class="svg-container">
                            <svg-icon icon-class="password" />
                          </span>
                          <el-input
                            ref="DynamicCode"
                            v-model="loginMobileForm.DynamicCode"
                            placeholder="验证码"
                            name="DynamicCode"
                            type="text"
                            tabindex="1"
                            auto-complete="on"
                          />
                        </el-form-item>
                        <el-button
                          type="primary"
                          style="width: 100%; margin-bottom: 20px"
                          :disabled="codeDisabled"
                          @click.native.prevent="handleMobileCode"
                        >{{ codeText }}</el-button>
                        <el-button
                          :loading="loading"
                          type="primary"
                          style="width: 100%; margin-bottom: 30px; margin-left: 0"
                          @click.native.prevent="handleMobileLogin"
                        >登录</el-button>
                      </el-form>
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  validUsername,
  validMobileNumber
} from '@/utils/validate'
import {
  getLogonType,
  getWeiChatQrCode,
  checkScanResult,
  GenerateMobileNumVerification,
  admin,
  getInfo,
  GetPwdLimitInformation
} from '@/api/user'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
// import store from '@/store'
export default {
  name: 'Login',
  data() {
    const validateMobileNumber = (rule, value, callback) => {
      if (!validMobileNumber(value)) {
        callback(new Error('请输入正确的手机号'))
        this.codeDisabled = true
      } else {
        this.codeDisabled = false
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的密码'))
      } else {
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
    }
    return {
      activeName: 'first',
      LoginName: 'patientFirst',
      docLoginName: 'docFirst',
      loginForm: {
        username: '',
        password: '',
        email: ''
      },
      loginMobileForm: {
        logonTypeId: 2, // 普通登录1 手机号登录2
        mobileNumber: '',
        DynamicCode: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        mobileNumber: [
          { required: true, trigger: 'blur', validator: validateMobileNumber }
        ]
      },
      codeText: '获取动态验证码',
      codeDisabled: false, // 发送验证码按钮是否禁用
      isOpenWeiXinLogin: false, // 是否开启微信登录
      qrCodeLoading: true,
      qrCodeSuccess: true,
      isOpenMobileNumberLogin: false, // 是否开启手机号登录
      qrCodeUrl: require('@/assets/common/wechatPublic.png'), // 微信二维码
      qrFrequency: 600, // 扫码轮询次数
      qrTime: 2000, // 扫码轮询间隔
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      intervalId: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        if (this.redirect === '/doctor') {
          this.activeName = 'second'
        }
        if (this.redirect === '/login') {
          this.activeName = 'first'
        }
      },
      immediate: true
    }
  },
  created() {
    // 检查系统支持登录方式
    this.getLogonType()
  },
  mounted() {
    // this.intervalId =
  },
  beforeDestroy() {
    // 页面跳转后清除计时器
    console.log('销毁了')
    console.log(this)
    clearInterval(this.intervalId)
    this.intervalId = null
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
    // 验证码倒计时方法
    countDown(time) {
      if (time === 0) {
        this.codeDisabled = false
        this.codeText = '重新获取'
        return
      } else {
        this.codeDisabled = true
        this.codeText = '获取动态验证码(' + time + ')'
        time--
      }
      setTimeout(() => {
        this.countDown(time)
      }, 1000)
    },
    // 点击获取验证码
    handleMobileCode() {
      if (this.loginMobileForm.mobileNumber !== '') {
        const param = {
          mobileNumber: this.loginMobileForm.mobileNumber
        }
        GenerateMobileNumVerification(param).then((response) => {
          const { Data } = response
          if (response.Code === 1) {
            this.countDown(Data)
          } else {
            this.codeDisabled = false
          }
        })
      } else {
        Message({
          message: '请输入手机号',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // 手机号码登录
    handleMobileLogin() {
      this.$refs.loginMobileForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/mobileLogin', this.loginMobileForm)
            .then(() => {
              Message({
                message: '登录成功',
                type: 'success',
                duration: 5 * 1000
              })
              // this.checkLoginJunmTo()
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取支持登录类型
    getLogonType() {
      getLogonType().then((response) => {
        const { isOpenMobileNumberLogin, isOpenWeiXinLogin } = response.Data
        this.isOpenMobileNumberLogin = isOpenMobileNumberLogin
        this.isOpenWeiXinLogin = isOpenWeiXinLogin
        // 如果开启微信登录，则调取二维码
        if (this.isOpenWeiXinLogin === true) {
          this.getWeiChatQrCode()
        }
        if (this.isOpenMobileNumberLogin === true) {
          // this.GenerateMobileNumVerification();
        }
      })
    },
    // 获取二维码
    getWeiChatQrCode() {
      getWeiChatQrCode().then((response) => {
        const { Data } = response
        const { code, wid, qrCodeUrl } = Data
        this.qrCodeUrl = qrCodeUrl
        // 获取二维码成功后，轮询扫码验证
        const param = {
          code: code,
          wid: wid
        }
        this.qrCodeLoading = false
        this.checkScanResult(param)
      })
    },
    // 扫码验证
    checkScanResult(param) {
      const that = this
      // 此处作为全局变量，便于页面跳转、刷新时重置定时器
      that.intervalId = setInterval(() => {
        that.qrFrequency--
        if (that.qrFrequency >= 0) {
          checkScanResult(param).then((response) => {
            const { Data } = response
            const { resultCode, openId, wxUserId, sessionKey, refreshToken } =
              Data
            // 如果为-1扫描未成功，继续刷新
            // 如果为0扫描成功，并登录成功
            if (resultCode === 0) {
              // 清除计时器,获取用户信息
              clearInterval(that.intervalId)
              // 将返回的token保存在本地
              that.$store.dispatch('user/wechatLogin', {
                sessionKey,
                refreshToken
              })
              Message({
                message: '登录成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.checkLoginJunmTo()
              // this.$router.push({ path: this.redirect || '/' })
            }
            // 如果为2扫描成功，但登录失败
            if (resultCode === 2) {
              Message({
                message: '登录失败，请稍后重新扫描',
                type: 'error',
                duration: 5 * 1000
              })
              that.qrCodeSuccess = false
            }
            // 如果为3跳转至绑定页绑定
            if (resultCode === 3) {
              Message({
                message: '扫码成功，前往绑定已有账户',
                type: 'success',
                duration: 5 * 1000
              })
              clearInterval(that.intervalId)
              that.$router.push({
                path: '/bindAccount',
                query: { openId: openId, wxUserId: wxUserId }
              })
            }
          })
        } else {
          that.qrCodeSuccess = false
          clearInterval(that.intervalId)
        }
      }, this.qrTime)
    },
    handleLogin() {
      const that = this
      that.$refs.loginForm.validate((valid) => {
        if (valid) {
          that.loading = true
          that.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              Message({
                message: '登录成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.checkLoginJunmTo()
              // this.$router.push({ path: this.redirect || '/' })
              that.loading = false
            })
            .catch((res) => {
              that.loading = false
              if (res.Code === 99) {
                Message({
                  message: res.Msg,
                  type: 'error',
                  duration: 5 * 1000
                })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    checkLoginJunmTo() {
      this.$router.push({ path: this.redirect || '/' })
      // this.getUserInfo()
    },
    getUserInfo() {
      // 获取前登录用户信息后判断跳转地址
      getInfo().then((response) => {
        const { Data } = response
        const roleList = Data.roleList
        if (roleList.some((item, index) => item.roleId === 2)) {
          // 医生端
          this.$router.push({ path: '/doctor/index' })
        } else if (
          roleList.some((item, index) => item.roleId === 1 && index <= 0)
        ) {
          // 管理端
          this.jumpToAdmin()
        } else if (
          roleList.some((item, index) => item.roleId === 4 && index <= 0)
        ) {
          // 患者端
          this.$router.push({ path: '/patient/home' })
        }
      })
    },
    hasPermission(role, roleList) {
      return roleList.some((itme) => itme.roleId === role)
    },
    jumpToAdmin() {
      // 跳转至管理后台
      admin()
        .then((response) => {
          const { Data } = response
          const hasToken = getToken('userToken')
          const key = Data.slice(0, 4) + hasToken.substr(4, 7) + Data.slice(4)
          const href = '/Home/jumpManager?verificationCode=' + key
          // 当前页跳转至首页
          this.$router.push({ path: '/' })
          // 打开新页面跳转至管理端
          window.open(href, '_blank')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/login.scss';
.login-container {
  .el-tabs__item {
    font-size: 20px;
  }
  .login-box .el-tabs__item {
    font-size: 16px;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.login {
  .login-container {
    padding: 45px 50px;
    background: #fff;

    .login-box {
      width: 75%;
      margin: 0 auto;
    }
    .login-form {
      width: 450px;
      max-width: 100%;
      padding: 35px 0;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
      background-color: #fff;
    }
    .login-container-codebox-tite {
      text-align: center;
      font-weight: normal;
      margin-bottom: 20px;
    }
    .login-container-codebox-code {
      .login-container-codebox-imgcon {
        padding: 0 30px;
        min-height: 300px;
        img {
          max-width: 100%;
          width: 100%;
          border: 1px solid $bg;
        }
      }
    }
    .login-container-codebox-desc {
      text-align: center;
      p {
        margin-top: 10px;
        font-size: 14px;
      }
    }
    .login-container-codebox-desc.warning {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e6a23c;
      i {
        font-size: 35px;
        margin-right: 10px;
      }
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
    .el-button--primary {
      background-color: $bg;
      border-color: $bg;
      &:hover {
        background-color: #c37032;
        border-color: #c37032;
      }
    }
  }
}
</style>
