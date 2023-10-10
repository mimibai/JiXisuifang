
<template>
  <div class="mine-container-msg">
    <el-steps
      :active="active"
      finish-status="success"
      :align-center='true'
    >
      <el-step title="身份认证"></el-step>
      <el-step title="设置绑定新的手机号码"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-row
      type="flex"
      justify="center"
      class="chageNumber"
    >
      <el-col
        :span="17"
        v-if="changeNumberShow"
      >
        <el-form
          ref="changeMobileFrom"
          class="user-account-key"
          :model="{MobileFrom}"
          label-width="90px"
          label-position="left"
        >
          <template v-for="(item,index) in MobileFrom">
            <el-form-item
              v-if=" item.type == 'text' && item.name =='MobileNum'"
              :key="item.index"
              :label="item.title"
              :prop="item.name"
            >
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col>
                  <el-input
                    v-model="item.value"
                    :disabled="item.disabled"
                  />
                </el-col>
              </el-row>

            </el-form-item>
            <el-form-item
              v-if=" item.type == 'phone' && item.name =='MobileNum'"
              :key="item.index"
              :label="item.title"
              :prop="'MobileFrom.' + index + '.value'"
              :rules="[{
                required: item.isMust,
                message: item.title + '不能为空',
              },]"
            >
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col>
                  <el-input
                    v-model="item.value"
                    :disabled="item.disabled"
                  />
                </el-col>
              </el-row>

            </el-form-item>
            <el-form-item
              v-if=" item.type == 'text' && item.name =='DynamicCode'"
              :key="item.index"
              :label="item.title"
              :prop="'MobileFrom.' + index + '.value'"
              :rules="[{
                required: item.isMust,
                message: item.title + '不能为空',
              },
              { type: 'number', message: '必须为数字值'}]"
            >
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col :span='14'>
                  <el-input
                    v-model.number="item.value"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                  />
                </el-col>
                <el-col :span='9'>
                  <!-- 倒计时按钮 -->
                  <el-button
                    type="primary"
                    :disabled="disable"
                    :class="{ codeGeting:isGetingCode }"
                    @click="getVerifyCode"
                    class="DynamicCodeBtn"
                  >{{getCode}}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </template>
          <el-row
            type="flex"
            justify="center"
          >
            <el-button
              type="primary"
              @click.native.prevent="handleChangeMobile"
              class="DynamicCodeBtn"
            >{{submitTitle}}</el-button>
          </el-row>
        </el-form>

        <el-row
          type="flex"
          justify="center"
          style="margin-top:20px;"
        >
          <el-alert
            title="收不到短信验证码？"
            type="warning"
            description="请检查手机网络并且核实手机是否屏蔽系统短信，如均正常请重新获取或稍后再试。"
            show-icon
            :closable=false
          >
          </el-alert>
        </el-row>
      </el-col>
      <el-col
        :span="17"
        v-if='changeNumberSuccess'
      >
        <el-result
          icon="success"
          title="手机号绑定成功"
        >
        </el-result>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { getToken } from '@/utils/auth' // 从sessionStorlage中获取token,如果有则证明已登录
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import {
  ChangeMobileNumberGet,
  GenerateVerificationByLogon,
  ChangeMobileNumberPost,
} from '@/api/user'
import { validMobileNumber } from '@/utils/validate'

export default {
  data() {
    const validateMobileNumber = (rule, value, callback) => {
      if (!validMobileNumber(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }

    return {
      MobileFrom: null,
      active: 0,
      ChangeMobileRules: {
        oldMobileNumber: [
          { required: true, trigger: 'blur', validator: validateMobileNumber },
        ],
        newMobileNumber: [
          { required: true, trigger: 'blur', validator: validateMobileNumber },
        ],
      },
      typeId: 1,
      getCode: '获取验证码',
      isGetingCode: false,
      CodeCount: 60,
      disable: false,
      submitData: {}, // 提交数据
      submitCodeData: {}, // 提交数据
      submitTitle: '提交认证',
      changeNumberSuccess: false,
      changeNumberShow: true,
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      const hasToken = getToken('userToken')
      if (hasToken) {
        this.avatar = store.getters.avatar
        this.userName = store.getters.name
        this.mobileNumber = store.getters.mobileNumber
        this.email = store.getters.email
        this.changeMobileNumber(this.typeId)
      } else {
        return false
      }
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    //第一步获取表单
    changeMobileNumber(typeId) {
      const param = { typeId: typeId }
      ChangeMobileNumberGet(param).then((res) => {
        const { Data } = res
        this.MobileFrom = Data
      })
    },
    //第二步获取手机短信验证码
    getVerifyCode() {
      const formData = this.MobileFrom
      for (let index = 0; index < formData.length; index++) {
        const item = formData[index]
        if (item.name == 'MobileNum') {
          this.submitCodeData[item.name] = item.value
        }
      }
      const param = Object.assign(this.submitCodeData, {
        typeId: this.typeId,
      })
      GenerateVerificationByLogon(param)
        .then((res) => {
          const { Data } = res
          this.CodeCount = Data
          var countDown = setInterval(() => {
            if (this.CodeCount < 1) {
              this.isGetingCode = false
              this.disable = false
              this.getCode = '获取验证码'
              clearInterval(countDown)
            } else {
              this.isGetingCode = true
              this.disable = true
              this.getCode = this.CodeCount-- + 's后重发'
            }
          }, 1000)
        })
        .catch((err) => {
          this.loading = false
          this.$message({
            showClose: true,
            message: err.Msg,
            type: 'warning',
          })
        })
    },
    //第三部提交
    handleChangeMobile() {
      this.$refs.changeMobileFrom.validate((valid) => {
        if (valid) {
          this.loading = true
          const formData = this.MobileFrom
          for (let index = 0; index < formData.length; index++) {
            const item = formData[index]
            this.submitData[item.name] = item.value
          }
          const param = Object.assign(this.submitData, {
            typeId: this.typeId,
          })
          if (param.typeId == 1) {
            ChangeMobileNumberPost(param).then((res) => {
              if (res.Code == 1) {
                this.active = 1
                this.$message({
                  showClose: true,
                  message: '认证成功',
                  type: 'success',
                })

                this.submitTitle = '提交'
                this.CodeCount = 0
                this.isGetingCode = false
                this.disable = false
                this.getCode = '获取验证码'
                this.typeId = 2
                this.changeMobileNumber(this.typeId)
              }
            })
          } else if (param.typeId == 2) {
            ChangeMobileNumberPost(param)
              .then((res) => {
                this.active = 2
                this.changeNumberShow = false
                this.changeNumberSuccess = true
                this.active = 3
              })
              .catch((err) => {
                this.$message({
                  showClose: true,
                  message: err.Msg,
                  type: 'error',
                })
              })
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.chageNumber {
  margin-top: 40px;
}
.DynamicCodeBtn {
  width: 100%;
}
.codeGeting {
  background: #cdcdcd;
  border-color: #cdcdcd;
}
</style>

