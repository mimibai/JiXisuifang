<template>
  <div class="terminalHospitalInfo-cotent">
    <span class="span-one">{{ hospitalInfo.hospitalName }} </span>
    <span>{{ hospitalInfo.terminalName }}</span>
  </div>
</template>

<script>
export default {
  name: 'PaddHospitalInfo',
  props: {
    hospitalInfo: {
      type: Object,
      required: true,
      default() {
        return {
          hospitalName: '',
          terminalName: ''
        }
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
  .terminalHospitalInfo-cotent{
    padding: 10px 0;
    text-align: center;
    color: $bg;
    font-size: 20px;
    .span-one{
      margin-right: 10px;
    }
  }
</style>

