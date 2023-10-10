
<template>
  <div class="mine-container-msg">
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="15">
        <div class="mine-container-info">
          <div class="mine-container-info-avatar">
            <img
              :src="avatar"
              class="user-avatar"
            >
          </div>
          <div class="mine-container-info-name">
            {{ userName }}
          </div>
          <div class="mine-container-info-nameitem">
            <el-row
              type="flex"
              :gutter="10"
            >
              <el-col :span="6">
                <div class="mine-container-info-labletit">
                  <span>用户账号：</span>
                </div>
              </el-col>
              <el-col :span="15">
                <div class="mine-container-info-divInput">
                  {{ userName }}
                </div>
              </el-col>
              <!-- <el-col
                :span="3"
                class="change_btn"
              >
                <el-button
                  type="text"
                  class="mobileBtn"
                  @click="handleOpenNameDialog"
                >修改</el-button>
              </el-col> -->
            </el-row>
          </div>
          <div class="mine-container-info-nameitem">
            <el-row
              type="flex"
              :gutter="10"
            >
              <el-col :span="6">
                <div class="mine-container-info-labletit">
                  <span>手机号码：</span>
                </div>
              </el-col>
              <el-col :span="15">
                <div class="mine-container-info-divInput">
                  {{ mobileNumber }}
                </div>
              </el-col>

              <el-col :span="3">
                <el-button
                  type="text"
                  class="mobileBtn"
                  @click="changeMobileNumber()"
                >修改</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- <div class="mine-container-info-nameitem">
            <el-row
              type="flex"
              :gutter="10"
            >
              <el-col :span="6">
                <div class="mine-container-info-labletit">
                  <span>电子邮件：</span>
                </div>
              </el-col>
              <el-col :span="15">
                <div class="mine-container-info-divInput">
                  {{ email }}
                </div>
              </el-col>
              <el-col
                :span="3"
                class="change_btn"
              >
                <el-button
                  type="text"
                  class="mobileBtn"
                  @click="DialogEmail = true"
                >修改</el-button>
              </el-col>
            </el-row>
          </div> -->
          <div class="mine-container-info-nameitem">
            <el-row
              type="flex"
              :gutter="10"
            >
              <el-col :span="6">
                <div class="mine-container-info-labletit">
                  <span>微信：</span>
                </div>
              </el-col>
              <el-col :span="15">
                <div v-if="!isBindWX">
                  暂未绑定
                </div>
                <div v-else>
                  已绑定
                </div>
              </el-col>
              <el-col
                :span="3"
                class="change_btn"
              >
                <el-button
                  v-if="!isBindWX"
                  type="text"
                  class="mobileBtn"
                  @click="openWeixinDailog"
                >绑定</el-button>
                <el-button
                  v-else
                  type="text"
                  class="mobileBtn"
                  @click="unBindWeixin"
                >解绑</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="mine-container-info-nameitem">
            <el-row
              type="flex"
              :gutter="10"
            >
              <el-col :span="6" />
              <el-col :span="15" />
              <el-col :span="3">
                <el-button
                  type="text"
                  class="mobileBtn"
                  @click="logOff()"
                >注销账号</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      ref="DialogName"
      title="修改账户名"
      :visible.sync="DialogName"
      width="30%"
    >
      <span>
        <el-form
          ref="changNameFrom"
          class="user-account-key"
          :model="changNameFrom"
          :rules="ChangeNameRules"
          label-width="100px"
        >
          <el-form-item
            label="新账户名："
            prop="newName"
          >
            <el-input
              ref="newName"
              v-model="changNameFrom.newName"
              type="text"
              :placeholder="userName"
              name="newName"
            />
          </el-form-item>
        </el-form>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="DialogName = false">取消修改</el-button>
        <el-button
          type="primary"
          @click.native.prevent="handleChangeName"
        >确定修改</el-button>
      </span>
    </el-dialog>
    <el-dialog
      ref="DialogEmail"
      title="修改邮箱"
      :visible.sync="DialogEmail"
      width="30%"
    >
      <span>
        <el-form
          ref="changEmailFrom"
          class="user-account-key"
          :model="changEmailFrom"
          :rules="ChangeEmailRules"
          label-width="90px"
        >
          <el-form-item
            label="旧邮箱："
            prop="oldEmail"
          >
            <el-input
              ref="oldEmail"
              v-model="changEmailFrom.oldEmail"
              type="text"
              placeholder="请输入旧邮箱"
              name="oldEmail"
            />
          </el-form-item>
          <el-form-item
            label="新邮箱："
            prop="newEmail"
          >
            <el-input
              ref="newEmail"
              v-model="changEmailFrom.newEmail"
              type="text"
              placeholder="请输入新邮箱"
              name="newEmail"
            />
          </el-form-item>
        </el-form>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="DialogEmail = false">取消修改</el-button>
        <el-button
          type="primary"
          @click.native.prevent="handleChangeEmail"
        >确定修改</el-button>
      </span>
    </el-dialog>
    <el-dialog
      ref="DialogWeixin"
      title="绑定微信"
      :visible.sync="DialogWeixin"
      width="30%"
    >
      <div
        v-loading="qrCodeLoading"
        class="login-container-codebox"
        element-loading-background="rgba(255, 255, 255, 0.95)"
      >
        <h4 class="login-container-codebox-tite">微信绑定</h4>
        <div class="login-container-codebox-code">
          <div class="login-container-codebox-imgcon">
            <img
              :src="qrCodeUrl"
              alt="微信扫一扫绑定"
              class="defaut_qr"
            >
          </div>
        </div>
        <div
          v-if="qrCodeSuccess"
          class="login-container-codebox-desc"
        >
          <div>
            <p>请使用微信扫描二维码绑定</p>
            <p>“佰惠早筛”</p>
          </div>
        </div>
        <div
          v-else
          class="login-container-codebox-desc warning"
        >
          <i class="el-icon-warning" />
          <div>
            <p>此次绑定已取消</p>
            <p>请刷新页面再次扫描</p>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="DialogWeixin = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth' // 从sessionStorlage中获取token,如果有则证明已登录
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import {
  ChangeUserName,
  ChangeEmail,
  isBindWX,
  getWeiChatQrCode,
  checkScanResult,
  weiXinUnbundling,
  unregisterRemind
} from '@/api/user'
import { validMobileNumber } from '@/utils/validate'
export default {
  props: ['avatar'],
  data() {
    const validateMobileNumber = (rule, value, callback) => {
      if (!validMobileNumber(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }

    const validateName = (rule, value, callback) => {
      if (value === this.userName) {
        callback(new Error('新账号名与当前账号名相同！'))
      } else {
        callback()
      }
    }

    return {
      userName: '',
      mobileNumber: '',
      email: '',
      DialogName: false,
      DialogEmail: false,
      DialogWeixin: false,
      isBindWX: false,
      qrCodeLoading: true,
      qrCodeUrl: require('@/assets/common/wechatPublic.png'), // 微信二维码
      qrFrequency: 600, // 扫码轮询次数
      qrTime: 2000, // 扫码轮询间隔
      qrCodeSuccess: true,
      changNameFrom: {
        newName: ''
      },
      changEmailFrom: {
        oldEmail: '',
        newEmail: ''
      },
      ChangeNameRules: {
        newName: [
          { required: true, trigger: 'blur', message: '请输入正确的账号名' },
          { validator: validateName, trigger: 'blur' }
        ]
      },
      ChangeEmailRules: {
        oldEmail: [
          { required: true, message: '请输入正确的邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        newEmail: [
          { required: true, message: '请输入正确的邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      },
      typeId: 1
    }
  },
  created() {
    this.getUserInfo()
    this.checkWeixinBind()
  },
  methods: {
    handleOpen(key, keyPath) {
      //   console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //   console.log(key, keyPath);
    },
    getUserInfo() {
      const hasToken = getToken('userToken')
      if (hasToken) {
        // this.avatar = store.getters.avatar
        this.userName = store.getters.name
        this.mobileNumber = store.getters.mobileNumber
        this.email = store.getters.email
      } else {
        return false
      }
    },
    checkWeixinBind() {
      isBindWX().then((res) => {
        const { Data } = res
        this.isBindWX = Data
      })
    },
    // 更改手机号
    changeMobileNumber() {
      this.$emit('toChangeNumber')
    },

    // 绑定微信弹窗
    openWeixinDailog() {
      this.DialogWeixin = true
      getWeiChatQrCode()
        .then((res) => {
          const { Data } = res
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
        .catch((err) => {
          const { Msg } = err
          Message({
            message: Msg,
            type: 'error',
            duration: 5 * 1000
          })
          // this.DialogWeixin = false
        })
    },
    checkScanResult(param) {
      const that = this
      // 此处作为全局变量，便于页面跳转、刷新时重置定时器
      this.intervalId = setInterval(() => {
        that.qrFrequency--
        if (that.qrFrequency >= 0) {
          checkScanResult(param)
            .then((res) => {
              const { Data } = res
              const { resultCode, openId, wxUserId, sessionKey, refreshToken } =
                Data
              // 如果为-1扫描未成功，继续刷新
              // 如果为0扫描成功，并登录成功
              if (resultCode === 0) {
                // 清除计时器,获取用户信息
                clearInterval(that.intervalId)
                // 将返回的token保存在本地
                Message({
                  message: '绑定成功！',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.DialogWeixin = false
                this.isBindWX = true
              }
              // 如果为2扫描成功，但登录失败
              if (resultCode === 2) {
                Message({
                  message: '绑定失败，请稍后重新扫描',
                  type: 'error',
                  duration: 5 * 1000
                })
                that.qrCodeSuccess = false
              }
            })
            .catch((err) => {
              clearInterval(that.intervalId)
              that.qrCodeSuccess = false
              const { Msg } = err
              Message({
                message: Msg,
                type: 'error',
                duration: 5 * 1000
              })
            })
        } else {
          that.qrCodeSuccess = false
          clearInterval(that.intervalId)
          this.DialogWeixin = false
        }
      }, this.qrTime)
    },
    // 解绑微信
    unBindWeixin() {
      MessageBox.confirm('你确定要解除绑定当前微信吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        weiXinUnbundling().then((res) => {
          const { Msg } = res
          Message({
            message: Msg,
            type: 'success',
            duration: 5 * 1000
          })
          this.DialogWeixin = false
          this.isBindWX = false
        })
      })
    },
    handleChangeName() {
      this.$refs.changNameFrom.validate((valid) => {
        if (valid) {
          this.$confirm('确认修改？')
            .then((_) => {
              this.loading = true
              const formData = this.changNameFrom
              console.log(formData)
              ChangeUserName(formData)
                .then((res) => {
                  this.$message({
                    message: '账号名修改成功',
                    type: 'success'
                  })
                  this.$router.go(0)
                })
                .catch(() => {
                  this.loading = false
                })
            })
            .catch((_) => {})
        } else {
          return false
        }
      })
    },
    handleChangeEmail() {
      this.$refs.changEmailFrom.validate((valid) => {
        if (valid) {
          this.$confirm('确认修改？')
            .then((_) => {
              this.loading = true
              const formData = this.changEmailFrom
              ChangeEmail(formData)
                .then((res) => {
                  this.$message({
                    message: '邮箱修改成功',
                    type: 'success'
                  })
                  this.$router.go(0)
                })
                .catch(() => {
                  this.loading = false
                })
            })
            .catch((_) => {})
        } else {
          return false
        }
      })
    },
    // 注销账号
    async logOff() {
      await unregisterRemind().then((res) => {
        const { Data } = res
        const { unregisterBootInstructions, unregisterConfirmInstructions } = Data
        this.$confirm(unregisterBootInstructions, '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '注销申请',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.$confirm(unregisterConfirmInstructions, '注销说明', {
            message: unregisterConfirmInstructions,
            confirmButtonText: '好的，我知道了',
            dangerouslyUseHTMLString: true
          })
          // this.$msgbox({
          //   title: '注销说明',
          //   message: unregisterConfirmInstructions,
          //   confirmButtonText: '好的，我知道了',
          //   dangerouslyUseHTMLString: true
          // })
        })
      })
    },
    // 关闭姓名弹窗
    handleOpenNameDialog() {
      this.DialogName = true
      this.$refs.changNameFrom.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.mobileBtn {
  color: #da1818;
  font-size: 16px;
  padding: 8px 0px;
}
.mine-container-msg {
  padding: 50px;
  background: #ffffff;
}
.mine-container-info {
  font-size: 16px;
  line-height: 36px;
  &-avatar {
    text-align: center;
    width: 120px;
    height: 120px;
    margin: 0 auto;
    .user-avatar {
      width: 100%;
      height: 100%;
      // background: $bg;
      border-radius: 50%;
    }
  }
  &-name {
    text-align: center;
    color: #666666;
    font-size: 14px;
    margin: 10px 0;
  }
  &-nameitem {
    margin-bottom: 20px;
  }
  &-divInput {
    height: 36px;
    border: 1px solid #dddddd;
    border-radius: 5px;
    padding: 0px 10px;
  }
  &-revise {
    color: #da1818;
  }
  &-labletit {
    color: #666666;
    text-align: right;
  }

  &-btn {
    color: #da1818;
    text-align: right;
  }
}
.el-button--primary {
  background-color: $bg;
  border-color: $bg;
  &:hover {
    background-color: #c37032;
    border-color: #c37032;
  }
}
.login-container-codebox {
  text-align: center;
  .defaut_qr {
    max-width: 250px;
  }
}
</style>

