<template>
  <div
    v-loading="mainLoading"
    class="dashboard-container"
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
    <div class="table_warpper">
      <div class="table_con">
        <!-- 新增随访 -->
        <div class="addNewPlan">
          <div>
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col :span="18">
                <el-row>
                  <el-col
                    v-for="(item,index) in checklist"
                    :key="index"
                    :span="5"
                  >
                    <div
                      :class="index == currentIdx ? 'check checkBtn' : 'checkBtn'"
                      @click="siteIdChange(index)"
                    >{{ item.name }}({{ item.num }})</div>
                  </el-col>
                </el-row>
              </el-col>
              <el-col style="text-align:right;padding-right:30px;">
                <el-button
                  class="opButton"
                  type="primary"
                  icon="el-icon-folder-add"
                  @click="batchGetPlan"
                >批量领取</el-button>
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
              type="selection"
              width="55"
              align="center"
              :selectable="checkSelectBatch"
            />
            <el-table-column
              label="序号"
              width="75px"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ (pageIndex-1)*pageSize+(scope.$index + 1) }} </span>

              </template>
            </el-table-column>
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
                  @claimTask="claimTask"
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
      </div>
    </div>

  </div>
</template>
<script>
import { getTaskPoolList, claimTask } from '@/api/followVisits'
import iCell from '@/views/doctor/layout/components/iCell.vue'
import SearchForm from '@/views/doctor/layout/components/SearchFrom.vue'
import { Message, MessageBox } from 'element-ui'
export default {
  components: {
    iCell,
    SearchForm,
  },
  data() {
    return {
      cols: [
        // 列名集合
        { prop: 'taskTypeId', label: '任务类型', width: null },
        { prop: 'patientName', label: '姓名', width: null },
        { prop: 'mobileNumber', label: '手机号', width: null },
        { prop: 'followVisitPlanName', label: '参与方案名称', width: null },
        {
          prop: 'startDateTime',
          label: '任务时间',
          width: null,
          sortable: 'custom',
        },
        { prop: 'runTime', label: '随访时长', width: null },
        { prop: 'executiveId', label: '执行人类别', width: null },
        { prop: 'stateName', label: '任务状态', width: null },
        { prop: 'abnormalData', label: '回访信息', width: null },
        { prop: 'taskSource', label: '任务来源', width: null },
        { prop: 'buttonList', label: '功能', width: '250px' },
      ],
      taskPoolData: null,
      taskPoolList: null,
      searchForm: [],
      pageIndex: 1, // 当前页码
      pageSize: 20, // 每页数据条数
      pageCount: null, // 总页数
      labelPosition: 'right',
      styleWidth: '204px',
      labelWidth: '100px',
      mainLoading: true, // 全局loading
      taskListLoading: false,
      caseFollowVisitList: null,
      caseFollowVisitTaskDetailIds: null,
      // 随访状态筛选
      currentIdx: 0,
      checklist: [],
      sortTypeId: 0, //默认排序方式 不排序
      sortName: '', //默认排序列名称
      searchData: {},
      stateId: 1,
      params: {},
    }
  },
  created() {
    const parmas = { stateId: this.stateId }
    this.getData(parmas)
  },
  methods: {
    getData: function (parmas) {
      if (parmas) {
        parmas = Object.assign(
          parmas,
          {
            stateId: this.stateId,
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            pageSize: this.pageSize,
            page: this.pageIndex,
          },
          this.searchData
        )
      } else {
        parmas = {
          stateId: this.stateId,
        }
      }
      this.taskListLoading = true
      getTaskPoolList(parmas).then((res) => {
        if (res.Code === 1) {
          this.taskPoolData = res.Data
          this.taskPoolList = res.Data.list
          this.pageCount = res.Pages
          this.searchForm = res.Data.searchForm
          //将params中的开始和结束日期回显到value中 防止查询过后value为空
          for (let index = 0; index < this.searchForm.length; index++) {
            const element = this.searchForm[index]
            if (element.name == 'startExecuteDate') {
              if (parmas == undefined) {
                parmas = {}
              } else {
                element.value = [
                  String(parmas.startExecuteDate),
                  String(parmas.endExecuteDate),
                ]
              }
            }
          }
          this.mainLoading = false
          this.checklist = [
            {
              name: '待领取任务',
              num: res.Data.notStartCount,
              stateId: 1,
            },
            {
              name: '全部任务',
              num: res.Data.allCount,
              stateId: null,
            },
          ]
        } else {
          this.mainLoading = false
        }
        this.taskListLoading = false
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
    //表格排序
    onSortChange(column) {
      if (column) {
        //正序 1
        if (column.order == 'ascending') {
          this.sortTypeId = 1
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
          }
          this.pageIndex = 1
          this.getData(params)
        }
        //不排序 0
        if (column.order == null) {
          this.sortTypeId = 0
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
          }
          this.pageIndex = 1
          this.getData(params)
        }
        //倒序 2
        if (column.order == 'descending') {
          this.sortTypeId = 2
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
          }
          this.pageIndex = 1
          this.getData(params)
        }
      } else {
        //清空排序条件，数据会恢复成未排序的状态
        this.$refs.taskPoolTable.clearSort()
        this.sortTypeId = 0
        this.sortName = ''
      }
    },
    // 判断能否批量选择
    checkSelectBatch(row, index) {
      let isChecked = false
      // 判断行数据是否包含领取按钮
      if (row.buttonList.some((item) => item.clickTypeId === 23)) {
        isChecked = true
      } else {
        isChecked = false
      }
      return isChecked
    },
    // 根据随访状态切换数据
    siteIdChange(siteId) {
      this.currentIdx = siteId
      this.pageIndex = 1
      const params = {}
      switch (siteId) {
        case 0:
          params.stateId = 1
          break
        case 1:
          params.stateId = null
          break
        default:
          this.taskPoolList = this.taskPoolData.list
      }
      this.stateId = params.stateId
      this.pageSize = 20
      this.pageIndex = 1
      this.getData(params)
    },
    // 重置条件搜索框
    restSearchForm() {
      this.pageIndex = 1
      this.pageSize = 20
      this.getData()
      this.onSortChange()
    },
    GetSearchData(data) {
      this.searchData = data
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      const params = { pageSize: val }
      this.getData(params)
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.pageIndex = val
      const params = { page: val }
      this.getData(params)
    },
    // 领取任务
    claimTask(claim) {
      this.taskListLoading = true
      this.caseFollowVisitList = claim
      const caseFollowVisitTaskDetailIds =
        this.caseFollowVisitList.caseFollowVisitTaskDetailId
      MessageBox.confirm('您是否要领取当前任务  ?', '任务领取', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          claimTask({
            caseFollowVisitTaskDetailIds: caseFollowVisitTaskDetailIds,
          })
            .then((res) => {
              Message({
                message: '领取成功！',
                type: 'success',
                duration: 5 * 1000,
              })
              this.getData()
            })
            .catch((err) => {
              Message({
                message: '领取失败！',
                type: 'error',
                duration: 5 * 1000,
              })
              this.taskListLoading = false
              return err
            })
        })
        .catch((err) => {
          console.log(err)
        })
      this.taskListLoading = false
    },
    // 批量领取随访任务
    batchGetPlan() {
      const caseFollowVisitTaskDetailIds = []
      const data = this.$refs.taskPoolTable.selection
      data.forEach(function (item) {
        caseFollowVisitTaskDetailIds.push(item.caseFollowVisitTaskDetailId)
      })
      if (caseFollowVisitTaskDetailIds.length > 0) {
        MessageBox.confirm('您是否要领取当前已选择的任务?', '任务领取', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then((res) => {
            // 将数组转换为字符串
            claimTask({
              caseFollowVisitTaskDetailIds:
                caseFollowVisitTaskDetailIds.join(','),
            })
              .then((res) => {
                if (res.Code === 1) {
                  Message({
                    message: '领取成功！',
                    type: 'success',
                    duration: 5 * 1000,
                  })
                  this.getData()
                }
              })
              .catch((err) => {
                console.log(err)
                Message({
                  message: '领取失败！',
                  type: 'error',
                  duration: 5 * 1000,
                })
                this.taskListLoading = false
              })
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        Message({
          message: '请选择要领取的任务！',
          type: 'error',
          duration: 5 * 1000,
        })
      }
    },
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

