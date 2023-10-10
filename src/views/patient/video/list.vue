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
        class="health-content"
        v-loading="videoListLoading"
      >
        <div class="health-video-list">
          <h2 class="title-com">{{columnName}}</h2>
          <el-row
            type="flex"
            :gutter="30"
            style="flex-wrap: wrap"
          >
            <el-col
              v-for="(item,index) in videoList"
              :key="index"
              :span="8"
            >
              <div class="health-video-list-item">
                <router-link :to="'/patient/video/index/'+item.videoArticleId">
                  <div class="health-video-list-item-img">
                    <el-image
                      class="video-box-img"
                      style="width: 100%; height: 220px"
                      :src="item.coverImg"
                      fit="cover"
                    />
                    <img
                      class="video_btn"
                      :src="require('@/assets/common/play.png')"
                    >
                    <h4>{{ item.title }}</h4>
                  </div>
                </router-link>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="health-content-pagination">
          <el-pagination
            background
            :page-count="Pages"
            layout="prev, pager, next"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner/index'
import Article from '@/components/Article/index'
import { getVideo } from '@/api/video'
export default {
  // 注册组件
  components: {
    Banner,
    Article,
  },
  data() {
    return {
      height: '440px',
      arrow: 'never',
      Pages: 1,
      indicatorPosition: 'none',
      columnName: '健康知识库',
      videoListLoading: true,
      bannerList: [
        {
          id: 1,
          alt: '',
          title: '',
          link: '',
          imgUrl: require('@/assets/screening/banner1.jpg'),
        },
      ],

      videoList: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const videoColumnId = this.$route.query.videoColumnId
      const departmentId = this.$route.query.departmentId
      const doctorId = this.$route.query.doctorId
      const diseaseId = this.$route.query.diseaseId
      if (videoColumnId) {
        this.getVideoColumnList({ videoColumnId: videoColumnId })
      } else if (departmentId) {
        this.getDepartmentVideo({ departmentId })
      } else if (doctorId) {
        this.getDoctorVideo({ doctorId })
      } else if (diseaseId) {
        this.getDiseaseIdVideo({ diseaseId })
      } else {
        this.$router.push({
          path: '/',
        })
      }
    },
    getVideoColumnList(param) {
      this.videoListLoading = true
      getVideo(param).then((res) => {
        const { Data, Pages } = res
        const { videoArticleList } = Data
        this.Pages = Pages
        this.videoList = videoArticleList
        this.columnName = Data.videoColumnName
        this.videoListLoading = false
      })
    },
    getDepartmentVideo(param) {
      this.videoListLoading = true
      getVideo(param).then((res) => {
        const { Data, Pages } = res
        const { videoArticleList } = Data
        this.Pages = Pages
        this.videoList = videoArticleList
        this.columnName = Data.departmentName
        this.videoListLoading = false
      })
    },
    getDoctorVideo(param) {
      this.videoListLoading = true
      getVideo(param).then((res) => {
        const { Data, Pages } = res
        const { videoArticleList } = Data
        this.Pages = Pages
        this.videoList = videoArticleList
        this.columnName = Data.doctorName
        this.videoListLoading = false
      })
    },
    getDiseaseIdVideo(param) {
      this.videoListLoading = true
      getVideo(param).then((res) => {
        const { Data, Pages } = res
        const { videoArticleList } = Data
        this.Pages = Pages
        this.videoList = videoArticleList
        this.columnName = Data.diseaseName
        this.videoListLoading = false
      })
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.el-pagination {
  text-align: center;
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
  color: $bg;
  margin-bottom: 20px;
  line-height: 30px;
  text-align: center;
}

.health-video-list-item {
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .health-video-list-item-img {
    position: relative;
    height: 220px;
    img.video_btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      z-index: 11;
    }
    h4 {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      padding: 15px 20px;
      box-sizing: border-box;
      color: #fff;
      font-size: 16px;
      z-index: 11;
      &:hover {
        color: $bg;
      }
    }
    &::after {
      width: 100%;
      height: 100%;
      display: block;
      content: '';
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      top: 0;
    }
    &:hover .video-box-img img {
      transition: all 0.3s;
      transform: scale(1.05);
    }
  }
}
</style>

