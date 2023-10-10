<template>
  <div>
    <Banner
      :bannerList="bannerList"
      :height="height"
      :arrow="arrow"
      :indicator-position="indicatorPosition"
    >
    </Banner>
    <div class="container">
      <div class="screen">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col :span="15">
            <div class="screen-left">
              <img
                src="@/assets/screening/screen-left-top.png"
                alt=""
                class="screen-left-img1"
              />
              <img
                src="@/assets/screening/screen-left-bottom.png"
                alt=""
                class="screen-left-img2"
              />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="screen-right">
              <div class="screen-right-top">
                <div @click="open(2)">
                  <img
                    src="@/assets/screening/screen-right-topIcon.png"
                    alt=""
                  />
                  <span>综合版早癌筛查问卷</span>
                </div>
              </div>
              <div class="screen-right-bottom">
                <div @click="open(3)">
                  <img
                    src="@/assets/screening/screen-right-bottomIcon.png"
                    alt=""
                  />
                  <span>专科版早癌筛查问卷</span>
                </div>
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
import { getSurveyList } from '@/api/summary.js'
export default {
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
    }
  },
  components: {
    Banner,
  },
  methods: {
    open(proTypeId) {
      // 1：综合版 2：简易版 3专科版
      if (proTypeId == 2) {
        // 跳转至简易版问卷填写页
        this.getSurvey(proTypeId)
      } else if (proTypeId == 3) {
        this.$router.push({
          // 跳转至专科问卷列表页
          path: '/patient/summary',
          query: { proTypeId: proTypeId },
        })
      }
    },
    getSurvey(proTypeId) {
      let operatType = { proTypeId: proTypeId }
      getSurveyList(operatType).then((response) => {
        const { Data } = response
        if (proTypeId === 2) {
          const { followupProtocolId, name } = Data[0]
          this.$router.push({
            path: '/patient/summary/selectPatient',
            query: {
              followupProtocolId: followupProtocolId,
            },
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.screen {
  margin-top: 60px;
  margin-bottom: 60px;
  height: 550px;
  .screen-left {
    font-size: 14px;
    .screen-left-img2 {
      margin-top: 30px;
    }
  }
  .screen-right {
    font-size: 30px;
    color: #fff;
    text-align: center;
    .screen-right-top div,
    .screen-right-bottom div {
      background-image: url(../../../assets/screening/screen-right-topBg.png);
      padding-top: 60px;
      padding-bottom: 60px;
      display: block;
      transition: all 0.2s;
      overflow: hidden;
      background-size: 100%;
      cursor: pointer;
      img {
        display: block;
        margin: 0 auto;
        transition: all 0.2s;
      }
      span {
        margin-top: -24px;
        display: block;
      }
    }
    .screen-right-top div:hover,
    .screen-right-bottom div:hover {
      background-size: 110%;
      text-decoration: underline;
    }
    .screen-right-top div:hover img,
    .screen-right-bottom div:hover img {
      transform: scale(1.1);
    }
    .screen-right-bottom div {
      background-image: url(../../../assets/screening/screen-right-bottomBg.png);
      margin-top: 30px;
    }
  }
}
</style>
