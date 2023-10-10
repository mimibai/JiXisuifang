<template>
  <div>
    <el-input placeholder="请输入内容" v-model="search" class="search-input" size="mini">
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
    </el-input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: "",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
$bg: #095fb0;
$active_bg: #054b8cff;
$light_gray: #ddd;
.search-input {
  .el-input__icon {
    cursor: pointer;
    font-size: 18px;
  }
}
</style>

