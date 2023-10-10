<template>
  <div
    v-loading="loading"
    class="dashboard-container"
  >
    <peorder-index
      :has-search-form="hasSearchForm"
      :is-have-create-role="isHaveCreateRole"
      :search-form="searchForm"
      :pe-order-list="peOrderList"
      :cols="cols"
      :url-params="urlParams"
      :page-count="pageCount"
      :is-null-object="isNullObject"
      @getData="getData"
      @GetSearchData="GetSearchData"
    />
  </div>
</template>
<script>
import PeorderIndex from './components/PeorderIndex.vue'
import { Message } from 'element-ui'
import { GetPEReserves } from '@/api/peOrder'
export default {
  name: 'PeOrders',
  components: {
    PeorderIndex
  },
  data() {
    return {
      loading: false, // 主体loading
      hasSearchForm: false, // 是否含有搜索
      searchForm: [], // 头部搜索
      isHaveCreateRole: false, // 是否有预约权限
      peOrderList: null, // 订单集合
      urlParams: {}, // 路径传过来的参数
      isNullObject: true, // urlParams是否为空对象
      cols: [
        // 订单集合列名
        { prop: '序号', label: '序号', width: '75px' },
        { prop: 'checkNo', label: '体检号', width: null },
        { prop: 'reservationType', label: '预约类型', width: null },
        { prop: 'reservationSource', label: '预约来源', width: null },
        { prop: 'name', label: '姓名', width: null },
        { prop: 'age', label: '年龄', width: '75px', sortable: 'custom' },
        { prop: 'sex', label: '性别', width: '75px' },
        { prop: 'pePackageName', label: '体检套餐', width: null },
        { prop: 'checkSignStr', label: '体检状态', width: null },
        {
          prop: 'registTime',
          label: '订单时间',
          width: null,
          sortable: 'custom'
        },
        {
          prop: 'reserveTime',
          label: '预约时间',
          width: null,
          sortable: 'custom'
        },
        { prop: 'buttonList', label: '功能', width: '300px' }
      ],
      pageCount: null,
      searchData: {} // 搜索参数
    }
  },
  created() {
    const pePackageId = this.$route.query.pePackageId
    const patientId = this.$route.query.patientId
    if (pePackageId || patientId) {
      this.urlParams.pePackageId = pePackageId
      this.urlParams.patientId = patientId
      this.getData(this.urlParams)
    } else {
      this.getData()
    }
    // 判断是否有路径传参，如果有则在路径传参基础上进行搜索
    this.isNullObject = JSON.stringify(this.urlParams) === '{}'
  },
  methods: {
    GetSearchData(data) {
      this.searchData = data
    },
    // 获取就诊人集合 获取页码
    getData(params) {
      if (params) {
        params = Object.assign(
          params,
          {
            sortTypeId: params.sortTypeId,
            sortName: params.sortName,
            pageSize: params.pageSize,
            page: params.page
          },
          this.searchData
        )
      }
      this.loading = TextTrackCueList
      GetPEReserves(params)
        .then((res) => {
          const { Data, Pages } = res
          this.peOrderList = Data.dataList
          this.isHaveCreateRole = Data.isHaveCreateRole
          if (Data.searchForm && Data.searchForm.length > 0) {
            this.searchForm = Data.searchForm
            this.hasSearchForm = true
            // 将params中的开始和结束日期回显到value中 防止查询过后value为空
            for (let index = 0; index < this.searchForm.length; index++) {
              const element = this.searchForm[index]
              if (element.name === 'beginReserveDate') {
                if (params === undefined) {
                  params = {}
                } else {
                  element.value = [
                    String(params.beginReserveDate),
                    String(params.endReserveDate)
                  ]
                }
              }
            }
          }
          this.pageCount = Pages
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          Message({
            message: '请稍后重试',
            type: 'error',
            duration: 5 * 1000
          })
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
