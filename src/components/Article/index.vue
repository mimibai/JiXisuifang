<template>
  <div>
    <div class="article_tit">
      <h2 class="content-title">{{ articleContent.title }}</h2>
      <p class="source_p">
        <span v-if="articleContent.formatDate"> 发布日期：{{ articleContent.formatDate }} </span>
        <span v-if="articleContent.author"> 作者：{{ articleContent.author }} </span>
      </p>
    </div>
    <div class="article_con">
      <div v-html="articleContent.content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Article',
  props: ['articleContent'],
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.content-title {
  text-align: center;
  color: $bg;
}
.source_p {
  text-align: center;
  color: #999999;
  padding: 15px 0;
  border-bottom: 1px solid #ededed;
  overflow: hidden;
  margin-bottom: 20px;

  span {
    margin: 0 10px;
  }
}
</style>
