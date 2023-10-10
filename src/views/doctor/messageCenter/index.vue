<template>
  <div class="message-container">
    <h2 class="message-container-title">通知公告</h2>
    <div v-loading="loading">
      <template v-if="articleList.length>0">
        <div class="message-container-list">
          <el-row
            type="flex"
            class="list-title"
          >
            <el-col :span="20">
              标题
            </el-col>
            <el-col
              :span="4"
              align='right'
            >
              发布时间
            </el-col>
          </el-row>
          <!-- <div
            v-for="(item,index) in articleList"
            :key="index"
            class="list-item"
          >
            <router-link
              :to="'/example/edit/'+item.articleId"
              class="link-type"
            >
              <el-row type="flex">
                <el-col :span="16">
                  {{item.title}}
                </el-col>
                <el-col :span="4">

                </el-col>
                <el-col :span="4">
                  {{item.formatDate}}
                </el-col>
              </el-row>
            </router-link>
          </div> -->
          <GetArticleList
            :columnId="3"
            :count="5"
          ></GetArticleList>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-count="pages"
          class="pagination-container"
          align="center"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </template>
      <template v-else>
        <div>
          <el-empty description="暂无内容！"></el-empty>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getInInsideMail, getArticleList } from '@/api/article'
import GetArticleList from '@/views/doctor/layout/components/Article/getList'
export default {
  name: 'MessageCenter',
  // 注册组件
  components: {
    GetArticleList,
  },
  data() {
    return {
      loading: true,
      articleList: [],
      columnId: 3,
      pages: 1,
    }
  },
  created() {
    this.getMessages({ columnId: this.columnId })
  },
  methods: {
    getMessages(param) {
      this.loading = true
      getArticleList(param)
        .then((res) => {
          const { Data, Pages } = res
          this.articleList = Data
          this.pages = Pages
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.getMessages({
        columnId: this.columnId,
        page: val,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.message-container {
  padding: 30px;
  &-title {
    color: $bg;
    text-align: center;
    line-height: 42px;
    font-size: 20px;
    margin-bottom: 20px;
  }
  &-list {
    padding: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .list-title {
      color: $bg;
      margin-bottom: 20px;
    }
    .list-item {
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }
  }
}
.link-type:hover {
  color: $bg;
}
.pagination-container {
  padding: 30px 0;
}
</style>
