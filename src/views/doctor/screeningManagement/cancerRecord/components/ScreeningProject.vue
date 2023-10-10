<template>
  <div>
    <h3 class="survey-main-content-tit">筛查项目</h3>
    <h3 class="survey-main-content-subtit">系统推荐项目</h3>
    <el-table
      ref="multipleTable"
      :data="recommendList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :header-cell-style="getRowClass"
      border
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="体检项目名称" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.checkItemName }}</template>
      </el-table-column>
      <el-table-column label="性别" width="90" align="center">
        <template slot-scope="scope">{{ scope.row.objectSex }}</template>
      </el-table-column>
      <el-table-column label="所属科室" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.objectDept }}</template>
      </el-table-column>
      <el-table-column label="项目价格" width="90" align="center">
        <template slot-scope="scope">{{ scope.row.objectPrice }}</template>
      </el-table-column>
      <el-table-column label="关联癌种" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.releatedcancers }}</template>
      </el-table-column>
    </el-table>
    <h3 class="survey-main-content-subtit">体检订单关联</h3>
    <el-table
      ref="showPEReserveList"
      :data="showPEReserveList"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="getRowClass"
      border
    >
      <el-table-column type="expand" label="操作" width="60" align="center">
        <template>
          <el-table
            ref="showPEReserveDetailList"
            :data="showPEReserveDetailList"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="getRowClass"
            border
          >
            <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
            <el-table-column
              label="序号"
              type="index"
              width="90"
              align="center"
            >
            </el-table-column>
            <el-table-column label="体检项目名称" width="240" align="center">
              <template slot-scope="scope">{{ scope.row.peItemName }}</template>
            </el-table-column>
            <el-table-column label="性别" width="240" align="center">
              <template slot-scope="scope">{{ scope.row.sex }}</template>
            </el-table-column>
            <el-table-column label="所属科室" width="240" align="center">
              <template slot-scope="scope">{{
                scope.row.peDepartmentName
              }}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="体检号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.checkCode }}</template>
      </el-table-column>
      <el-table-column label="姓名" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.patientName }}</template>
      </el-table-column>
      <el-table-column label="套餐名称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.pePackageName }}</template>
      </el-table-column>
      <el-table-column label="预约日期" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.registTime }}</template>
      </el-table-column>
      <el-table-column label="下单时间" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.reserveTime }}</template>
      </el-table-column>
      <el-table-column label="体检标志" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.checkSignStr }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      multipleSelection: [],
    };
  },
  props: {
    recommendList: {
      type: Array,
    },
    showPEReserveList: {
      type: Array,
    },
    showPEReserveDetailList: {
      type: Array,
    },
  },
  created() {},
  methods: {
    //设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style lang="scss">
@import "~@/styles/variables.scss";
.survey-main-content-tit {
  text-align: center;
  color: $bg;
}
.survey-main-content-subtit {
  text-align: left;
  color: $bg;
  font-weight: normal;
  margin: 20px 0;
}
</style>