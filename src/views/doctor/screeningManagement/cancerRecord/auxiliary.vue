<template>
  <div
    v-loading="mainLoading"
    class="dashboard-container"
  >
    <!-- 搜索表单 -->
    <el-form
      ref="searchForm"
      :model="{ searchForm }"
      :inline="true"
      label-width="150px"
      :label-position="labelPosition"
    >
      <template v-for="(item,index) in searchForm">
        <el-form-item
          v-if="item.type == 4 || item.type == 3"
          :key="index"
          :label="item.title"
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
              :value="items.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="item.type == 5 && item.name == 'joinDate'"
          :key="index"
          :label="item.title"
        >
          <el-col>
            <!-- <el-date-picker
              v-model="item.value"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择开始日期"
              :style="'width:' + styleWidth"
            /> -->
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
        <!-- <el-form-item
          v-if="item.type == 5 && item.name == 'joinEndDate'"
          :key="item.index"
          :prop="item.name"
        >
          <el-col>
            <el-date-picker
              v-model="item.value"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择结束日期"
              :style="'width:' + styleWidth"
            />
          </el-col>
        </el-form-item> -->
        <el-form-item
          v-if="item.type == 1 && item.name == 'startAge'"
          :key="index"
          :label="item.title"
          :prop="'searchForm.' + index + '.value'"
          :rules="[
            {required:false},
            { trigger: 'blur', validator: validPositiveNumber },
            { trigger: 'blur', validator:validMinNumber3}
          ]"
        >
          <el-input
            v-model="item.value"
            placeholder="请填写开始年龄"
            :style="'width:' + styleWidth"
          />
        </el-form-item>
        <el-form-item
          v-if="item.type == 1 && item.name == 'endAge'"
          :key="index"
          :prop="'searchForm.' + index + '.value'"
          :rules="[
            {required:false},
            { trigger: 'blur', validator: validPositiveNumber },
            { trigger: 'blur', validator:validMaxNumber100}
          ]"
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
          :key="index"
          :label="item.title"
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
        @click="onSearchSubmit()"
      >查询</el-button>
      <el-button
        icon="el-icon-refresh-left"
        @click="restSearchForm"
      >重置</el-button>
    </div>
    <!-- 新增早筛患者 -->
    <!-- <div class="addNewPatient">
      <el-button
        class="opButton"
        type="primary"
        icon="el-icon-plus"
        v-if="isHaveCreateRole"
        @click="addNewPatient"
      >新建癌筛记录</el-button>
    </div> -->
    <!-- 早筛条目 -->
    <el-table
      ref="TableForm"
      v-loading="caseListLoading"
      :data="caseList"
      style="width: 100%"
      border
      :show-overflow-tooltip="true"
      :header-cell-style="getRowClass"
      @row-click="itemChoose"
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
          <i-cell
            :prop="col.prop"
            :row="scope.row"
            :row-index="(pageIndex-1)*pageSize+(scope.$index + 1)"
            @deleteCase="deleteCase"
            @changeItemState="changeItemState"
            @restart="restart"
            @susPend="susPend"
            @MyReport="MyReport"
            @docAdvice="docAdvice"
          />
        </template>
      </el-table-column>
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
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        :page-sizes="[20, 40, 60, 80]"
        layout="sizes, prev,pager,next,jumper"
        align="center"
        :page-count="pageCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 建议弹窗 -->
    <el-dialog
      v-loading="adviceLoading"
      :visible.sync="adviceShow"
      @close="resetAdviceForm"
    >
      <div class="editInfoBox advice">
        <h2>修改医师意见</h2>
        <div style="overflow: hidden">
          <el-form
            ref="adviceForm"
            :model="adviceInfoList"
            label-width="200px"
            class="demo-dynamic"
          >
            <div class="input-content">
              <div
                v-for="item in adviceInfoList.list"
                :key="item.name"
                class="input-content-items"
                :style="item.type == 'display' ? 'display:none' : ''"
              >
                <el-form-item
                  v-if="item.type == 'display'"
                  style="display: none"
                  :label="item.title"
                >
                  <el-input v-model="item.value" />
                </el-form-item>
                <el-form-item
                  v-if="item.type == 'text' || item.type == 'number'"
                  :label="item.title"
                >
                  <el-input
                    v-model="item.value"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    :autosize="{ minRows: 2, maxRows: 5}"
                    type="textarea"
                    rows="5"
                  />
                </el-form-item>
                <el-form-item
                  v-if="item.type == 'radio'"
                  :label="item.title"
                  :style="item.isdisplay ? 'display:none' : ''"
                >
                  <el-radio-group v-model="item.value">
                    <el-radio
                      v-for="itemChild in item.list"
                      :key="itemChild.name"
                      :label="Number(itemChild.id)"
                      :disabled="item.disabled"
                    >{{ itemChild.name }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div class="dialog-footer">
              <el-button
                type="primary"
                :loading="adviceButtonLoading"
                @click="postAdvice"
              >确 定</el-button>
              <el-button @click="resetAdviceForm">取 消</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <!-- 上下机弹窗 -->
    <el-dialog
      v-loading="restartLoading"
      :title="restartList.MsgTitle"
      :visible.sync="restartDailogShow"
    >
      <div class="editInfoBox">
        <div style="overflow: hidden">
          <el-form
            :model="restartContent"
            label-width="120px"
            class="demo-dynamic"
          >
            <div class="input-content">
              <div
                v-for="item in restartContent.dialogFormItems"
                :key="item.name"
                class="input-content-items"
                :style="item.type == 'display' ? 'display:none' : ''"
              >
                <el-form-item
                  v-if="item.type == 'display'"
                  style="display: none"
                  :label="item.title"
                >
                  <el-input v-model="item.value" />
                </el-form-item>
                <el-form-item
                  v-if="item.type == 'text' || item.type == 'number'"
                  :label="item.title"
                >
                  <el-input
                    v-model="item.value"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    rows="5"
                  />
                </el-form-item>
                <el-form-item
                  v-if="item.type == 'picker' && !item.isdisplay"
                  :label="item.title"
                  :rules="{
                    required: item.isMust,
                  }"
                >
                  <el-select
                    v-model="item.value"
                    :placeholder="item.placeholder"
                    :disabled="item.disabled"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(itemChild, idx) in item.list"
                      :key="idx"
                      :label="itemChild.name"
                      :value="Number(itemChild.id)"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="dialog-footer">
              <el-button
                type="primary"
                :loading="restartButtonLoading"
                @click="postRestart"
              >确 定</el-button>
              <el-button @click="restartDailogShow = false">取 消</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import iCell from '@/views/doctor/layout/components/iCell.vue'
import { validPositiveNumber } from '@/utils/validate'

import { Message, MessageBox } from 'element-ui'
import {
  creatPatientPost,
  getDocAdvice,
  postDocAdvice,
  restart, // 上机
  restartPost, // 上机提交
  susPend, // 下机
  changeState
} from '@/api/doctor'
import { getCaseJoinProtocolList } from '@/api/summary'
export default {
  name: 'Dashboard',

  components: {
    iCell
  },
  data() {
    return {
      cols: [
        // 列名集合
        { prop: '序号', label: '序号', width: '75px' },
        { prop: 'code', label: '测评编号', width: '100px' },
        { prop: 'patientName', label: '患者姓名', width: '100px' },
        {
          prop: 'patientAge',
          label: '年龄',
          width: '75px',
          sortable: 'custom'
        },
        { prop: 'patientGender', label: '性别', width: '75px' },
        { prop: 'followupProtocolName', label: '筛查方案', width: null },
        {
          prop: 'joinDate',
          label: '筛查时间',
          width: null,
          sortable: 'custom'
        },
        { prop: 'assessStateId', label: '测评状态', width: null },
        { prop: 'doctorName', label: '筛查医生', width: null },
        { prop: 'pcClientName', label: '绑定终端--测评密码', width: null },
        { prop: 'buttonList', label: '功能', width: '300px' }
      ],
      labelPosition: 'right',
      styleWidth: '160px',
      restartDailogShow: false, // 终端上下机弹窗开关
      restartLoading: true, // 终端上下机loading
      restartList: {
        MsgTitle: ''
      },
      restartContent: {
        dialogFormItems: []
      },
      restartsubmitData: {
        // 用于提交表单信息到后台
        // patientId: Number(this.$route.query.patientId),
        // operatTypeId: 1,
      },
      isHaveCreateRole: false, // 是否有新建权限
      restartButtonLoading: false,
      caseList: null, // 就诊人列表集合
      caseListLoading: true,
      pageIndex: 1, // 当前页码
      pageSize: 20, // 每页数据条数
      pageCount: null, // 总页数
      searchForm: null,
      dialogFormBox: {
        dialogForm: []
      }, // 弹窗内容
      mainLoading: false, // 全局loading
      formLabelWidth: '120px',
      submitData: {}, // 添加就诊人的返回数据
      adviceShow: false, // 建议弹窗show
      adviceLoading: false, // 建议弹窗loading
      adviceInfoList: {
        // 建议弹窗内容渲染
        list: null
      },
      adviceButtonLoading: false,
      urlObject: {}, // 路径传入参数
      sortTypeId: 0, // 默认排序方式 不排序
      sortName: '', // 默认排序列名称
      searchData: {},
      maxAge: null,
      minAge: null
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    // 判断路径里有没有patientId参数
    const urlObject = this.$route.query
    this.fetchData(urlObject)
  },
  methods: {
    // 跳转筛查明细
    // jumpTpSurvey(e) {
    //   this.$router.push({ name: "survey", params: { caseJoinProtocolId: e,patientId:e.patientId } });
    // },
    // 提交医生建议
    postAdvice() {
      this.adviceButtonLoading = true
      const param = {}
      const data = this.adviceInfoList.list
      for (let index = 0; index < data.length; index++) {
        const item = data[index]
        if (item.name === 'CaseJoinProtocolId') {
          param.CaseJoinProtocolId = data[index].value
        }
        if (item.name === 'Advice') {
          param.Advice = data[index].value
        }
      }
      postDocAdvice(param).then((response) => {
        this.adviceButtonLoading = false
        this.adviceLoading = false
        this.adviceShow = false
        this.fetchData()
      })
    },
    // 重置建议弹窗
    resetAdviceForm() {
      this.adviceShow = false
      this.adviceLoading = false
      this.adviceButtonLoading = false
      this.$refs.adviceForm.resetFields()
    },
    // 获取医生建议
    docAdvice(e) {
      const param = e
      this.adviceShow = true
      this.adviceLoading = true
      getDocAdvice(param).then((response) => {
        console.log(response.Data)
        this.adviceLoading = false
        this.adviceInfoList.list = response.Data
      })
    },
    // 评估报告 医生指摘跳转
    MyReport(e) {
      if (e.isFinish) {
        this.$router.push({
          name: 'survey',
          query: {
            caseJoinProtocolId: e.caseJoinProtocolId,
            patientId: e.patientId,
            clickTypeId: e.clickTypeId,
            isShowDoctorCensure: e.isShowDoctorCensure
          }
        })
      } else {
        MessageBox.confirm('您有未完成的问卷，是否继续填写?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push({
              name: 'survey',
              query: {
                caseJoinProtocolId: e.caseJoinProtocolId,
                patientId: e.patientId
              }
            })
          })
          .catch(() => {})
      }
    },
    // 上机
    restart(e) {
      console.log(e)
      this.restartList = e
      const param = { caseJoinProtocolId: this.restartList.caseJoinProtocolId }
      this.restartLoading = true
      restart(param).then((response) => {
        console.log(response)
        const { Data } = response
        this.restartLoading = false
        this.restartContent.dialogFormItems = Data
      })
      this.restartList.MsgTitle = '终端上机'
      this.restartDailogShow = true
    },
    // 上机提交
    postRestart(pram) {
      if (this.restartList.MsgTitle === '终端上机') {
        const data = this.restartContent.dialogFormItems
        for (let index = 0; index < data.length; index++) {
          const item = data[index]
          this.restartsubmitData[item.name] = item.value
        }
        this.restartsubmitData = Object.assign(this.restartsubmitData)
        const param = {
          caseJoinProtocolId: this.restartsubmitData.CaseJoinProtocolId,
          PcClientId: Number(this.restartsubmitData.PcClientId)
        }
        // console.log(param)
        restartPost(param).then((res) => {
          if (res.Code === 1) {
            Message({
              message: res.Msg,
              type: 'success',
              duration: 5 * 1000
            })
            this.restartDailogShow = false
            const params = { page: this.pageIndex }
            this.fetchData(params)
            this.$forceUpdate()
          } else {
            Message({
              message: res.Msg,
              type: 'warning',
              duration: 5 * 1000
            })
            this.restartDailogShow = false
            const params = { page: this.pageIndex }
            this.fetchData(params)
            this.$forceUpdate()
          }
        })
      } else {
        const param = {
          caseJoinProtocolId: this.restartList.caseJoinProtocolId
        }
        susPend(param).then((res) => {
          if (res.Code === 1) {
            Message({
              message: res.Msg,
              type: 'success',
              duration: 5 * 1000
            })
            this.restartDailogShow = false
            const params = { page: this.pageIndex }
            this.fetchData(params)
            this.$forceUpdate()
          } else {
            Message({
              message: res.Msg,
              type: 'warning',
              duration: 5 * 1000
            })
            this.restartDailogShow = false
            const params = { page: this.pageIndex }
            this.fetchData(params)
            this.$forceUpdate()
          }
        })
      }
    },
    // 下机
    susPend(e) {
      // console.log(e)
      this.restartList = e
      const param = { caseJoinProtocolId: this.restartList.caseJoinProtocolId }
      this.restartLoading = true
      restart(param).then((response) => {
        // console.log(response)
        const { Data } = response
        for (let index = 0; index < Data.length; index++) {
          const iten = Data[index]
          if (iten.name === 'PcClientId') {
            // 下机时终端为不可点击
            iten.disabled = true
          }
        }
        this.restartLoading = false
        this.restartContent.dialogFormItems = Data
      })
      this.restartList.MsgTitle = '终端下机'
      this.restartDailogShow = true
    },
    // 组件删除事件
    deleteCase(e) {
      const params = { page: this.pageIndex }
      this.fetchData(params)
      this.$forceUpdate()
    },
    // 组件变更状态
    changeItemState(e) {
      const that = this
      const params = { CaseJoinProtocolId: e.CaseJoinProtocolId }
      let tips = null
      let btnText = null
      if (e.type === '2') {
        tips = '公开报告后患者可查看报告，您确定公开报告吗？'
        btnText = '确定'
      } else {
        tips = '关闭报告后患者不能查看报告，您确定关闭报告吗？'
        btnText = '关闭'
      }
      MessageBox.confirm(tips, '修改报告状态', {
        confirmButtonText: btnText,
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          that.loading = true
          changeState(params).then((response) => {
            if (response.Code === 1) {
              new Promise((resolve) => {
                that.fetchData()
              })
            }
            that.loading = false
          })
        })
        .catch(() => {
          that.loading = false
        })
      // changeState(params).then((response) => {
      //   if(response.Code == 1){
      //     new Promise(resolve => {
      //       that.fetchData();
      //     });
      //   }
      //   that.loading = false;
      // });
    },
    // 条目选中
    itemChoose(row) {
      // console.log(row);
    },
    // 跳转新增就诊人
    addNewPatient() {
      this.$router.push({
        name: 'addScreeningPatient',
        query: {
          operatTypeId: 1
        }
      })
    },
    // 新建就诊人
    createPatient(operatType) {
      console.log(this.dialogFormBox.dialogForm)
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const data = this.dialogFormBox.dialogForm
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
          }
          if (this.idCardNoPlaintext != null) {
            this.submitData.IdCardNo = this.idCardNoPlaintext
          }
          this.submitData = Object.assign(this.submitData, operatType)
          creatPatientPost(this.submitData).then((response) => {
            // 添加完毕后刷新数据
            this.fetchData()
          })
          this.dialogShow = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取就诊人集合 获取页码  //获取搜索条件
    fetchData(params) {
      this.caseListLoading = true
      // 如果路径参数有值，需要获取时拼接
      if (params) {
        params = Object.assign(
          params,
          {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            pageSize: this.pageSize,
            page: this.pageIndex
          },
          this.searchData
        )
      }
      params = Object.assign(params || {}, { proTypeId: '1' })
      getCaseJoinProtocolList(params)
        .then((response) => {
          this.caseList = response.Data.dataList
          this.searchForm = response.Data.searchForm
          this.isHaveCreateRole = response.Data.isHaveCreateRole
          this.pageCount = response.Pages
          this.caseListLoading = false
          // 将params中的开始和结束日期回显到value中 防止查询过后value为空
          for (let index = 0; index < this.searchForm.length; index++) {
            const element = this.searchForm[index]
            if (element.name === 'joinDate') {
              if (params === undefined) {
                params = {}
              } else {
                element.value = [
                  String(params.joinDate),
                  String(params.joinEndDate)
                ]
              }
            }
          }
        })
        .catch((error) => {
          console.log(error)
          this.caseListLoading = false
        })
    },
    // 表格排序
    onSortChange(column) {
      if (column) {
        console.log('排序', column.prop, column.order)
        // 正序 1
        if (column.order === 'ascending') {
          this.sortTypeId = 1
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName
          }
          this.pageIndex = 1
          this.fetchData(params)
        }
        // 不排序 0
        if (column.order == null) {
          this.sortTypeId = 0
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName
          }
          this.pageIndex = 1
          this.fetchData(params)
        }
        // 倒序 2
        if (column.order === 'descending') {
          this.sortTypeId = 2
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName
          }
          this.pageIndex = 1
          this.fetchData(params)
        }
      } else {
        // 清空排序条件，数据会恢复成未排序的状态
        this.$refs.TableForm.clearSort()
        this.sortTypeId = 0
        this.sortName = ''
      }
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    resetForm() {
      // 重置编辑弹窗
      this.editShow = false
      this.editLoading = false
      this.mainLoading = false
    },
    // 条件搜索事件
    onSearchSubmit(params) {
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          this.pageIndex = 1
          const searchParams = {}
          if (params === undefined) {
            params = {}
          }
          for (let index = 0; index < this.searchForm.length; index++) {
            const item = this.searchForm[index]
            // 处理开始和结束日期
            if (item.name === 'joinDate') {
              for (let j = 0; j < item.value.length; j++) {
                searchParams['joinDate'] = item.value[0]
                searchParams['joinEndDate'] = item.value[1]
              }
            } else if (item.name !== 'joinEndDate') {
              searchParams[item.name] = item.value
            }
          }
          this.searchData = searchParams
          params = Object.assign(params, searchParams)
          this.fetchData(params)
        } else {
          return false
        }
      })
    },
    // 给最大年龄和最小年龄添加默认值

    // 重置条件搜索框
    restSearchForm() {
      this.$refs.searchForm.resetFields()
      this.pageIndex = 1
      this.pageSize = 20
      this.onSortChange()
      this.fetchData()
      this.searchData = {}
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      const params = { pageSize: val }
      this.caseListLoading = true
      this.fetchData(params)
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.pageIndex = val
      const params = { page: val }
      this.caseListLoading = true
      this.fetchData(params)
    },
    // 自定义校验规则：正整数
    validPositiveNumber(rule, value, callback) {
      if (value === '') {
        return callback()
      } else if (!validPositiveNumber(value)) {
        return callback(new Error('请输入正确的年龄'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:整数大与3
    validMinNumber3(rule, value, callback) {
      if (value === '') {
        return callback()
      } else if (value < 3 || value > 100) {
        return callback(new Error('开始年龄需大与3小于100'))
      } else {
        this.minAge = value
        if (this.maxAge != null && Number(this.minAge) > Number(this.maxAge)) {
          return callback(new Error('开始年龄需小与结束年龄'))
        } else {
          return callback()
        }
      }
    },
    // 自定义校验规则:整数小与100
    validMaxNumber100(rule, value, callback) {
      if (value === '') {
        return callback()
      } else if (value < 3 || value > 100) {
        return callback(new Error('结束年龄需小与100大与3'))
      } else {
        this.maxAge = value
        if (this.minAge != null && Number(this.minAge) > Number(value)) {
          return callback(new Error('结束年龄需大与开始年龄'))
        } else {
          return callback()
        }
      }
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
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.el-table__body tr:hover > td {
  background: #1b223e !important;
}
.primaryBtn {
  display: flex;
  justify-content: center;
  padding: 0 0 30px 60px;
}
.addNewPatient {
  margin: 0 auto;
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
.dialog-footer {
  text-align: center;
  margin-top: 22px;
}
.el-input {
  /*width: 300px;margin-left: 20px;*/
  padding: 0;
}
.allPatientBtns {
  display: flex;
  justify-content: center;
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
.editInfoBox {
  text-align: center;
  h2 {
    margin-bottom: 30px;
  }
  .input-content {
    display: flex;
    flex-wrap: wrap;
    &-items {
      width: 50%;
      padding: 0px 43px;
      label {
        text-align: left;
      }
      input,
      .el-select {
        width: 100%;
      }
    }
  }
}
.editInfoBox.advice {
  .input-content {
    flex-direction: column;
    align-items: center;
    &-items {
      width: 70%;
      /* padding: 0px 43px;*/
      label {
        text-align: left;
      }
      input,
      .el-select {
        width: 100%;
      }
      div {
        text-align: left;
      }
    }
  }
}
</style>
