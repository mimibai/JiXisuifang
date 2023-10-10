<template>
  <div>
    <baidu-map
      id="baidumap"
      class="map"
      :ak="map.ak"
      :center="{lng: hospitalL.longitude, lat:hospitalL.latitude}"
      :zoom="map.zoom"
      :scroll-wheel-zoom="map.scroll"
    >
      <bm-marker
        :position="{lng: hospitalL.longitude, lat:hospitalL.latitude}"
        animation="BMAP_ANIMATION_BOUNCE"
      />
    </baidu-map>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'// 用什么引入什么就好，路径在下载的github项目中可以看到
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
export default {
  name: 'Map',
  components: {
    BaiduMap,
    BmMarker
  },
  props: ['hospitalLoacation'],
  data() {
    return {
      map: {
        ak: 'mIWmCLi8l46K7IWwMLri9b7OKSxDh86t',
        zoom: 18, // 1-18，数值越大离地面越近，地图实际面积越小
        scroll: true // 支持滚动鼠标缩放
      }
    }
  },
  computed: {
    hospitalL() {
      return this.hospitalLoacation
    }
  },
  watch: {
    'hospitalLoacation': function(val) {
      this.hospitalLoacation = val
    }
  }
}
</script>
<style lang="scss" scoped>
    .map{
        width:100%;
        height:400px;
        margin: 0 auto;
    }
</style>

