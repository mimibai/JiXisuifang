<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-row>
        <el-col class="loginStatus-box-item">
          <span style="color:#606266;font-size:14px;">{{hospitalName}}</span>
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
      <div
        v-if="roles.includes(2)"
        class="loginStatus-box-item-name"
      >
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            class="user-dropdown"
          >
            <el-dropdown-item command="toHome"> 主页 </el-dropdown-item>
            <el-dropdown-item
              command="toPatient"
              v-if="roles.includes(4)"
            >个人中心</el-dropdown-item>
            <el-dropdown-item command="toUserInfo">账号信息</el-dropdown-item>
            <el-dropdown-item command="toChangeAccount">修改密码</el-dropdown-item>
            <!-- <el-dropdown-item
              command="toAdmin"
              v-if="roles.includes(1) || userIdentityId === 3"
            >
              管理端
            </el-dropdown-item> -->
            <el-dropdown-item command="loginOut">
              <span style="display: block">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <router-link
          v-if="roles.includes(2)"
          to="/doctor/messageCenter"
          class="loginStatus-box-item-msg"
        >
          <el-badge
            :value="0"
            class="loginStatus-box-item-name-message"
          >
            <img
              src="@/assets/common/messageAdmin.png"
              alt=""
              class="message-icon"
            />
          </el-badge>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { admin } from '@/api/user'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import store from '@/store'
export default {
  data() {
    return {
      userName: '',
      hospitalName: '',
      userIdentityId: 0,
      roles: [],
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar']),
  },
  created() {
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      this.userIdentityId = store.getters.userIdentityId
      this.userName = store.getters.name
      this.hospitalName = store.getters.hospitalName
      let userRoles = store.getters.roles
      this.roles = userRoles.map((user) => {
        return user.roleId
      })
      console.log(store.getters)
    },
    handleCommand(command) {
      if (command === 'toAdmin') {
        this.jumpToAdmin()
      } else if (command === 'loginOut') {
        this.logout()
      } else if (command === 'toHome') {
        this.$router.push({ path: '/' })
      } else if (command === 'toPatient') {
        this.$router.push({ path: '/patient/mine' })
      } else if (command === 'toUserInfo') {
        this.$router.push({ path: '/doctor/mine/account/userInfo' })
      } else if (command === 'toChangeAccount') {
        this.$router.push({ path: '/doctor/mine/account/changeAccount' })
      }
    },
    jumpToAdmin() {
      admin()
        .then((response) => {
          const { Data } = response
          const hasToken = store.getters.token
          let key = Data.slice(0, 4) + hasToken.substr(4, 7) + Data.slice(4)
          let href = '/Home/jumpManager?verificationCode=' + key
          window.open(href, '_blank')
        })
        .catch((error) => {
          console.log(error)
        })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    &:focus {
      outline: none;
    }
    .loginStatus-box-ManagersBtn {
      font-size: 14px;
      color: #606266;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.el-badge__content.is-dot {
  right: 10px;
  top: 5px;
  height: 10px;
  width: 10px;
}
.loginStatus-box {
  &-item {
    width: auto;
    &-name {
      display: flex;
      align-items: center;
      &-message {
        transform: scale(0.8);
        display: flex;
        align-items: center;
        margin: 0 40px 0 10px;
      }
    }
  }
}
</style>
