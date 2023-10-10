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
import {
  GetVoteDetails,
  GetVoteItemDetails,
  GetVoteDetailDetails,
} from '@/api/followVisits'
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
      votePlanTitle: '随访问卷详情',
    }
  },
  created() {
    this.getPatientInfo()
  },
  methods: {
    getPatientInfo() {
      if (
        this.$route.query.voteId != null ||
        this.$route.query.voteId != undefined
      ) {
        let voteId = this.$route.query.voteId
        // 获取随访方案详细信息
        let operatType = {
          voteId: voteId,
        }
        GetVoteDetails(operatType).then((response) => {
          const { Data } = response
          this.formItems = Data
          this.loading = false
          this.votePlanTitle = '随访问卷详情'
        })
      } else if (
        this.$route.query.voteItemId != null ||
        this.$route.query.voteItemId != undefined
      ) {
        let voteItemId = this.$route.query.voteItemId
        // 获取随访方案详细信息
        let operatType = {
          voteItemId: voteItemId,
        }
        GetVoteItemDetails(operatType).then((response) => {
          const { Data } = response
          this.formItems = Data
          this.loading = false
          this.votePlanTitle = '随访问卷题目详情'
        })
      } else if (
        this.$route.query.voteDetailId != null ||
        this.$route.query.voteDetailId != undefined
      ) {
        let voteDetailId = this.$route.query.voteDetailId
        // 获取随访方案详细信息
        let operatType = {
          voteDetailId: voteDetailId,
        }
        GetVoteDetailDetails(operatType).then((response) => {
          const { Data } = response
          this.formItems = Data
          this.loading = false
          this.votePlanTitle = '随访问卷题目明细详情'
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
