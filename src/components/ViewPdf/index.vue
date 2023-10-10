<template>
  <div>
    <iframe
      :src="'/static/pdf/web/viewer.html?file=' + encodeURIComponent(pdfUrl)"
      width="100%"
      height="1100px"
      frameborder="0"
    ></iframe>
  </div>
</template>
<script>
export default {
  name: "Pdf",
  props: {
    pdfUrl: String,
  },
  data() {
    return {
      url: this.pdfUrl,
    };
  },
  watch: {},
  methods: {},
};
</script>
<style lang="scss" scope>
</style>


