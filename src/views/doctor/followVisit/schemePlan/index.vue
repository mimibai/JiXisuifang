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
              :value="items.id"
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
            :placeholder="'请填写'+item.title"
            :style="'width:' + styleWidth"
          />
        </el-form-item>
      </template>
    </el-form>
    <div class="primaryBtn">
      <el-button
        class="searchBtn"
        type="primary"
        icon="el-icon-search"
        @click="onSearchSubmit"
      >查询</el-button>
      <el-button
        class="restBtn"
        icon="el-icon-refresh-left"
        @click="restSearchForm"
      >重置</el-button>
    </div>
    <div class="table_warpper">
      <div class="table_con">
        <!-- 新增随访 -->
        <div
          class="addNewPlan"
          v-if="checkPermission([1])"
        >
          <div>
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col style="text-align:right;padding-right:30px;">
                <el-button
                  class="opButton"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addNewPlan"
                >新增方案</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 随访列表 -->
        <div class="table_info">
          <el-table
            ref="taskPoolTable"
            v-loading="planListLoading"
            :data="planList"
            style="width: 100%"
            border
            :show-overflow-tooltip="true"
            :header-cell-style="getRowClass"
            :expand-row-keys="expands"
            :row-key="getRowKeys"
            @expand-change="expandChange"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div class="childTable-wrapper">
                  <el-table
                    ref="taskPoolTable1"
                    v-loading="childItemLoading"
                    :data="scope.row.childItemData"
                    style="width: 100%"
                    border
                    :show-overflow-tooltip="true"
                    :header-cell-style="getRowClass"
                  >
                    <el-table-column
                      v-for="(col, index) in colsChild"
                      :key="index"
                      :prop="col.prop"
                      :label="col.label"
                      align="center"
                      :width="col.width"
                    >
                      <template slot-scope="scope">
                        <i-cell
                          :prop="col.prop"
                          :row="scope.row"
                          @closeTask="closeTask"
                          @openTask="openTask"
                          @createTask="createTask"
                          @moveUpTask="moveUpTask"
                          @moveDownTask="moveDownTask"
                          @goSchemePlanTaskDetail="goSchemePlanTaskDetail"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                  <template v-if="checkPermission([1])">
                    <el-button
                      class="addScheButton"
                      type="primary"
                      size="mini"
                      @click="addSchemePlan"
                    >新增任务</el-button>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, index) in cols"
              :key="index"
              :prop="col.prop"
              :label="col.label"
              align="center"
              :width="col.width"
            >
              <template slot-scope="scope">
                <i-cell
                  :prop="col.prop"
                  :row="scope.row"
                  :rowIndex="(currentPage-1)*pageSize+(scope.$index + 1)"
                  @closePlan="closePlan"
                  @openPlan="openPlan"
                  @editPlan="editPlan"
                  @copyPlan="copyPlan"
                  @goSchemePlanDetail="goSchemePlanDetail"
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
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[20, 40, 60, 80]"
              layout="sizes, prev, pager, next, jumper"
              :page-count="pageCount"
              align="center"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 新增随访方案弹窗 -->
    <el-dialog
      v-loading="createLoading"
      :title="dialogTitle"
      :visible.sync="creatFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="createVisitForm"
        :model="createVisitForm"
      >
        <div class="input-content">
          <div
            v-for="(item, index) in createVisitForm.createFormItems"
            :key="item.index"
            :class="item.name == 'Remarks'?'input-content-item itemW':'input-content-item'"
            :style="item.type == null || item.isdisplay ? 'display:none' : ''"
          >
            <el-form-item
              v-if="item.type == 'text'"
              :label-width="formLabelWidth"
              :label="item.title"
              :prop="'createFormItems.' + index + '.value'"
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
            <el-form-item
              v-if="item.type == 'picker'"
              :label="item.title"
              :prop="'createFormItems.' + index + '.value'"
              :label-width="formLabelWidth"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :label="item.title"
              >
                <el-option
                  v-for="itemChild in item.list"
                  :key="itemChild.id"
                  :label="itemChild.name"
                  :value="Number(itemChild.id)"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="creatFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="creatFormLoading"
          @click="formSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPlanList,
  closeVisitPlan,
  openVisitPlan,
  createVisitPlanPost,
  createVisitPlanGet,
  getTaskList,
  closeVisitTask,
  openVisitTask,
  moveUpVisitTask,
  moveDownVisitTask,
} from '@/api/followVisits'
import checkPermission from '@/utils/permission' // 权限判断函数
import iCell from '@/views/doctor/layout/components/iCell.vue'
import { Message, MessageBox } from 'element-ui'
export default {
  components: {
    iCell,
  },
  data() {
    return {
      cols: [
        // 列名集合
        { prop: '序号', label: '序号', width: '75px' },
        { prop: 'planName', label: '方案名称', width: null },
        { prop: 'planTypeName', label: '方案类别', width: null },
        { prop: 'isEnable', label: '是否启用', width: null },
        { prop: 'buttonList', label: '功能', width: '350px' },
      ],
      colsChild: [
        // 列名集合
        { prop: 'isEnable', label: '是否启用', width: null },
        { prop: 'executiveName', label: '执行任务人员类别', width: null },
        { prop: 'taskTypeName', label: '任务类型', width: null },
        { prop: 'taskName', label: '任务名称', width: null },
        { prop: 'isCycle', label: '是否循环任务', width: null },
        { prop: 'isNeedReturnVisit', label: '是否需要回访', width: null },
        { prop: 'buttonList', label: '功能', width: '350px' },
      ],
      planList: [],
      searchForm: null,
      labelPosition: 'right',
      styleWidth: '204px',
      mainLoading: true, // 全局loading
      planListLoading: false,
      createLoading: true,
      createVisitForm: {
        createFormItems: [], // 新建随访方案集合
      },
      searchFormData: {},
      submitData: {}, // 用于提交表单信息到后台
      formLabelWidth: '120px',
      dialogTitle: '',
      creatFormVisible: false, // 随访方案弹窗默认关闭
      creatFormLoading: false, //随访方案弹窗loading
      operatTypeId: null,
      taskFormVisible: false, // 随访任务弹窗默认关闭
      taskLoading: false,
      taskVisitForm: {
        taskFormItems: [], // 新建随访方案集合
      },
      taskdialogTitle: '',
      taskFormLabelWidth: '300px',
      followId: null, // 编辑随访任务和展开随访方案
      // 要展开的行，数值的元素是row的key值
      expands: [],
      childItemLoading: false,
      pageSize: 20,
      pageCount: 1,
      currentPage: 1,
    }
  },
  created() {
    this.getData()
  },

  methods: {
    getData: function (param) {
      if (param) {
        param = Object.assign(
          param,
          {
            pageSize: this.pageSize,
            page: this.currentPage,
          },
          this.searchFormData
        )
      }

      console.log(param)
      getPlanList(param).then((res) => {
        this.pageCount = res.Pages
        this.searchForm = res.Data.searchForm
        this.mainLoading = false
        this.planListLoading = false
        res.Data.dataList.map((item) => {
          item.childItemData = []
        })
        this.planList = res.Data.dataList
      })
    },
    // 获取row的key值
    getRowKeys(row) {
      return row.followVisitplanId
    },
    // 方案下的随访任务
    expandChange(row, index) {
      this.childItemLoading = true
      this.followId = row.followVisitplanId
      const that = this
      if (index.length > 0) {
        getTaskList({ followVisitPlanId: this.followId }).then((res) => {
          // 遍历当前页面表
          row.childItemData = res.Data
          that.expands = []
          if (row) {
            that.expands.push(this.followId) // 每次push进去的是每行的ID
          }
        })
      } else {
        that.expands = [] // 默认不展开
      }
      this.childItemLoading = false // 设置table中的扩展项，展开的followVisitPlanId
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    // 条件搜索事件
    onSearchSubmit(params) {
      let searchParams = {}
      if (params == undefined) {
        params = {}
      }
      this.mainLoading = true
      for (let index = 0; index < this.searchForm.length; index++) {
        const item = this.searchForm[index]
        if (item.name === 'planName') {
          searchParams.planName = item.value
        }
        if (item.name === 'planTypeId') {
          searchParams.planTypeId = item.value
        }
        if (item.name === 'isEnable') {
          searchParams.isEnable = item.value
        }
      }
      this.searchFormData = searchParams
      params = Object.assign(params, searchParams)
      this.getData(params)
      // getPlanList(params).then((res) => {
      //   this.planList = res.Data.dataList
      //   this.mainLoading = false
      // })
    },
    // 重置条件搜索框
    restSearchForm() {
      this.$refs.searchForm.resetFields()
      this.mainLoading = true
      this.currentPage = 1
      this.pageSize = 20
      this.getData()
      this.searchFormData = {}
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      const params = { pageSize: val }
      this.getData(params)
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      const param = { page: val }
      // 判断是否有路径传参，如果有则在路径传参基础上进行分页
      if (!this.isNullObject) {
        param.patientId = this.urlParams.patientId
      }
      this.getData(param)
    },
    // 停用方案
    closePlan(planId) {
      this.planListLoading = true
      const param = planId
      MessageBox.confirm('您确定要停用此方案吗  ?', '方案停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          closeVisitPlan(param)
            .then((res) => {
              Message({
                message: '停用成功！',
                type: 'success',
                duration: 5 * 1000,
              })
              this.getData()
            })
            .catch((error) => {
              Message({
                message: '停用失败！',
                type: 'error',
                duration: 5 * 1000,
              })
            })
        })
        .catch((err) => {
          this.planListLoading = false
        })
    },
    // 开启方案
    openPlan(planId) {
      this.planListLoading = true
      const param = planId
      MessageBox.confirm('您确定要开启此方案吗  ?', '方案开启', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          openVisitPlan(param).then((res) => {
            Message({
              message: '开启成功！',
              type: 'success',
              duration: 5 * 1000,
            })
            this.getData()
          })
        })
        .catch((err) => {
          Message({
            message: '开启失败',
            type: 'error',
            duration: 5 * 1000,
          })
          this.planListLoading = false
          return err
        })
    },
    // 新增随访方案
    addNewPlan() {
      this.operatTypeId = 1
      this.dialogTitle = '新增随访方案'
      this.createLoading = true
      createVisitPlanGet({ operatTypeId: this.operatTypeId }).then((res) => {
        this.creatFormVisible = true // 打开弹窗
        const { Data } = res
        this.createVisitForm.createFormItems = Data
        // 判断类型为picker的下拉框将其value改为空
        const createFormItem = this.createVisitForm.createFormItems
        for (let index = 0; index < createFormItem.length; index++) {
          const item = createFormItem[index]
          if (item.type === 'picker') {
            item.value = null
          }
        }
        this.createLoading = false
      })
    },
    editPlan(parma) {
      this.operatTypeId = 3
      this.dialogTitle = '编辑随访方案'
      const followVisitplanId = parma.followVisitplanId
      this.createLoading = true
      const parmas = {
        operatTypeId: this.operatTypeId,
        followVisitplanId: followVisitplanId,
      }
      createVisitPlanGet(parmas).then((res) => {
        this.creatFormVisible = true // 打开弹窗
        const { Data } = res
        this.createVisitForm.createFormItems = Data
        this.createLoading = false
      })
    },
    copyPlan(parma) {
      this.operatTypeId = 4
      this.dialogTitle = '复制随访方案'
      const followVisitplanId = parma.followVisitplanId
      this.createLoading = true
      const parmas = {
        operatTypeId: this.operatTypeId,
        followVisitplanId: followVisitplanId,
      }
      createVisitPlanGet(parmas).then((res) => {
        this.creatFormVisible = true // 打开弹窗
        const { Data } = res
        this.createVisitForm.createFormItems = Data
        this.createLoading = false
      })
    },
    // 提交新增随访方案
    formSubmit() {
      this.$refs.createVisitForm.validate((valid) => {
        if (valid) {
          this.creatFormLoading = true
          const data = this.createVisitForm.createFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
          }
          // 编辑时需要传operatTypeId
          if (this.operatTypeId === 3 || this.operatTypeId === 4) {
            const operatData = { operatTypeId: this.operatTypeId }
            this.submitData = Object.assign(this.submitData, operatData)
          } else {
            this.submitData = Object.assign(this.submitData)
          }
          createVisitPlanPost(this.submitData).then((res) => {
            const { Code } = res
            if (Code === 1) {
              this.creatFormVisible = false
              this.$refs.createVisitForm.resetFields()
              // 添加完毕后刷新数据
              this.getData()
              if (this.operatTypeId === 3) {
                Message({
                  message: '方案修改成功！',
                  type: 'success',
                  duration: 5 * 1000,
                })
              } else if (this.operatTypeId === 4) {
                Message({
                  message: '方案复制成功！',
                  type: 'success',
                  duration: 5 * 1000,
                })
              } else {
                Message({
                  message: '方案添加成功！',
                  type: 'success',
                  duration: 5 * 1000,
                })
              }
              this.creatFormLoading = false
            }
          })
        } else {
          console.log('error submit!!')
          this.creatFormLoading = false
          return false
        }
      })
    },
    handleClose(done) {
      done()
    },
    // 随访方案中的任务停用
    closeTask(TaskId) {
      this.childItemLoading = true
      const param = TaskId
      MessageBox.confirm('您确定要停用此任务吗  ?', '任务停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          closeVisitTask(param).then((res) => {
            Message({
              message: '停用成功！',
              type: 'success',
              duration: 5 * 1000,
            })
            getTaskList({ followVisitPlanId: this.followId }).then((res) => {
              // 遍历当前页面表
              for (let index = 0; index < this.planList.length; index++) {
                const item = this.planList[index]
                if (item.followVisitplanId === this.followId) {
                  item.childItemData = res.Data
                }
              }
            })
            this.childItemLoading = false
          })
        })
        .catch((err) => {
          Message({
            message: '停用失败',
            type: 'error',
            duration: 5 * 1000,
          })
          this.childItemLoading = false
          return err
        })
    },
    // 随访方案中的任务停用
    openTask(TaskId) {
      this.childItemLoading = true
      const param = TaskId
      MessageBox.confirm('您确定要开启此任务吗  ?', '任务开启', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          openVisitTask(param).then((res) => {
            Message({
              message: '开启成功！',
              type: 'success',
              duration: 5 * 1000,
            })
            getTaskList({ followVisitPlanId: this.followId }).then((res) => {
              // 遍历当前页面表
              for (let index = 0; index < this.planList.length; index++) {
                const item = this.planList[index]
                if (item.followVisitplanId === this.followId) {
                  item.childItemData = res.Data
                }
              }
            })
            this.childItemLoading = false
          })
        })
        .catch((err) => {
          Message({
            message: '开启失败',
            type: 'error',
            duration: 5 * 1000,
          })
          this.childItemLoading = false
          return err
        })
    },
    // 随访方案中的任务编辑
    createTask(parma) {
      const parmas = {
        followVisitPlanId: parma.followVisitPlanId,
        followVisitTaskId: parma.followVisitTaskId,
        operatTypeId: 3,
      }
      this.$router.push({
        path: '/doctor/followVisit/schemeEdit',
        query: parmas,
      })
    },
    // 随访方案中的任务新增
    addSchemePlan(parma) {
      const parmas = {
        followVisitPlanId: this.followId,
        operatTypeId: 1,
      }
      this.$router.push({
        path: '/doctor/followVisit/schemeEdit',
        query: parmas,
      })
    },
    // 随访任务上移
    moveUpTask(parma) {
      this.childItemLoading = true
      moveUpVisitTask(parma)
        .then((res) => {
          getTaskList({ followVisitPlanId: this.followId }).then((res) => {
            // 遍历当前页面表
            for (let index = 0; index < this.planList.length; index++) {
              const item = this.planList[index]
              if (item.followVisitplanId === this.followId) {
                item.childItemData = res.Data
              }
            }
          })
          this.childItemLoading = false
        })
        .catch((err) => {
          Message({
            message: err.Msg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
    },
    // 随访任务下移
    moveDownTask(parma) {
      this.childItemLoading = true
      moveDownVisitTask(parma)
        .then((res) => {
          getTaskList({ followVisitPlanId: this.followId }).then((res) => {
            // 遍历当前页面表
            for (let index = 0; index < this.planList.length; index++) {
              const item = this.planList[index]
              if (item.followVisitplanId === this.followId) {
                item.childItemData = res.Data
              }
            }
          })
          this.childItemLoading = false
        })
        .catch((err) => {
          Message({
            message: err.Msg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
    },
    // 随访方案详情
    goSchemePlanDetail(parma) {
      this.$router.push({
        path: '/doctor/followVisit/schemeDetail',
        query: parma,
      })
    },
    // 随访方案任务详情
    goSchemePlanTaskDetail(parma) {
      this.$router.push({
        path: '/doctor/followVisit/schemeDetail',
        query: parma,
      })
    },
    checkPermission,
  },
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
    margin: 30px 0 0;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
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
.primaryBtn {
  padding: 0 0 30px 60px;
  display: flex;
  justify-content: center;
  .restBtn {
    background: #e1e5ec;
    margin-left: 20px;
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
.input-content {
  display: flex;
  flex-wrap: wrap;
  &-item {
    width: 50%;
    padding: 0px 43px;
    input,
    .el-select {
      width: 100%;
    }
    &.itemW {
      width: 100%;
    }
  }
}
.childTable-wrapper {
  padding: 15px;
  position: relative;
  .addScheButton {
    position: absolute;
    right: 25px;
    top: 25px;
  }
}
.dialog-footer {
  text-align: center;
}
</style>

