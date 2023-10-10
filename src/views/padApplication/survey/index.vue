<template>
  <div
    v-loading="loading"
    class="pad-container"
  >
    <el-row
      type="flex"
      justify="end"
      align="middle"
      class="pad-container-box"
    >
      <el-col
        :xs="16"
        :sm="14"
        :md="12"
        :lg="8"
        :xl="8"
      >
        <div class="login-container">
          <el-row
            type="flex"
            justify="center"
          >
            <el-col :span="17">
              <div class="pad-container-logo">
                <el-row
                  type="flex"
                  justify="center"
                >
                  <el-col>
                    <div class="header-bottom-logo">
                      <el-row type="flex">
                        <el-col>
                          <el-row
                            type="flex"
                            align="middle"
                            class="header-bottom-logo-container"
                          >
                            <el-col>
                              <img
                                src="@/assets/padApplication/padLogo.png"
                                alt="佰惠早筛"
                                title="佰泽医疗"
                                style="max-width: 100%"
                              >
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div v-if="HospitalName && TerminalName" class="pad-name">
                <div><span class="pad-name-span">{{ HospitalName }}</span><span>{{ TerminalName }}</span></div>
              </div>
              <div class="pad-content">
                <div
                  v-if="isBindIp"
                  class="pad-bindIp"
                >
                  <div
                    v-if="TerminalType == 1"
                    class="pad-verification"
                  >
                    <el-button
                      round
                      type="primary"
                      class="login-button"
                      @click.native.prevent="handleSubmitSome(TerminalType)"
                    >进入测评量表</el-button>
                    <h4 class="pad-verification-tips">
                      请点击“进入测评量表”来进行测评！
                    </h4>
                  </div>
                  <div
                    v-if="TerminalType === 2"
                    class="pad-verification"
                  >
                    <el-form
                      ref="codeForm"
                      :model="codeForm"
                      label-width="auto"
                      class="pad-verification-form"
                    >
                      <div
                        v-for="(item, index) in codeForm.list"
                        :key="item.index"
                      >
                        <div v-if="item.type == 'text'">
                          <el-form-item
                            v-if="!item.isdisplay"
                            :prop="'list.' + index + '.value'"
                            :rules="[
                              {
                                required: item.isMust,
                                message: '必填项不能为空',
                                trigger: 'blur',
                              },
                              {
                                trigger: 'blur',
                                validator: validateCode,
                              },
                            ]"
                          >
                            <el-input
                              v-model="item.value"
                              :placeholder="'请输入'+item.title"
                            />
                          </el-form-item>
                        </div>
                      </div>
                    </el-form>
                    <el-button
                      round
                      type="primary"
                      class="login-button"
                      @click.native.prevent="handleSubmitSome(TerminalType)"
                    >癌筛评估</el-button>
                    <h4 class="pad-verification-tips">
                      请点击“癌筛评估”来进行测评！
                    </h4>
                  </div>
                </div>
                <div v-else>
                  <el-result
                    icon="error"
                    :title="bindTpTitle"
                    :sub-title="bindTpSubTitle"
                  />
                </div>
                <div class="login-bottom-logo">
                  <img
                    src="@/assets/common/headerLogo2.png"
                    alt="北京抗癌协会"
                    title="北京抗癌协会"
                  >
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  startEntranceGet,
  startEntrancePost
} from '@/api/padApplication'
import { getCookieToken, removeCookieToken } from '@/utils/cookie'
import { Message } from 'element-ui'
import { validNumber } from '@/utils/validate'
export default {
  data() {
    return {
      loading: true,
      isBindIp: false,
      bindTpTitle: '当前设备不可用，请先进行绑定',
      bindTpSubTitle: '请确认后重试！',
      HospitalName: null,
      TerminalName: null,
      secretKeyToken: null, // 秘钥
      codeForm: {
        list: []
      },
      TerminalType: 0
    }
  },
  created() {
    const param = {}
    const pcClientId = this.$route.query.pcClientId
    const secretKeyToken = getCookieToken('terminalToken')
    if (pcClientId && secretKeyToken) {
      // 一机多人秘钥填写正确，前往填写编号
      param.pcClientId = pcClientId
      param.secretKeyToken = secretKeyToken
      this.secretKeyToken = secretKeyToken
    }
    this.fetchData(param)
  },
  methods: {
    fetchData(param) {
      startEntranceGet(param)
        .then((res) => {
          const { Data } = res
          const { HospitalName, TerminalName } = Data
          // 如果有终端名称，保存至cookie
          if (HospitalName && TerminalName) {
            this.HospitalName = HospitalName
            this.TerminalName = TerminalName
            this.$store
              .dispatch('terminal/saveterminalHospitalInfo', { hospitalName: HospitalName, terminalName: TerminalName })
          }
          this.TerminalType = Data.TerminalType
          this.isBindIp = true
          this.codeForm.list = Data.formData
          this.loading = false
        })
        .catch((err) => {
          const { Code, Msg, Data } = err
          if (Code === 99) {
            Message({
              message: Msg || '错误',
              type: 'error',
              duration: 5 * 1000
            })
            this.bindTpTitle = Msg
            this.isBindIp = false
          }
          if (Code === 20) {
            const { isEnableSecretKey } = Data
            // 判断系统是否开启秘钥识别
            // 如果开启获取秘钥
            if (isEnableSecretKey === true) {
              // 如果cookie里有秘钥，无需登录，直接填写测评编号，自调用当前请求
              const terminalToken = getCookieToken('terminalToken')
              if (terminalToken) {
                this.fetchData({ secretKeyToken: terminalToken })
                this.secretKeyToken = terminalToken
              } else {
                // 如果token里无秘钥，需秘钥登录，跳至秘钥页
                Message({
                  message: '秘钥已过期，请重新输入秘钥！',
                  type: 'error',
                  duration: 5 * 1000
                })
                this.$router.push({
                  path: '/padApplication/checkSecretKey'
                })
              }
            } else {
              // 如果未开启，提示报错
              Message({
                message: Msg || '错误',
                type: 'error',
                duration: 5 * 1000
              })
              this.bindTpTitle = Msg
            }
          }
          // 重复登录导致秘钥失效返回输入秘钥页，清除cookie
          if (Code === 22) {
            Message({
              message: Msg,
              type: 'error',
              duration: 5 * 1000
            })
            removeCookieToken('terminalToken')
            this.$router.push({
              path: '/padApplication/checkSecretKey'
            })
          }
          this.loading = false
        })
    },
    // getIp() {
    //   getIp().then((res) => {
    //     console.log(res);
    //   });
    // },
    handleSubmitSome(TerminalType) {
      // 一机一人
      if (TerminalType === 1) {
        this.$router.push({
          path: '/padApplication/list',
          query: {
            TerminalType: TerminalType,
            code: ''
          }
        })
      } else {
        this.$refs.codeForm.validate((valid) => {
          if (valid) {
            // 一机多人需要编号
            const param = {}
            const dataArr = this.codeForm.list
            for (let index = 0; index < dataArr.length; index++) {
              const element = dataArr[index]
              if (element.name === 'Code') {
                param.code = element.value
              }
            }
            param.TerminalType = TerminalType
            if (this.secretKeyToken != null) {
              param.secretKeyToken = this.secretKeyToken
            }
            this.startEntrance(param)
          } else {
            return false
          }
        })
      }
    },
    startEntrance(param) {
      const { code, TerminalType, secretKeyToken } = param
      console.log(param)
      startEntrancePost({ code, secretKeyToken })
        .then((res) => {
          this.$router.push({
            path: '/padApplication/list',
            query: { TerminalType, code }
          })
        })
        .catch((err) => {
          const { Msg } = err
          Message({
            message: Msg || '错误',
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    // 正则验证编号
    validateCode(rule, value, callback) {
      if (!validNumber(value)) {
        callback(new Error('请输入正确的编号'))
      } else if (value.length < 6) {
        callback(new Error('编号不能少于6位'))
      } else {
        callback()
      }
    }
  }
}
</script>
<style lang="scss">
.pad-verification-form input {
  border-radius: 20px;
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.pad-container {
  height: 100vh;
  width: 100%;
  background: url(../../../assets/padApplication/bg.jpg) no-repeat center;
  background-size: cover;
  overflow: hidden;
  .pad-container-box {
    height: 100%;
    box-sizing: border-box;
    padding-right: 260px;
  }
  .login-container {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    padding: 100px 0;
  }

  .login-button {
    width: 100%;
  }
}
.pad-name{
  padding: 20px 0;
  color: $bg;
  font-size: 20px;
  text-align: center;
  &-span{
    margin-right: 20px;
  }
}
.pad-container-logo {
  margin-bottom: 80px;
}
.header-bottom-logo-container {
  height: 60px;
  text-align: center;
}
.header-bottom-logo-line {
  height: 40px;
  width: 1px;
  background: #dadadaff;
  vertical-align: middle;
  display: inline-block;
}
.pad-content {
  text-align: center;
}
.pad-verification-tips {
  color: $bg;
  margin-top: 50px;
  margin-bottom: 50px;
  font-weight: 400;
  font-size: 18px;
}
.pad-verification-form {
  margin: 0 auto;
  margin-bottom: 30px;
}
@media screen and (max-width: 1366px) {
  .pad-container {
    .pad-container-box {
      padding-right: 200px;
    }
  }
  .pad-container-logo {
    margin-bottom: 75px;
  }
  .pad-verification-tips {
    margin-top: 22px;
    margin-bottom: 22px;
  }
  .pad-verification-form {
    margin-bottom: 22px;
  }
}
@media screen and (max-width: 1200px) {
  .pad-container {
    .pad-container-box {
      padding-right: 0px;
      justify-content: center;
    }
    .login-container {
      padding: 60px 0 45px;
    }
  }
  .pad-container-logo {
    margin-bottom: 45px;
  }
}
</style>
