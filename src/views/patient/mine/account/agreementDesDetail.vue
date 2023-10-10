<template>
  <div v-loading="loading" class="mine-container-msg">
    <ArticleIndex :article-content="articleContent" />
  </div>
</template>
<script>
import { getUserUseProtocolDetail } from '@/api/user'
import ArticleIndex from '@/components/Article/index'
export default {
  // 注册组件
  components: {
    ArticleIndex
  },
  data() {
    return {
      loading: true,
      articleContent: {
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const { id } = this.$route.query
      if (id) {
        const param = {
          id
        }
        this.getUserUseProtocolDetail(param)
      } else {
        this.$router.push({
          path: '/patient/home'
        })
      }
    },
    getUserUseProtocolDetail(param) {
      this.loading = true
      getUserUseProtocolDetail(param).then((res) => {
        const { Data } = res
        this.articleContent = Data
        this.loading = false
      })
    }
  }
}
</script>
  <style lang="scss" scoped>

  </style>

