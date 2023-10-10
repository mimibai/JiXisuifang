<template>
  <div
    v-loading="loading"
    class="dashboard-container"
  >
    <add-andedit
      :form-items-data="formItems"
      :patient-datas="patientDatas"
      :last-page-url="lastPageUrl"
    />
  </div>
</template>
<script>
import { creatPatient, creatPatientPost } from '@/api/doctor'
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
      patientDatas: {},
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
    const pEReserveIds = this.$route.query.peReserveIds
    this.patientDatas = {
      caseJoinProtocolId: caseJoinProtocolId,
      followupProtocolId: followupProtocolId,
      operatTypeId: operatTypeId,
      patientId: patientId,
      pEReserveIds: pEReserveIds
    }
    this.fetchData()
  },
  methods: {
    // 获取条件
    fetchData() {
      creatPatient(this.patientDatas).then((response) => {
        this.argumentData(response.Data)
        console.log(response.Data)
        this.formItems = response.Data
        this.loading = false
      })
    },
    argumentData(Data) {
      let twoLevelList = []
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
        // 如果为终端类别，需要把终端类别项的联动全部转到测评终端中
        if (element.name === 'DeviceTypeId') {
          const arrList = element.list
          for (let index = 0; index < arrList.length; index++) {
            const twoLevelItem = arrList[index]
            twoLevelList.push(...twoLevelItem.twoLevelList)
          }
          const set = new Set(twoLevelList)
          twoLevelList = [...set]
        }
        if (element.name === 'PcClientId') {
          element.list = twoLevelList
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
