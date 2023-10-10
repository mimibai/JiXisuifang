<template>
  <div class="caseJoinList-container">
    <el-row
      type="flex"
      justify="center"
    >
      <el-col
        :xs="24"
        :sm="24"
        :md="18"
        :lg="12"
      >
        <div>
          <el-result
            icon="success"
            title="提交成功"
            :subTitle="second+'秒后自动返回评测首页'"
          >
            <template slot="extra">
              <el-button
                type="primary"
                size="medium"
              >返回首页</el-button>
            </template>
          </el-result>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      second: 3,
    }
  },
  created() {
    this.downTime()
  },
  methods: {
    //倒计时
    downTime() {
      this.timer = setInterval(() => {
        this.second--
        if (this.second === 0) {
          clearInterval(this.timer)
          this.$router.push({
            path: '/padApplication',
          })
        }
      }, 1000)
    },
  },
}
</script>
