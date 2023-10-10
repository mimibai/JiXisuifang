<template>
  <div class="header">
    <div class="header-top">
      <div class="container">
        <el-row>
          <el-col class="header-top-left">
            <el-row type="flex">
              <el-col :span="8">
                <a @click="checkPatient">
                  <div :class="active?'header-top-nav active':'header-top-nav'">
                    <div class="header-top-nav-rigtline">
                      <img
                        src="@/assets/common/huanzhe.png"
                        alt=""
                        class="header-top-nav-icon"
                      >
                      <span class="header-top-nav-font">患者版</span>
                    </div>
                  </div>
                </a>
              </el-col>
              <el-col :span="8">
                <a @click="checkLogin">
                  <div :class="active?'header-top-nav ':'header-top-nav active'">
                    <div class="header-top-nav-rigtline">
                      <img
                        src="@/assets/common/yisheng.png"
                        alt=""
                        class="header-top-nav-icon"
                      >
                      <span class="header-top-nav-font">专业版</span>
                    </div>
                  </div>
                </a>
              </el-col>
              <el-col :span="8">
                <!-- <router-link key="golbal" to="/patient/home">
                  <div class="header-top-nav">
                    <div class="header-top-nav-rigtline">
                      <img
                        src="@/assets/common/yuyan.png"
                        alt=""
                        class="header-top-nav-icon"
                      />
                      <span class="header-top-nav-font">EN</span>
                    </div>
                  </div>
                </router-link> -->
              </el-col>
            </el-row>
          </el-col>
          <el-col class="header-top-right">
            <div class="header-top-search">
              <!-- <Search /> -->
            </div>
            <div class="header-top-login">
              <login-status />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="header-bottom">
      <div class="container">
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
        >
          <el-col :span="9">
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
                        src="@/assets/common/headerLogo2.png"
                        alt="北京抗癌协会"
                        title="北京抗癌协会"
                      >
                    </el-col>
                  </el-row>
                </el-col>
                <el-col>
                  <el-row
                    type="flex"
                    align="middle"
                    class="header-bottom-logo-container"
                  >
                    <el-col>
                      <div class="header-bottom-logo-line" />
                    </el-col>
                  </el-row>
                </el-col>
                <el-col>
                  <el-row
                    type="flex"
                    align="middle"
                    class="header-bottom-logo-container"
                  >
                    <el-col>
                      <img
                        src="@/assets/common/headerLogo1.png"
                        alt="佰惠早筛"
                        title="佰泽医疗"
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="13">
            <el-row
              type="flex"
              justify="end"
            >
              <div class="header-bottom-nav">
                <nav-bar />
              </div>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// import Search from "./Search.vue";
import { checkLogin } from '@/utils/common'
import LoginStatus from './LoginStatus.vue'
import NavBar from './NavBar'
export default {
  components: {
    // Search,
    LoginStatus,
    NavBar
  },
  data() {
    return {
      search: '',
      active: true,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        if (this.redirect == '/doctor') {
          this.active = false
        } else if (this.redirect == '/login') {
          this.active = true
        } else {
          this.active = true
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    checkLogin() {
      this.active = false
      checkLogin()
    },
    checkPatient() {
      this.active = true
      this.$router.push({ path: '/patient/home' })
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.header {
  .el-input__inner {
    border: none;
    border-radius: 14px;
    background: $searchBg;
    color: $fontColor;
    &::-webkit-input-placeholder {
      color: $fontColor;
    }
    &::-moz-input-placeholder {
      color: $fontColor;
    }
    &::-ms-input-placeholder {
      color: $fontColor;
    }
  }
  .el-icon-search {
    color: $fontColor;
  }
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.header {
  color: $lightGray;
  font-size: 14px;
  &-top {
    background: $bg;
    &-left {
      float: left;
      width: 27%;
    }
    &-right {
      float: right;
      width: auto;
      &::after {
        display: table;
        content: '';
      }
      &::before {
        display: table;
        content: '';
      }
    }
    &-nav {
      font-size: 12px;
      padding: 15px 0;
      text-align: center;
      &-icon {
        vertical-align: middle;
        margin-right: 5px;
      }
      &-rigtline {
        border-left: 1px solid $lightGray;
      }
    }
    &-nav.active {
      background: $activeBg;
      .header-top-nav-rigtline {
        border-left: none;
      }
    }
    &-search {
      padding: 7px 0;
      float: left;
      width: auto;
    }
    &-login {
      float: left;
      height: 42px;
      width: auto;
      margin-left: 15px;
    }
  }
  &-bottom {
    padding: 20px 0;
    &-logo {
      text-align: center;
      &-line {
        height: 40px;
        width: 1px;
        background: #dadadaff;
        vertical-align: middle;
        display: inline-block;
      }
      &-container {
        height: 100%;
      }
    }
  }
}
</style>

