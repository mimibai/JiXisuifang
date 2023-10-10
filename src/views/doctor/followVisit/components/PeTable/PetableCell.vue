<template>
  <div>
    <span>{{ row[prop] }}</span>
  </div>
</template>
<script>
export default {
  name: "PetableCell",
  props: {
    prop: String,
    row: Object,
  },
  data() {
    return {};
  },
  watch: {},
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.btn-dropDowm {
  margin-left: 10px;
}
</style>