<template>
  <div>
    <div
      v-loading="loading"
      class="article-list"
    >
      <template v-if="!isShowImage">
        <div
          v-for="item in videoList"
          :key="item.videoArticleId"
          class="article-list-item"
        >
          <a
            class="article-list-link"
            @click="goToVideoArticle(item.videoArticleId)"
          >
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col :span="18">
                <p class="article-list-item-title">
                  {{ item.title }}
                </p>
              </el-col>
              <el-col :span="5">
                <div class="article-list-item-date">
                  <span>{{ item.time }}</span>
                </div>
              </el-col>
            </el-row>
          </a>
        </div>
      </template>
      <template v-else>
        <div
          v-for="item in videoList"
          :key="item.videoArticleId"
        >
          <el-row type="flex">
            <el-col :span="8">
              <a @click="goToVideoArticle(item.videoArticleId)">
                <el-image
                  class="video-box-img"
                  style="width: 230px; height: 140px"
                  :src="item.coverImg"
                  fit="cover"
                ></el-image>
              </a>
            </el-col>
            <el-col :span="16">
              <div class="video-box-content">
                <h3 class="video-box-content-title">
                  <a @click="goToVideoArticle(item.videoArticleId)">
                    {{item.title}}
                  </a>
                </h3>
                <div class="video-box-content-desc">
                  <div class="video-box-content-desc-left">
                    <span class="svg-container">
                      <svg-icon icon-class="time" />
                    </span>
                    <span>{{item.time}}</span>
                  </div>
                  <div class="video-box-content-desc-right">
                    <span>播放量：{{item.readnum}}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getVideo } from '@/api/video'
export default {
  name: 'Article',
  props: {
    videoColumnId: {
      type: Number,
      default: null,
    },
    isShowImage: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      loading: true,
      videoList: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const param = { columnId: this.columnId }
      getVideo(param).then((res) => {
        const { Data } = res
        const { videoArticleList } = Data
        this.videoList = videoArticleList.slice(0, this.count)
        this.loading = false
      })
    },
    goToVideoArticle(id) {
      this.$router.push({
        name: 'VideoIndex',
        params: { videoId: id },
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
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
.video-box-content {
  padding: 20px 0 30px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &-title {
    font-size: 16px;
    margin-bottom: 25px;
    line-height: 1.5;
    &:hover {
      color: $bg;
    }
  }
  &-desc {
    display: flex;
    justify-content: space-between;
    color: #999999;
    font-size: 14px;
    .svg-container {
      margin-right: 10px;
    }
  }
}
</style>
