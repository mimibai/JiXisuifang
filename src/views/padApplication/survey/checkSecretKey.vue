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
              <div class="pad-content">
                <div class="pad-bindIp">
                  <div class="pad-verification">
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
                                validator: validateSecretKey,
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
                      @click.native.prevent="handleSubmitSome()"
                    >验证秘钥</el-button>
                    <h4 class="pad-verification-tips">
                      请点击“验证秘钥”来进行秘钥验证！
                    </h4>
                  </div>
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
import { getCheckSecretKey, postCheckSecretKey } from '@/api/padApplication'
import { Message, MessageBox } from 'element-ui'
// import { getCookieToken } from '@/utils/cookie'
import { validPassword } from '@/utils/validate'
export default {
  data() {
    return {
      loading: true,
      codeForm: {
        list: []
      }
    }
  },
  created() {
    const param = {}
    this.fetchData(param)
  },
  methods: {
    fetchData(param) {
      this.getCheckSecretKey()
    },
    handleSubmitSome() {
      this.$refs.codeForm.validate((valid) => {
        if (valid) {
          const param = {}
          const dataArr = this.codeForm.list
          for (let index = 0; index < dataArr.length; index++) {
            const element = dataArr[index]
            if (element.name === 'SecretKey') {
              param.SecretKey = element.value
            }
          }
          this.postCheckSecretKey(param)
        } else {
          return false
        }
      })
    },
    // 获取秘钥验证form
    getCheckSecretKey() {
      getCheckSecretKey().then((res) => {
        const { Data } = res
        this.codeForm.list = Data.formData
        this.loading = false
      })
    },
    // 提交秘钥验证
    postCheckSecretKey(params) {
      postCheckSecretKey(params)
        .then((res) => {
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
        })
        .catch((err) => {
          const { Msg, Code } = err
          // code21为重复登录，
          if (Code === 21) {
            MessageBox.confirm(Msg, '警告！', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              const newParam = Object.assign(params, { isConfirmRequest: true })
              this.postCheckSecretKey(newParam)
            })
          } else {
            Message({
              message: Msg || '错误',
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
    },
    // 正则验证秘钥
    validateSecretKey(rule, value, callback) {
      if (!validPassword(value)) {
        callback(new Error('秘钥最少8位 包括字母、数字、特殊符号，区分大小写'))
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
.pad-container-logo {
  margin-bottom: 125px;
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
