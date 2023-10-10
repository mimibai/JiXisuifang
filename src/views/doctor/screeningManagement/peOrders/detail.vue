<template>
  <div
    v-loading:loading
    class="detail-container"
  >
    <el-row
      type="flex"
      justify="center"
    >
      <el-col
        :lg="22"
        :xl="18"
      >
        <h5 class="patient-title">检查订单详情</h5>
        <div class="patient-detail pePatient">
          <el-descriptions :column="columnCount">
            <el-descriptions-item label="检查号">{{
              patientData.checkNo
            }}</el-descriptions-item>
            <el-descriptions-item label="检查套餐">{{
              patientData.pePackageName
            }}</el-descriptions-item>
            <el-descriptions-item label="检查单位">{{
              patientData.hospitalName
            }}</el-descriptions-item>
            <el-descriptions-item label="预约时间">{{ patientData.reserveDate
            }}&nbsp;&nbsp;{{ patientData.reserveTime }}</el-descriptions-item>
            <el-descriptions-item label="检查状态">{{
              patientData.checkState
            }}</el-descriptions-item>
            <el-descriptions-item label="预约来源">{{
              patientData.reservationSource
            }}</el-descriptions-item>
            <el-descriptions-item label="预约类型">{{
              patientData.reservationType
            }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{
              patientData.name
            }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{
              patientData.sex
            }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{
              patientData.age
            }}</el-descriptions-item>
            <el-descriptions-item label="婚姻状态">{{
              patientData.marriage
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              patientData.phone
            }}</el-descriptions-item>
            <el-descriptions-item label="民族">{{
              patientData.nation
            }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{
              patientData.address
            }}</el-descriptions-item>
            <el-descriptions-item label="预约医生">
              <span v-html="patientData.expectDoctor" />
            </el-descriptions-item>
            <el-descriptions-item label="医生备注">{{
              patientData.doctorRemark
            }}</el-descriptions-item>
          </el-descriptions>
          <div>
            <el-form
              ref="peDetailForm"
              :model="peDetailForm"
              label-position="right"
              label-width="45px"
            >
              <el-form-item label="备注:">
                <el-input
                  v-model="peDetailForm.remark"
                  :autosize="{ minRows: 2, maxRows: 5}"
                  type="textarea"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <h5 class="patient-title">检查项目</h5>
        <el-alert
          :title="patientData.pePackageDetailCountText"
          type="success"
        />
        <div class="patient-peTable">
          <el-table
            v-loading="pePackageListLoading"
            :data="pePackageList"
            style="width: 100%"
            border
            :show-overflow-tooltip="true"
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
                  :row-index="scope.$index + 1"
                />
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="noTableData">
                暂无数据
                <!--，或点击 <span @click="getMakeList(1)">“刷新”</span>-->
              </div>
            </template>
          </el-table>
          <div class="patient-btns">
            <template v-for="(item, index) in btnList">
              <el-button
                :key="index"
                type="primary"
                @click="handleClick(item.clickTypeId, peReserveId)"
              >{{ item.title }}</el-button>
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { GetPEReserve, CancelPEReserve } from '@/api/peOrder'
import PeorderCell from './components/PeorderCell.vue'
import { Message, MessageBox } from 'element-ui'
export default {
  components: {
    PeorderCell
  },
  data() {
    return {
      loading: true, // 全局loading
      pePackageListLoading: false, // 表格loading
      peReserveId: null, // 订单id
      peDetailForm: {},
      patientData: {
        remark: ''
      },
      pePackageList: [],
      btnList: [],
      columnCount: 5, // 每行个数
      cols: [
        // 订单集合列名
        { prop: '序号', label: '序号', width: null },
        { prop: 'peItemName', label: '检查项目名称', width: null },
        { prop: 'peDepartmentName', label: '所属科室', width: null },
        { prop: 'sex', label: '性别', width: null },
        { prop: 'peItemPrice', label: '项目价格', width: null }
      ]
    }
  },
  created() {
    this.peReserveId = this.$route.params.peReserveId
    this.fenchData({ peReserveId: this.peReserveId })
  },
  methods: {
    fenchData(param) {
      this.pePackageListLoading = true
      GetPEReserve(param).then((res) => {
        const { Data } = res
        this.patientData = Data
        this.peDetailForm.remark = Data.remark
        if (Number(this.patientData.nation) === 0) {
          this.patientData.nation = ''
        }
        // Data.addItems体检加项，合并数组一起展示
        const arry = [...Data.addItems, ...Data.pePackageDetails]
        this.pePackageList = arry
        this.btnList = Data.buttonList
        this.loading = false
        this.pePackageListLoading = false
      })
    },
    handleClick(clickTypeId, peReserveId) {
      // 取消预约
      if (clickTypeId === 30) {
        this.cancelPEReserve({ peReserveId: peReserveId })
      }
    },
    // 取消预约
    cancelPEReserve(param) {
      MessageBox.confirm('你确定要取消当前预约吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CancelPEReserve(param).then((res) => {
          const { Code } = res
          if (Code === 1) {
            Message({
              message: '取消成功！',
              type: 'success',
              duration: 5 * 1000
            })
            this.$router.push({
              path: '/doctor/screeningManagement/peOrders'
            })
          }
        })
      })
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss">
.pePatient .el-descriptions-item__container .el-descriptions-item__label {
  font-weight: bold;
}
</style>
<style lang="scss" scope>
@import '~@/styles/variables.scss';
.detail-container {
  padding-top: 30px;
}
.patient-title {
  color: $bg;
  text-align: center;
  margin: 22px 0;
}
.patient-btns {
  margin-top: 22px;
  text-align: center;
}
</style>
