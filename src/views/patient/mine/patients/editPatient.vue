<template>
  <div class="mine-container-patient">
    <div class="mine-container-patient-title">
      <h4>个人基本信息填写</h4>
    </div>
    <p class="mine-container-patient-tips">
      *尊敬的用户，您好！为了更全面地为您定制治疗方案，请您如实填写以下信息。
    </p>
    <div
      v-loading="loading"
      class="mine-container-patient-content"
    >
      <PatientDetail
        :btn-loading="buttonLoading"
        :show-submit="showSubmit"
        :form-items="formItems"
        @submitForm="submitForm"
      />
    </div>
  </div>
</template>
<script>
import { creatPatient, creatPatientPost } from '@/api/patient'
import PatientDetail from '@/components/Patient/patientDetail.vue'
import { Message } from 'element-ui'
export default {
  components: {
    PatientDetail
  },
  data() {
    return {
      loading: true,
      showSubmit: true,
      patientId: 0,
      buttonLoading: false,
      formItems: []
    }
  },
  created() {
    this.getPatientInfo()
  },
  methods: {
    getPatientInfo() {
      const getPatientId = this.$route.query.patientId
      if (getPatientId) {
        this.patientId = Number(this.$route.query.patientId)
      } else {
        this.$router.push({
          path: '/patient/mine/patients/list'
        })
      }
      // 获取就诊人详细信息
      const operatType = { operatTypeId: 3, PatientId: this.patientId }
      creatPatient(operatType).then((response) => {
        const { Data } = response
        this.formItems = Data
        for (let index = 0; index < Data.length; index++) {
          const element = Data[index]
          // 接口默认返回的证件类型value为1时默认居民身份证，此时应把isMust改为false
          if (
            element.value === 1 &&
            element.name === 'DocumentTypeId' &&
            element.type === 'picker'
          ) {
            element.isMust = false
          }
          if (
            element.isdisplay === true &&
            element.isMust === true &&
            element.pshow === 'DocumentTypeId'
          ) {
            element.isMust = false
          }
        }
        this.loading = false
      })
    },
    // 表单提交
    submitForm(submitData) {
      this.buttonLoading = true
      submitData.operatTypeId = 3
      creatPatientPost(submitData)
        .then((response) => {
          const { Msg } = response
          Message({
            message: Msg + '返回就诊人列表页',
            type: 'success',
            duration: 5 * 1000
          })
          this.buttonLoading = false
          // 添加完毕后返回列表页
          this.$router.push({
            path: '/patient/mine/patients/list'
          })
        })
        .catch(() => {
          this.buttonLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.mine-container-patient {
  padding: 50px;
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
