<template>
  <!--获取所有就诊人弹窗组件-->
  <div
    class="allPatient"
    style="text-align: center"
  >
    <div class="allPatientBtns">
      <span class="mb20">选择就诊人</span>
      <div v-show="opSearchPatientName">
        <!-- 搜索表单 -->
        <el-form
          ref="searchPatientForm"
          :model="{ searchForm }"
          :inline="true"
          label-width="90px"
        >
          <template v-for="item in searchForm">
            <el-form-item
              v-if="item.type == 4"
              :key="item.index"
              :label="item.title"
              :prop="item.name"
            >
              <el-select
                v-model="item.value"
                :placeholder="'请选择' + item.title"
                size="mini"
                style="width:180px"
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
              v-if="item.type == 1"
              :key="item.index"
              :label="item.title"
              :prop="item.name"
            >
              <el-input
                v-model="item.value"
                :placeholder="'请填写' + item.title"
                size="mini"
                style="width:130px"
              />
            </el-form-item>
          </template>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="searchPatientInfo"
            >搜索</el-button>
            <el-button
              icon="el-icon-refresh-left"
              size="mini"
              @click="resetSearchPatientInfo"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 所有就诊人条目 -->
    <div>
      <el-table
        v-loading="allPatientLoading"
        :data="allPatientList"
        width="100%"
        max-height="300px"
        :row-style="{ padding: '5px' }"
        border
        :show-overflow-tooltip="true"
        :header-cell-style="getRowClass"
        @row-click="patientChoose"
      >
        <el-table-column
          label="序号"
          align="center"
          width="75px"
        >
          <template scope="scope">
            <span>{{
              (allPatientPageIndex - 1) * allPatientPageSize + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          align="center"
          :show-overflow-tooltip="true"
          width="110px"
        >
          <template slot-scope="scope">
            <el-popover v-if="scope.row.isShowGuardianInfo" trigger="hover" placement="top">
              <p>监护人姓名: <span class="guardianInfo-span">{{ scope.row.patientName }}</span></p>
              <p>监护人监护人证件类型: <span class="guardianInfo-span">{{ scope.row.guardianDocumentTypeName }}</span></p>
              <p>监护人证件号: <span class="guardianInfo-span">{{ scope.row.guardianCertificateNo }}</span></p>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.patientName }}</span>
                <span class="icon-minority">
                  <svg-icon icon-class="minority" />
                </span>
              </div>
            </el-popover>
            <span v-else>{{ scope.row.patientName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          align="center"
          :show-overflow-tooltip="true"
          width="75px"
        />
        <el-table-column
          prop="birthday"
          label="出生日期"
          align="center"
          :show-overflow-tooltip="true"
          width="130px"
        />
        <el-table-column
          prop="mobileNumber"
          label="联系方式"
          align="center"
          :show-overflow-tooltip="true"
          width="130px"
        />
        <el-table-column
          label="证件类型"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.documentTypeId == null||scope.row.documentTypeId == 1">居民身份证</span>
            <span v-if="scope.row.documentTypeId == 2">港澳居民来往内地通行证</span>
            <span v-if="scope.row.documentTypeId == 3">台湾居民来往大陆通行证</span>
            <span v-if="scope.row.documentTypeId == 4">港澳台居民居住证</span>
            <span v-if="scope.row.documentTypeId == 5">外国人永久居留身份证</span>
            <span v-if="scope.row.documentTypeId == 6">护照</span>
            <span v-if="scope.row.documentTypeId == 7">军官证</span>
            <span v-if="scope.row.documentTypeId == 8">内地居民往来港澳通行证</span>
          </template>
        </el-table-column>
        <el-table-column
          label="证件号"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.idCardNoPlaintext != null">{{ scope.row.idCardNoPlaintext }}</span>
            <span v-if="scope.row.fperManentResidentNum != null">{{ scope.row.fperManentResidentNum }}</span>
            <span v-if="scope.row.hkAndMacaoAndMTPsResidenceNum != null">{{ scope.row.hkAndMacaoAndMTPsResidenceNum }}</span>
            <span v-if="scope.row.hkAndMacaoPermitNum != null">{{ scope.row.hkAndMacaoPermitNum }}</span>
            <span v-if="scope.row.militaryOfficerNum != null">{{ scope.row.militaryOfficerNum }}</span>
            <span v-if="scope.row.mtpsNum != null">{{ scope.row.mtpsNum }}</span>
            <span v-if="scope.row.passportNum != null">{{ scope.row.passportNum }}</span> -->
            <span v-if="scope.row.curCertificateNo != null">{{ scope.row.curCertificateNo }}</span>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="noTableData">
            <p class="noTableData-desc">
              暂无数据
            </p>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addNewPatient()"
            >添加就诊人</el-button>
          </div>
        </template>
      </el-table>
      <!-- 分页器 -->
      <div
        class="health-content-pagination"
        style="margin-top: 15px"
      >
        <el-pagination
          background
          :current-page="allPatientPageIndex"
          :page-size="1"
          layout="prev, pager, next, jumper"
          :total="allPatientTotal"
          align="center"
          @current-change="handleCurrentChange"
        />
      </div>

    </div>
  </div>
</template>
<script>
import { getAllPatientList } from '@/api/doctor'
export default {
  name: 'AllPatients',
  props: {
    searchPatientData: Object // 传入需要搜索的数据
  },
  data() {
    return {
      allPatientList: [], // 所有就诊人集合
      allPatientLoading: false, // tableloading
      allPatientTotal: null, // 总页数
      allPatientPageSize: 20, // 每页个数
      allPatientPageIndex: 1, // 默认页
      opSearchPatientName: true, // 控制姓名搜索框
      searchPatientForm: {}, // 搜索的就诊人姓名
      allPatients: this.allPatientList,
      searchForm: [] // 就诊人搜索项
    }
  },
  created() {
    if (this.searchPatientData) {
      this.searchPatientForm.name = this.searchPatientData.name
      this.searchPatientForm.cardNo = this.searchPatientData.cardNo
      this.searchPatientForm.documentTypeId =
        this.searchPatientData.documentTypeId
      this.getAllPatientList(this.searchPatientForm)
    } else {
      this.getAllPatientList()
    }
  },
  methods: {
    // 获取所有就诊人数据
    getAllPatientList(params) {
      this.allPatientLoading = true
      getAllPatientList(params)
        .then((res) => {
          const { Data, Pages } = res
          this.allPatientList = Data.dataList
          this.searchForm = Data.searchForm
          this.allPatientTotal = Pages
          this.allPatientLoading = false
        })
        .catch(() => {
          this.allPatientLoading = false
        })
    },
    // 所有就诊人弹窗
    // 所有就诊人弹窗搜索
    searchPatientInfo(params) {
      this.allPatientPageIndex = 1
      const searchParams = {}
      if (params === undefined) {
        params = {}
      }
      for (let index = 0; index < this.searchForm.length; index++) {
        const element = this.searchForm[index]
        searchParams[element.name] = element.value
      }
      this.searchPatientForm = searchParams
      this.getAllPatientList(this.searchPatientForm)
    },
    // 重置搜索就诊人弹窗
    resetSearchPatientInfo() {
      this.searchPatientForm = {}
      this.getAllPatientList()
      this.allPatientPageIndex = 1
    },
    handleCurrentChange(val) {
      this.allPatientPageIndex = val
      const params = Object.assign(this.searchPatientForm, { page: val })
      this.getAllPatientList(params)
    },
    // 将选中的行返回出去
    patientChoose(row) {
      this.$emit('selectPatientData', row)
      this.$emit('closeDailog')
    },
    // 打开添加就诊人弹窗
    addNewPatient() {
      this.$emit('openAddPatientDailog')
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.allPatientBtns {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    font-size: 24px;
  }
}
.noTableData-desc {
  line-height: initial;
  margin-top: 15px;
}
.mb20 {
  margin-bottom: 20px;
}
</style>
