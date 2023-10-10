<template>
  <div>
    <template v-for="(item, index) in btnList">
      <el-link
        :type="linkType"
        :key="index"
        @click="handleClik(item.clickTypeId)"
        :underline="false"
        class="title-links"
      >{{ item.title }}</el-link>
    </template>
  </div>
</template>
<script>
import { Message, MessageBox } from 'element-ui'
export default {
  data() {
    return {
      linkType: 'info', //链接类型
      btnList: this.buttonList,
      patientIdN: this.patientId,
      pePackageIdN: this.pePackageId,
      caseFollowVisitTaskDetailIdN: this.caseFollowVisitTaskDetailId,
      caseJoinFollowVisitIdN: this.caseJoinFollowVisitId,
    }
  },
  props: {
    buttonList: Array,
    patientId: Number,
    pePackageId: Number,
    caseFollowVisitTaskDetailId: Number,
    caseJoinFollowVisitId: Number,
  },
  watch: {
    buttonList() {
      this.btnList = this.buttonList
      // console.log(this.buttonList)
    },
    patientId() {
      this.patientIdN = this.patientId
    },
    pePackageId() {
      this.pePackageIdN = this.pePackageId
    },
    caseFollowVisitTaskDetailId() {
      this.caseFollowVisitTaskDetailIdN = this.caseFollowVisitTaskDetailId
    },
    caseJoinFollowVisitId() {
      this.caseJoinFollowVisitIdN = this.caseJoinFollowVisitId
    },
  },
  created() {},
  methods: {
    handleClik(clickTypeId) {
      console.log(clickTypeId)
      //随访记录
      if (clickTypeId == 70) {
        this.$router.push({
          path: '/doctor/followVisit/caseJoinFollowVisit',
          query: { patientId: this.patientIdN },
        })
      }
      //方案任务详情
      if (clickTypeId == 50) {
        this.$router.push({
          path: '/doctor/followVisit/caseJoinFollowVisit',
          query: {
            patientId: this.patientIdN,
            caseJoinFollowVisitId: this.caseJoinFollowVisitIdN,
          },
        })
      }
      //终止随访
      if (clickTypeId == 51) {
        this.$emit('endCaseFollowVisitTask', this.caseJoinFollowVisitIdN)
      }
      //作废
      if (clickTypeId == 60) {
        this.$emit(
          'canceledCaseFollowVisitTask',
          this.caseFollowVisitTaskDetailIdN
        )
      }
      //退回
      if (clickTypeId == 61) {
        this.$emit('returnTask', this.caseFollowVisitTaskDetailIdN)
      }
      //重发任务提醒
      if (clickTypeId == 62) {
        this.$emit(
          'repeatCaseTaskDetailRemind',
          this.caseFollowVisitTaskDetailIdN
        )
      }
      //住院信息
      if (clickTypeId == 64) {
        this.$router.push({
          path: '/doctor/caseManagement/recordList',
          query: { patientId: this.patientIdN },
        })
      }
      //癌筛记录
      if (clickTypeId == 65) {
        this.$router.push({
          path: '/doctor/screeningManagement/cancerRecord',
          query: { patientId: this.patientIdN },
        })
      }
      //体检记录
      if (clickTypeId == 66) {
        console.log(this.pePackageIdN)
        if (this.pePackageIdN != null) {
          this.$router.push({
            path: '/doctor/screeningManagement/peOrders',
            query: { pePackageId: this.pePackageIdN },
          })
        } else {
          Message({
            message: '当前患者暂无体检信息！',
            type: 'error',
            duration: 5 * 1000,
          })
        }
      }
      //体检预约
      if (clickTypeId == 67) {
        this.$emit('createPEReserveByDoctor', this.caseFollowVisitTaskDetailIdN)
      }
      //预约改期
      if (clickTypeId == 68) {
        this.$emit('changeDatePe', this.caseFollowVisitTaskDetailIdN)
      }
      //取消预约
      if (clickTypeId == 69) {
        this.$emit('cancelPEReserve', this.caseFollowVisitTaskDetailIdN)
      }
    },
  },
}
</script>
<style lang="scss" scope>
@import '~@/styles/variables.scss';
.font-color-orange {
  color: $bg;
}
.title-links {
  padding: 0 20px;
  border-right: 1px solid #909399;
  text-decoration: none;
  &:last-of-type {
    border-right: none;
  }
  &:hover {
    color: $bg !important;
  }
}
</style>