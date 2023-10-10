<template>
  <div class="Records">
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="12">
        <div class="mine-container-patient">
          <div class="mine-container-patient-title">
            <h4>个人档案基本信息</h4>
          </div>
          <!-- <p class="mine-container-patient-tips">
            *尊敬的用户，您好！请您如实填写以下信息。
          </p> -->
          <div
            v-loading="loading"
            class="mine-container-patient-content"
          >
            <PatientDetail
              :btnLoading="buttonLoading"
              :showSubmit="showSubmit"
              :formItems="formItems"
              @submitForm="submitForm"
            ></PatientDetail>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { GetPatientDetail } from '@/api/records'
import PatientDetail from '@/components/Patient/patientDetail.vue'
import { Message } from 'element-ui'
export default {
  name: 'CaseManagementPatientDetail',
  components: { PatientDetail },
  data() {
    return {
      loading: true,
      patientId: 0,
      buttonLoading: false,
      showSubmit: false, //是否展示提交按钮
      formItems: [],
    }
  },
  created() {
    this.getPatientInfo()
  },
  methods: {
    getPatientInfo() {
      let getPatientId = this.$route.query.patientId
      if (getPatientId) {
        this.patientId = Number(this.$route.query.patientId)
      } else {
        this.$router.push({
          path: '/',
        })
      }
      //获取就诊人详细信息
      let operatType = { operatTypeId: 3, PatientId: this.patientId }
      GetPatientDetail(operatType).then((response) => {
        const { Data } = response
        this.formItems = Data
        this.loading = false
      })
    },
    submitForm(submitData) {
      this.buttonLoading = true
      // creatPatientPost(submitData)
      //   .then((response) => {
      //     const { Msg } = response
      //     Message({
      //       message: Msg + '返回就诊人列表页',
      //       type: 'success',
      //       duration: 5 * 1000,
      //     })
      //     this.buttonLoading = false
      //     //添加完毕后返回列表页
      //     this.$router.push({
      //       path: '/patient/mine/patients/list',
      //     })
      //   })
      //   .catch((err) => {
      //     this.buttonLoading = false
      //   })
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
