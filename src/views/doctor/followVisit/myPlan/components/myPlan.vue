<template>
  <div>
    <div
      class="searchBox"
      v-if="searchForm!=null"
    >
      <!-- 搜索表单 -->
      <search-form
        :searchForm="searchForm"
        :labelPosition="labelPosition"
        :styleWidth="styleWidth"
        :labelWidth="labelWidth"
        :params="params"
        @getData="getData"
        @GetSearchData="GetSearchData"
        @restSearchForm="restSearchForm"
      >
      </search-form>
    </div>
    <div class="table_warpper">
      <div class="table_con">
        <!-- 新增随访 -->
        <div class="addNewPlan">
          <div>
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col :span="10">
                <el-row>
                  <el-col
                    v-for="(item,index) in checklist"
                    :key="item.index"
                    :span="5"
                  >
                    <div
                      :class="item.stateId == currentIdx ? 'check checkBtn' : 'checkBtn'"
                      @click="siteIdChange(item.stateId)"
                    >{{ item.name }}({{ item.num }})</div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 随访列表 -->
        <div class="table_info">
          <el-table
            ref="taskPoolTable"
            v-loading="taskListLoading"
            :data="taskPoolList"
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
                <i-cell
                  :prop="col.prop"
                  :row="scope.row"
                  :rowIndex="(pageIndex-1)*pageSize+(scope.$index + 1)"
                  @terminationTask="terminationTask"
                  @sendBackTask="sendBackTask"
                  @createCase="createCase"
                  @repeatTask="repeatTask"
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
            class="health-content-pagination"
            style="margin-top: 15px"
            v-if="pageCount!=null"
          >
            <el-pagination
              background
              :current-page="pageIndex"
              :page-size="pageSize"
              :page-sizes="[20, 40, 60, 80]"
              layout="sizes, prev,pager,next,jumper"
              :page-count="pageCount"
              align="center"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
        <el-dialog
          ref="DialogTermination"
          title="任务作废"
          :visible.sync="DialogTermination"
          width="30%"
          :before-close="handleClose"
        >
          <el-form
            ref="cancelReasonFrom"
            :model="cancelReasonFrom"
          >
            <div class="input-content">
              <div
                v-for="(item, index) in cancelReasonFrom.cancelReasonItems"
                :key="item.index"
                class="input-content-item itemW"
                :style="item.type == null || item.isdisplay ? 'display:none' : ''"
              >
                <el-form-item
                  v-if="item.type == 'text'"
                  :label-width="formLabelWidth"
                  :label="item.title"
                  :prop="'cancelReasonItems.' + index + '.value'"
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
                </el-form-item>
              </div>
            </div>
          </el-form>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="DialogTermination = false">取消作废</el-button>
            <el-button
              type="primary"
              :before-close="handleClose"
              @click="terminationSure"
            >确定作废</el-button>
          </span>
        </el-dialog>

        <!-- 随访方案中任务编辑弹窗 -->
        <el-dialog
          v-loading="createCaseLoading"
          :title="createCaseDialogTitle"
          :visible.sync="createCaseFormVisible"
          :before-close="handleClose"
          width="40%"
        >
          <addplan-form
            ref="createCaseForm"
            :create-form="createCaseForm"
            :operat-type-id="operatTypeId"
            @postAddFollowVistTask="postAddFollowVistTask"
          />
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="createCaseFormVisible =false">取 消</el-button>
            <el-button
              type="primary"
              @click="createCaseFormSubmit()"
            >确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import iCell from '@/views/doctor/layout/components/iCell.vue'
import AddplanForm from '@/views/doctor/followVisit/caseJoinFollowVisit/components/AddplanForm.vue'
import SearchForm from '@/views/doctor/layout/components/SearchFrom.vue'
import {
  terminationCaseFollowVisitDetailGet,
  terminationCaseFollowVisitDetail,
  sendBackTask,
  createCaseFollowVisitTaskDetailGet,
  createCaseFollowVisitTaskDetailPost,
  repeatCaseTaskDetailRemind,
} from '@/api/followVisits'
import { Message, MessageBox } from 'element-ui'
export default {
  props: {
    searchForm: Array,
    checklist: Array,
    taskPoolList: Array,
    pageCount: Number,
    cols: Array,
  },
  components: {
    iCell,
    AddplanForm,
    SearchForm,
  },
  data() {
    return {
      // 随访状态筛选
      currentIdx: 1,
      pageIndex: 1, // 当前页码
      pageSize: 20, // 每页数据条数
      sortTypeId: 0, //默认排序方式 不排序
      sortName: '', //默认排序列名称
      params: {},
      formLabelWidth: '140px',
      DialogTermination: false, // 任务作废弹窗
      cancelReasonFrom: {
        cancelReasonItems: [],
      },
      terminationTaskId: null, // 用于废除任务id
      submitData: {},
      createCaseLoading: true,
      createCaseDialogTitle: '',
      operatTypeId: 1,
      createCaseFormVisible: false,
      createCaseForm: [], // 新建随访方案集合
      stateId: 1,
      taskListLoading: false,
      labelPosition: 'right',
      // searchData: {},
      styleWidth: '204px',
      labelWidth: '100px',
    }
  },
  methods: {
    handleClose(done) {
      done()
    },
    getData(params) {
      this.$emit('getData', params)
    },
    GetSearchData(searchData) {
      this.$emit('GetSearchData', searchData)
    },
    // 重置条件搜索框
    restSearchForm() {
      const parmas = Object.assign({
        stateId: 1,
        sortTypeId: 0,
        sortName: null,
        pageSize: 20,
        page: 1,
      })
      this.$emit('getData')
      this.stateId = 1
      this.currentIdx = 1
      this.pageSize = 20
      this.onSortChange()
    },
    // 根据随访状态切换数据
    siteIdChange(stateId) {
      // this.taskListLoading = true
      this.currentIdx = stateId
      this.pageIndex = 1
      this.pageSize = 20
      const params = { stateId: stateId }
      this.stateId = params.stateId
      this.params = {
        sortTypeId: this.sortTypeId,
        sortName: this.sortName,
        pageIndex: 1,
        pageSize: this.pageSize,
        stateId: stateId,
      }
      this.$emit('getData', this.params)
    },
    // 重新发送任务提醒
    repeatTask(caseId) {
      const param = caseId
      this.taskListLoading = true
      MessageBox.confirm('您是否要重新发送任务提醒?', '重新发送任务提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        repeatCaseTaskDetailRemind(param)
          .then((res) => {
            Message({
              message: '重新发送任务提醒成功！',
              type: 'success',
              duration: 5 * 1000,
            })
            this.$emit('getData')
          })
          .catch((err) => {
            Message({
              message: '重新发送任务提醒失败！',
              type: 'error',
              duration: 5 * 1000,
            })
            this.taskListLoading = false
            return err
          })
      })
      this.taskListLoading = false
    },
    // 任务作废
    terminationTask(caseId) {
      this.terminationTaskId = caseId.caseFollowVisitTaskDetailId
      // 先获取作废原因
      terminationCaseFollowVisitDetailGet({
        caseFollowVisitTaskDetailId: this.terminationTaskId,
      })
        .then((res) => {
          const { Data } = res
          this.cancelReasonFrom.cancelReasonItems = Data
          this.DialogTermination = true
          console.log(res)
        })
        .catch((err) => {
          Message({
            message: err.Data.errorMsg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
    },
    // 任务作废提交
    terminationSure() {
      this.$refs.cancelReasonFrom.validate((valid) => {
        if (valid) {
          const data = this.cancelReasonFrom.cancelReasonItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
          }
          this.$confirm('确认作废？').then((termi) => {
            terminationCaseFollowVisitDetail(this.submitData)
              .then((res) => {
                if (res.Code === 1) {
                  this.DialogTermination = false
                  Message({
                    message: '作废成功！',
                    type: 'success',
                    duration: 5 * 1000,
                  })
                  this.$emit('getData')
                }
              })
              .catch((err) => {
                Message({
                  message: err.Data.errorMsg,
                  type: 'error',
                  duration: 5 * 1000,
                })
              })
          })
          this.taskListLoading = false
        }
      })
    },
    // 任务退回
    sendBackTask(caseId) {
      const param = caseId
      this.taskListLoading = true
      MessageBox.confirm('您是否要退回当前任务  ?', '任务退回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        sendBackTask(param)
          .then((res) => {
            Message({
              message: '退回成功！',
              type: 'success',
              duration: 5 * 1000,
            })
            this.$emit('getData')
          })
          .catch((err) => {
            Message({
              message: '退回失败！',
              type: 'error',
              duration: 5 * 1000,
            })
            this.taskListLoading = false
            return err
          })
      })
      this.taskListLoading = false
    },
    // 任务编辑
    createCase(params) {
      this.createCaseLoading = true
      this.createCaseDialogTitle = '任务编辑'
      this.operatTypeId = params.operatTypeId
      createCaseFollowVisitTaskDetailGet(params)
        .then((res) => {
          this.createCaseFormVisible = true // 打开弹窗
          const { Data } = res
          this.createCaseForm = Data
          this.createCaseLoading = false
        })
        .catch((err) => {
          Message({
            message: err.Data.errorMsg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
    },
    postAddFollowVistTask(params) {
      createCaseFollowVisitTaskDetailPost(params)
        .then((res) => {
          const { Code } = res
          if (Code === 1) {
            // 操作之后刷新子table数据
            if (this.operatTypeId === 3) {
              Message({
                message: '任务修改成功！',
                type: 'success',
                duration: 5 * 1000,
              })
            } else {
              Message({
                message: '任务添加成功！',
                type: 'success',
                duration: 5 * 1000,
              })
            }
            this.$emit('getData')
            this.createCaseFormVisible = false
          }
        })
        .catch((err) => {
          Message({
            message: err.Data.errorMsg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
    },
    // 新建编辑题目明细提交
    createCaseFormSubmit() {
      this.$refs.createCaseForm.getFormData()
    },
    //表格排序
    onSortChange(column) {
      if (column) {
        //正序 1
        if (column.order == 'ascending') {
          this.sortTypeId = 1
          this.sortName = column.prop
          this.params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            page: 1,
            pageSize: this.pageSize,
            stateId: this.stateId,
          }
          this.pageIndex = 1
          this.$emit('getData', this.params)
        }
        //不排序 0
        if (column.order == null) {
          this.sortTypeId = 0
          this.sortName = column.prop
          this.params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            page: 1,
            pageSize: this.pageSize,
            stateId: this.stateId,
          }
          this.pageIndex = 1
          this.$emit('getData', this.params)
        }
        //倒序 2
        if (column.order == 'descending') {
          this.sortTypeId = 2
          this.sortName = column.prop
          this.params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            page: 1,
            pageSize: this.pageSize,
            stateId: this.stateId,
          }
          this.pageIndex = 1
          this.$emit('getData', this.params)
        }
      } else {
        //清空排序条件，数据会恢复成未排序的状态
        this.$refs.taskPoolTable.clearSort()
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
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.params.stateId = this.stateId
      this.params.page = 1
      const parmas = Object.assign(this.params, { pageSize: val })
      this.$emit('getData', parmas)
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.pageIndex = val
      this.params.stateId = this.stateId
      this.params.pageSize = this.pageSize
      const parmas = Object.assign(this.params, { page: val })
      this.$emit('getData', parmas)
    },
  },
}
</script>

<style lang="scss" scoped>
.el-button.is-round {
  width: 108px;
}
.table_warpper {
  background: #ecf1f5;
  padding: 20px;
  box-sizing: border-box;
}
.table_con {
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(169, 169, 169, 0.08);
  border-radius: 5px;
}
.addNewPlan {
  border-bottom: 1px solid #efefef;
  line-height: 60px;
}
.table_info {
  padding: 20px 30px;
  box-sizing: border-box;
}
.input-content {
  display: flex;
  flex-wrap: wrap;
  &-item {
    width: 100%;
    padding: 0px 43px;
    input,
    .el-select {
      width: 100%;
    }
    &.itemW {
      width: 100%;
    }
  }
  &-items {
    width: 100%;
  }
}
.checkBtn {
  text-align: center;
  cursor: pointer;
  position: relative;
  font-size: 18px;
  color: #999999;
  &.check {
    color: #b2642a;
    &::before {
      content: '';
      display: block;
      width: 80%;
      height: 3px;
      background: #b2642a;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 12px;
    background: #cecece;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>