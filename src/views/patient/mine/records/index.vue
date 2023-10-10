<template>
  <div class="Records">
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      border
      :header-cell-style="getRowClass"
    >
      <el-table-column
        prop="patientName"
        label="姓名"
        align="center"
      > </el-table-column>
      <el-table-column label="住院状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.stateId == 1">未入院</span>
          <span v-if="scope.row.stateId == 2">住院中</span>
          <span v-if="scope.row.stateId == 3">已出院</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="expectInpatientDate"
        label="预约入院日期"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="inpatientDatetime"
        label="入院时间"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="leaveDatetime"
        label="出院时间"
        align="center"
      > </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button
            v-for="n in row.buttonList"
            :key="n.index"
            size="small"
          >{{ n.title }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <Upload :imgUrl="imgUrl" :limit="6" :file-list="fileList" @getUrl="getUrl" @handleRemove="handleRemove" ></Upload> -->
  </div>
</template>
<script>
import Upload from '@/components/Upload/index'
import { GetInpatientRecordList } from '@/api/recordsPatient'
export default {
  data() {
    return {
      tableData: [],
      fileList: [],
      imgUrl: '',
    }
  },
  created() {
    // this.getData();
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
    getData() {
      GetInpatientRecordList({ patientId: 7 }).then((response) => {
        const { Data } = response
        // console.log(response);
        this.tableData = Data.list
        // console.log(this.tableData);
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
    //子级获取上传文件的链接
    getUrl(getUrl) {
      this.delUrl = getUrl
    },
    // 子级删除当前文件的链接（如果接受文件路径是数组时 使用此方法）
    handleRemove(url) {
      console.log(url)
      const delurl = this.temp.images.indexOf(url)
      this.temp.images.splice(delurl, 1)
    },
  },
  components: {
    Upload,
  },
}
</script>
<style lang="scss">
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.Records {
  background: #fff;
  padding: 50px;
}
</style>