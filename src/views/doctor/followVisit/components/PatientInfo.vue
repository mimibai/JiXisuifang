<template>
  <div>
    <el-descriptions :column="2">
      <el-descriptions-item label="姓名">{{
        patientInfo.patientName
      }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{
        patientInfo.gender
      }}</el-descriptions-item>
      <el-descriptions-item label="民族">{{
        patientInfo.nation
      }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{
        patientInfo.idCardNo
      }}</el-descriptions-item>
      <el-descriptions-item label="联系方式"
        ><span class="font-color-orange">{{
          patientInfo.mobileNumber
        }}</span></el-descriptions-item
      >
    </el-descriptions>
  </div>
</template>
<script>
export default {
  data() {
    return {
      patientInfo: this.patientData,
    };
  },
  props: {
    patientData: Object,
  },
  watch: {
    patientData() {
      this.patientInfo = this.patientData;
    },
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scope>
.font-color-orange {
  color: #b2642a;
}
</style>