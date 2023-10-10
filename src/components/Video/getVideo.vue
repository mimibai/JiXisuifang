<template>
  <div>
    <div class="video-container">
      <div
        v-loading="videoLoading"
        class="video-content"
      >
        <div v-for="(item,index) in videoList" :key="index">
          <router-link :to="'/patient/video/index/'+ item.videoArticleId">
            <div
              :key="index"
              class="video-outer"
              :style="videoStyle"
            >
              <el-image :src="item.imageUrl">
                <div
                  slot="error"
                  class="image-slot video-err-img"
                >
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <div class="video-btn">
                <i class="el-icon-video-play video-btn-icon" />
              </div>
            </div>
            <div>
              <div class="video_tit">
                <h2
                  v-if="isShowPlayNum"
                  class="tit_h2"
                >{{ videoTit }}<span>播放次数：{{ playNum }}</span></h2>
                <p
                  v-if="isShowReleaseDate"
                  class="date_p"
                >发布时间：{{ releaseDate }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Video from 'video.js'
import { getVideoArticle } from '@/api/video'
export default {
  name: 'GetVideo',
  props: {
    videoColumnId: {
      type: Number,
      default: 1
    },
    count: {
      type: Number,
      default: 1
    },
    videoStyle: {
      type: String,
      default: ''
    },
    isShowPlayNum: {
      type: Boolean,
      default: false
    },
    isShowReleaseDate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      videoLoading: true,
      releaseDate: '2021-07-14',
      videoList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const videoParams = {
        videoColumnId: this.videoColumnId
      }
      this.getVideoArticle(videoParams)
    },
    getVideoArticle(params) {
      getVideoArticle(params).then((res) => {
        const { Data } = res
        this.videoList = Data
        this.videoLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.video-outer {
  text-align: center;
  position: relative;
  .el-image {
    width: 100%;
    height: 100%;
  }
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
  }
  .video-btn {
    position: absolute;
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    .video-btn-icon {
      font-size: 60px;
      color: #ffffff;
    }
    &:hover {
      .video-btn-icon {
        font-size: 65px;
        color: $bg;
      }
    }
  }
}
</style>
