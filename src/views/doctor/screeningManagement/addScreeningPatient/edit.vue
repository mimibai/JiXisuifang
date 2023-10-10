<template>
  <div
    v-loading="loading"
    class="dashboard-container"
  >
    <add-andedit
      :form-items-data="formItems"
      :patient-datas="editPersonDatas"
      :last-page-url="lastPageUrl"
    />
  </div>
</template>
<script>
import { creatPatient } from '@/api/doctor'
import addAndedit from './components/addAndEdit.vue'
export default {
  name: 'AddScreeningPatient',
  components: {
    addAndedit
  },
  data() {
    return {
      formItems: [],
      loading: true, // 全局loading
      editPersonDatas: {},
      lastPageUrl: '' // 上页路径
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.lastPageUrl = from.path
    })
  },
  created() {
    const caseJoinProtocolId = this.$route.query.caseJoinProtocolId
    const followupProtocolId = this.$route.query.followupProtocolId
    const operatTypeId = this.$route.query.operatTypeId
    const patientId = this.$route.query.patientId
    if (caseJoinProtocolId && followupProtocolId && operatTypeId && patientId) {
      this.editPersonDatas = {
        caseJoinProtocolId: caseJoinProtocolId,
        followupProtocolId: followupProtocolId,
        operatTypeId: operatTypeId,
        patientId: patientId
      }
    } else {
      this.$router.push({
        path: '/doctor/screeningManagement/cancerRecord'
      })
      return false
    }
    this.fetchData()
  },
  methods: {
    // 获取条件
    fetchData() {
      creatPatient(this.editPersonDatas).then((response) => {
        this.formItems = response.Data
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
