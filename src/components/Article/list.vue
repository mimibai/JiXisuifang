<template>
  <div>
    <div v-for="item in articleList" :key="item.id">
      <div v-if="item.isDisplay == 0" class="health-article-item">
        <a @click="goToArticle(item.articleId)">
          <el-row type="flex" justify="space-between" :gutter="15">
            <el-col :span="5" style="text-align: center;vertical-align: text-top;">
              <el-image
                ref="lazyImg"
                lazy
                :fit="fit"
                class="vx-lazyLoad"
                :src="item.imageUrl.length > 0 ?item.imageUrl:defaultImage"
                :preview-src-list="[item.imageUrl]"
              >
                <div slot="placeholder" class="image-slot">
                  <i class="el-icon-loading" />加载中
                </div>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-col>
            <el-col :span="20" class="span_date">
              <h4>{{ item.title }}</h4>
              <div v-if="item.articleContent" class="article-content">
                {{ item.articleContent }}
              </div>
              <div v-if="item.formatDate">{{ item.formatDate }}</div>
            </el-col>
          </el-row>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Article',
  props: [''],
  data() {
    return {
      fit: 'scale-down',
      defaultImage: require('@/assets/common/artcleDefult.png')
    }
  },
  methods: {
    goToArticle(id) {
      this.$router.push({
        name: 'Article',
        params: { id: id }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
