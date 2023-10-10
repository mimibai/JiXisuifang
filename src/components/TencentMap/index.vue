<template>
  <div>
    <div
      id="MapContainer"
      style="width:100%; height:580px"
      :marker="marker"
    ></div>
  </div>
</template>
<script>
import qqmapPlus from 'qqmap-plus'
export default {
  name: 'TencentMap',
  props: {
    hospitalLoacation: Object,
  },
  data() {
    return {
      map: null,
      getAddress: null,
      getAddCode: null,
      mapKey: '',
      hospitalL: {},
      addressKeyword: '',
      marker: '',
      mapParameter: {
        mapKey: 'DKGBZ-4LFKX-KU64T-7DIZI-2K537-OTFF6', //刘勉账号申请
        center: 'center',
        zoom: 16,
      },
    }
  },
  watch: {
    hospitalLoacation() {
      console.log('sdasd')
      this.hospitalL = this.hospitalLoacation
      this.init()
    },
  },
  methods: {
    init() {
      let that = this
      console.log(that.hospitalLoacation)
      qqmapPlus.init(
        that.mapParameter.mapKey,
        () => {
          let center = new qq.maps.LatLng(
            that.hospitalL.latitude,
            that.hospitalL.longitude
          ) //你需要定位的经纬度
          let map = new qq.maps.Map(document.getElementById('MapContainer'), {
            center: center,
            zoom: that.mapParameter.zoom,
          })
          //这个是动态图标
          let anchor = new qq.maps.Point(6, 6),
            size = new qq.maps.Size(24, 24),
            origin = new qq.maps.Point(0, 0),
            icon = new qq.maps.MarkerImage(
              'https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/center.gif',
              size,
              origin,
              anchor
            )
          this.marker = new qq.maps.Marker({
            icon: icon,
            map: map,
            position: center,
          })
        },
        ['geometry']
      )
    },
  },
}
</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 400px;
  margin: 0 auto;
}
</style>

