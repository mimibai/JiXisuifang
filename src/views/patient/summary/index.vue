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
        class="summary"
      >
        <el-row
          type="flex"
          justify="space-between"
          :gutter="15"
        >
          <el-col
            v-for="item in summaryList.slice(0, 4)"
            :key="item.cancerTypeId"
            :span="6"
          >
            <div
              :class="'summaryItem summaryItem' + item.cancerTypeId"
              @click="
                open(
                  item.followupProtocolId,
                  item.msg,
                  item.proTypeId,
                  item.cancerTypeId
                )
              "
            >
              <img :src="getImgUrl(item.cancerTypeId)">
              <span>{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          justify="space-between"
          :gutter="15"
        >
          <el-col :span="12">
            <img
              src="@/assets/summary/summary-leftBg.png"
              alt=""
            >
          </el-col>
          <el-col
            v-for="item in summaryList.slice(4, 6)"
            :key="item.cancerTypeId"
            :span="12"
          >
            <div
              :class="'summaryItem summaryItem' + item.cancerTypeId"
              @click="
                open(
                  item.followupProtocolId,
                  item.msg,
                  item.proTypeId,
                  item.cancerTypeId
                )
              "
            >
              <img :src="getImgUrl(item.cancerTypeId)">
              <span>{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          justify="space-between"
          :gutter="15"
        >
          <el-col :span="12">
            <el-row :gutter="15">
              <el-col
                v-for="item in summaryList.slice(6, 8)"
                :key="item.cancerTypeId"
                :span="12"
              >
                <div
                  :class="'summaryItem summaryItem' + item.cancerTypeId"
                  @click="
                    open(
                      item.followupProtocolId,
                      item.msg,
                      item.proTypeId,
                      item.cancerTypeId
                    )
                  "
                >
                  <img :src="getImgUrl(item.cancerTypeId)">
                  <span>{{ item.name }}</span>
                </div>
              </el-col>
              <!-- <el-col
                :span="12"
                v-for="item in summaryList.slice(8, 10)"
                :key="item.cancerTypeId"
              >
                <div
                  :class="'summaryItem summaryItem' + item.cancerTypeId"
                  @click="
                    open(
                      item.followupProtocolId,
                      item.msg,
                      item.proTypeId,
                      item.cancerTypeId
                    )
                  "
                >
                  <img :src="getImgUrl(item.cancerTypeId)" />
                  <span>{{ item.name }}</span>
                </div>
              </el-col> -->
            </el-row>
          </el-col>
          <el-col :span="12">
            <img
              src="@/assets/summary/summary-rightBg2.jpg"
              alt=""
            >
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
  components: {
    Banner
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
      summaryList: [],
      proTypeId: 3
    }
  },
  created() {
    this.getData()
  },
  methods: {
    open(followupProtocolId, Msg) {
      // console.log(followupProtocolId,Msg,proTypeId,cancerTypeId);
      // followupProtocolId为0时表示没有找到该问卷类型
      if (followupProtocolId === 0) {
        this.$alert(Msg, {
          confirmButtonText: '确定'
        })
      } else {
        this.$router.push({
          path: '/patient/summary/selectPatient',
          query: {
            followupProtocolId: followupProtocolId
          }
        })
      }
    },
    getImgUrl(icon) {
      return require('@/assets/summary/summary-icon' + icon + '.png')
    },
    getData: function() {
      const proTypeId = this.$route.query.proTypeId
      if (proTypeId) {
        this.proTypeId = Number(this.$route.query.proTypeId)
        this.getSurvey(this.proTypeId)
      } else {
        this.$router.push({ path: '/patient/summary' })
        this.getSurvey(this.proTypeId)
      }
    },
    getSurvey(proTypeId) {
      const operatType = { proTypeId: proTypeId }
      getSurveyList(operatType)
        .then((response) => {
          const { Data } = response
          if (proTypeId === 2) {
            const { followupProtocolId } = Data[0]
            this.$router.push({
              path: '/patient/summary/selectPatient',
              query: {
                followupProtocolId: followupProtocolId
              }
            })
          } else if (proTypeId === 3) {
            this.summaryList = Data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.summary {
  padding: 60px 0;
  .summaryItem {
    width: 100%;
    font-size: 24px;
    color: #fff;
    text-align: center;
    margin-bottom: 15px;
    box-sizing: border-box;
    overflow: hidden;
    height: 200px;
    cursor: pointer;
    img {
      height: 52px;
      width: 52px;
      display: block;
      margin: 50px auto 30px;
      transition: all 0.2s;
    }
  }
  .summaryItem1 {
    background: #6498cb;
  }
  .summaryItem2 {
    background: #9493c8;
  }
  .summaryItem3 {
    background: #c89393;
  }
  .summaryItem4 {
    background: #6494cb;
  }
  .summaryItem5 {
    background: #7bb4b9;
  }
  .summaryItem6 {
    background: #9493c8;
  }
  .summaryItem7 {
    background: #bbaa8e;
  }
  .summaryItem8 {
    background: #5da0c3;
  }
  .summaryItem9 {
    background: #7bb4b9;
  }
  .summaryItem10 {
    background: #c89393;
  }
  .summaryItem:hover img {
    transform: scale(1.1);
  }
}
</style>

