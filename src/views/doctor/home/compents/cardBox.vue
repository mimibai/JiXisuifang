<template>
  <div>
    <h4 class="big-tit">
      {{cardData.title}}
    </h4>
    <div class="dashboard-desc">
      <el-row
        type="flex"
        :gutter="20"
        style="flex-wrap:wrap"
      >
        <el-col
          class="dashboard-des-box"
          :span="8"
          v-for="(item,index) in cardData.dataList"
        >
          <router-link :to="item.requestUrl +'?stateId='+ item.requestparameters.stateId">
            <div
              class="followVisitLabel"
              :class="'font-color'+item.requestparameters.stateId"
            >
              {{item.showNumber}}
            </div>
            <div class="followVisitContent">
              {{item.showNmae}}
            </div>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardBox',
  props: {
    cardData: Object,
  },
  data() {
    return {}
  },
}
</script>
<style lang="scss" scoped >
@import '~@/styles/variables.scss';
/*字体颜色*/
.font-color1 {
  color: $bg;
}
.font-color2 {
  color: #67c23a;
}
.font-color3 {
  color: #606266;
}
.font-color4 {
  color: #e6a23c;
}
.font-color5 {
  color: #b02727;
}
.font-color6 {
  color: #909399;
}
.big-tit {
  color: $bg;
  padding: 15px 20px;
  border-bottom: 1px solid #efefef;
}
.dashboard-desc {
  padding: 20px 15px;
  .followVisitLabel {
    text-align: center;
    padding: 10px 0;
    font-weight: 700;
    font-size: 18px;
  }
  .followVisitContent {
    text-align: center;
    padding: 10px 0;
    font-size: 16px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.45);
  }
  .dashboard-des-box {
    margin: 20px 0;
  }
}
</style>