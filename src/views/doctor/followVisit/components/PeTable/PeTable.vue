<template>
  <el-table
    :data="pePackageList"
    style="width: 100%"
    border
    :header-cell-style="headerRow"
    :show-overflow-tooltip="true"
  >
    <el-table-column label="序号" align="center" width="75px">
      <template scope="scope">
        <span>{{ scope.$index + 1 }}</span>
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
        <petable-cell
          :prop="col.prop"
          :row="scope.row"
          :row-index="scope.$index + 1"
        ></petable-cell>
      </template>
    </el-table-column>
    <template slot="empty">
      <div class="noTableData">暂无数据</div>
    </template>
  </el-table>
</template>
<script>
import PetableCell from "./PetableCell.vue";
export default {
  components: { PetableCell },
  name: "Petable",
  props: {
    tableData: Array,
    tableCols: Array,
  },
  data() {
    return {
      pePackageList: this.tableData,
      cols: this.tableCols,
    };
  },
  watch: {
    tableData() {
      this.pePackageList = this.tableData;
    },
    tableCols() {
      this.cols = this.tableCols;
    },
  },
  methods: {
    headerRow({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#ecf1f5";
      } else {
        return "";
      }
    },
  },
};
</script>