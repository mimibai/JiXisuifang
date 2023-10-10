<template>
  <div class="mine-container-msg">
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="15">
        <div class="mine-container-info">
          <template>
            <el-form
              ref="changeForm"
              class="user-account-key"
              :model="changeForm"
              :rules="changRules"
              label-width="100px"
            >
              <el-form-item
                label="当前密码："
                prop="oldPwd"
              >
                <el-input
                  :key="oldPwdType"
                  ref="oldPwd"
                  v-model="changeForm.oldPwd"
                  :type="oldPwdType"
                  placeholder="请输入当前密码"
                  name="oldPwd"
                />
                <span
                  class="show-pwd"
                  @click="showPwd1"
                >
                  <svg-icon :icon-class="oldPwdType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
              <el-form-item
                label="最新密码："
                prop="newPwd"
              >
                <el-input
                  :key="newPwdType"
                  ref="newPwd"
                  v-model="changeForm.newPwd"
                  :type="newPwdType"
                  placeholder="请设置最新密码"
                  name="newPwd"
                />
                <span
                  class="show-pwd"
                  @click="showPwd2"
                >
                  <svg-icon :icon-class="newPwdType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
              <el-form-item
                label="确认密码："
                prop="qrPwd"
              >
                <el-input
                  :key="qrPwdType"
                  ref="qrPwd"
                  v-model="changeForm.qrPwd"
                  :type="qrPwdType"
                  placeholder="请确认最新密码"
                  name="qrPwd"
                />
                <span
                  class="show-pwd"
                  @click="showPwd3"
                >
                  <svg-icon :icon-class="qrPwdType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click.native.prevent="handleChange"
                >修改密码</el-button>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { changePassword } from '@/api/user'
export default {
  name: 'ChangePassword',
  data() {
    // 此处即表单发送之前验证  验证新密码与原密码
    const validateNewPassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不能少于8位'))
      } else if (value === this.changeForm.oldPwd) {
        callback(new Error('最新密码不能与当前密码相同!'))
      } else {
        callback()
      }
    }
    // 此处即表单发送之前验证  验证新密码与再次确认
    const validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.changeForm.newPwd) {
        callback(new Error('与最新密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      userName: '',
      changeForm: {
        oldPwd: '',
        newPwd: '',
      },
      changRules: {
        // 验证规则
        oldPwd: [
          {
            required: true,
            message: '请输入当前密码',
            trigger: 'blur',
          },
        ],
        newPwd: [
          {
            required: true,
            message: '请设置最新密码',
            trigger: 'blur',
          },
          {
            validator: validateNewPassword,
            trigger: 'blur',
          },
        ],
        qrPwd: [
          {
            required: true,
            message: '请确认最新密码',
            trigger: 'blur',
          },
          {
            validator: validateNewPassword2,
            trigger: 'blur',
          },
        ],
      },
      loading: false,
      oldPwdType: 'password',
      newPwdType: 'password',
      qrPwdType: 'password',
    }
  },

  methods: {
    showPwd1() {
      if (this.oldPwdType === 'password') {
        this.oldPwdType = ''
      } else {
        this.oldPwdType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.oldPwd.focus()
      })
    },
    showPwd2() {
      if (this.newPwdType === 'password') {
        this.newPwdType = ''
      } else {
        this.newPwdType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.newPwd.focus()
      })
    },
    showPwd3() {
      if (this.qrPwdType === 'password') {
        this.qrPwdType = ''
      } else {
        this.qrPwdType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.qrPwd.focus()
      })
    },

    handleChange() {
      this.$refs.changeForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认修改？').then((_) => {
            this.loading = true
            const formData = this.changeForm
            console.log(formData)
            changePassword(formData)
              .then((res) => {
                this.$message({
                  message: '密码修改成功,请重新登录',
                  type: 'success',
                })
                this.$store.dispatch('user/logout')
                this.$router.push({ path: '/login' })
              })
              .catch((err) => {
                const { Msg } = err
                this.$message({
                  message: Msg,
                  type: 'error',
                })
                this.resetForm('changeForm')
                this.loading = false
              })
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

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
  top: 0px;
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

.mine-container-msg {
  padding: 50px;
  background: #ffffff;
}
.mine-container-info {
  font-size: 16px;
  line-height: 36px;
  &-avatar {
    &-img {
      width: 120px;
      height: 120px;
      background: $bg;
      border-radius: 60px;
      margin: 0 auto;
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
    text-align: right;
    color: #da1818;
  }
}
</style>
