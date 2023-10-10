<template>
  <el-table
    v-loading="dataListLoading"
    ref="dataTableList"
    :data="dataList"
    style="width: 100%"
    border
    :show-overflow-tooltip="true"
    :header-cell-style="getRowClass"
  >
    <el-table-column
      v-if="needSelectTable"
      type="selection"
      width="55"
      align="center"
      :selectable="checkSelectBatch"
    />
    <el-table-column
      v-for="(col, index) in cols"
      :key="index"
      :prop="col.prop"
      :label="col.label"
      align="center"
      :width="col.width"
      :min-width="col.minWidth"
    >
      <template slot-scope="scope">
        <data-cell
          :prop="col.prop"
          :row="scope.row"
          :pageSize="pageSize"
          :page="page"
          @stopFollowPlan="stopFollowPlan"
          @canceledTask="canceledTask"
          @delCaseFollowVisitDetail="delCaseFollowVisitDetail"
          @editFollowVisitTask="editFollowVisitTask"
          @moveUpCaseFollowVisitPlan="moveUpCaseFollowVisitPlan"
          @moveDownCaseFollowVisitPlan="moveDownCaseFollowVisitPlan"
          @delCaseFollowPlan="delCaseFollowPlan"
          @editCaseFollowPlan="editCaseFollowPlan"
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
</template>
<script>
import DataCell from './DataCell.vue'
import { Message, MessageBox } from 'element-ui'
import {
  cancelCaseFollowVisitTask,
  delCaseFollowVisitDetail,
  moveUpCaseFollowVisitTask,
  moveDownCaseFollowVisitTask,
  delCaseFollowVisitTask,
} from '@/api/followVisits'
export default {
  name: 'DataTable',
  components: {
    DataCell,
  },
  props: {
    dataList: Array,
    cols: Array,
    needSelectTable: Boolean, //是否需要全选选择框
    dataListLoading: Boolean,
    pageSize: Number,
    page: Number,
  },
  data() {
    return {}
  },
  methods: {
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    //停用随访计划
    stopFollowPlan(params) {
      const { caseFollowVisitTaskId, casejoinFollowVisitId } = params
      MessageBox.confirm('您确定终止当前随访?', '终止随访', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        cancelCaseFollowVisitTask({
          caseFollowVisitTaskId,
        })
          .then((res) => {
            Message({
              message: '停用成功',
              type: 'success',
              duration: 5 * 1000,
            })
            //重新加载随访计划
            this.$emit('getFollowPlanList', casejoinFollowVisitId)
          })
          .catch((res) => {
            Message({
              message: '停用失败，请稍后重试！',
              type: 'error',
              duration: 5 * 1000,
            })
          })
      })
    },
    //上移随访计划
    moveUpCaseFollowVisitPlan(params) {
      const { caseJoinFollowVisitId, caseFollowVisitTaskId } = params
      moveUpCaseFollowVisitTask({ caseFollowVisitTaskId }).then((res) => {
        Message({
          message: '上移成功！',
          type: 'success',
          duration: 5 * 1000,
        })
        this.$emit('getFollowPlanList', caseJoinFollowVisitId)
      })
    },
    //下移随访计划
    moveDownCaseFollowVisitPlan(params) {
      const { caseJoinFollowVisitId, caseFollowVisitTaskId } = params
      moveDownCaseFollowVisitTask({ caseFollowVisitTaskId }).then((res) => {
        Message({
          message: '下移成功！',
          type: 'success',
          duration: 5 * 1000,
        })
        this.$emit('getFollowPlanList', caseJoinFollowVisitId)
      })
    },
    //删除随访计划
    delCaseFollowPlan(params) {
      const { caseJoinFollowVisitId, caseFollowVisitTaskId } = params
      MessageBox.confirm('您确定要删除该随访计划?', '删除随访计划', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delCaseFollowVisitTask({
          caseFollowVisitTaskId,
        })
          .then((res) => {
            Message({
              message: '删除成功！',
              type: 'success',
              duration: 5 * 1000,
            })
            //重新加载当前患者关联随访计划
            this.$emit('getFollowPlanList', caseJoinFollowVisitId)
          })
          .catch((res) => {
            Message({
              message: '删除失败，请稍后重试！',
              type: 'error',
              duration: 5 * 1000,
            })
          })
      })
      delCaseFollowVisitTask
    },
    //编辑随访计划
    editCaseFollowPlan(params) {
      this.$emit('editFollowVistPlan', params)
    },
    //作废随访任务
    canceledTask(params) {
      this.$emit('terminationTask', params)
    },
    //删除随访任务
    delCaseFollowVisitDetail(params) {
      const { caseJoinFollowVisitId, caseFollowVisitTaskDetailId } = params
      MessageBox.confirm('您确定要删除该任务?', '删除任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delCaseFollowVisitDetail({
          caseFollowVisitTaskDetailId,
        })
          .then((res) => {
            Message({
              message: '删除成功！',
              type: 'success',
              duration: 5 * 1000,
            })
            //重新加载当前患者关联随访任务
            this.$emit('getFollowTaskList', caseJoinFollowVisitId)
          })
          .catch((res) => {
            Message({
              message: '删除失败，请稍后重试！',
              type: 'error',
              duration: 5 * 1000,
            })
          })
      })
    },
    //判断当前是否可选
    checkSelectBatch(row, index) {
      let isChecked = false
      if (
        row.buttonList.some(
          (item) => item.clickTypeId === 56 || item.clickTypeId === 57
        )
      ) {
        // 判断行数据是否包含领取按钮
        isChecked = true
      } else {
        isChecked = false
      }
      return isChecked
    },
    //编辑随访任务
    editFollowVisitTask(params) {
      this.$emit('editFollowVisitTasks', params)
    },
    //获取当前已选定计划或任务
    getBachDataTableList() {
      let bachDatTableaList = this.$refs.dataTableList.selection
      let bachDatTableaListIds = bachDatTableaList.map((item) => {
        return item.caseFollowVisitTaskId
      })
      return bachDatTableaListIds
    },
  },
}
</script>