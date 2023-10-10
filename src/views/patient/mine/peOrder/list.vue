<template>
  <div class="mine-container-msg">
    <div
      v-loading="loading"
      class="order-wrapper"
    >
      <!-- <div class="order-search">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col :span="10">
            <div class="order-searchBox">
              <input
                ref="seachValue"
                v-model="seachvalue"
                class="searchBox-input"
                type="text"
                placeholder="搜索体检订单"
              >
              <el-button
                class="searchBox-btn"
                type="primary"
                icon="el-icon-search"
                @click="inputChange"
              />
            </div>
          </el-col>
          <el-col :span="13">
            <div class="block order-dateVant" />
          </el-col>
        </el-row>
      </div> -->
      <!-- 搜索表单 -->
      <div v-if="hasSearchForm">
        <el-form
          ref="searchForm"
          :model="{ searchForm }"
          :inline="true"
          :label-position="labelPosition"
          size="mini"
        >
          <template v-for="item in searchForm">
            <el-form-item
              v-if="
                item.type == 1 && item.name != 'startAge' && item.name != 'endAge' && item.name != 'checkCode'
              "
              :key="item.index"
              :label="item.title"
              :prop="item.name"
            >
              <el-col>
                <el-input
                  v-model="item.value"
                  :placeholder="'请填写' + item.title"
                  :style="'width:' + styleWidth"
                />
              </el-col>

            </el-form-item>
            <!-- <el-form-item
              v-if="item.type == 4 || item.type == 3"
              :key="item.index"
              :label="item.title"
              :prop="item.name"
            >
              <el-select
                v-model="item.value"
                :placeholder="'请选择' + item.title"
                :style="'width:' + styleWidth"
              >
                <el-option
                  v-for="(items, idx) in item.dataList"
                  :key="idx"
                  :label="items.name"
                  :value="String(items.id)"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item
              v-if="item.type == 5 && item.name == 'beginReserveDate'"
              :key="item.index"
              :label="item.title"
              :prop="item.name"
            >
              <!-- <el-date-picker
                v-model="item.value"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始日期"
                :style="'width:' + styleWidth"
              /> -->
              <el-date-picker
                v-model="item.value"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="mini"
                style="width:300px"
                :clearable="false"
              />
            </el-form-item>
            <!-- <el-form-item
              v-if="
                item.type==5
                &&
                item.name=='endReserveDate'"
              :key="
                item.index"
                :prop="item.name"
              >
                <el-date-picker
                  v-model="item.value"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择结束日期"
                  :style="'width:' + styleWidth"
                />
            </el-form-item> -->
            <el-form-item
              v-if="item.type == 1 && item.name == 'startAge'"
              :key="item.index"
              :label="item.title"
              :prop="item.name"
            >
              <el-input
                v-model="item.value"
                placeholder="请填写开始年龄"
                :style="'width:' + styleWidth"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 1 && item.name == 'endAge'"
              :key="item.index"
              :prop="item.name"
            >
              <el-input
                v-model="item.value"
                placeholder="请填写结束年龄"
                :style="'width:' + styleWidth"
              />
            </el-form-item>
          </template>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="searchPeorders"
            >查询</el-button>
            <el-button
              icon="el-icon-refresh-left"
              size="mini"
              @click="searchReset"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="order-topTabs">
        <el-row
          type="flex"
          justify="start"
        >
          <el-col
            v-for="(iten,index) in checklist"
            :key="iten.index"
            :span="4"
          >
            <div
              :class="index == currentIdx ? 'check checkBtn' : 'checkBtn'"
              @click="change(index)"
            >{{ iten.name }}</div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="newOrderList"
        style="width: 100%"
        border
        :header-cell-style="getRowClass"
      >
        <el-table-column
          v-for="(col, index) in cols"
          :key="index"
          :prop="col.prop"
          :label="col.label"
          align="center"
          :width="col.width"
        >
          <template slot-scope="scope">
            <peorder-cell
              :prop="col.prop"
              :row="scope.row"
              :row-index="(pageIndex-1)*pageSize+(scope.$index + 1)"
              @goToDetail="goToDetail"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div
        v-show="currentIdx==0"
        class="health-content-pagination"
        style="margin-top: 15px"
      >
        <el-pagination
          background
          :current-page="pageIndex"
          :page-size="pageSize"
          :page-sizes="[20, 40, 60, 80]"
          layout="sizes,prev,pager,next,jumper"
          :page-count="total"
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { GetPEReserves } from '@/api/peOrderPatient'
import PeorderCell from '@/views/doctor/screeningManagement/peOrders/components/PeorderCell.vue'
export default {
  components: {
    PeorderCell
  },
  data() {
    return {
      value111: '',
      loading: true,
      peEReservesDate: [],
      pePEGuidedInspection: [],
      checklist: [
        {
          name: '全部'
        },
        {
          name: '进行中'
        },
        {
          name: '待体检'
        },
        {
          name: '已完成'
        }
      ],
      cols: [
        // 订单集合列名
        { prop: '序号', label: '序号', width: '60px' },
        { prop: 'name', label: '预约人', width: '80px' },
        { prop: 'phone', label: '预约手机', width: '110px' },
        { prop: 'pePackageName', label: '体检套餐', width: '110px' },
        { prop: 'checkSignStr', label: '体检状态', width: '100px' },
        { prop: 'reserveTime', label: '预约时间', width: null },
        { prop: 'buttonList', label: '操作', width: null }
      ],
      currentIdx: 0,
      newOrderList: [],
      seachvalue: '',
      pageIndex: 1, // 当前页码
      pageSize: 20, // 每页数据条数
      total: null, // 总页数
      hasSearchForm: false, // 是否含有搜索
      searchForm: [], // 头部搜索
      searchFormData: {}, // 搜索值
      labelPosition: 'left', // 头部label样式
      styleWidth: '150px',
      searchData: {}
    }
  },
  created() {
    this.getData()
  },

  methods: {
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    getData: function(params) {
      if (params) {
        params = Object.assign(
          params,
          {
            // sortTypeId: this.sortTypeId,
            // sortName: this.sortName,
            pageSize: this.pageSize,
            page: this.pageIndex
          },
          this.searchData
        )
      }
      GetPEReserves(params).then((res) => {
        const { Data, Pages } = res
        const { dataList } = Data
        this.peEReservesDate = dataList
        this.newOrderList = dataList
        this.loading = false
        this.total = Pages
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
      })
    },
    // 搜索
    searchPeorders(parmas) {
      const searchParams = {}
      if (parmas === undefined) {
        parmas = {}
      }
      for (let index = 0; index < this.searchForm.length; index++) {
        const element = this.searchForm[index]
        // 处理开始和结束日期
        if (element.name === 'beginReserveDate') {
          for (let j = 0; j < element.value.length; j++) {
            searchParams['beginReserveDate'] = element.value[0]
            searchParams['endReserveDate'] = element.value[1]
          }
        } else if (element.name !== 'endReserveDate') {
          searchParams[element.name] = element.value
        }
      }
      this.searchData = searchParams
      parmas = Object.assign(parmas, searchParams)
      this.getData(parmas)
    },
    // 搜索重置
    searchReset() {
      this.$refs.searchForm.resetFields()
      this.getData()
      this.pageIndex = 1
      this.pageSize = 20
    },
    goToDetail(peReserveId) {
      this.$router.push({
        name: 'PeOrderDetail',
        params: { peReserveId: peReserveId }
      })
    },
    change: function(type) {
      this.currentIdx = type
      switch (type) {
        case 0:
          this.newOrderList = this.peEReservesDate
          break
        case 1:
          this.newOrderList = this.peEReservesDate.filter(function(item) {
            return item.checkSign > 200 && item.checkSign < 700
          })
          break
        case 2:
          this.newOrderList = this.peEReservesDate.filter(function(item) {
            return item.checkSign <= 200
          })
          break
        case 3:
          this.newOrderList = this.peEReservesDate.filter(function(item) {
            return item.checkSign === 900
          })
          break
        default:
          this.newOrderList = this.peEReservesDate
      }
    },
    inputChange() {
      this.currentIdx = 0
      const seachvalue = this.$refs.seachValue.value
      this.newOrderList = this.peEReservesDate.filter((item) => {
        if (item.pePackageName.includes(seachvalue)) {
          return item
        }
      })
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      const params = { pageSize: val }
      this.getData(params)
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.loading = true
      this.pageIndex = val
      const params = { page: val }
      this.getData(params)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.mine-container-msg {
  padding: 50px;
  background: #ffffff;
}
.order-searchBox {
  border: 1px solid $bg;
  width: 100%;
  border-radius: 5px;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  position: relative;
  .searchBox-input {
    width: 100%;
    padding: 0 10px;
    border: none;
    outline: none;
    &:focus {
      border: none;
    }
  }
  .searchBox-btn {
    width: 60px;
    height: 100%;
    border: none;
    cursor: pointer;
    background: $bg;
    position: absolute;
    right: 0;
    top: 0;
    line-height: 0px;
  }
}
.order-dateVant {
  .order-block {
    width: 100%;
    border: 1px solid $bg;
    width: 100%;
    border-radius: 5px;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
  }
}
.order-topTabs {
  margin: 20px 0;
  border-bottom: 1px solid #efefef;
  div.checkBtn {
    text-align: center;
    line-height: 40px;
    font-weight: 400;
    font-size: 16px;
    cursor: pointer;
    position: relative;
    &.check {
      color: $bg;
      &::before {
        content: '';
        display: block;
        width: 50%;
        height: 2px;
        background: $bg;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    &::after {
      content: '';
      display: block;
      width: 1px;
      height: 12px;
      background: #cecece;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.order-com {
  width: 100%;
  border-radius: 10px;
  background: #fdfaf8;
  margin-bottom: 30px;
  .order-com-top {
    padding: 10px 20px;
    border-bottom: 1px solid #ebeef5;
    line-height: 30px;
    font-weight: 600;
    .order-com-title {
      font-size: 18px;
    }
    .order-com-state {
      float: right;
    }
  }
  .order-com-btm {
    padding: 10px 20px;
    .order-com-info {
      line-height: 30px;
      font-size: 16px;
      span {
        display: inline-block;
        width: 75px;
        text-align: justify;
        text-align-last: justify;
        margin-left: 10px;
      }
      i {
        font-size: 20px;
        color: $bg;
        vertical-align: middle;
      }
    }
    .order-com-link {
      width: fit-content;
      margin: 30px auto 20px;
    }
  }
}
.icon-minority{
    color: $bg;
    font-size: 20px;
  }
  .guardianInfo-span{
    color: $bg;
    margin-left: 10px;
}
</style>
