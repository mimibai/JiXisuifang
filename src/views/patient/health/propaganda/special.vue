<template>
  <div>
    <Banner
      :banner-list="bannerList"
      :height="height"
      :arrow="arrow"
      :indicator-position="indicatorPosition"
    />
    <div class="container">
      <div class="health-content">
        <div class="health-propaganda-nav">
          <el-row
            type="flex"
            :gutter="20"
          >
            <template v-for="(item,index) in propagandaNav">
              <el-col
                :span="24/propagandaNav.length"
                class="propaganda-nav-items"
              >
                <div
                  @click="tabClick(item.name,item.number)"
                  :class="activeCol == item.name?'active':''"
                  class="nav-item"
                >
                  {{item.name}}
                </div>
              </el-col>
            </template>
          </el-row>
        </div>
        <div class="health-propaganda-videos">
          <div
            class="health-propaganda-videoContainer"
            v-loading="videoItemsLoading"
          >
            <el-row :gutter="20">
              <el-col
                :span="6"
                v-for="(item,index) in columnList"
              >
                <a @click="checkJump(item)">
                  <div class="health-video-item">
                    <el-image
                      style="width: 100%;height:260px"
                      :src="item.coverImg"
                    >
                      <div
                        slot="error"
                        class="image-slot fontColor"
                      >
                        <i class="el-icon-picture-outline imgError-img"></i>
                      </div>
                    </el-image>
                    <div class="health-video-item-titlebox">
                      <el-row
                        type="flex"
                        justify="space-between"
                      >
                        <h4>{{item.title}}</h4>
                        <div class="videoCount">
                          <i class="el-icon-video-camera videoCount-icon fontColor"></i>
                          <span class="title-count">共{{item.count}}个视频</span>
                        </div>
                      </el-row>
                    </div>
                  </div>
                </a>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Banner from '@/components/Banner/index'
import {
  getVideoColumn,
  getVideoConfiguration,
  getDepartmentVideo,
  getDoctorVideo,
  getDiseaseVideo,
} from '@/api/video'

export default {
  // 注册组件
  components: {
    Banner,
  },
  data() {
    return {
      height: '440px',
      arrow: 'never',
      indicatorPosition: 'none',
      bannerList: [
        {
          id: 1,
          alt: '',
          title: '',
          link: '',
          imgUrl: require('@/assets/screening/banner1.jpg'),
        },
      ],
      videoItemsLoading: true,
      activeCol: '专题',
      urlParam: '',
      columnList: [],
      propagandaNav: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getVideoConfiguration().then((res) => {
        const { Data } = res
        const { data } = Data
        this.propagandaNav = data
      })
      this.getVideoColumn()
    },
    getVideoColumn() {
      this.videoItemsLoading = true
      getVideoColumn().then((res) => {
        const { Data } = res
        const { list } = Data
        this.columnList = list
        this.videoItemsLoading = false
      })
    },
    getDepartmentVideo() {
      this.videoItemsLoading = true
      getDepartmentVideo().then((res) => {
        const { Data } = res
        const { list } = Data
        this.columnList = list
        this.videoItemsLoading = false
      })
    },
    getDoctorVideo() {
      this.videoItemsLoading = true
      getDoctorVideo().then((res) => {
        const { Data } = res
        const { list } = Data
        this.columnList = list
        this.videoItemsLoading = false
      })
    },
    getDiseaseVideo() {
      this.videoItemsLoading = true
      getDiseaseVideo().then((res) => {
        const { Data } = res
        const { list } = Data
        this.columnList = list
        this.videoItemsLoading = false
      })
    },
    tabClick(tabName, typeNumber) {
      this.activeCol = tabName
      //专题
      if (typeNumber === 1) {
        this.getVideoColumn()
      }
      //科室
      if (typeNumber === 2) {
        this.getDepartmentVideo()
      }
      //医生
      if (typeNumber === 3) {
        this.getDoctorVideo()
      }
      //疾病
      if (typeNumber === 4) {
        this.getDiseaseVideo()
      }
    },
    checkJump(item) {
      if (item.videoColumnId && item.videoColumnId != null) {
        this.$router.push({
          path: '/patient/video/list',
          query: {
            videoColumnId: item.videoColumnId,
          },
        })
      }
      if (item.departmentId && item.departmentId != null) {
        this.$router.push({
          path: '/patient/video/list',
          query: {
            departmentId: item.departmentId,
          },
        })
      }
      if (item.doctorId && item.doctorId != null) {
        this.$router.push({
          path: '/patient/video/list',
          query: {
            doctorId: item.doctorId,
          },
        })
      }
      if (item.diseaseId && item.diseaseId != null) {
        this.$router.push({
          path: '/patient/video/list',
          query: {
            diseaseId: item.diseaseId,
          },
        })
      }
    },
  },
}
</script>
<style lang="scss" scope>
@import '~@/styles/variables.scss';
.fontColor {
  color: $bg;
}
.health-content {
  padding: 60px 0;
}
.health-propaganda-nav {
  margin-bottom: 20px;
}
.health-title {
  color: $bg;
  margin-bottom: 20px;
  line-height: 30px;
  .A_more {
    font-size: 16px;
    float: right;
  }
}
.propaganda-nav-items {
  text-align: center;
  .nav-item {
    padding: 16px 35px;
    border: 1px solid $bg;
    font-size: 16px;
  }
  .nav-item.active {
    background: $bg;
    color: #fff;
  }
}
.health-video-item {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  &-titlebox {
    padding: 22px 12px;
    background: #ffffff;
  }
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 200px;
  height: 100%;
  font-size: 30px;
  background: #f5f7fa;
}
.videoCount-icon {
  margin-right: 10px;
}
.title-count {
  color: #999999;
}
</style>
