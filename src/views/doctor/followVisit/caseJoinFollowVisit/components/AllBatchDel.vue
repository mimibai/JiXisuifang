<template>
  <!--获取可以复用的随访计划弹窗组件-->
  <div class="allPatient">
    <div class="allPatientBtns">
      <span class="mb20">选择随访方案</span>
    </div>
    <!-- 搜索表单 -->
    <el-form
      ref="searchForm"
      :model="{ searchForm }"
      :inline="true"
      size="mini"
      label-width="70px"
      :label-position="labelPosition"
    >
      <template v-for="(item,index) in searchForm">
        <el-form-item
          v-if="item.type == 4 "
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
          v-if="item.type == 1"
          :label="item.title"
        >
          <el-input
            v-model="item.value"
            :placeholder="'请填写' + item.title"
            :style="'width:' + styleWidth"
          />
        </el-form-item>
      </template>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="onSearchSubmit()"
          size="mini"
        >查询</el-button>
        <el-button
          @click="restSearchForm"
          icon="el-icon-refresh-left"
          size="mini"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 所有条目 -->
    <div>
      <el-table
        ref="TableForm"
        v-loading="ListLoading"
        :data="dataList"
        style="width: 100%"
        border
        :show-overflow-tooltip="true"
        :header-cell-style="getRowClass"
        @row-click="itemChoose"
        height="550"
      >
        <el-table-column
          v-for="(col, index) in cols"
          :key="index"
          :prop="col.prop"
          :label="col.label"
          align="center"
          :width="col.width"
        >
          <template slot-scope="scope">
            <data-cell
              :prop="col.prop"
              :row="scope.row"
              :rowIndex="(pageIndex-1)*pageSize+(scope.$index + 1)"
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
      >
        <el-pagination
          background
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          :page-sizes="[20, 40, 60, 80]"
          layout="sizes, prev, pager, next, jumper"
          align="center"
          :page-count="pageCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { BatchDelCaseFollowVisitTask } from '@/api/followVisits'
import DataCell from './DataCell.vue'
export default {
  data() {
    return {
      cols: [
        // 列名集合
        { prop: '序号', label: '序号', width: '60px' },
        { prop: 'ExecutiveName', label: '执行人员类别', width: '110px' },
        { prop: 'followVisitplanName', label: '随访方案', width: null },
        { prop: 'followVisitTaskName', label: '任务名称', width: null },
        { prop: 'isCycle', label: '是否循环', width: '80px' },
        { prop: 'isNeedReturnVisit', label: '是否需要回访', width: '80px' },
        { prop: 'taskDetail', label: '任务详情', width: null },
      ],
      pageCount: null, //总页数
      pageSize: 20, //每页个数
      pageIndex: 1, //默认页
      ListLoading: true,
      dataList: null, // 列表集合
      searchForm: null, //搜索集合
      labelPosition: 'left',
      styleWidth: '160px',
      searchData: {},
    }
  },
  components: {
    DataCell,
  },
  created() {
    this.getAllList()
  },
  methods: {
    //获取数据
    getAllList(params) {
      this.ListLoading = true
      //如果路径参数有值，需要获取时拼接
      if (params) {
        params = Object.assign(
          params,
          {
            pageSize: this.pageSize,
            page: this.pageIndex,
          },
          this.searchData
        )
      }
      BatchDelCaseFollowVisitTask(params).then((response) => {
        this.dataList = response.Data.dataList
        this.searchForm = response.Data.searchForm
        this.ListLoading = false
        this.pageCount = response.Pages
      })
    },
    // 条件搜索事件
    onSearchSubmit(params) {
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          this.pageIndex = 1
          let searchParams = {}
          if (params == undefined) {
            params = {}
          }
          for (let index = 0; index < this.searchForm.length; index++) {
            const item = this.searchForm[index]
            searchParams[item.name] = item.value
          }
          this.searchData = searchParams
          params = Object.assign(params, searchParams)
          this.getAllList(params)
        } else {
          return false
        }
      })
    },
    // 重置条件搜索框
    restSearchForm() {
      this.$refs.searchForm.resetFields()
      this.pageIndex = 1
      this.pageSize = 20
      this.getAllList()
      this.searchData = {}
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      console.log(val)
      this.pageIndex = 1
      const params = { pageSize: val }
      this.ListLoading = true
      this.getAllList(params)
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.pageIndex = val
      const params = { page: val }
      this.ListLoading = true
      this.getAllList(params)
    },

    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    // 点击选中后参数传回父组件
    itemChoose(row, column, event) {
      const param = row.followVisitTaskId
      this.$emit('BatchChoose', param)
    },
  },
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
.el-form--inline .el-form-item {
  display: inline-block;
  margin-right: 15px;
  vertical-align: top;
}
</style>