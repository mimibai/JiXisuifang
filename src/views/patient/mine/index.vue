
<template>
  <div class="mine">
    <div class="container">
      <el-row class="mine-container" :gutter="30">
        <el-col :span="6">
          <Sidebar />
        </el-col>
        <el-col :span="18">
          <router-view :key="key" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Sidebar from '@/views/patient/layout/components/Sidebar'
export default {
  components: {
    Sidebar
  },
  data() {
    return {
      mineList: []
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    key() {
      return this.$route.path
    }
  },
  created() {
    this.mineList = this.$router.options.routes
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.mine {
  padding-top: 50px;
  padding-bottom: 80px;
  height: 100%;
  .mine-container-msg {
    padding: 50px;
    background: #ffffff;
  }
}
</style>
