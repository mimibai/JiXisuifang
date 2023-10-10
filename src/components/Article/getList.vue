<template>
  <div>
    <div v-loading="loading" class="article-list">
      <div
        v-for="item in articleList"
        :key="item.articleId"
        class="article-list-item"
      >
        <a class="article-list-link" @click="goToArticle(item.articleId)">
          <el-row type="flex" justify="space-between">
            <el-col :span="18">
              <p class="article-list-item-title">
                {{ item.title }}
              </p>
            </el-col>
            <el-col :span="5">
              <div class="article-list-item-date">
                <span>{{ item.formatDate }}</span>
              </div>
            </el-col>
          </el-row>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleList } from '@/api/article'
export default {
  name: 'Article',
  props: ['columnId', 'count'],
  data() {
    return {
      loading: true,
      articleList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const param = { columnId: this.columnId }
      getArticleList(param).then((res) => {
        this.articleList = res.Data.slice(0, this.count)
        this.loading = false
        console.log('res', res.Data)
      })
    },
    goToArticle(id) {
      this.$router.push({
        name: 'Article',
        params: { id: id }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.article-list {
  &-item {
    padding: 10px 0;
    &-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-date {
      text-align: right;
      color: #999999;
    }
  }
  &-link {
    &:hover {
      color: $bg;
    }
  }
}
</style>
