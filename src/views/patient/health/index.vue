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
        <div class="health-video-list">
          <h2 class="health-title">健康知识库
            <router-link
              to="/patient/video/list"
              class="A_more"
            >
              更多>>
            </router-link>
          </h2>
          <el-row
            type="flex"
            :gutter="30"
            style="flex-wrap: wrap"
          >
            <el-col
              v-for="item in videoList"
              :key="item.id"
              :span="8"
            >
              <div class="health-video-list-item">
                <router-link :to="'/patient/video/index/'+item.id">
                  <div class="health-video-list-item-img">
                    <el-image
                      class="video-box-img"
                      style="width: 100%; height: 220px"
                      :src="item.videoImgUrl"
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

        <div class="health-article-list">
          <el-row
            type="flex"
            justify="space-between"
          >
            <el-col :span="11">
              <h2 class="health-title">科普文章
                <router-link
                  to="/patient/article/list/1"
                  class="A_more"
                >
                  更多>>
                </router-link>
              </h2>
              <div>
                <GetArticleList
                  :columnId="1"
                  :count="5"
                ></GetArticleList>
              </div>
            </el-col>
            <el-col :span="11">
              <h2 class="health-title">
                新闻资讯
                <router-link
                  to="/patient/article/list/6"
                  class="A_more"
                >
                  更多>>
                </router-link>
              </h2>
              <div>
                <GetArticleList
                  :columnId="6"
                  :count="5"
                ></GetArticleList>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="health-content-pagination">
          <el-pagination
            background
            :page-size="6"
            :pager-count="5"
            layout="prev, pager, next"
            :total="100"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner/index'
import Article from '@/components/Article/index'
import GetArticleList from '@/components/Article/getList'
export default {
  // 注册组件
  components: {
    Banner,
    Article,
    GetArticleList,
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
      videoList: [
        {
          id: 1,
          title: '呼吸热病',
          videoImgUrl: require('@/assets/screening/banner1.jpg'),
          videoDesc:
            '肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关',
        },
        {
          id: 2,
          title: '呼吸热病',
          videoImgUrl: require('@/assets/screening/banner1.jpg'),
          videoDesc:
            '肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关',
        },
        {
          id: 3,
          title: '呼吸热病',
          videoImgUrl: require('@/assets/screening/banner1.jpg'),
          videoDesc:
            '肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关',
        },
        {
          id: 4,
          title: '呼吸热病',
          videoImgUrl: require('@/assets/screening/banner1.jpg'),
          videoDesc:
            '肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关',
        },
        {
          id: 5,
          title: '呼吸热病',
          videoImgUrl: require('@/assets/screening/banner1.jpg'),
          videoDesc:
            '肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关',
        },
        {
          id: 6,
          title: '呼吸热病',
          videoImgUrl: require('@/assets/screening/banner1.jpg'),
          videoDesc:
            '肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关肺癌相关资讯肺癌相关资讯肺癌相关资讯肺癌sdd资讯肺癌相关',
        },
      ],
    }
  },
  methods: {},
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: $bg;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: $bg;
}
.health-content {
  padding: 60px 0;
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

  &-title {
    padding: 15px 0px;
    margin: 0 10px;
    border-bottom: 1px solid #eeeeee;
    &-date {
      text-align: right;
      color: #999;
      font-size: 13px;
    }
  }
  &-desc {
    padding: 15px 10px;
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      line-height: 1.5;
      font-size: 15px;
    }
  }
  &:hover {
    a {
      color: $bg;
    }
  }
}
.health-article-list {
  margin-top: 20px;
}
.ul_list {
  li {
    list-style: none;
    line-height: 45px;
    .span_date {
      font-size: 16px;
      opacity: 0.8;
      text-align: center;
    }
    &:hover {
      color: $bg;
    }
  }
}
</style>
