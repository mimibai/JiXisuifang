<template>
  <div class="layout">
    <Header />
    <Breadcrumb />
    <app-main />
    <Footer />
  </div>
</template>
<script>
// import {Header, Footer, AppMain} from './components';
import Header from './components/Header.vue'
import Breadcrumb from '@/components/Breadcrumb/index'
import AppMain from './components/AppMain.vue'
import Footer from './components/Footer.vue'
export default {
  components: {
    Header,
    Breadcrumb,
    AppMain,
    Footer
  },
  data() {
    return {}
  },
  mounted: function() {
    const htmlDom = document.getElementsByTagName('html')[0]
    // const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
    if (this.$route.path !== '/') {
      htmlDom.style.fontSize = null
    }
  },
  methods: {}
}
</script>
<style lang="scss">
</style>
<style scoped>
.Breadcrumb {
  position: absolute;
  width: 1200px;
  overflow: hidden;
  z-index: 111;
  transform: translateX(-50%);
  left: 50%;
  font-size: 14px;
}
</style>

