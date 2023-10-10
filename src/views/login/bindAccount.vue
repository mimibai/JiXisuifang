<template>
  <div class="login">
    <div class="login-container">
      <div class="title-container">
        <h3 class="title">微信绑定</h3>
      </div>
      <div class="login-step">
        <div class="login-step-box">
          <el-steps
            :active="2"
            finish-status="success"
            simple
            style="margin-top: 20px"
          >
            <el-step title="1.扫码成功"></el-step>
            <el-step title="2.绑定账号"></el-step>
            <el-step title="3.绑定成功"></el-step>
            <el-step title="4.完成"></el-step>
          </el-steps>
        </div>
        <div class="login-step-form">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left"
          >
            <el-form-item prop="userName">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="userName"
                v-model="loginForm.userName"
                placeholder="账号"
                name="userName"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-form-item prop="pwd">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="pwd"
                v-model="loginForm.pwd"
                :type="passwordType"
                placeholder="密码"
                name="pwd"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin(1)"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>

            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; margin-bottom: 30px"
              @click.native.prevent="handleLogin(1)"
              >登录</el-button
            >
            <div class="tips">
              <span style="margin-right: 20px">
                <a @click="wechatLogin">跳过以微信信息直接登录</a>
              </span>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername, validPassword } from "@/utils/validate";
import { bindAccount,wechatNewCreate } from "@/api/user";
import { Message } from "element-ui";
export default {
  name: "register",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入正确的密码"));
      } else if (!validPassword(value)) {
        callback(new Error("密码不能少于8位且必须包含字母、数字、特殊字符"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        userName: "",
        pwd: "",
        email: "",
        wxUserId: 0,
        openId: 0,
        loginTypeId: 0,
        mobileNumber: 0,
        dynamicCode: 0,
      },
      loginRules: {
        userName: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        pwd: [{ required: true, trigger: "blur", validator: validatePassword }],
      },
      passwordType: "password",
      loading: false,
    };
  },
  created() {
    this.getQuery();
  },
  methods: {
    getQuery() {
      let openId = this.$route.query.openId;
      let wxUserId = this.$route.query.wxUserId;
      if (openId && wxUserId) {
        this.loginForm.openId = openId;
        this.loginForm.wxUserId = wxUserId;
      } else {
        this.$router.push({
          path: "/",
        });
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin(typeId) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loginForm.loginTypeId = typeId;
          this.loading = true;
          bindAccount(this.loginForm)
            .then((response) => {
              const { Data } = response;
              const { sessionKey } = Data;
              this.addToken(sessionKey, "绑定成功");
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    wechatLogin() {
      let param = {
        openId: this.loginForm.openId,
        wxUserId: this.loginForm.wxUserId,
      };
      wechatNewCreate(param)
        .then((response) => {
          const { Data } = response;
          const { sessionKey } = Data;
          this.addToken(sessionKey, "登录成功");
        })
        .catch(() => {
          console.log("error submit!!");
        });
    },
    addToken(token, msg) {
      Message({
        message: msg,
        type: "success",
        duration: 5 * 1000,
      });
      this.$store.dispatch("user/wechatLogin", token);
      this.$router.push({ path: this.redirect || "/" });
    },
  },
};
</script>
<style lang="scss">
@import "~@/styles/login.scss";
</style>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.login {
  .login-container {
    padding-top: 50px;
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
    .login-step {
      padding: 0 40px;
      .login-step-box {
        margin-bottom: 20px;
      }
    }
    .login-step-form {
      width: 450px;
      max-width: 100%;
      padding: 35px 35px 0;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
    }
    .tips {
      font-size: 14px;
      color: #b2642a;
      margin-bottom: 10px;
    }
  }
}
</style>
