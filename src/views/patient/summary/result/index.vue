<template>
  <div>
    <div class="container">
      <div v-loading="loading">
        <div v-if="resutlData">
          <SurveyResult
            :result-list="Result"
            :isShow="isShow"
            :IsPrint="IsPrint"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SurveyResult from '@/components/SurveyResult/index'
import { getPatientSurveyResult } from '@/api/summaryPatient'
export default {
  components: {
    SurveyResult,
  },
  data() {
    return {
      isShow: false,
      IsPrint: false,
      loading: true,
      doctorAdvice: false, // 是否展示医生建议
      resutlData: false,
      Result: {
        patientMsgData: {
          patientMsgIsShow: false,
        },
        reportResultData: {
          reportResultIsShow: false,
        },
        adviceMsgData: {
          adviceMsgIsShow: false,
        },
        checkItemListData: {
          checkItemListIsShow: false,
        },
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData: function () {
      const caseJoinProtocolId = this.$route.query.caseJoinProtocolId
      if (caseJoinProtocolId) {
        this.caseJoinProtocolId = Number(caseJoinProtocolId)
      } else {
        this.$router.push({
          path: '/patient/mine/patients/list',
        })
      }
      const operatType = {
        caseJoinProtocolId: this.caseJoinProtocolId,
      }
      getPatientSurveyResult(operatType).then((response) => {
        const { Data } = response
        this.Result = Data
        this.resutlData = true
        this.loading = false
      })
    },
  },
}
</script>
