<template>
  <div class="Records">
    <!-- 搜索表单 -->
    <el-form
      ref="searchForm"
      :model="searchForm"
      label-width="80px"
      class="searchFormBody"
      :inline="true"
    >
      <div>
        <el-form-item
          label="患者姓名"
          prop="patientName"
        >
          <el-input
            v-model="searchForm.patientName"
            placeholder="请输入要查询的患者姓名"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="onSearchSubmit"
          >查询</el-button>
          <el-button
            icon="el-icon-refresh-left"
            @click="restSearchForm"
          >重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!-- 添加个案患者 -->
    <!-- <div class="addNewPatient">
      <el-button
        class="opButton"
        type="primary"
        icon="el-icon-plus"
        @click="creatNewPatient"
      >添加个案患者</el-button>
    </div> -->
    <!-- 添加个案患者弹窗 -->
    <el-dialog
      v-loading="editLoading"
      title="添加个案患者"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="creatPatientForm"
        :model="creatPatientForm"
      >
        <div
          v-for="(item, index) in creatPatientForm.dialogFormItems"
          :key="item.index"
        >
          <el-form-item
            v-if="item.type == 'text'"
            :label-width="formLabelWidth"
            :label="item.title"
            :prop="'dialogFormItems.' + index + '.value'"
            :rules="[
              { required: item.isMust, message: item.title + '不能为空' },
            ]"
          >
            <el-input
              v-model="item.value"
              autocomplete="off"
              :name="item.name"
              :placeholder="item.placeholder"
              class="case-el-input"
            />
            <el-button
              v-if="item.name == 'PatientName'"
              type="primary"
              style="margin-left: 15px"
              icon="el-icon-search"
              @click="openAddPatientModal"
            />
          </el-form-item>
          <el-form-item
            v-if="item.type == 'idcard'"
            :label-width="formLabelWidth"
            :label="item.title"
            :prop="'dialogFormItems.' + index + '.value'"
            :rules="[
              { required: item.isMust, message: item.title + '不能为空' },
              { trigger: 'blur', validator: validIdCardNumberData },
            ]"
          >
            <el-input
              v-model="item.value"
              autocomplete="off"
              :name="item.name"
              :placeholder="item.placeholder"
            />
          </el-form-item>
          <el-form-item
            v-if="item.type == 'phone'"
            :label-width="formLabelWidth"
            :label="item.title"
            :prop="'dialogFormItems.' + index + '.value'"
            :rules="[
              { required: item.isMust, message: item.title + '不能为空' },
              { trigger: 'blur', validator: validMobileNumberData },
            ]"
          >
            <el-input
              v-model="item.value"
              autocomplete="off"
              :name="item.name"
              :placeholder="item.placeholder"
            />
          </el-form-item>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button
          type="submit"
          @click="formSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 就诊人弹窗 -->
    <el-dialog
      v-loading="allPatientLoading"
      :visible.sync="dialogShow"
      @close="resetForm"
    >
      <div
        class="allPatient"
        style="text-align: center"
      >
        <div class="allPatientBtns">
          <span class="mb20">选择患者</span>
          <div
            v-show="opSearchPatientName"
            class="mb20"
          >
            <el-input
              v-model="searchPatientName"
              placeholder="请输入要查询的就诊人姓名"
            />
            <el-button
              icon="el-icon-search"
              circle
              @click="searchPatientInfo"
            />
          </div>
        </div>
        <!-- 所有就诊人条目 -->
        <div class="">
          <el-table
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
              prop="patientName"
              label="姓名"
              align="center"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="idCardNo"
              label="身份证号"
              align="center"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="mobileNumber"
              label="联系方式"
              align="center"
              :show-overflow-tooltip="true"
            />
            <template slot="empty">
              <div class="noTableData">
                暂无数据
                <!--，或点击 <span @click="getMakeList(1)">“刷新”</span>-->
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
              layout="prev, pager, next ,jumper"
              align="center"
              :total="allPatientTotal"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 个案患者列表 -->
    <el-table
      ref="TableForm"
      v-loading="tableLoading"
      :data="tableData"
      style="width: 100%"
      :header-cell-style="getRowClass"
      border
      class="ggg"
      @sort-change="onSortChange"
    >
      <el-table-column
        label="序号"
        width="75px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ (PageIndexPatient-1)*pageSize+(scope.$index + 1) }} </span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-popover v-if="scope.row.isShowGuardianInfo" trigger="hover" placement="top">
            <p>监护人姓名: <span class="guardianInfo-span">{{ scope.row.guardianName }}</span></p>
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
        width="150"
        align="center"
      />
      <el-table-column
        prop="age"
        label="年龄"
        width="150"
        align="center"
        sortable="custom"
      />
      <el-table-column
        prop="patientIdCardNo"
        label="身份证号"
        width="200"
        align="center"
      />
      <el-table-column
        prop="mobileNumber"
        label="联系电话"
        width="200"
        align="center"
      />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
      >
        <!-- <template slot-scope="{ row }">
          <el-button
            v-for="n in row.buttonList"
            :key="n.index"
            @click="operations(n.clickTypeId, row.patientId)"
          >{{ n.title }}</el-button>
        </template> -->
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div
      class="health-content-pagination"
      style="margin-top: 15px"
    >
      <el-pagination
        background
        :current-page="PageIndexPatient"
        :page-count="total"
        :page-size="pageSize"
        :page-sizes="[20, 40, 60, 80]"
        layout="sizes, prev,pager,next,jumper"
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChangePatient"
      />
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import {
  GetPatientList, // 获取患者集合
  CreatePatientGet, // 新建患者
  CreatePatientPost, // 提交患者
  RemovePatientPost // 移除患者
} from '@/api/records'
import { getAllPatientList } from '@/api/doctor'
import {
  validIdCardNumber, // 验证身份证规则
  validMobileNumber // 验证手机号规则
} from '@/utils/validate'
import { Message, MessageBox } from 'element-ui'
export default {
  components: {},
  data() {
    return {
      loading: true, // 全局loading
      dialogFormVisible: false, // 弹窗默认关闭
      dialogShow: false, // 添加患者弹窗开关
      editLoading: false, // 添加患者loading
      allPatientLoading: false, // 所有就诊人loading
      tableLoading: true,
      allPatientList: null, // 所有就诊人集合
      opSearchPatientName: false, // 控制姓名搜索框
      searchPatientName: null, // 搜索的就诊人姓名
      allPatientTotal: null, // 搜索页码总条目数
      allPatientPageIndex: 1, // 搜索页码当前页数
      pageSize: 20,
      allPatientPageSize: null, // 搜索页码每页显示条目个数
      creatPatientForm: {
        dialogFormItems: [] // 新建患者集合
      },
      submitData: {}, // 用于提交表单信息到后台
      formLabelWidth: '120px',
      tableData: [], // 就诊人集合
      errorMsg: [], // 报错信息
      total: null, // 就诊人总页数
      searchForm: {
        // 搜索信息
        patientName: null // 姓名
      },
      PageIndexPatient: 1, // 就诊人当前页数
      searchName: null, // 搜索的患者姓名
      sortTypeId: 0, // 默认排序方式 不排序
      sortName: '', // 默认排序列名称
      searchData: {}
    }
  },
  created() {
    this.getUserToken()
  },
  methods: {
    getUserToken() {
      const hasToken = getToken('userToken')
      if (hasToken) {
        this.getData()
      } else {
        // 做进一步处理
        return false
      }
    },
    // 获取患者集合
    getData(param) {
      if (param) {
        param = Object.assign(
          param,
          {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            pageSize: this.pageSize,
            page: this.PageIndexPatient
          },
          this.searchData
        )
      }
      GetPatientList(param).then((response) => {
        const { Data, Pages } = response
        if (Data.length === 0) {
          Message({
            message: '当前无患者',
            type: 'warning',
            duration: 5 * 1000
          })
          this.tableData = Data
          this.tableLoading = false
        } else {
          this.tableData = Data
          this.tableLoading = false
          this.total = Pages
        }
      })
    },
    // 添加个案患者
    creatNewPatient() {
      this.dialogFormVisible = true // 打开弹窗
      this.editLoading = true
      CreatePatientGet().then((response) => {
        const { Data } = response
        this.creatPatientForm.dialogFormItems = Data
        this.editLoading = false
      })
    },
    // 提交新建患者
    formSubmit() {
      this.$refs.creatPatientForm.validate((valid) => {
        if (valid) {
          const data = this.creatPatientForm.dialogFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
          }
          this.submitData = Object.assign(this.submitData)
          CreatePatientPost(this.submitData).then((response) => {
            const { Msg, Code } = response
            if (Code === 1) {
              this.tableLoading = false
              this.dialogFormVisible = false
              this.$refs.creatPatientForm.resetFields()
              // 添加完毕后刷新数据
              this.getData()
              this.PageIndexPatient = 1
              Message({
                message: Msg || '添加成功',
                type: 'success',
                duration: 5 * 1000
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭新建患者弹窗事件
    closeDialog() {
      this.dialogFormVisible = false
      this.$refs.creatPatientForm.resetFields()
    },
    handleClose(done) {
      this.dialogFormVisible = false
      this.$refs.creatPatientForm.resetFields()
    },
    // 自定义校验规则:手机号
    validMobileNumberData(rule, value, callback) {
      if (!validMobileNumber(value)) {
        return callback(new Error('请输入正确的手机号'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:身份证号
    validIdCardNumberData(rule, value, callback) {
      if (!validIdCardNumber(value)) {
        return callback(new Error('请输入正确的身份证号'))
      } else {
        return callback()
      }
    },
    // 表格按钮事件
    operations(clickTypeId, patientId) {
      // clickTypeId1:移除,12:住院记录,77:个案详情,65:癌筛记录，66：体检记录，70:随访记录
      console.log(clickTypeId)
      if (clickTypeId === 1) {
        this.delPartient(patientId)
      } else if (clickTypeId === 12) {
        this.$router.push({
          path: '/doctor/caseManagement/recordList',
          query: { patientId: patientId }
        })
      } else if (clickTypeId === 65) {
        this.$router.push({
          path: '/doctor/screeningManagement/cancerRecord',
          query: { patientId: patientId }
        })
      } else if (clickTypeId === 66) {
        this.$router.push({
          path: '/doctor/screeningManagement/peOrders',
          query: { patientId: patientId }
        })
      } else if (clickTypeId === 70) {
        this.$router.push({
          path: '/doctor/followVisit/caseJoinFollowVisit',
          query: { patientId: patientId }
        })
      } else if (clickTypeId === 77) {
        this.$router.push({
          path: '/doctor/caseManagement/patientDetail',
          query: { patientId: patientId }
        })
      }
    },
    // 移除个案患者
    delPartient(patientId) {
      MessageBox.confirm(
        '确定移除患者？移除后将无法恢复，需重新添加',
        '确认移除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          RemovePatientPost({ PatientId: patientId }).then((response) => {
            this.tableLoading = true
            const { Msg } = response
            Message({
              message: Msg || '错误',
              type: 'success'
            })
            this.PageIndexPatient = 1
            this.tableLoading = false
            this.getData()
          })
        })
        .catch(() => {
          Message({
            message: '已取消移除',
            type: 'info'
          })
        })
    },
    // 根据姓名搜索就诊人
    searchPatientInfo() {
      this.allPatientLoading = true
      const data = { name: this.searchPatientName }
      getAllPatientList(data).then((response) => {
        this.allPatientList = response.Data
        this.allPatientLoading = false
        this.allPatientTotal = response.Pages
      })
    },
    // 表格排序
    onSortChange(column) {
      if (column) {
        // 正序 1
        if (column.order === 'ascending') {
          this.sortTypeId = 1
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName
          }
          this.PageIndexPatient = 1
          this.getData(params)
        }
        // 不排序 0
        if (column.order == null) {
          this.sortTypeId = 0
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName
          }
          this.PageIndexPatient = 1
          this.getData(params)
        }
        // 倒序 2
        if (column.order === 'descending') {
          this.sortTypeId = 2
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName
          }
          this.PageIndexPatient = 1
          this.getData(params)
        }
      } else {
        // 清空排序条件，数据会恢复成未排序的状态
        this.$refs.TableForm.clearSort()
        this.sortTypeId = 0
        this.sortName = ''
      }
    },
    // 条件搜索事件
    onSearchSubmit(params) {
      this.tableLoading = true
      const searchParams = {}
      if (this.searchForm.patientName != null) {
        searchParams.patientName = this.searchForm.patientName
      }
      this.searchData = searchParams
      params = Object.assign(params, searchParams)
      this.getData(params)
    },
    // 重置条件搜索框
    restSearchForm() {
      this.tableLoading = true
      this.$refs.searchForm.resetFields()
      this.getData()
      this.onSortChange()
      this.PageIndexPatient = 1
      this.pageSize = 20
      this.tableLoading = false
    },
    // 新增患者搜索弹窗
    openAddPatientModal() {
      this.dialogShow = true
      this.allPatientLoading = true
      getAllPatientList().then((response) => {
        this.allPatientList = response.Data
        this.allPatientLoading = false
        this.opSearchPatientName = true
        this.allPatientTotal = response.Pages
      })
      this.allPatientPageIndex = 1
    },
    // 将所选患者信息反填回去
    patientChoose(row) {
      const data = this.creatPatientForm.dialogFormItems
      for (let index = 0; index < data.length; index++) {
        const item = data[index]
        console.log(item)
        console.log('ROW为', row)
        if (item.name === 'PatientName') {
          data[index].value = row.patientName
        }
        if (item.name === 'PatientId') {
          data[index].value = row.patientId
        }
        if (item.name === 'IdCardNo') {
          data[index].value = row.idCardNoPlaintext
        }
        if (item.name === 'MobileNumber') {
          data[index].value = row.mobileNumber
        }
      }
      this.resetForm()
    },
    resetForm() {
      // 重置新增患者弹窗
      this.allPatientList = null
      this.dialogShow = false
      this.searchPatientName = null
      this.opSearchPatientName = false
    },

    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.allPatientLoading = true
      // console.log(`当前页: ${val}`);
      this.allPatientPageIndex = val
      const params = { page: val }
      getAllPatientList(params).then((response) => {
        this.allPatientList = response.Data
        this.allPatientLoading = false
      })
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      this.PageIndexPatient = 1
      const params = { pageSize: val }
      this.getData(params)
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChangePatient(val) {
      this.tableLoading = true
      this.PageIndexPatient = val
      const params = { page: val }
      this.getData(params)
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
<style lang="scss" scope>
@import '~@/styles/variables.scss';
.searchFormBody {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.case-el-input {
  width: 91%;
}
.Records {
  padding: 30px;
  .addNewPatient {
    .opButton {
      float: right;
      margin-bottom: 22px;
    }
  }
  .addNewPatient {
    .el-form-item {
      /*display: flex;*/
      label {
        width: 94px;
      }
      div {
        width: calc(100% - 120px);
      }
    }
    .idCard {
      margin-bottom: 0;
    }
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
  .allPatientBtns > div {
    width: 300px;
    margin-left: 20px;
    position: relative;
    .el-button {
      position: absolute;
      right: 1px;
      top: 1px;
      border: none;
    }
  }
  // .el-form-item__content {
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  // }
}
.mb20 {
  margin-bottom: 20px;
}
.icon-minority{
    color: $bg;
    font-size: 20px;
  }
  .guardianInfo-span{
    color: $bg;
    margin-left: 10px;
}
</style>
