<template>
  <div
    v-loading=""
    class="changePe-date"
  >
    <div
      v-show="isShowPatient"
      class="changePeDate-patient"
    >
      <el-descriptions :column="2">
        <template v-for="(item, index) in changePeDatePatientMation">
          <el-descriptions-item
            v-if="item.value != null && item.value.length > 0"
            :key="index"
            :label="item.title"
          >
            {{ item.value }}
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </div>
    <el-calendar v-model="value">
      <template
        slot="dateCell"
        slot-scope="{ date, data }"
      >
        <div
          class="data-container"
          :class="data.isSelected ? 'is-selected' : ''"
        >
          <div v-if="data.isSelected">{{ handleChoose(date, data) }}</div>
          <p>{{ data.day.split("-").slice(1).join("-") }}</p>
          <template v-for="(item, index) in datas">
            <p
              v-if="data.day === item.readableDate && item.freeCount > 0"
              :key="index"
            >
              余号：{{ item.freeCount }}
            </p>
            <p
              v-else-if="data.day === item.readableDate && item.freeCount === 0"
              :key="index"
            >
              无号
            </p>
          </template>
        </div>
      </template>
    </el-calendar>
    <div class="changePe-dateDetail">
      <div class="changePe-dateDetail-row">
        <el-row type="flex">
          <el-col :span="3">
            <h4><span class="hight">日期：</span></h4>
          </el-col>
          <el-col :span="21">
            <span>{{ today }}</span>
          </el-col>
        </el-row>
      </div>
      <div class="changePe-dateDetail-row">
        <el-row type="flex">
          <el-col :span="3">
            <h4><span class="hight">可选时间：</span></h4>
          </el-col>
          <el-col :span="21">
            <div v-if="hasPeTime">
              <template v-for="(item, index) in canChooseList">
                <el-button
                  :key="index"
                  round
                  size="mini"
                  class="changePe-date-btn"
                  :type="chooseTimeNum == index ? 'primary' : ''"
                  @click="chooseTimeClick(index, item.id)"
                >{{ item.name }}
                </el-button>
              </template>
            </div>
            <div v-else>暂无出诊排班信息！</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { PeriodList, PeriodDayList } from '@/api/peOrder'
import { parseTime } from '@/utils/index'
import { Message, MessageBox } from 'element-ui'
export default {
  props: {
    changePeDatePatient: Object,
    isShowPatient: Boolean,
    pePackageId: Number,
  },
  data() {
    return {
      value: new Date(),
      calendarLoading: true,
      datas: [],
      monthInterval: 3,
      today: '',
      nowDay: '',
      chooseTimeNum: null,
      canChooseList: [],
      changePeDatePatientMation: [],
      changePeDatePatientDetail: this.changePeDatePatient,
      chooseDate: '',
      chooseTime: '',
      hasPeTime: false, // 是否有出诊时间
    }
  },
  watch: {
    changePeDatePatient() {
      this.changePeDatePatientMation = this.changePeDatePatient
      this.showPePatient(this.changePeDatePatientMation)
    },
  },
  created() {
    this.fenchData()
  },
  methods: {
    handleChoose(date, data) {
      const day = data.day
      if (day < this.nowDay) {
        Message({
          message: '当前日期不可选！',
          type: 'error',
          duration: 5 * 1000,
        })
      } else {
        this.chooseTimeNum = null
        this.today = day
        this.getPeriodDayList(day, this.changePeDatePatientDetail.hospitalId)
      }
    },
    fenchData() {
      const DATE = new Date()
      const YEAR = DATE.getFullYear()
      const MONTH = DATE.getMonth()
      const DAY = DATE.getDate()
      const FUTUREDATE = new Date(YEAR, MONTH + this.monthInterval, DAY)
      const beginDate = parseTime(DATE, '{y}-{m}-{d}')
      this.today = beginDate
      this.nowDay = beginDate
      const endDate = parseTime(FUTUREDATE, '{y}-{m}-{d}')
      const param = {
        beginDate: beginDate,
        endDate: endDate,
      }
      // 获取从今天开始到n个月后总排班
      PeriodList(param)
        .then((res) => {
          const { Data } = res
          this.datas = Data
          this.calendarLoading = false
        })
        .catch((err) => {
          this.calendarLoading = false
        })
      // 展示当前人物信息
      this.showPePatient(this.changePeDatePatient)
      // 获取今天可选择时间段
      this.getPeriodDayList(
        this.today,
        this.changePeDatePatientDetail.hospitalId
      )
    },
    // 展示当前人物信息
    showPePatient(patientInfo) {
      console.log(patientInfo)
      this.changePeDatePatientMation = [
        {
          title: '体检号',
          value: patientInfo.checkCode,
        },
        {
          title: '体检套餐',
          value: patientInfo.pePackageName,
        },
        {
          title: '姓名',
          value: patientInfo.name,
        },
        {
          title: '性别',
          value: patientInfo.sex,
        },
        {
          title: '身份证号',
          value: patientInfo.idCardNo,
        },
        {
          title: '联系方式',
          value: patientInfo.phoneNumber,
        },
        {
          title: '当前预约时间',
          value: patientInfo.nowReserveTime,
        },
      ]
    },
    // 根据日期获取可预约时间段
    getPeriodDayList(date, hospitalId) {
      const param = {
        date: date,
        hospitalId: hospitalId,
        pePackageId: this.pePackageId,
      }
      PeriodDayList(param)
        .then((res) => {
          const { Code, Data } = res
          if (Code === 1) {
            this.canChooseList = Data.slice(1)
            this.hasPeTime = true
          } else {
            // 如果没有时间段，重置时间段,防止再次点击
            this.$emit('chooseTimeFun', {})
            this.hasPeTime = false
          }
        })
        .catch((err) => {
          // 如果没有时间段，重置时间段,防止再次点击
          this.$emit('chooseTimeFun', {})
          this.hasPeTime = false
        })
    },
    // 选择时间段
    chooseTimeClick(index, id) {
      this.chooseTimeNum = index
      this.chooseTime = id
      const chosePeDatas = {
        peReserveId: this.changePeDatePatientDetail.peReserveId,
        reserveTime: this.today,
        time: this.chooseTime,
        hospitalId: this.changePeDatePatientDetail.hospitalId,
        pePackageId:
          this.changePeDatePatientDetail.pePackageId || this.pePackageId,
        patientId: this.changePeDatePatientDetail.patientId,
        peReserveTemporaryId:
          this.changePeDatePatientDetail.peReserveTemporaryId,
      }
      this.$emit('chooseTimeFun', chosePeDatas)
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.changePe-date {
  .el-calendar-table .el-calendar-day {
    height: 50px;
    text-align: center;
  }
  .el-calendar-table td.is-today .data-container {
    background: $bg;
    color: #fff;
  }
  .el-calendar-table td.is-selected {
    background-color: #fdefe6;
    color: $bg;
  }
  .el-calendar-table .el-calendar-day {
    padding: 0;
  }
}
</style>
<style lang="scss" scope>
@import '~@/styles/variables.scss';
.changePe-date {
  .data-container {
    height: 100%;
    padding: 8px;
  }
}
.changePe-dateDetail {
  padding: 12px 20px;
}
.changePe-dateDetail-row {
  margin: 10px 0;
  .changePe-date-btn {
    margin-bottom: 10px;
    margin-right: 10px;
    margin-left: 10px;
  }
}
.hight {
  color: $bg;
}
</style>

