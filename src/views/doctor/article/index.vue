<template>
  <div class="container">
    <div
      v-loading="loading"
      class="article-content"
    >
      <ArticleIndex :article-content="articleContent" />
      <div class="article_togg">
        <p
          v-if="Number(articleContent.previousId) > 0"
          class="togg_p"
        >
          上一篇：<router-link
            :to="'/doctor/article/index/' + articleContent.previousId"
            class="togg_a"
          >{{ articleContent.previousName }}</router-link>
        </p>
        <p
          v-if="Number(articleContent.nextId) > 0"
          class="togg_p"
        >
          下一篇：<router-link
            class="togg_a"
            :to="'/doctor/article/index/' + articleContent.nextId"
          >{{ articleContent.nextName }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleIndex from '@/components/Article/index'
import { getArticleList } from '@/api/article'
export default {
  // 注册组件
  components: {
    ArticleIndex,
  },
  data() {
    return {
      loading: true,
      id: 0, // 文章id
      articleContent: [],
      title: '',
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const id = this.$route.params.id
      if (id) {
        this.id = id
        console.log(id);
      } else {
        this.$router.push({
          path: '/doctor/index',
        })
      }
      getArticleList({ id: id }).then((res) => {
        const { Data } = res
        this.articleContent = Data
        this.loading = false
        this.title = Data.title
        this.$route.meta.title = this.title
      })
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.article_con {
  p {
    line-height: 2em;
    margin-bottom: 10px;
  }
}
.content-title {
  text-align: center;
  color: $bg;
}
.source_p {
  text-align: center;
  color: #999999;
  padding: 15px 0;
  border-bottom: 1px solid #ededed;
  overflow: hidden;
  margin-bottom: 20px;

  span {
    margin: 0 10px;
  }
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.container {
  padding-top: 50px;
  padding-bottom: 50px;
}
.article-content {
  padding: 40px;
  background: #ffffff;

  .article_togg {
    margin-top: 30px;
    .togg_p {
      font-size: 15px;
      color: #333;
      line-height: 28px;
      a {
        color: #b2642a;
      }
    }
  }
}
</style>
