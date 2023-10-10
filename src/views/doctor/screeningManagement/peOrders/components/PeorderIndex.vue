<template>
  <div>
    <!-- 搜索表单 -->
    <div v-if="hasSearchForm">
      <el-form
        ref="searchForm"
        :model="{ searchForm }"
        :inline="true"
        label-width="100px"
        :label-position="labelPosition"
      >
        <template v-for="item in searchForm">
          <el-form-item
            v-if="item.type == 4 || item.type == 3"
            :key="item.index"
            :label="item.title"
            :prop="item.name"
          >
            <el-select
              v-model="item.value"
              :placeholder="'请选择' + item.title"
              :style="'width:' + styleWidth"
            >
              <el-option
                v-for="(items, idx) in item.dataList"
                :key="idx"
                :label="items.name"
                :value="String(items.id)"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="item.type == 5 && item.name == 'beginReserveDate'"
            :key="item.index"
            :label="item.title"
            :prop="item.name"
          >
            <el-col>
              <el-date-picker
                v-model="item.value"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:330px"
                :clearable="false"
              />
            </el-col>
          </el-form-item>
          <el-form-item
            v-if="item.type == 1 && item.name == 'startAge'"
            :key="item.index"
            :label="item.title"
            :prop="item.name"
          >
            <el-input
              v-model="item.value"
              placeholder="请填写开始年龄"
              :style="'width:' + styleWidth"
            />
          </el-form-item>
          <el-form-item
            v-if="item.type == 1 && item.name == 'endAge'"
            :key="item.index"
            :prop="item.name"
          >
            <el-input
              v-model="item.value"
              placeholder="请填写结束年龄"
              :style="'width:' + styleWidth"
            />
          </el-form-item>
          <el-form-item
            v-if="
              item.type == 1 && item.name != 'startAge' && item.name != 'endAge'
            "
            :key="item.index"
            :label="item.title"
            :prop="item.name"
          >
            <el-input
              v-model="item.value"
              :placeholder="'请填写' + item.title"
              :style="'width:' + styleWidth"
            />
          </el-form-item>
        </template>
      </el-form>
      <div class="primaryBtn">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="searchPeorders"
        >查询</el-button>
        <el-button
          icon="el-icon-refresh-left"
          @click="searchReset"
        >重置</el-button>
      </div>
    </div>
    <!-- 新增早筛患者 -->
    <div
      class="addNewPeOrder"
    >
      <el-button
        class="opButton"
        type="primary"
        icon="el-icon-refresh-left"
        @click.native="asyncOrgOrder"
      >同步团检订单</el-button>
      <el-button
        v-if="isHaveCreateRole"
        class="opButton"
        type="primary"
        icon="el-icon-plus"
        @click.native="creatPeorder"
      >体检预约</el-button>
    </div>
    <!-- 早筛条目 -->
    <el-table
      ref="TableForm"
      v-loading="peOrderListLoading"
      :data="peOrderList"
      style="width: 100%"
      border
      :show-overflow-tooltip="true"
      :header-cell-style="getRowClass"
      @sort-change="onSortChange"
    >
      <el-table-column
        v-for="(col, index) in cols"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        align="center"
        :width="col.width"
        :sortable="col.sortable"
      >
        <template slot-scope="scope">
          <peorder-cell
            :prop="col.prop"
            :row="scope.row"
            :row-index="(currentPage-1)*pageSize+(scope.$index + 1)"
            @cancelPEReserve="cancelPEReserve"
            @changeDatePe="changeDatePe"
            @goToDetail="goToDetail"
            @addPeRemark="addPeRemark"
          />
        </template>
      </el-table-column>
      <template slot="empty">
        <div class="noTableData">
          暂无数据
        </div>
      </template>
    </el-table>
    <!-- 分页器 -->
    <div
      v-if="pageCount!=null"
      class="health-content-pagination"
      style="margin-top: 15px"
    >
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[20, 40, 60, 80]"
        layout="sizes,prev,pager,next,jumper"
        :page-count="pageCount"
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--新建预约弹窗-->
    <el-dialog
      v-loading="createPEReserveLoading"
      title="体检预约"
      :visible.sync="createPEReserveSubmitdialog"
      :close-on-click-modal="false"
      width="35%"
    >
      <div>
        <peorder-form
          ref="peorderForm"
          :create-p-e-reserve-form-data="createPEReserveFormData"
          @openAllPatientDailog="openAllPatientDailog"
          @openChooseDateDailog="openChooseDateDailog"
          @postCreatePEReserveByDoctor="postCreatePEReserveByDoctor"
        />
      </div>
      <!--选择就诊人弹窗-->
      <el-dialog
        v-if="allPatientDailog"
        width="50%"
        :visible.sync="allPatientDailog"
        :close-on-click-modal="false"
        append-to-body
        @close="resetPatientsTable"
      >
        <all-patients
          ref="allPatientsTable"
          :search-patient-data="searchPatientData"
          @selectPatientData="selectPatientData"
          @closeDailog="resetPatientsTable"
          @openAddPatientDailog="openAddPatientDailog"
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
      <!--选择预约日期弹窗-->
      <el-dialog
        title="选择预约日期"
        :visible.sync="chooseDatedialog"
        width="35%"
        :close-on-click-modal="false"
        append-to-body
      >
        <div>
          <change-date
            :is-show-patient="false"
            :change-pe-date-patient="choosePeDatePatient"
            @chooseTimeFun="choosePeTime"
          />
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="chooseDatedialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="chooseDateSubmit"
          >确 定</el-button>
        </span>
      </el-dialog>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="createPEReserveSubmitdialog = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="createPEReserveSubmitLoading"
          @click="valiPEReserveSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!--预约改期弹窗-->
    <el-dialog
      title="预约改期"
      :visible.sync="changeDatedialog"
      :close-on-click-modal="false"
      width="35%"
    >
      <div>
        <change-date
          :is-show-patient="false"
          :change-pe-date-patient="changePeDatePatient"
          @chooseTimeFun="chooseTimeFun"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="changeDatedialog = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="changeDateSubmitLoading"
          @click="changeDateSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!--添加备注信息弹窗-->
    <el-dialog
      title="添加备注"
      :visible.sync="addPeRemarkdialog"
      :close-on-click-modal="false"
      width="35%"
    >
      <el-form ref="form" :model="addPeRemarkForm" label-width="80px">
        <el-form-item label="备注：">
          <el-input
            v-model="addPeRemarkForm.doctorRemark"
            :autosize="{ minRows: 2, maxRows: 5}"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addPeRemarkdialog = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="addPeRemarkSubmitLoading"
          @click="addPeRemarkSubmit"
        >提交</el-button>
      </span>
    </el-dialog>
    <!--同步团检预约订单弹窗-->
    <el-dialog
      title="同步团检预约订单"
      :visible.sync="asyncOrgOrderDialog"
      :close-on-click-modal="false"
      width="35%"
    >
      <el-form ref="asyncOrgOrderForm" :model="asyncOrgOrderForm" label-width="120px">
        <el-form-item
          label="单位名称："
          :prop="'orgName'"
          :rules="[
            { required: true, message: '单位名称不能为空',trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="asyncOrgOrderForm.orgName"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item
          label="单位编码："
          :prop="'hospitalId'"
          :rules="[
            { required: true, message: '单位编码不能为空',trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="asyncOrgOrderForm.hospitalId"

            clearable
          />
        </el-form-item> -->
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="asyncOrgOrderDialog = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="asyncOrgOrderSubmitLoading"
          @click="asyncOrgOrderSubmit"
        >提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCreatePEReserveByDoctor,
  postCreatePEReserveByDoctor,
  CancelPEReserve,
  UpdateReserveTime,
  postUpdateDoctorRemark,
  asyncOrgOrderInfo
} from '@/api/peOrder'
import PeorderForm from './PeorderForm.vue'
import AllPatients from '@/views/doctor/layout/components/AllPatients.vue'
import AddPatients from '@/views/doctor/layout/components/AddPatient.vue'
import ChangeDate from '@/components/ChoosePeDate/index.vue'
import PeorderCell from './PeorderCell.vue'
import { Message, MessageBox } from 'element-ui'
import {
  checkAgeByIdcard,
  checkSexByIdcard,
  checkAgeByBirthday
} from '@/utils/index'
export default {
  components: {
    PeorderCell,
    PeorderForm,
    AllPatients,
    ChangeDate,
    AddPatients
  },
  props: {
    hasSearchForm: Boolean,
    isHaveCreateRole: Boolean,
    isNullObject: Boolean,
    searchForm: Array,
    peOrderList: Array,
    urlParams: Object,
    cols: Array,
    pageCount: Number
  },
  data() {
    return {
      styleWidth: '160px',
      labelPosition: 'right', // 头部label样式
      currentPage: 1,
      pageSize: 20,
      searchData: {}, // 搜索参数
      createPEReserveSubmitdialog: false, // 体检预约dialog
      createPEReserveFormData: [], // 获取体检预约表单
      allPatientDailog: false,
      searchPatientData: {},
      createPEReserveLoading: false, // 体检预约dialogloading
      chooseDatedialog: false, // 选择预约日期弹窗
      choosePeDatePatient: {}, // 选择预约日期弹窗内人物信息
      createPEReserveSubmitLoading: false, // 体检预约dialog提交loading
      addPatientDailog: false,
      showAddPatientDetail: false,
      peOrderListLoading: false, // 订单表格loading
      sortTypeId: 0, // 默认排序方式 不排序
      sortName: '', // 默认排序列名称
      params: {},
      changeDatedialog: false, // 预约改期弹窗
      changePeDatePatient: {}, // 预约改期弹窗内人物信息
      chosePeDatas: null, // 改期后信息
      changeDateSubmitLoading: false,
      searchFormData: {}, // 搜索值
      addPeRemarkdialog: false, // 添加备注弹
      addPeRemarkSubmitLoading: false, // 备注提交按钮
      addPeRemarkForm: {
        doctorRemark: null,
        peReserveId: null
      },
      asyncOrgOrderDialog: false, // 同步团检订单弹窗
      asyncOrgOrderSubmitLoading: false,
      asyncOrgOrderForm: {
        orgName: null
        // hospitalId: null
      }
    }
  },
  methods: {
    // 查看订单详情
    goToDetail(peReserveId) {
      this.$router.push({
        name: 'PeOrdersDetail',
        params: { peReserveId: peReserveId }
      })
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    // 表格排序
    onSortChange(column) {
      if (column) {
        // 正序 1
        if (column.order === 'ascending') {
          this.sortTypeId = 1
          this.sortName = column.prop
          this.params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            page: 1,
            pageSize: this.pageSize
          }
          this.currentPage = 1
          this.$emit('getData', this.params)
        }
        // 不排序 0
        if (column.order == null) {
          this.sortTypeId = 0
          this.sortName = column.prop
          this.params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            page: 1,
            pageSize: this.pageSize
          }
          this.currentPage = 1
          this.$emit('getData', this.params)
        }
        // 倒序 2
        if (column.order === 'descending') {
          this.sortTypeId = 2
          this.sortName = column.prop
          this.params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            page: 1,
            pageSize: this.pageSize
          }
          this.currentPage = 1
          this.$emit('getData', this.params)
        }
      } else {
        // 清空排序条件，数据会恢复成未排序的状态
        this.$refs.TableForm.clearSort()
        this.sortTypeId = 0
        this.sortName = ''
      }
    },
    // 搜索
    searchPeorders(params) {
      this.currentPage = 1
      const searchParams = {}
      if (params === undefined) {
        params = {}
      }
      for (let index = 0; index < this.searchForm.length; index++) {
        const element = this.searchForm[index]
        // 处理开始和结束日期
        if (element.name === 'beginReserveDate') {
          for (let j = 0; j < element.value.length; j++) {
            searchParams['beginReserveDate'] = element.value[0]
            searchParams['endReserveDate'] = element.value[1]
          }
        } else if (element.name !== 'endReserveDate') {
          searchParams[element.name] = element.value
        }
      }
      this.searchData = searchParams
      // 判断是否有路径传参，如果有则在路径传参基础上进行搜索
      if (!this.isNullObject) {
        this.searchData.pePackageId = this.urlParams.pePackageId
        this.searchData.patientId = this.urlParams.patientId
      }
      params = Object.assign(params, searchParams)
      this.$emit('GetSearchData', this.searchData)
      this.$emit('getData', params)
    },
    // 搜索重置
    searchReset() {
      this.$refs.searchForm.resetFields()
      this.currentPage = 1
      this.pageSize = 20
      this.onSortChange()
      this.$emit('getData')
      this.searchData = {}
      this.$emit('GetSearchData', this.searchData)
    },
    // 新建体检预约获取
    creatPeorder() {
      this.createPEReserveSubmitdialog = true
      getCreatePEReserveByDoctor().then((res) => {
        const { Data } = res
        this.createPEReserveFormData = Data
        // 判断类型为picker的下拉框将其value改为空
        const taskFormItem = this.createPEReserveFormData
        for (let index = 0; index < taskFormItem.length; index++) {
          const item = taskFormItem[index]
          if (item.type === 'picker' && item.value === 0) {
            item.value = null
          }
        }
      })
      // 解决页面刷新出现表单验证bug，数据加载完毕清除表单验证。
      this.$nextTick(() => {
        this.$refs.peorderForm.clearVali()
      })
    },
    // 同步团检订单，打开弹窗
    asyncOrgOrder() {
      this.asyncOrgOrderDialog = true
    },
    // 同步团检订单提交
    asyncOrgOrderSubmit() {
      this.$refs.asyncOrgOrderForm.validate((valid) => {
        if (valid) {
          this.asyncOrgOrderSubmitLoading = true
          const hospitalId = this.$store.getters.hospitalId
          this.asyncOrgOrderForm.hospitalId = hospitalId
          asyncOrgOrderInfo(this.asyncOrgOrderForm).then((res) => {
            const { Code } = res
            if (Code === 1) {
              Message({
                message: '同步团检预约订单成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.asyncOrgOrderDialog = false
              this.$emit('getData')
            } else {
              const { Msg } = res
              Message({
                message: Msg,
                type: 'error',
                duration: 5 * 1000
              })
            }
            this.asyncOrgOrderDialog = false
            this.asyncOrgOrderSubmitLoading = false
          }).catch((err) => {
            const { Msg } = err
            Message({
              message: Msg,
              type: 'error',
              duration: 5 * 1000
            })
            this.asyncOrgOrderSubmitLoading = false
          })
        } else {
          return false
        }
      })
    },
    // 备注预约订单信息
    addPeRemark(param) {
      this.addPeRemarkdialog = true
      this.addPeRemarkForm.doctorRemark = param.doctorRemark
      this.addPeRemarkForm.peReserveId = param.peReserveId
    },
    // 备注信息提交
    addPeRemarkSubmit() {
      this.addPeRemarkSubmitLoading = true
      postUpdateDoctorRemark(this.addPeRemarkForm).then((res) => {
        const { Code } = res
        if (Code === 1) {
          Message({
            message: '提交备注信息成功！',
            type: 'success',
            duration: 5 * 1000
          })
          this.addPeRemarkdialog = false
          this.$emit('getData')
        } else {
          const { Msg } = res
          Message({
            message: Msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
        this.addPeRemarkdialog = false
        this.addPeRemarkSubmitLoading = false
      }).catch((err) => {
        const { Msg } = err
        Message({
          message: Msg,
          type: 'error',
          duration: 5 * 1000
        })
        this.addPeRemarkSubmitLoading = false
      })
    },
    // 获取所有就诊人弹窗
    openAllPatientDailog() {
      this.allPatientDailog = true
      const formInputValueArr = this.createPEReserveFormData
      for (let index = 0; index < formInputValueArr.length; index++) {
        const element = formInputValueArr[index]
        if (element.name === 'Name') {
          this.searchPatientData.name = element.value
        }
        if (element.name === 'IdCard') {
          this.searchPatientData.idcardno = element.value
        }
      }
    },
    // 选择日期弹窗
    openChooseDateDailog(param) {
      this.chooseDatedialog = true
      this.choosePeDatePatient = {
        hospitalId: param.hospitalId,
        pePackageId: param.pePackageId
      }
    },
    // 新建体检预约提交
    postCreatePEReserveByDoctor(submitData) {
      this.createPEReserveSubmitLoading = true
      postCreatePEReserveByDoctor(submitData)
        .then((res) => {
          const { Code } = res
          if (Code === 1) {
            Message({
              message: '预约成功！',
              type: 'success',
              duration: 5 * 1000
            })
            this.$emit('getData')
          } else {
            const { Msg } = res
            Message({
              message: Msg,
              type: 'error',
              duration: 5 * 1000
            })
          }
          this.createPEReserveSubmitLoading = false
          this.createPEReserveSubmitdialog = false
        })
        .catch((err) => {
          this.createPEReserveSubmitLoading = false
          const { Msg } = err
          Message({
            message: Msg,
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    // 关闭并重置所有患者弹窗
    resetPatientsTable() {
      this.allPatientDailog = false
      this.$refs.allPatientsTable.resetSearchPatientInfo()
    },
    selectPatientData(patientData) {
      // 循环表单数据，将所选数据进行回填
      // console.log(patientData)
      const DATA = this.createPEReserveFormData
      let patientAge = null
      let sex = 0
      for (let index = 0; index < DATA.length; index++) {
        const ELEMENT = DATA[index]
        if (ELEMENT.name === 'Name') {
          ELEMENT.value = patientData.patientName
        }
        if (ELEMENT.name === 'PatientId') {
          ELEMENT.value = patientData.patientId
        }
        if (ELEMENT.name === 'PhoneNumber') {
          ELEMENT.value = patientData.mobileNumber
        }
        if (ELEMENT.name === 'IdCard') {
          ELEMENT.value = patientData.idCardNoPlaintext
          if (
            patientData.idCardNoPlaintext !== '' &&
            patientData.idCardNoPlaintext !== null
          ) {
            // 通过计算身份证得到用户年龄
            patientAge = checkAgeByIdcard(patientData.idCardNoPlaintext)
            // 通过计算身份证得到用户性别
            sex = checkSexByIdcard(patientData.idCardNoPlaintext)
          } else {
            // 通过计算出生日期得到用户年龄
            patientAge = checkAgeByBirthday(patientData.birthday)
          }
        }
        if (ELEMENT.name === 'Age') {
          if (patientData.age != null && patientData.age !== '') {
            ELEMENT.value = patientData.age
          } else {
            ELEMENT.value = patientAge
          }
        }
        if (ELEMENT.name === 'Sex') {
          ELEMENT.value = sex
        }
        if (ELEMENT.name === 'DocumentTypeId') {
          if (
            patientData.documentTypeId === null &&
            patientData.idCardNoPlaintext != null
          ) {
            ELEMENT.value = 1
          } else {
            ELEMENT.value = patientData.documentTypeId
          }
          this.$refs.peorderForm.pickerCtrlShowOrHide(DATA, ELEMENT)
        }
        if (ELEMENT.name === 'HKAndMacaoPermitNum') {
          ELEMENT.value = patientData.hkAndMacaoPermitNum
        }
        if (ELEMENT.name === 'MTPsNum') {
          ELEMENT.value = patientData.mtpsNum
        }
        if (ELEMENT.name === 'HKAndMacaoAndMTPsResidenceNum') {
          ELEMENT.value = patientData.hkAndMacaoAndMTPsResidenceNum
        }
        if (ELEMENT.name === 'FPerManentResidentNum') {
          ELEMENT.value = patientData.fperManentResidentNum
        }
        if (ELEMENT.name === 'PassportNum') {
          ELEMENT.value = patientData.passportNum
        }
        if (ELEMENT.name === 'MilitaryOfficerNum') {
          ELEMENT.value = patientData.militaryOfficerNum
        }
        if (ELEMENT.name === 'NDToHKAndMacaoPermitNum') {
          ELEMENT.value = patientData.curCertificateNo
        }
        if (ELEMENT.name === 'BirthDay') {
          ELEMENT.value = patientData.birthday
        }
        if (ELEMENT.name === 'Sex') {
          ELEMENT.value = patientData.genderId
        }
      }
    },
    // 打开新建就诊人弹窗
    openAddPatientDailog() {
      this.addPatientDailog = true
      this.showAddPatientDetail = false
    },
    // 关闭新建就诊人弹窗
    closeAddPatientDailog() {
      this.addPatientDailog = false
    },
    // 新建就诊人后，dailog返回得数据
    addPatientDailogReturnData(patientData) {
      // 数据反填
      this.selectPatientData(patientData)
      this.closeAddPatientDailog()
      this.allPatientDailog = false
    },
    // 选择日期
    choosePeTime(chooseTime) {
      this.choosePeDatePatient = chooseTime
    },
    chooseDateSubmit() {
      // 选择日期后返填至form表单
      const DATA = this.createPEReserveFormData
      const patientData = this.choosePeDatePatient
      for (let index = 0; index < DATA.length; index++) {
        const ELEMENT = DATA[index]
        if (ELEMENT.name === 'ReserveTime') {
          ELEMENT.value = patientData.reserveTime
        }
        if (ELEMENT.name === 'Time') {
          ELEMENT.value = patientData.time
        }
      }
      this.chooseDatedialog = false
    },
    // 新建体检预约校验
    valiPEReserveSubmit() {
      // 子组件校验表单验证
      this.$refs.peorderForm.valiForm()
    },
    // 取消预约
    cancelPEReserve(param) {
      MessageBox.confirm('你确定要取消当前预约吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CancelPEReserve(param).then((res) => {
          const { Code } = res
          if (Code === 1) {
            Message({
              message: '取消成功！',
              type: 'success',
              duration: 5 * 1000
            })
            const parm = Object.assign(this.searchFormData, {
              page: this.currentPage
            })
            this.$emit('getData', parm)
            this.$forceUpdate()
          }
        })
      })
    },
    // 预约改期
    changeDatePe(param) {
      this.changeDatedialog = true
      this.changePeDatePatient = {
        name: param.name,
        checkCode: param.checkCode,
        pePackageName: param.pePackageName,
        sex: param.sex,
        peReserveId: param.peReserveId,
        nowReserveTime: param.reserveTime, // 当前预约日期
        hospitalId: param.hospitalId
      }
    },
    // 改期信息
    chooseTimeFun(chosePeDatas) {
      this.chosePeDatas = chosePeDatas
    },
    // 改期提交
    changeDateSubmit() {
      this.changeDateSubmitLoading = true
      if (this.chosePeDatas != null && this.chosePeDatas.time != null) {
        console.log(this.chosePeDatas)
        UpdateReserveTime(this.chosePeDatas)
          .then((res) => {
            if (res.Code === 1) {
              Message({
                message: '预约改期成功！',
                type: 'success',
                duration: 5 * 1000
              })
              const param = Object.assign(this.searchFormData, {
                page: this.currentPage
              })
              this.$emit('getData', param)
              this.changeDateSubmitLoading = false
              this.changeDatedialog = false
            } else {
              Message({
                message: res.Msg,
                type: 'error',
                duration: 5 * 1000
              })
              this.changeDatedialog = false
            }
          })
          .catch(() => {
            Message({
              message: '操作失败！请稍候重试',
              type: 'error',
              duration: 5 * 1000
            })
            this.changeDatedialog = false
          })
        this.changeDatedialog = false
      } else {
        Message({
          message: '请选择正确的日期！',
          type: 'error',
          duration: 5 * 1000
        })
        this.changeDateSubmitLoading = false
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      const parmas = Object.assign(this.params, { page: val })
      // 判断是否有路径传参，如果有则在路径传参基础上进行分页
      if (!this.isNullObject) {
        this.params.pePackageId = this.urlParams.pePackageId
        this.params.patientId = this.urlParams.patientId
      }
      this.$emit('getData', parmas)
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      // 每页条数改变时触发回到第一页
      this.currentPage = 1
      this.params.page = 1
      const parmas = Object.assign(this.params, { pageSize: val })
      // 判断是否有路径传参，如果有则在路径传参基础上进行分页
      if (!this.isNullObject) {
        this.params.pePackageId = this.urlParams.pePackageId
        this.params.patientId = this.urlParams.patientId
      }
      this.$emit('getData', parmas)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.addPatientForm-right {
  text-align: center;
}
.primaryBtn {
  text-align: center;
}
.addNewPeOrder {
  text-align: right;
  margin-bottom: 22px;
}
</style>
