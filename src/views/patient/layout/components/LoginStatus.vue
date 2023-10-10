<template>
  <div class="loginStatus-box-outer">
    <div
      class="loginStatus-box"
      v-if="!isLogin"
    >
      <el-row
        type="flex"
        align="middle"
        class="loginStatus-box-inner"
      >
        <el-col>
          <router-link
            key="login"
            :to="loginPath"
          > 登录 </router-link>
        </el-col>
        <el-divider direction="vertical"></el-divider>
        <el-col>
          <router-link
            key="register"
            to="/register"
          > 注册 </router-link>
        </el-col>
      </el-row>
    </div>
    <div
      class="loginStatus-box"
      v-else
    >
      <el-row
        type="flex"
        align="middle"
        class="loginStatus-box-inner"
      >
        <el-row>
          <el-col class="loginStatus-box-item">
            <span style="color:#fff;">{{hospitalName}}</span>
          </el-col>
          <el-col class="loginStatus-box-item">
            <el-divider direction="vertical"></el-divider>
          </el-col>
        </el-row>
        <el-row v-if="roles.includes(1) || userIdentityId ===3 ">
          <el-col class="loginStatus-box-item">
            <span
              @click="jumpToAdmin"
              class="loginStatus-box-ManagersBtn"
            >管理端</span>
          </el-col>
          <el-col class="loginStatus-box-item">
            <el-divider direction="vertical"></el-divider>
          </el-col>
        </el-row>
        <el-col class="loginStatus-box-item">
          <span class="loginStatus-box-item-name">

            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link userName">
                {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="toHome"> 主页 </el-dropdown-item>
                <el-dropdown-item
                  command="toPatient"
                  v-if="roles.includes(4)"
                >个人中心</el-dropdown-item>
                <el-dropdown-item
                  command="toDoctor"
                  v-if="roles.includes(2)"
                >医生工作站</el-dropdown-item>
                <!-- <el-dropdown-item
                  command="toAdmin"
                  v-if="roles.includes(1) || userIdentityId ===3 "
                >
                  管理端
                </el-dropdown-item> -->
                <el-dropdown-item command="loginOut">
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <router-link
              to="/doctor/messageCenter"
              v-if="roles.includes(2)"
            >
              <el-badge
                :value="0"
                class="loginStatus-box-item-name-message"
              >
                <img
                  src="@/assets/common/message.png"
                  alt=""
                  class="message-icon"
                />
              </el-badge>
            </router-link>
          </span>
        </el-col>
        <!-- <el-col class="loginStatus-box-item"
          ><el-divider direction="vertical"></el-divider
        ></el-col> -->
        <!-- <el-col class="loginStatus-box-item">
          <span @click="loginOut" class="loginStatus-box-logOutBtn">退出</span>
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth' // 从sessionStorlage中获取token,如果有则证明已登录
import { admin } from '@/api/user'
import store from '@/store'
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      isLogin: false,
      loginPath: undefined,
      userName: '',
      hospitalName: '',
      userIdentityId: 0,
      roles: [],
    }
  },
  created() {
    this.checkLogin()
    this.loginPath = `/login?redirect=${this.$route.path}`
  },
  watch: {
    $route: {
      handler: function (route) {
        //路由变化时检测与刷新状态
        this.checkLogin(route)
      },
      immediate: true,
    },
  },
  methods: {
    checkLogin(route) {
      const hasToken = getToken('userToken')
      this.userIdentityId = store.getters.userIdentityId
      let userRoles = store.getters.roles
      this.roles = userRoles.map((user) => {
        return user.roleId
      })
      if (hasToken) {
        this.isLogin = true
        this.userName = store.getters.name
        this.hospitalName = store.getters.hospitalName
        if (route != undefined) {
          if (route.query.LoginOff) {
            this.isLogin = false
          } else {
            this.isLogin = true
          }
        } 
      } else {
          this.isLogin = false
      }
    },
    handleCommand(command) {
      if (command === 'toAdmin') {
        this.jumpToAdmin()
      } else if (command === 'loginOut') {
        this.loginOut()
      } else if (command === 'toDoctor') {
        this.$router.push({ path: '/doctor' })
      } else if (command === 'toPatient') {
        this.$router.push({ path: '/patient/mine' })
      } else if (command === 'toHome') {
        this.$router.push({ path: '/' })
      }
    },
    jumpToAdmin() {
      admin()
        .then((response) => {
          const { Data } = response
          const hasToken = getToken('userToken')
          let key = Data.slice(0, 4) + hasToken.substr(4, 7) + Data.slice(4)
          let href = '/Home/jumpManager?verificationCode=' + key
          window.open(href, '_blank')
        })
        .catch((error) => {
          console.log(error)
        })
    },

    async loginOut() {
      await MessageBox.confirm(
        '确定要退出登录？退出登录后将会返回首页',
        '确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        this.$store.dispatch('user/logout')
        this.isLogin = false
        this.$router.push('/')
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.loginStatus-box-outer {
  height: 100%;
}
.userName {
  color: #fff;
}
.loginStatus-box {
  text-align: center;
  height: 100%;
  &-inner {
    height: 100%;
  }
  &-ManagersBtn {
    cursor: pointer;
    color: #fff;
  }
  &-item {
    width: auto;
    &-name {
      display: inline-block;
      vertical-align: middle;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &-message {
        margin: 5px 10px;
        transform: scale(0.8);
      }
    }
  }
}
</style>

