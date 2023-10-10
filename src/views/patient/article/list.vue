<template>
  <div>
    <Banner
      :banner-list="bannerList"
      :height="height"
      :arrow="arrow"
      :indicator-position="indicatorPosition"
    />
    <div class="container">
      <div
        v-loading="loading"
        class="health-content"
      >
        <div class="health-article-list">
          <h2 class="title-com">{{ columnName }}</h2>
          <el-row>
            <ArticleList :article-list="articleList" />
          </el-row>
        </div>
        <div class="health-content-pagination">
          <el-pagination
            background
            :page-size="10"
            :pager-count="7"
            layout="prev, pager, next"
            :total="5"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner/index'
import ArticleList from '@/components/Article/list'
import { getArticleList } from '@/api/article'
export default {
  // 注册组件
  components: {
    Banner,
    ArticleList
  },
  data() {
    return {
      loading: true,
      height: '440px',
      arrow: 'never',
      indicatorPosition: 'none',
      bannerList: [
        {
          id: 1,
          alt: '',
          title: '',
          link: '',
          imgUrl: require('@/assets/screening/banner1.jpg')
        }
      ],
      articleList: [],
      columnId: '',
      columnName: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const columnId = this.$route.params.columnId
      if (columnId) {
        this.columnId = columnId
      } else {
        this.$router.push({
          path: '/'
        })
      }
      this.getColumnList({ columnId: this.columnId })
    },
    getColumnList(param) {
      this.loading = true
      getArticleList(param).then((res) => {
        const { Code, Data } = res
        // 当前栏目下只有一篇文章
        if (Code === 8) {
          this.goToArticle(Data.articleId)
          this.loading = false
        } else {
          this.articleList = Data
          this.columnName = Data[0].columnName
          this.loading = false
          this.$route.meta.title = this.columnName
        }
      })
    },
    goToArticle(id) {
      this.$router.push({
        name: 'Article',
        params: { id: id }
      })
    },
    handleCurrentChange(val) {
      this.getColumnList({ columnId: this.columnId, page: val })
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.health-content-pagination {
  margin-top: 30px;
  .el-pagination {
    text-align: center;
  }
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: $bg;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: $bg;
}
.health-content {
  padding: 60px 0;
}
.title-com {
  text-align: center;
  color: $bg;
  margin-bottom: 20px;
  line-height: 30px;
  .A_more {
    font-size: 16px;
    float: right;
  }
}

.health-article-list {
  margin-top: 20px;
}
.health-article-item {
  list-style: none;
  line-height: 45px;
  margin-bottom: 20px;
  overflow: hidden;
  padding: 20px;
  background: #fff;
  border: 1px solid #e2e2e2;
  .span_date {
    font-size: 16px;
    opacity: 0.8;
  }
  &:hover {
    color: $bg;
  }
  .article-content {
    font-size: 14px;
    line-height: 30px;
    color: #666;
    border-top: 1px solid #eaeaea;
    border-bottom: 1px solid #eaeaea;
    padding: 10px 0;
    margin: 10px 0;
  }
}
</style>
