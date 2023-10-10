<template>
  <div
    v-loading="loading"
    class="addNewPatient mine-container-patient"
  >
    <div class="mine-container-patient-title">
      <h4>患者信息填写</h4>
    </div>
    <p class="mine-container-patient-tips">
      *尊敬的用户，您好！为了更全面地为您定制治疗方案，请您如实填写以下信息。
    </p>
    <div style="overflow: hidden">
      <add-form
        ref="PatientsAddTable"
        :form-datas="formData.formItems"
        :patient-datas="patientDatas"
        :add-person-datas="addPersonDatas"
        :submit-loading="submitLoading"
        @openAddPatientDailog="openAddPatientDailog"
        @handleHospitalChange="handleHospitalChange"
        @handleDepartmentChange="handleDepartmentChange"
        @goLastPage="goLastPage"
        @submitData="submitData"
      />
    </div>
    <!--选择就诊人弹窗-->
    <el-dialog
      v-if="dialogShow"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      @close="resetPatientsTable"
    >
      <all-patients
        ref="allPatientsTable"
        :search-patient-data="searchPatientData"
        @selectPatientData="patientChoose"
        @closeDailog="resetPatientsTable"
        @openAddPatientDailog="openAddPatientByIdCardDailog"
      />

      <!--新建就诊人dailog-->
      <el-dialog
        v-if="addPatientDailog"
        width="40%"
        title="新建就诊人"
        :visible.sync="addPatientDailog"
        :close-on-click-modal="false"
        append-to-body
      >
        <add-patients
          ref="addPatientForm"
          @closeAddPatientDailog="closeAddPatientDailog"
          @addPatientDailogReturnData="addPatientDailogReturnData"
        />
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { getProvinceList, getCityList, getCountyList } from '@/api/region'
import {
  creatPatientPost,
  getHospitalList,
  getDepartmentList,
  getDoctorList
} from '@/api/doctor'
import { Message } from 'element-ui'
import AddForm from './addForm.vue'
import AllPatients from '@/views/doctor/layout/components/AllPatients.vue'
import AddPatients from '@/views/doctor/layout/components/AddPatient.vue'
export default {
  name: 'AddAndEdit',
  components: {
    AddForm,
    AllPatients,
    AddPatients
  },
  props: {
    formItemsData: Array,
    patientDatas: Object,
    lastPageUrl: String
  },
  data() {
    return {
      formData: {
        formItems: this.formItemsData
      },
      cascaderPlaceHolder: '请选择',
      dialogShow: false, // 添加患者弹窗开关
      loading: false, // 全局loading
      canAddPatientInput: true,
      searchPatientData: {}, // 就诊人弹窗传入数据
      opSearchPatientName: true, // 控制姓名搜索框
      idCardNoPlaintext: null, // 存储真实身份证
      addPersonDatas: null, // 选中患者详细信息
      submitLoading: false, // 表单提交按钮loading
      addPatientDailog: false
    }
  },
  watch: {
    formItemsData() {
      this.formData.formItems = this.arrangement(this.formItemsData)
    }
  },
  created() {
    this.arrangement(this.formItemsData)
  },
  methods: {
    // 患者搜索弹窗
    openAddPatientDailog() {
      this.dialogShow = true
      const formInputValueArr = this.formData.formItems
      for (let index = 0; index < formInputValueArr.length; index++) {
        const element = formInputValueArr[index]
        // console.log(element)
        if (element.name === 'PatientName') {
          this.searchPatientData.name = element.value
        }
        if (element.name === 'DocumentTypeId') {
          this.searchPatientData.documentTypeId = element.value
        }
        if (
          this.searchPatientData.documentTypeId === Number(element.pshowval)
        ) {
          this.searchPatientData.cardNo = element.value
        }
      }
    },

    // 打开新建就诊人弹窗
    openAddPatientByIdCardDailog() {
      this.addPatientDailog = true
    },
    // 关闭新建就诊人弹窗
    closeAddPatientDailog() {
      this.addPatientDailog = false
    },
    resetPatientsTable() {
      // 重置新增患者弹窗
      this.dialogShow = false
      this.$refs.allPatientsTable.resetSearchPatientInfo()
    },
    // 新建就诊人后，dailog返回得数据
    addPatientDailogReturnData(patientData) {
      // 数据反填
      this.patientChoose(patientData)
      this.closeAddPatientDailog()
      this.dialogShow = false
    },
    // 将所选患者信息反填回去
    patientChoose(row) {
      const data = this.formData.formItems
      for (let index = 0; index < data.length; index++) {
        const item = data[index]
        if (item.name === 'PatientName') {
          data[index].value = row.patientName
        }
        if (item.name === 'PatientId') {
          data[index].value = row.patientId
        }
        if (item.name === 'IdCardNo') {
          data[index].value = row.idCardNoPlaintext
          this.idCardNoPlaintext = row.idCardNoPlaintext
        }
        if (item.name === 'MobileNumber') {
          data[index].value = row.mobileNumber
        }
        if (item.name === 'Height') {
          data[index].value = row.height
        }
        if (item.name === 'Weight') {
          data[index].value = row.weight
        }
        if (item.name === 'MarriageAge') {
          if (row.marriageage == null || row.marriageage === false) {
            data[index].isdisplay = true
          } else {
            data[index].isdisplay = false
            data[index].value = row.marriageage
          }
        }
        if (item.name === 'EducationTitleId') {
          data[index].value = row.educationTitleId
        }
        if (item.name === 'IsMarriage') {
          if (row.ismarriage) {
            data[index].value = 1
          } else {
            data[index].value = 0
          }
        }
        if (item.name === 'ProvinceId,CityId,CountyId') {
          if (row.provinceid != null && row.provinceid > 0) {
            data[
              index
            ].value = `${row.provinceid},${row.cityid},${row.countyid}`
          } else {
            data[index].value = '0, 0, 0'
          }
        }
        if (
          item.name === 'AncestralProvinceId,AncestralCityId,AncestralCountyId'
        ) {
          if (row.ancestralProvinceId != null && row.ancestralProvinceId > 0) {
            data[
              index
            ].value = `${row.ancestralProvinceId},${row.ancestralCityId},${row.ancestralCountyId}`
          } else {
            data[index].value = '0, 0, 0'
          }
        }
        if (item.name === 'DocumentTypeId') {
          if (row.documentTypeId === null && row.idCardNoPlaintext != null) {
            data[index].value = 1
          } else {
            data[index].value = row.documentTypeId
          }
          this.$refs.PatientsAddTable.pickerCtrlShowOrHide(data, data[index])
        }
        if (item.name === 'HKAndMacaoPermitNum') {
          data[index].value = row.hkAndMacaoPermitNum
        }
        if (item.name === 'MTPsNum') {
          data[index].value = row.mtpsNum
        }
        if (item.name === 'HKAndMacaoAndMTPsResidenceNum') {
          data[index].value = row.hkAndMacaoAndMTPsResidenceNum
        }
        if (item.name === 'FPerManentResidentNum') {
          data[index].value = row.fperManentResidentNum
        }
        if (item.name === 'PassportNum') {
          data[index].value = row.passportNum
        }
        if (item.name === 'MilitaryOfficerNum') {
          data[index].value = row.militaryOfficerNum
        }
        if (item.name === 'NDToHKAndMacaoPermitNum') {
          data[index].value = row.curCertificateNo
        }
        if (item.name === 'Birthday') {
          data[index].value = row.birthday
        }
        if (item.name === 'Gender') {
          data[index].value = row.genderId
        }
      }
      const assData = this.arrangement(data)
      this.formData.formItems = assData
      this.addPersonDatas = row
      this.resetPatientsTable()
    },
    submitData(param) {
      this.submitLoading = true
      creatPatientPost(param)
        .then((response) => {
          const { Code, Data } = response
          if (Code === 1) {
            Message({
              message: '创建成功，前往癌筛明细',
              type: 'success',
              duration: 1.5 * 1000
            })
            this.$router.push({
              path: '/doctor/screeningManagement/survey',
              query: {
                caseJoinProtocolId: Data,
                patientId: param.PatientId
              }
            })
          } else if (Code === 0) {
            Message({
              message: '保存成功，返回癌筛记录',
              type: 'success',
              duration: 1.5 * 1000
            })
            this.$router.push({
              path: this.lastPageUrl
            })
          }
          this.submitLoading = false
        })
        .catch((err) => {
          const { Msg } = err
          Message({
            message: Msg,
            type: 'error',
            duration: 1.5 * 1000
          })
          this.submitLoading = false
        })
    },

    goLastPage() {
      window.history.go(-1)
    },

    // 选择医院inut
    handleHospitalChange(hospitalId) {
      // 根据hospitalId使form里的科室和医生进行对应改变
      const data = this.formData.formItems
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.name === 'DepartmentId') {
          // 先清空科室，再赋值
          element.list = []
          element.value = null
          this.getDepartmentList({ hospitalId }).then((res) => {
            element.list = res
          })
        }
        // 同时清空医生input
        if (element.name === 'DoctorId') {
          element.list = []
          element.value = null
        }
      }
    },
    // 选择科室input
    handleDepartmentChange(doctorParam) {
      // 根据hospitalId使form里的医生进行对应改变
      const data = this.formData.formItems
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.name === 'DoctorId') {
          // 先清空科室，再赋值
          element.list = []
          element.value = null
          this.getDoctorList(doctorParam).then((res) => {
            element.list = res
          })
        }
      }
    },
    // 格式化数据
    arrangement(Data) {
      this.loading = true
      let twoLevelChildName = ''
      let twoLevelChildList = []
      let hospitalId = null
      let departmentId = null
      for (let index = 0; index < Data.length; index++) {
        const oldValue = Data[index].value
        if (Data[index].type !== 'radio' && oldValue === 0) {
          Data[index].value = null
        }
        if (
          Data[index].type === 'radio' &&
          oldValue === 0 &&
          Data[index].name === 'Gender'
        ) {
          Data[index].value = null
        }
        // 循环将数据中城市信息类型进行转换
        if (Data[index].type === 'regionSelect') {
          const nameArr = Data[index].value.split(',')
          // 如果value为“0,0,0”表示未选择
          if (nameArr[0] > 0) {
            this.getProvinceData(nameArr).then((res) => {
              if (res) {
                const provinceName = res[0]
                let cityName = ''
                let countyName = ''
                res[1].then((res1) => {
                  cityName = res1[0]
                  res1[1].then((res2) => {
                    countyName = res2
                    Data[
                      index
                    ].placeholder = `${provinceName}/${cityName}/${countyName}`
                    // Data[index].value = [provinceName,cityName,countyName]
                    Data[index].addClass = 'sepcialInput'
                  })
                })
              }
            })
          } else {
            Data[index].placeholder = this.cascaderPlaceHolder
            Data[index].addClass = ''
          }
        }
        // 循环从接口中医疗机构，科室，医生进行查找并回填
        if (Data[index].name === 'HospitalId') {
          hospitalId = Data[index].value
          this.getHospitalList().then((res) => {
            Data[index].list = res
          })
        }
        if (Data[index].name === 'DepartmentId') {
          // console.log(hospitalId)
          departmentId = Data[index].value
          const depParam = {
            hospitalId
          }
          this.getDepartmentList(depParam).then((res) => {
            Data[index].list = res
          })
        }
        if (Data[index].name === 'DoctorId') {
          const doctorParam = {
            hospitalId,
            departmentId
          }
          this.getDoctorList(doctorParam).then((res) => {
            Data[index].list = res
          })
        }
        // 二级联动将父级项填到子级
        if (Data[index].type === 'twolevel') {
          const childIndex = Number(Data[index].value)
          const dataList = Data[index].list
          dataList.forEach((element) => {
            if (Number(element.id) === childIndex) {
              twoLevelChildName = element.twoLevelName
              twoLevelChildList = element.twoLevelList
            }
          })
        }
        if (
          Data[index].name === twoLevelChildName &&
          twoLevelChildName.length > 0
        ) {
          const twoLevelChildListArr = []
          const twoLevelChildValue = Number(Data[index].value)
          // 循环子级的list看是否有已经有的值，如果有不处理，如果没有置空value
          for (let k = 0; k < twoLevelChildList.length; k++) {
            const twoLevelChild = twoLevelChildList[k]
            twoLevelChildListArr.push(Number(twoLevelChild.id))
          }
          if (twoLevelChildListArr.indexOf(twoLevelChildValue) === -1) {
            Data[index].value = null
          }
          Data[index].list = twoLevelChildList
        }
      }
      this.loading = false
      return Data
    },
    async getProvinceData(arr) {
      // 后台数据为0是“请选择..”所以跳过
      if (Number(arr[0] === 0)) {
        return false
      } else {
        let provinceId = 0
        let provinceName = ''
        let newArr = []
        await getProvinceList().then((response) => {
          const { Data } = response
          provinceId = Number(arr[0])
          for (let index = 0; index < Data.length; index++) {
            const eProvince = Data[index]
            if (eProvince.provinceId === provinceId) {
              provinceName = eProvince.Name
            }
          }
          newArr = this.getCityData(arr, provinceId)
        })

        return [provinceName, newArr]
      }
    },
    async getCityData(arr, provinceId) {
      let cityId = 0
      let cityName = ''
      let countyName = ''
      await getCityList({ provinceId: provinceId }).then((cityResponse) => {
        const cityData = cityResponse.Data
        cityId = Number(arr[1])
        for (let index = 0; index < cityData.length; index++) {
          const eCity = cityData[index]
          if (eCity.cityId === cityId) {
            cityName = eCity.Name
          }
        }
        countyName = this.getCountyData(arr, cityId)
      })
      return [cityName, countyName]
    },
    async getCountyData(arr, cityId) {
      let countyId = 0
      let countyName = ''
      await getCountyList({ cityId: cityId }).then((countyResponse) => {
        const countyData = countyResponse.Data
        countyId = Number(arr[2])
        for (let index = 0; index < countyData.length; index++) {
          const eCounty = countyData[index]
          if (eCounty.countyId === countyId) {
            countyName = eCounty.Name
          }
        }
      })
      return countyName
    },
    // 获取可用医院信息
    async getHospitalList(param) {
      let data = []
      await getHospitalList(param).then((res) => {
        data = res.Data
      })
      return data
    },
    // 获取可用科室信息
    async getDepartmentList(param) {
      let data = []
      await getDepartmentList(param).then((res) => {
        data = res.Data
      })
      return data
    },
    // 获取可用医生信息
    async getDoctorList(param) {
      let data = []
      await getDoctorList(param).then((res) => {
        data = res.Data
      })
      return data
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: $bg;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  /*color: $bg;*/
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.mine-container-patient .input-content-items:nth-last-of-type(2n) .dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.mine-container-patient {
  padding: 50px;
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
  .input-content {
    &-items {
      width: 25%;
      display: inline-block;
      box-sizing: border-box;
      padding: 0 10px;
    }
    .form-titles {
      width: 100%;
      display: block;
      h5 {
        padding-bottom: 22px;
        color: $bg;
      }
    }
  }
}
.noTableData-desc {
  line-height: initial;
  margin-top: 15px;
}
.addNewPatient {
  width: 80%;
  margin: 0 auto;
  .opButton {
    float: right;
    margin-bottom: 22px;
  }
}
.el-input {
  /*width: 300px;margin-left: 20px;*/
  padding: 0;
}
.allPatientBtns {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    font-size: 24px;
  }
}
.mb20 {
  margin-bottom: 20px;
}

@media only screen and (max-width: 1440px) {
  .addNewPatient {
    width: 100%;
  }
  .mine-container-patient {
    .input-content {
      &-items {
        width: 33%;
      }
    }
  }
}
</style>
