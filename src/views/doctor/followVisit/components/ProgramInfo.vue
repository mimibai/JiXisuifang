<template>
  <div>
    <el-descriptions :column="2">
      <!-- <el-descriptions-item label="方案名称">{{
        programInfo.Name
      }}</el-descriptions-item> -->
      <el-descriptions-item label="参与时间">{{
        programInfo.startDate
      }}</el-descriptions-item>
      <el-descriptions-item label="随访时长">{{
        programInfo.runTime
      }}</el-descriptions-item>
      <el-descriptions-item label="随访状态">
        <el-tag size="mini" :type="programInfoStateType">
          {{ programInfo.stateId }}
        </el-tag>
      </el-descriptions-item>
      <!-- <el-descriptions-item label="指导医生"
        ><span class="font-color-orange">{{
          programInfo.mobileNumber
        }}</span></el-descriptions-item
      > -->
      <el-descriptions-item
        label="回访医生"
      ><span class="font-color-orange">{{
        programInfo.visitDoctor
      }}</span></el-descriptions-item>
      <el-descriptions-item
        label="超期任务数量"
      ><span>{{ programInfo.curOverdueCount }}</span>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="programInfo.followVisitLabelNames && programInfo.followVisitLabelNames.length > 0"
        label="随访标签"
      >
        <el-tag v-for="(item,index) in programInfo.followVisitLabelNames" :key="index" style="margin-right:3px" size="mini">{{ item }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="programInfo.followVisitIndicativeLabelNames && programInfo.followVisitIndicativeLabelNames.length > 0"
        label="阳性指征"
      >
        <el-tag v-for="(item,index) in programInfo.followVisitIndicativeLabelNames" :key="index" size="mini" style="margin-right:3px">{{ item }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="1">
      <el-descriptions-item
        label="参与方案名称"
      ><span>{{ programInfo.followVisitPlanName }}</span>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
export default {
  props: {
    programData: Object
  },
  data() {
    return {
      programInfo: this.programData,
      programInfoStateType: 'success'
    }
  },
  watch: {
    programData() {
      const followVisitIndicativeLabelNames = this.programData.followVisitIndicativeLabelNames
      const followVisitLabelNames = this.programData.followVisitLabelNames
      let followVisitIndicativeLabelNamesArr = []
      let followVisitLabelNamesArr = []
      if (followVisitLabelNames.length > 0) {
        followVisitLabelNamesArr = followVisitLabelNames.split('、')
      }
      if (followVisitIndicativeLabelNames.length > 0) {
        followVisitIndicativeLabelNamesArr = followVisitIndicativeLabelNames.split('、')
      }

      console.log('asdasd', followVisitLabelNamesArr.length)
      this.programInfo = this.programData
      this.programInfo.followVisitIndicativeLabelNames = followVisitIndicativeLabelNamesArr
      this.programInfo.followVisitLabelNames = followVisitLabelNamesArr
      if (this.programInfo.stateId === '人工终止') {
        this.programInfoStateType = 'info'
      } else {
        this.programInfoStateType = 'success'
      }
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scope>
.font-color-orange {
  color: #b2642a;
}
</style>
