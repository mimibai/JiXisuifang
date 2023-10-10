<template>
  <div class="cancerRecords">
    <!-- 搜索表单 -->
    <el-form
      ref="searchForm"
      :model="searchForm"
      label-width="80px"
      class="demo-form-inline"
      size="mini"
      :inline="true"
    >
      <div>
        <el-form-item
          label="方案类别"
          prop="proTypeId"
        >
          <el-select
            v-model="searchForm.proTypeId"
            placeholder="请选择方案类别"
          >
            <el-option
              v-for="(item, idx) in dropLog"
              :key="idx"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="参与时间"
          prop="joinDate"
        >
          <el-col>
            <el-date-picker
              v-model="searchForm.joinDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="onSearchSubmit"
          >查询</el-button>
          <el-button
            size="mini"
            @click="restSearchForm"
          >重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      ref="TableForm"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      stripe
      :row-class-name="tableRowClassName"
      :header-cell-style="getRowClass"
      border
    >
      <el-table-column
        label="序号"
        width="55px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ (pageIndex-1)*pageSize+(scope.$index + 1) }} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="followupProtocolName"
        label="问卷名称"
        width="180"
        align="center"
      />
      <el-table-column
        label="测评人"
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
        prop="joinDate"
        label="测评时间"
        align="center"
      />
      <el-table-column
        fixed="right"
        label="完成状态"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag
            v-if="row.isFinish"
            type="success"
          >已完成</el-tag>
          <el-tag
            v-else
            type="danger"
          >未完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button
            v-for="n in row.buttonList"
            :key="n.index"
            size="small"
            @click="handleClick(row.caseJoinProtocolId)"
          >{{ n.title }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div
      class="health-content-pagination"
      style="margin-top: 15px"
    >
      <el-pagination
        background
        :current-page="pageIndex"
        :page-count="total"
        :page-size="pageSize"
        :page-sizes="[20, 40, 60, 80]"
        layout="sizes,prev,pager,next,jumper"
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { getCaseJoinProtocolList } from '@/api/summaryPatient'
export default {
  name: 'GetRecordsList',
  data() {
    return {
      loading: true,
      tableData: [],
      pageIndex: 1, // 当前页码
      pageSize: 20, // 每页数据条数
      total: null, // 总页数
      searchForm: {
        // 搜索信息
        joinDate: null, // 时间
        proTypeId: null // 类别
      },
      dropLog: [
        // 方案类别
        {
          name: '综合版',
          value: 1
        },
        {
          name: '简易版',
          value: 2
        },
        {
          name: '专科版',
          value: 3
        }
      ],
      sortTypeId: 0, // 默认排序方式 不排序
      sortName: '', // 默认排序列名称
      searchData: {}
    }
  },
  created() {
    this.getData()
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
    handleClick(caseJoinProtocolId) {
      this.$router.push({
        path: '/patient/summary/result',
        query: {
          caseJoinProtocolId: caseJoinProtocolId
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    getData: function(param) {
      if (param) {
        param = Object.assign(
          param,
          {
            // sortTypeId: this.sortTypeId,
            // sortName: this.sortName,
            pageSize: this.pageSize,
            page: this.pageIndex
          },
          this.searchData
        )
      }
      getCaseJoinProtocolList(param).then((response) => {
        const { Data, Pages } = response
        const { dataList } = Data
        this.tableData = dataList
        this.loading = false
        this.total = Pages
      })
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageIndex = 1
      this.pageSize = val
      const params = { pageSize: val }
      this.getData(params)
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.loading = true
      this.pageIndex = val
      const params = { page: val }
      if (this.searchForm.joinDate != null) {
        params.joinDate = this.searchForm.joinDate
      }
      if (this.searchForm.proTypeId != null) {
        params.proTypeId = this.searchForm.proTypeId
      }
      this.getData(params)
    },
    // 条件搜索事件
    onSearchSubmit(params) {
      this.loading = true
      const searchParams = {}
      if (this.searchForm.joinDate != null) {
        searchParams.joinDate = this.searchForm.joinDate
      }
      if (this.searchForm.proTypeId != null) {
        searchParams.proTypeId = this.searchForm.proTypeId
      }
      this.searchData = searchParams
      params = Object.assign(params, searchParams)
      this.getData(params)
    },
    // 重置条件搜索框
    restSearchForm() {
      this.$refs.searchForm.resetFields()
      this.getData()
      // this.onSortChange()
      this.pageIndex = 1
      this.pageSize = 20
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
          this.pageIndex = 1
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
          this.pageIndex = 1
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
          this.pageIndex = 1
          this.getData(params)
        }
      } else {
        // 清空排序条件，数据会恢复成未排序的状态
        this.$refs.TableForm.clearSort()
        this.sortTypeId = 0
        this.sortName = ''
      }
    }
  }
}
</script>
<style lang="scss">
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.cancerRecords {
  background: #fff;
  padding: 50px;
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.icon-minority{
    color: $bg;
    font-size: 20px;
  }
  .guardianInfo-span{
    color: $bg;
    margin-left: 10px;
}
</style>
