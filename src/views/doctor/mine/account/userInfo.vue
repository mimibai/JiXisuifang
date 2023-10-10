
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
      avatar: require('@/assets/common/doctorAva.png') // 医生端头像
    }
  },
  methods: {
    toChangeNumber() {
      this.$router.push({
        name: 'ModifyMobileDoctor'
      })
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.mine-container-msg {
  width: 892px;
  margin: 50px auto;
}
</style>
