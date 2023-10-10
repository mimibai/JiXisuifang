<template>
  <div class="Records">
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="12">
        <div class="mine-container-patient">
          <div class="mine-container-patient-title">
            <h4>{{votePlanTitle}}</h4>
          </div>
          <div
            v-loading="loading"
            class="mine-container-patient-content"
          >
            <addplan-form :create-form="formItems" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import AddplanForm from '../caseJoinFollowVisit/components/AddplanForm.vue'
import { Message } from 'element-ui'
import { GetPlanDetail, GetTaskDetail } from '@/api/followVisits'
export default {
  components: {
    AddplanForm,
  },
  data() {
    return {
      loading: true,
      buttonLoading: false,
      showSubmit: false, //是否展示提交按钮
      formItems: [],
      votePlanTitle: '随访方案详情',
    }
  },
  created() {
    this.getPatientInfo()
  },
  methods: {
    getPatientInfo() {
      if (
        this.$route.query.followVisitPlanId != null ||
        this.$route.query.followVisitPlanId != undefined
      ) {
        let followVisitPlanId = this.$route.query.followVisitPlanId
        // 获取随访方案详细信息
        let operatType = {
          followVisitPlanId: followVisitPlanId,
        }
        GetPlanDetail(operatType).then((response) => {
          const { Data } = response
          this.votePlanTitle = '随访问卷详情'
          this.formItems = Data
          this.loading = false
        })
      } else if (
        this.$route.query.followVisitTaskId != null ||
        this.$route.query.followVisitTaskId != undefined
      ) {
        let followVisitTaskId = this.$route.query.followVisitTaskId
        // 获取随访方案详细信息
        let operatType = {
          followVisitTaskId: followVisitTaskId,
        }
        GetTaskDetail(operatType).then((response) => {
          const { Data } = response
          this.votePlanTitle = '随访任务详情'
          this.formItems = Data
          this.loading = false
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.mine-container-patient {
  padding: 40px;
  background: #ffffff;
  &-title {
    padding: 8px 16px;
    margin: 16px 0;
    h4 {
      color: $bg;
      line-height: 33px;
      font-size: 15px;
      text-align: center;
    }
  }
  &-tips {
    font-size: 12px;
    text-align: center;
    color: #d9001b;
    margin-bottom: 25px;
  }
}
</style>
