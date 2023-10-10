<template>
  <div>
    <div class="dashboard-container">
      <el-row
        type="flex"
        justify="space-between"
        :gutter="20"
      >
        <el-col :span="15">
          <div
            class="dashboard-box"
            v-loading="calendarLoading"
          >
            <el-row
              type="flex"
              :gutter="20"
              justify="space-between"
            >
              <el-col :span="13">
                <div class="dashboard-calendarBox">
                  <el-calendar v-model="dateValue">
                    <template
                      slot="dateCell"
                      slot-scope="{ date, data }"
                    >
                      <div>
                        <template v-for="(item, index) in dailyDatas">
                          <div>
                            <div
                              v-if="data.day == item.nowDate"
                              :key="index"
                              class="daily-container"
                              :class="data.isSelected ? 'is-selected' : ''"
                            >
                              <div v-if="data.isSelected">{{ handleChoose(date, data,item) }}</div>
                              <template v-if="item.followVisitTaskDetailData.length > 0 || item.caseJoinProtocolData.length > 0">
                                <el-popover
                                  placement="top-start"
                                  width="300"
                                  trigger="hover"
                                >
                                  <div>
                                    <div v-for="(otem,otemIndex) in item.followVisitTaskDetailData">
                                      <el-row
                                        type="flex"
                                        class="dailyTask-detail"
                                        v-if="otemIndex <3 "
                                      >
                                        <el-col :span="8">{{otem.taskTypeName}}</el-col>
                                        <el-col :span="5">{{otem.patientName}}</el-col>
                                        <el-col :span="11">{{otem.taskName}}</el-col>
                                      </el-row>
                                    </div>
                                    <div v-for="(otem,otemIndex) in item.caseJoinProtocolData">
                                      <el-row
                                        type="flex"
                                        class="dailyTask-detail"
                                        v-if="otemIndex <3 "
                                      >
                                        <el-col :span="8">早筛</el-col>
                                        <el-col :span="5">{{otem.patientName}}</el-col>
                                        <el-col :span="11">{{otem.followupProtocolName}}</el-col>
                                      </el-row>
                                    </div>
                                  </div>
                                  <div
                                    slot="reference"
                                    :class="data.isSelected ? 'days has-task days-select' : 'days has-task'"
                                  >
                                    <div>{{ data.day.split('-').slice(2).join()}}</div>
                                  </div>
                                </el-popover>
                              </template>
                              <template v-else>
                                <div :class="data.isSelected ? 'days days-select' : 'days'">
                                  <div>{{ data.day.split('-').slice(2).join()}}</div>
                                </div>
                              </template>
                            </div>
                            <!-- <div
                              v-else
                              class="daily-container"
                              :class="data.isSelected ? 'is-selected' : ''"
                            >
                              <div v-if="data.isSelected">{{ handleChoose(date, data) }}</div>
                              <div :class="data.isSelected ? 'days days-select' : 'days'">
                                <div>{{ data.day.split('-').slice(2).join()}}</div>
                              </div>
                            </div> -->
                          </div>
                        </template>
                      </div>
                    </template>
                  </el-calendar>
                </div>
              </el-col>
              <el-col :span="11">
                <div class="daily-task-container">
                  <div class="daily-task-date">
                    <el-row type="flex">
                      <el-col
                        :lg="6"
                        :md="8"
                      >
                        <span class="big-date">{{dailyTaskDate.day}}</span>
                      </el-col>
                      <el-col
                        :lg="18"
                        :md="16"
                      >
                        <p class="week-date">{{dailyTaskDate.detailDay}}</p>
                        <p class="week-date">{{dailyTaskDate.week}}</p>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="daily-task-lists">
                    <div v-if="dailyTaskList != null && (dailyTaskList.followVisitTaskDetailData.length > 0 || dailyTaskList.caseJoinProtocolData.length > 0)">
                      <div v-for="(otem,otemIndex) in dailyTaskList.followVisitTaskDetailData">
                        <router-link :to="{path:'/doctor/followVisit/pubilcPlan/detail',query:{caseFollowVisitTaskDetailId:otem.caseFollowVisitTaskDetailId}}">
                          <el-row
                            type="flex"
                            class="daily-task-lists-item s"
                          >
                            <el-col :span="3">
                              <span v-if="otem.taskTypeId ===1"><img src="@/assets/doctorPlan/wenjuan.png"></span>
                              <span v-if="otem.taskTypeId ===2"><img src="@/assets/doctorPlan/tixing.png"></span>
                              <span v-if="otem.taskTypeId ===3"><img src="@/assets/doctorPlan/tijian.png"></span>
                            </el-col>
                            <el-col :span="5">{{otem.patientName}}</el-col>
                            <el-col :span="11">{{otem.taskName}}</el-col>
                            <el-col :span="5">{{otem.stateName}}</el-col>
                          </el-row>
                        </router-link>
                      </div>
                      <div v-if="dailyTaskList.isExistMoreFollowVisitTaskDetailData === true">
                        <router-link to="/doctor/followVisit/myPlan">
                          <el-button
                            size="small"
                            type="primary"
                          >查看更多</el-button>
                        </router-link>
                      </div>
                      <div v-for="(otem,otemIndex) in dailyTaskList.caseJoinProtocolData">
                        <router-link :to="{path:'/doctor/screeningManagement/survey',query:{caseJoinProtocolId:otem.caseJoinProtocolId,patientId:otem.patientId}}">
                          <el-row
                            type="flex"
                            class="daily-task-lists-item t"
                          >
                            <el-col :span="3">
                              <img src="@/assets/doctorPlan/jilu.png">
                            </el-col>
                            <el-col :span="5">{{otem.patientName}}</el-col>
                            <el-col :span="11">{{otem.followupProtocolName}}</el-col>
                            <el-col :span="5">{{otem.assessStateName}}</el-col>
                          </el-row>
                        </router-link>
                      </div>
                      <div v-if="dailyTaskList.isExistMoreCaseJoinProtocolData === true">
                        <router-link :to="{path:'/doctor/screeningManagement/cancerRecord',query:{doctorId:dailyTaskList.doctorId}}">
                          <el-button
                            size="small"
                            type="primary"
                          >查看更多</el-button>
                        </router-link>
                      </div>
                    </div>
                    <el-empty
                      v-else
                      description="当日无事项需处理"
                    ></el-empty>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <!--快捷操作-->
          <template v-if="checkPermission([6,7,8,12,14,16])">
            <div class="dashboard-box">
              <h4 class="big-tit">
                {{shortcutOperationsData.title}}
              </h4>
              <div class="dashboard-desc">
                <el-row
                  type="flex"
                  :gutter="20"
                >
                  <el-col
                    :span="6"
                    v-for="(item,index) in shortcutOperationsData.dataList"
                  >
                    <div class="card-panel">
                      <router-link :to="item.requestUrl +'?operatTypeId='+ item.requestparameters.operatTypeId">
                        <div class="card-panel-img">
                          <svg-icon icon-class="jilu" />
                        </div>
                        <div class="card-panel-desc">
                          {{item.showNmae}}
                        </div>
                      </router-link>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </template>
          <!--随访任务列表-->
          <template v-if="checkPermission([6,14])">
            <div class="dashboard-box">
              <h4 class="big-tit">
                我的随访任务列表
              </h4>
              <div class="dashboard-desc">
                <my-plan
                  ref="myplanList"
                  :taskPoolList="taskPoolList"
                  @getData="getCaseDetailByPersonalList"
                  :cols="taskCols"
                >
                </my-plan>
              </div>
            </div>
          </template>

          <!--体检预约列表-->
          <template v-if="checkPermission([8,15,16])">
            <div class="dashboard-box">
              <h4 class="big-tit">
                今日癌筛预约列表
              </h4>
              <div class="dashboard-desc">
                <!-- 早筛条目 -->
                <peorder-index
                  :peOrderList="peOrderList"
                  :hasSearchForm="hasSearchForm"
                  :isHaveCreateRole="isHaveCreateRole"
                  @getData="getPeOrederList"
                  :cols="cols"
                >
                </peorder-index>
              </div>
            </div>
          </template>

        </el-col>
        <el-col :span="9">
          <!--随访任务-->
          <template v-if="checkPermission([6,14])">
            <div class="dashboard-box">
              <card-box :cardData="followVisitData"></card-box>
            </div>
          </template>
          <!--预约-->
          <template v-if="checkPermission([8,15,16])">
            <div class="dashboard-box">
              <card-box :cardData="pEStaticsData"></card-box>
            </div>
          </template>
          <!--癌筛-->
          <template v-if="checkPermission([7,11,12])">
            <div class="dashboard-box">
              <card-box :cardData="caseJoinProtocolStatics"></card-box>
            </div>
          </template>
          <!--满意度调查-->
          <div class="dashboard-box">
            <card-box :cardData="voteStatics"></card-box>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import iCell from '@/views/doctor/layout/components/iCell.vue'
import PeorderCell from '@/views/doctor/screeningManagement/peOrders/components/PeorderCell.vue'
import CardBox from './compents/cardBox.vue'
import myPlan from '@/views/doctor/followVisit/myPlan/components/myPlan.vue'
import peorderIndex from '@/views/doctor/screeningManagement/peOrders/components/PeorderIndex.vue'
import { Message, MessageBox } from 'element-ui'

// import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import {
  getDailyInformation,
  getFollowVisitStatics,
  getShortcutOperations,
  getPEStatics,
  getCaseJoinProtocolStatics,
  getVoteStatics,
  getCaseDetailByPersonalList,
  getPEReserves,
} from '@/api/doctorMain'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['roles']),
  },
  components: {
    iCell,
    PeorderCell,
    CardBox,
    myPlan,
    peorderIndex,
  },
  // directives: { permission },
  data() {
    return {
      calendarLoading: true,
      dateValue: new Date(),
      currentDate: {
        year: '',
        month: '',
      }, //日历点击后的时间
      dailyDatas: [],
      dailyTaskDate: {},
      dailyTaskList: null,
      followVisitData: {}, //随访统计
      shortcutOperationsData: {}, //快捷操作
      pEStaticsData: {}, //预约统计
      caseJoinProtocolStatics: {}, //癌筛统计
      voteStatics: {}, //满意度调查
      peOrderListLoading: false,
      peOrderList: null, // 预约订单集合
      hasSearchForm: false,
      isHaveCreateRole: false,
      cols: [
        // 预约订单集合列名
        { prop: 'name', label: '姓名', width: null },
        { prop: 'sex', label: '性别', width: '75px' },
        { prop: 'pePackageName', label: '体检套餐', width: null },
        { prop: 'checkSignStr', label: '体检状态', width: null },
        { prop: 'reserveTime', label: '预约时间', width: null },
        { prop: 'buttonList', label: '功能', width: '340px' },
      ],
      taskPoolList: null, //我的任务集合
      taskListLoading: false, //我的任务集合loading
      taskCols: [
        // 列名集合
        { prop: 'taskTypeId', label: '任务类型', width: null },
        { prop: 'patientName', label: '姓名', width: null },
        { prop: 'followVisitPlanName', label: '参与方案名称', width: null },
        { prop: 'startDateTime', label: '任务时间', width: null },
        { prop: 'buttonList', label: '功能', width: '340px' },
      ],
      weekArr: [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ],
    }
  },
  watch: {
    $route() {
      // console.log('acs')
    },
  },
  activated() {
    // console.log('44cs')
  },
  created() {
    this.loadData()
    this.$nextTick(() => {
      // 点击前一个月
      let prevBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(1)'
      )
      prevBtn.addEventListener('click', (e) => {
        let d = new Date(this.dateValue)
        let year = d.getFullYear()
        let month = d.getMonth() + 1
        let resDate = year + '-' + this.handleTime(month) + '-' + d.getDate() //2020-10
        this.currentDate.year = year
        this.currentDate.month = month
        this.getDaily(resDate)
      })
      //点击下一个月
      let nextBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(3)'
      )
      nextBtn.addEventListener('click', (e) => {
        let d = new Date(this.dateValue)
        let year = d.getFullYear()
        let month = d.getMonth() + 1
        let resDate = year + '-' + this.handleTime(month) + '-' + d.getDate() //2020-12
        this.currentDate.year = year
        this.currentDate.month = month
        this.getDaily(resDate)
      })
      //点击今天
      let todayBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(2)'
      )
      todayBtn.addEventListener('click', (e) => {
        let d = new Date(this.dateValue)
        let year = d.getFullYear()
        let month = d.getMonth() + 1
        let resDate = year + '-' + this.handleTime(month) + '-' + d.getDate() //2021-11
        this.currentDate.year = year
        this.currentDate.month = month
        this.getDaily(resDate)
      })
    })
    //当前年月
    let d = new Date()
    this.currentDate.year = d.getFullYear()
    this.currentDate.month = d.getMonth() + 1
  },
  methods: {
    /*
     *角色id对应角色
     *1为admin        管理员
     *2为Doctor       医生
     *为Patient       患者
     *5为SystemAdmin  超级管理员
     *6为CaseManager  随访
     *7为EarlyCancerManager  癌筛
     *8为PeManager 体检
     */
    checkPermission,
    loadData() {
      //随访任务
      if (this.checkPermission([6, 14])) {
        this.getFollowVisitStatics()

        this.getCaseDetailByPersonalList()
      }
      //快捷操作
      if (this.checkPermission([6, 7, 8, 12, 14, 16])) {
        this.getShortcutOperations()
      }

      //癌筛统计
      if (this.checkPermission([7, 11, 12])) {
        this.getCaseJoinProtocolStatics()
      }
      if (this.checkPermission([8, 15, 16])) {
        //体检统计
        this.getPeOrederList()
        //预约统计
        this.getPEStatics()
      }
      this.getDaily()
      this.getVoteStatics()
    },
    //日历
    getDaily(date) {
      this.calendarLoading = true
      getDailyInformation({ myMonth: date }).then((res) => {
        const { Data } = res
        this.dailyDatas = Data
        this.calendarLoading = false
      })
    },
    //随访任务
    getFollowVisitStatics() {
      getFollowVisitStatics()
        .then((res) => {
          const { Data } = res
          this.followVisitData = Data
        })
        .catch((err) => {})
    },
    //快捷操作
    getShortcutOperations() {
      getShortcutOperations()
        .then((res) => {
          const { Data } = res
          this.shortcutOperationsData = Data
        })
        .catch((err) => {})
    },
    //预约统计
    getPEStatics() {
      getPEStatics()
        .then((res) => {
          const { Data } = res
          this.pEStaticsData = Data
        })
        .catch((err) => {})
    },
    //癌筛统计
    getCaseJoinProtocolStatics() {
      getCaseJoinProtocolStatics()
        .then((res) => {
          const { Data } = res
          this.caseJoinProtocolStatics = Data
        })
        .catch((err) => {})
    },
    //满意度调查统计
    getVoteStatics() {
      getVoteStatics()
        .then((res) => {
          const { Data } = res
          this.voteStatics = Data
        })
        .catch((err) => {})
    },
    //获取随访任务列表
    getCaseDetailByPersonalList(parmas) {
      if (parmas) {
        parmas = Object.assign({
          sortTypeId: parmas.sortTypeId,
          sortName: parmas.sortName,
        })
      } else {
        parmas = {}
      }
      this.taskListLoading = true
      getCaseDetailByPersonalList(parmas)
        .then((res) => {
          console.log(parmas)
          const { Data } = res
          this.taskPoolList = Data.list
          this.taskListLoading = false
        })
        .catch((err) => {
          this.taskListLoading = false
        })
    },
    //获取体检订单列表
    getPeOrederList(params) {
      this.peOrderListLoading = true
      getPEReserves(params)
        .then((res) => {
          const { Data } = res
          this.peOrderList = Data.list
          this.peOrderListLoading = false
        })
        .catch((err) => {
          // console.log(err)
          Message({
            message: '请稍后重试',
            type: 'error',
            duration: 5 * 1000,
          })
          this.peOrderListLoading = false
        })
    },

    handleChoose(date, data, taskDetail) {
      const day = data.day
      let d = new Date(day)
      let dYear = d.getFullYear()
      let dMonth = d.getMonth() + 1
      let showDay = d.getDate()
      let showWeek = this.weekArr[d.getDay()]
      let showDetailDay = dYear + '年' + dMonth + '月' + showDay + '日'
      //日历右侧展示日期信息
      this.dailyTaskDate = {
        week: showWeek,
        day: showDay,
        detailDay: showDetailDay,
      }
      //日历右侧任务列表
      this.dailyTaskList = taskDetail
      //判断当前点击月是否大与日历展示的月
      const { year, month } = this.currentDate
      if (year != dYear || month != dMonth) {
        this.currentDate.year = dYear
        this.currentDate.month = dMonth
        this.getDaily(day)
      }
    },
    handleTime(s) {
      return s < 10 ? '0' + s : s
    },
  },
}
</script>
<style lang="scss" scoped>
.dashboard-calendarBox .el-calendar-table .el-calendar-day {
  height: 55px;
}
.dashboard {
  &-container {
    background: #a9a9a914;
    min-height: calc(100vh - 84px);
    padding: 20px;
    box-sizing: border-box;
    margin: 0;
  }
  &-box {
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    background: #ffffff;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style lang="scss" >
@import '~@/styles/variables.scss';
.dashboard-calendarBox .el-calendar-table .el-calendar-day {
  height: 55px;
}
.dashboard-desc .table_warpper {
  padding: 0;
}
.dashboard-desc .table_info {
  padding: 0;
}

.daily-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.daily-task-date {
  padding: 12px 20px;
  .big-date {
    font-size: 60px;
    font-weight: bold;
    color: $bg;
  }
  .week-date {
    font-size: 14px;
    color: #bbbbbb;
    padding: 8px 0;
  }
}
.daily-task-lists {
  padding: 0 20px;
  .daily-task-lists-item {
    padding: 10px 0;
  }
}
.days {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  line-height: 26px;
  text-align: center;
  font-size: 14px;
  color: #000;
  transition: all 0.3s;
  position: relative;
  &:hover {
    background: #c18355;
    color: #ffffff;
  }
  &.has-task {
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      height: 6px;
      width: 6px;
      border-radius: 50%;
      background: #969ea5;
    }
  }
  &.days-select {
    background: $bg;
    color: #ffffff;
    &:after {
      background: $bg;
      border: 1px solid #ffffff;
    }
  }
}
.dailyTask-detail {
  text-align: center;
}

.right-ico {
  display: block;
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: #969ea5;
}
.big-tit {
  color: $bg;
  padding: 15px 20px;
  border-bottom: 1px solid #efefef;
}
.dashboard-desc {
  padding: 20px 15px;
}
.card-panel {
  text-align: center;
  &-img {
    font-size: 60px;
    color: $bg;
  }
  &-desc {
    margin-top: 15px;
  }
}
.card-panel:hover {
  .card-panel-img {
    color: $activeBg;
  }
}
</style>
