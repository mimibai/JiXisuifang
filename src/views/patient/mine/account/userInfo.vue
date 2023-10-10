
<template>
  <UserInfo
    :avatar="avatar"
    @toChangeNumber="toChangeNumber"
  />
</template>
<script>
import UserInfo from '@/components/Account/userInfo'
export default {
  // 注册组件
  components: {
    UserInfo
  },
  data() {
    return {
      avatar: require('@/assets/common/defaultAva.png') // 患者端头像
    }
  },
  methods: {
    toChangeNumber() {
      this.$router.push({
        name: 'ModifyMobile'
      })
    }
  }
}
</script>
