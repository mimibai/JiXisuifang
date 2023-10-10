<template>
  <div>
    <Banner
      :banner-list="bannerList"
      :height="height"
      :arrow="arrow"
      :indicator-position="indicatorPosition"
    />
    <div class="container">
      <div class="health-content">
          <h1>deps</h1>
      </div>
    </div>
  </div>
</template>
<script>
import Banner from '@/components/Banner/index'
export default {
  // 注册组件
  components: {
    Banner,
  },
  data() {
    return {
      height: '440px',
      arrow: 'never',
      indicatorPosition: 'none',
      bannerList: [
        {
          id: 1,
          alt: '',
          title: '',
          link: '',
          imgUrl: require('@/assets/screening/banner1.jpg'),
        },
      ],
    }
  },
  methods: {},
}
</script>
<style lang="scss" scope>
@import '~@/styles/variables.scss';
.health-content {
  padding: 60px 0;
}
.health-title {
  color: $bg;
  margin-bottom: 20px;
  line-height: 30px;
  .A_more {
    font-size: 16px;
    float: right;
  }
}
</style>
