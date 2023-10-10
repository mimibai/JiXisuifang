<template>
  <div>
    <span
      v-if="
        prop != 'buttonList' &&
          prop != 'assessStateId' &&
          prop != 'taskTypeId' &&
          prop != 'startDateTime' &&
          prop != 'isEnable' &&
          prop != 'isCycle' &&
          prop != 'isNeedReturnVisit'&&
          prop != 'abnormalData'&&
          prop != 'patientName'
      "
    >{{ row[prop] }}</span>
    <!--患者未成年判定-->
    <span v-else-if="prop == 'patientName'">
      <el-popover v-if="row.isShowGuardianInfo" trigger="hover" placement="top">
        <p>监护人姓名: <span class="guardianInfo-span">{{ row.guardianName }}</span></p>
        <p>监护人监护人证件类型: <span class="guardianInfo-span">{{ row.guardianDocumentTypeName }}</span></p>
        <p>监护人证件号: <span class="guardianInfo-span">{{ row.guardianCertificateNo }}</span></p>
        <div slot="reference" class="name-wrapper">
          <span>{{ row[prop] }}</span>
          <span class="icon-minority">
            <svg-icon icon-class="minority" />
          </span>
        </div>
      </el-popover>
      <span v-else>{{ row[prop] }}</span>
    </span>
    <span v-if="prop == 'assessStateId'">
      <el-tag
        v-if="row[prop] == 1"
        type="danger"
      >进行中</el-tag>
      <el-tag
        v-if="row[prop] == 2"
        type="warning"
      >下机</el-tag>
      <el-tag
        v-if="row[prop] == 3"
        type="success"
      >完成</el-tag>
    </span>
    <!-- 医生随访公共任务 -->
    <span v-if="prop == 'taskTypeId'">
      <span
        v-if="row[prop] == 1"
        class="taskSpan"
        style="color: #2498e9"
      ><img src="@/assets/doctorPlan/wenjuan.png">问卷</span>
      <span
        v-if="row[prop] == 2"
        class="taskSpan"
        style="color: #fc8013"
      ><img src="@/assets/doctorPlan/tixing.png">提醒</span>
      <span
        v-if="row[prop] == 3"
        class="taskSpan"
        style="color: #e03843"
      ><img src="@/assets/doctorPlan/tijian.png">体检</span>
    </span>
    <span v-if="prop == 'startDateTime'">
      <span
        v-if="row[prop] < today"
        class="dataSpan"
        style="color: #cb3412"
      >{{ row[prop] }}<img src="@/assets/doctorPlan/chaoshi.png"></span>
      <span v-if="row[prop] >= today">{{ row[prop] }}</span>
    </span>

    <!-- 随访任务回访状态 -->
    <div v-if="prop == 'abnormalData'">
      <span
        v-if="abnormalDataList.length>0"
        style="color:#F69036"
      >
        <span
          v-for="(item, i) in abnormalDataList"
          :key="i"
        >
          <span v-if="i==0">{{ item.currentOperationDoctorName }} {{ item.abnormalTypeName }} {{ item.currentDateTime }}</span></span>
        <el-dropdown
          v-if="showAbnormalMore"
          class="btn-dropDowm"
          @command="handleCommand"
        >
          <span><i class="el-icon-arrow-down el-icon--right" /></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item,index) in abnormalDataList"
              :key="index"
            >{{ item.currentOperationDoctorName }} {{ item.abnormalTypeName }} {{ item.currentDateTime }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>

    <!-- 随访方案列表 -->
    <span
      v-if="
        prop == 'isEnable' || prop == 'isCycle' || prop == 'isNeedReturnVisit'
      "
    >
      <el-tag
        v-if="row[prop] === true"
        type="success"
      >是</el-tag>
      <el-tag
        v-else-if="row[prop] === false"
        type="danger"
      >否</el-tag>
    </span>
    <div v-if="prop == 'buttonList'">
      <el-button
        v-for="(item, i) in btnList"
        :key="i"
        :type="item.type"
        size="small"
        @[eventName]="
          handleClick({
            clickTypeId: item.clickTypeId,
            title: item.title,
            state:
              item.clickTypeId == 9 && row.isPublicResult == true ? '1' : '2',
          })
        "
      >{{ item.title }}</el-button>
      <el-dropdown
        v-if="showSelect"
        class="btn-dropDowm"
        @command="handleCommand"
      >
        <el-button size="small">
          更多功能<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in selectList"
            :key="item.clickTypeId"
            :command="{
              clickTypeId: item.clickTypeId,
              state:
                item.clickTypeId == 9 && row.isPublicResult == true ? '1' : '2',
            }"
          >{{ item.title }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <span v-if="prop == '序号'">
      {{ rowIndex }}
    </span>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import { parseTime } from '@/utils/index'
import { deleteCase } from '@/api/doctor'
export default {
  name: 'ICell',
  props: {
    prop: String,
    row: Object,
    rowIndex: Number
  },
  data() {
    return {
      eventName: 'click',
      btnList: this.row.buttonList,
      selectList: this.row.moreButtonList,
      showSelect: false,
      showAbnormalMore: false,
      operatTypeId: 3, // 1.新建，3编辑
      today: null, // 随访任务时间
      abnormalDataList: this.row.abnormalData
    }
  },
  watch: {
    row() {
      this.btnList = this.row.buttonList
      this.selectList = this.row.moreButtonList
      this.checkBtnList()
      this.abnormalDataList = this.row.abnormalData
    }
  },
  created() {
    this.checkBtnList()
    this.nowDay()
    this.checkAbnormalDataList()
  },
  methods: {
    // 如果moreButtonList个数大于1，则显示更多工能按钮
    checkBtnList() {
      if (
        this.row.moreButtonList != null &&
        this.row.moreButtonList.length >= 1
      ) {
        this.showSelect = true
      } else {
        this.showSelect = false
      }
    },
    // 如果回访条数大于1，则显示下拉按钮
    checkAbnormalDataList() {
      if (this.row.abnormalData != null && this.row.abnormalData.length > 1) {
        this.showAbnormalMore = true
      } else {
        this.showAbnormalMore = false
      }
    },
    nowDay() {
      const DATE = new Date()
      const beginDate = parseTime(DATE, '{y}-{m}-{d}')
      this.today = beginDate
    },
    // 动态绑定操作按钮的点击事件
    handleClick(param) {
      const i = param.clickTypeId
      // console.log(i)
      if (i === 6) {
        // 编辑
        this['edit']()
      }
      if (i === 7) {
        // 删除
        this['delete']()
      }
      if (i === 8) {
        // 筛查明细
        this['detail']()
      }
      if (i === 9) {
        // 更改报告状态
        this['changeState'](param.state)
      }
      // if (i == 38) {
      //   //医生建议
      //   this["advice"]();
      // }
      if (i === 38 || i === 78) {
        // 评估报告 || 医生指摘
        this['report'](param.clickTypeId)
      }
      // 下机
      if (i === 27) {
        this['susPend']()
      }
      // 上机
      if (i === 28) {
        this['restart']()
      }
      // 随访公共任务详情
      if (i === 24) {
        this['planDetail']()
      }
      // 随访公共任务领取
      if (i === 23) {
        this['claimTask']()
      }
      // 随访个人任务作废
      if (i === 60) {
        this['terminationTask']()
      }
      // 随访个人任务退回
      if (i === 61) {
        this['sendBackTask']()
      }
      // 随访个人任务提醒
      if (i === 62) {
        this['repeatTask']()
      }
      // 随访方案列表编辑
      if (i === 15) {
        this['editPlan']()
      }
      // 随访方案列表中的任务停用
      if (i === 20) {
        this['closeTask']()
      }
      // 随访方案列表中的任务编辑
      if (i === 18) {
        this['createTask']()
      }
      // 随访方案列表中的任务开启
      if (i === 19) {
        this['openTask']()
      }
      // 随访方案列表启用
      if (i === 16) {
        if (param.title === '开启') {
          this['openPlan']()
        }
        if (param.title === '停用') {
          this['closePlan']()
        }
      }
      // 随访方案列表中的任务编辑
      if (i === 58) {
        this['createCase']()
      }
      // 随访方案列表中的任务上移
      if (i === 71) {
        this['moveUpTask']()
      }
      // 随访方案列表中的任务下移
      if (i === 72) {
        this['moveDownTask']()
      }
      // 随访方案复制
      if (i === 75) {
        this['copyPlan']()
      }
      // 随访方案详情
      if (i === 79) {
        this['goSchemePlanDetail']()
      }
      // 随访方案任务详情
      if (i === 80) {
        this['goSchemePlanTaskDetail']()
      }
    },
    handleCommand(command) {
      this.handleClick(command)
    },
    // 医生建议
    advice() {
      this.$emit('docAdvice', {
        CaseJoinProtocolId: this.row.caseJoinProtocolId
      })
    },
    // 评估报告  医生指摘 通过clickTypeId跳转后显示评估报告或者医生指摘
    report(clickTypeId) {
      this.$emit('MyReport', {
        caseJoinProtocolId: this.row.caseJoinProtocolId,
        patientId: this.row.patientId,
        isFinish: this.row.isFinish,
        clickTypeId: clickTypeId,
        isShowDoctorCensure: this.row.isShowDoctorCensure
      })
    },
    // 更改报告状态
    changeState(state) {
      this.$emit('changeItemState', {
        CaseJoinProtocolId: this.row.caseJoinProtocolId,
        type: state
      })
    },
    // 筛查明细
    detail() {
      // alert("新增~");
      // console.log(this.row.caseJoinProtocolId)
      this.$router.push({
        name: 'survey',
        query: {
          caseJoinProtocolId: this.row.caseJoinProtocolId,
          patientId: this.row.patientId,
          isShowDoctorCensure: this.row.isShowDoctorCensure
        }
      })
    },
    // 编辑
    edit() {
      const param = {
        caseJoinProtocolId: this.row.caseJoinProtocolId,
        followupProtocolId: this.row.followupProtocolId,
        patientId: this.row.patientId,
        operatTypeId: this.operatTypeId
      }
      this.$router.push({
        path: '/doctor/screeningManagement/addScreeningPatient/edit',
        query: param
      })
    },
    // 删除
    delete() {
      // alert("删除~");
      MessageBox.confirm('您确定删除该记录?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = { caseJoinProtocolIds: this.row.caseJoinProtocolId }
        deleteCase(param).then((response) => {
          if (response.Code === 1) {
            Message({
              message: response.Msg,
              type: 'success',
              duration: 5 * 1000
            })
            this.$emit('deleteCase')
          }
        })
      })
    },
    // 上机
    restart() {
      const param = this.row
      this.$emit('restart', param)
    },
    // 下机
    susPend() {
      const param = this.row
      this.$emit('susPend', param)
    },
    // 随访任务领取
    claimTask() {
      const param = this.row
      this.$emit('claimTask', param)
    },
    // 随访个人任务作废
    terminationTask() {
      const param = this.row
      this.$emit('terminationTask', param)
    },
    // 随访个人任务退回
    sendBackTask() {
      this.$emit('sendBackTask', {
        caseFollowVisitTaskDetailId: this.row.caseFollowVisitTaskDetailId
      })
    },
    // 随访个人任务编辑
    createCase() {
      if (this.row.casejoinFollowVisitId) {
        this.$emit('createCase', {
          operatTypeId: 3,
          caseFollowVisitTaskDetailId: this.row.caseFollowVisitTaskDetailId,
          caseJoinFollowVisitId: this.row.casejoinFollowVisitId
        })
      } else if (this.row.caseJoinFollowVisitId) {
        this.$emit('createCase', {
          operatTypeId: 3,
          caseFollowVisitTaskDetailId: this.row.caseFollowVisitTaskDetailId,
          caseJoinFollowVisitId: this.row.caseJoinFollowVisitId
        })
      }
    },
    // 随访任务详情
    planDetail() {
      const caseFollowVisitTaskDetailId = this.row.caseFollowVisitTaskDetailId
      this.$router.push({
        path: '/doctor/followVisit/pubilcPlan/detail',
        query: {
          caseFollowVisitTaskDetailId
        }
      })
    },
    // 随访个人任务重新发送任务提醒
    repeatTask() {
      this.$emit('repeatTask', {
        caseFollowVisitTaskDetailId: this.row.caseFollowVisitTaskDetailId
      })
    },
    // 随访方案中的任务编辑
    createTask() {
      const param = this.row
      this.$emit('createTask', param)
    },
    // 随访方案停用
    closePlan() {
      this.$emit('closePlan', {
        followVisitPlanId: this.row.followVisitplanId
      })
    },
    // 随访方案开启
    openPlan() {
      this.$emit('openPlan', {
        followVisitPlanId: this.row.followVisitplanId
      })
    },
    // 随访方案编辑
    editPlan() {
      const param = this.row
      this.$emit('editPlan', param)
    },
    // 随访方案复制
    copyPlan() {
      const param = this.row
      this.$emit('copyPlan', param)
    },
    // 随访方案中的任务停用
    closeTask() {
      this.$emit('closeTask', {
        followVisitTaskId: this.row.followVisitTaskId
      })
    },
    // 随访方案中的任务开启
    openTask() {
      this.$emit('openTask', {
        followVisitTaskId: this.row.followVisitTaskId
      })
    },
    // 随访方案中的任务上移
    moveUpTask() {
      this.$emit('moveUpTask', {
        followVisitTaskId: this.row.followVisitTaskId
      })
    },
    // 随访方案中的任务下移
    moveDownTask() {
      this.$emit('moveDownTask', {
        followVisitTaskId: this.row.followVisitTaskId
      })
    },
    // 随访方案详情
    goSchemePlanDetail() {
      this.$emit('goSchemePlanDetail', {
        followVisitPlanId: this.row.followVisitplanId
      })
    },
    // 随访方案任务详情
    goSchemePlanTaskDetail() {
      this.$emit('goSchemePlanTaskDetail', {
        followVisitTaskId: this.row.followVisitTaskId
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.btn-dropDowm {
  margin-left: 10px;
}
.taskSpan img {
  vertical-align: middle;
  margin-right: 15px;
}
.dataSpan img {
  position: absolute;
  right: 2px;
  top: 2px;
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
