<template>
  <div class="home">
    <div class="home-banner">
      <Banner
        :banner-list="bannerList"
        :height="height"
        :arrow="arrow"
        :indicator-position="indicatorPosition"
      />
    </div>
    <div class="container">
      <div class="home-content">
        <el-row
          type="flex"
          justify="space-between"
          :gutter="60"
        >
          <el-col :span="15">
            <div class="home-content-left-videoBox">
              <div class="videoBox">
                <GetVideoArticle
                  :video-column-id="1"
                  :count="1"
                  :video-style="videoStyle"
                />
              </div>
            </div>
            <div class="home-content-left">
              <div class="home-content-left-articleBox">
                <div class="column-title">
                  <el-row type="flex">
                    <el-col :span="18">
                      <span>健康宣教</span>
                    </el-col>
                    <el-col
                      :span="6"
                      class="column-title-more"
                    >
                      <router-link to="/patient/health/propaganda/special">更多<i class="el-icon-arrow-right" /></router-link>
                    </el-col>
                  </el-row>
                </div>
                <div class="column-article-box">
                  <GetVideoList
                    :count="2"
                    :is-show-image="true"
                  />
                </div>
                <div class="column-article-list-divider">
                  <el-divider />
                </div>
                <div class="column-article-list">
                  <GetVideoList
                    :count="3"
                    :is-show-image="false"
                  />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="home-content-right">
              <div
                v-for="item in productList"
                :key="item.index"
                class="home-content-right-item"
              >
                <router-link
                  key="screening"
                  :to="item.link"
                >
                  <img
                    :src="item.bgUrl"
                    class="home-content-right-item-bg"
                  >
                  <div class="home-content-right-item-content">
                    <el-row type="flex">
                      <el-col :span="3">
                        <el-row
                          type="flex"
                          align="middle"
                          style="height: 100%"
                        >
                          <el-col>
                            <img :src="item.iconUrl">
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col
                        :span="19"
                        :offset="2"
                      >
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.titleEn }}</p>
                      </el-col>
                    </el-row>
                  </div>
                </router-link>
              </div>
            </div>
            <div
              class="home-content-left-article"
              style="margin-bottom:20px;"
            >
              <div class="column-title">
                <el-row type="flex">
                  <el-col :span="18">
                    <span>新闻资讯</span>
                  </el-col>
                  <el-col
                    :span="6"
                    class="column-title-more"
                  >
                    <a @click="goToColumn(6)"> 更多<i class="el-icon-arrow-right" /></a>
                  </el-col>
                </el-row>
              </div>
              <div class="column-article-list">
                <GetArticleList
                  :column-id="6"
                  :count="4"
                />
              </div>
            </div>
            <div class="home-content-left-article">
              <div class="column-title">
                <el-row type="flex">
                  <el-col :span="18">
                    <span>科普文章</span>
                  </el-col>
                  <el-col
                    :span="6"
                    class="column-title-more"
                  >
                    <a @click="goToColumn(1)"> 更多<i class="el-icon-arrow-right" /></a>
                  </el-col>
                </el-row>
              </div>
              <div class="column-article-list">
                <GetArticleList
                  :column-id="1"
                  :count="3"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import Banner from '@/components/Banner/index'
import GetArticleList from '@/components/Article/getList'
import GetVideoArticle from '@/components/Video/getVideo.vue'
import GetVideoList from '@/components/Video/getList.vue'
export default {
  components: {
    Banner,
    GetArticleList,
    GetVideoArticle,
    GetVideoList
  },
  data() {
    return {
      height: '100%',
      arrow: 'hover',
      indicatorPosition: 'none',
      bannerList: [
        {
          id: 1,
          imgUrl: require('@/assets/patientHome/banner1.jpg'),
          link: 'javascript:void(0)',
          title: '',
          alt: ''
        },
        {
          id: 2,
          imgUrl: require('@/assets/patientHome/banner1.jpg'),
          link: 'javascript:void(0)',
          title: '',
          alt: ''
        },
        {
          id: 3,
          imgUrl: require('@/assets/patientHome/banner1.jpg'),
          link: 'javascript:void(0)',
          title: '',
          alt: ''
        }
      ],
      productList: [
        {
          link: '/patient/screening',
          bgUrl: require('@/assets/patientHome/screening-bg.png'),
          iconUrl: require('@/assets/patientHome/screening.png'),
          title: '早癌筛查中心',
          titleEn: 'Early cancer screening center'
        },
        {
          link: '/patient/mine/records',
          bgUrl: require('@/assets/patientHome/check-bg.png'),
          iconUrl: require('@/assets/patientHome/check.png'),
          title: '健康档案',
          titleEn: 'Health Record'
        }
      ],
      articleList: [],
      homeColumns: [
        {
          columnName: '早癌筛查中心'
        }
      ],
      videoStyle: 'width:100%;height:424px;'
    }
  },
  methods: {
    goToColumn(columnId) {
      this.$router.push({
        name: 'ArticleList',
        params: { columnId: columnId }
      })
    }
  }
}
</script>
<style lang="scss">
.home-banner {
  height: 800px;
  .el-carousel {
    height: 100%;
  }
  .el-carousel__arrow {
    height: 50px;
    width: 50px;
    font-size: 34px;
  }
  .el-carousel__button {
    width: 50px;
    height: 4px;
  }
  img {
    max-width: 100%;
  }
}
.article-list-item-title {
  font-size: 14px;
}
.article-list-item {
  padding: 5px 0;
}
.article-list-item-date {
  font-size: 14px;
}
</style>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.home-content {
  padding: 60px 0;
  &-left {
    &-videoBox {
      margin-bottom: 25px;
      .videoBox {
        width: 100%;
        min-height: 423px;
        background: #f5f7fa;
      }
    }
  }
  &-right {
    margin-bottom: 25px;
  }
  &-right-item {
    position: relative;
    overflow: hidden;
    margin-bottom: 50px;
    &-bg {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      transition: all 0.2s;
    }
    &-content {
      padding: 68px 50px;
      color: $fontColor;
      h3 {
        margin-bottom: 5px;
        font-size: 24px;
      }
      p {
        font-size: 16px;
      }
    }
    &:hover {
      .home-content-right-item-bg {
        transform: scale(1.1);
      }
    }
    &:last-child {
      margin-bottom: 0px;
    }
  }
  .column-title {
    font-size: 18px;
    font-weight: bold;
    color: $bg;
    margin-bottom: 20px;
    &-more {
      text-align: right;
      font-size: 16px;
      font-weight: normal;
    }
  }
  .column-article-box {
    .article-box-content {
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
  }
  .column-article-list-divider {
    .el-divider {
      margin: 10px 0;
    }
  }
}
</style>

