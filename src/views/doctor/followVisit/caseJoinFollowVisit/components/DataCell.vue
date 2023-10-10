<template>
  <div>
    <div v-if="prop == 'buttonList'">
      <el-button
        v-for="(item, i) in btnList"
        :key="i"
        :type="item.type"
        size="small"
        @[eventName]="
          handleClick({
            clickTypeId: item.clickTypeId,
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
            }"
          >{{ item.title }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <span v-else-if="prop == '序号'">
      {{ rowIndex }}
    </span>
    <span v-else-if="prop == 'stateId'">
      <el-tag v-if="row[prop] === 1">等待执行</el-tag>
      <el-tag
        v-else-if="row[prop] === 2"
        type="warning"
      >进行中</el-tag>
      <el-tag
        v-else-if="row[prop] === 3"
        type="danger"
      >已完成</el-tag>
      <el-tag
        v-else-if="row[prop] === 4"
        type="success"
      >已超期</el-tag>
      <el-tag
        v-else-if="row[prop] === 5"
        type="warning"
      >超期完成</el-tag>
      <el-tag
        v-else-if="row[prop] === 6"
        type="info"
      >已作废</el-tag>
      <template v-else>{{ row[prop] }}</template>
    </span>
    <span v-else>
      <el-tag
        v-if="row[prop] === true"
        type="success"
      >是</el-tag>
      <el-tag
        v-else-if="row[prop] === false"
        type="danger"
      >否</el-tag>
      <template v-else>{{ row[prop] }}</template>
    </span>
  </div>
</template>

<script>
export default {
  name: 'VisitCell',
  props: {
    prop: String,
    row: Object,
    rowIndex: Number,
    pageSize: Number,
    page: Number,
  },
  data() {
    return {
      eventName: 'click',
      btnList: this.row.buttonList,
      selectList: this.row.moreButtonList,
      showSelect: false,
    }
  },
  watch: {
    row() {
      this.btnList = this.row.buttonList
      this.selectList = this.row.moreButtonList
      this.checkBtnList()
    },
  },
  created() {
    this.checkBtnList()
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
    // 动态绑定操作按钮的点击事件
    handleClick(param) {
      const i = param.clickTypeId
      // console.log(i)
      if (i == 24) {
        // 随访任务详情
        const params = {
          caseFollowVisitTaskDetailId: this.row.caseFollowVisitDetailId,
          pageSize: this.pageSize,
          page: this.page,
        }
        this.$router.push({
          path: '/doctor/followVisit/pubilcPlan/detail',
          query: params,
        })
      }
      if (i == 57) {
        // 停用随访计划
        const params = {
          caseFollowVisitTaskId: this.row.caseFollowVisitTaskId,
          casejoinFollowVisitId: this.row.casejoinFollowVisitId,
        }
        this.$emit('stopFollowPlan', params)
      }
      if (i == 55) {
        // 编辑随访计划
        const params = {
          caseJoinFollowVisitId: this.row.casejoinFollowVisitId,
          caseFollowVisitTaskId: this.row.caseFollowVisitTaskId,
        }
        this.$emit('editCaseFollowPlan', params)
      }
      if (i == 56) {
        // 删除随访计划
        const params = {
          caseJoinFollowVisitId: this.row.casejoinFollowVisitId,
          caseFollowVisitTaskId: this.row.caseFollowVisitTaskId,
        }
        this.$emit('delCaseFollowPlan', params)
      }
      if (i == 58) {
        // 编辑随访任务
        const params = {
          caseJoinFollowVisitId: this.row.casejoinFollowVisitId,
          caseFollowVisitTaskDetailId: this.row.caseFollowVisitDetailId,
        }
        this.$emit('editFollowVisitTask', params)
      }
      if (i == 59) {
        // 删除随访任务
        const params = {
          caseJoinFollowVisitId: this.row.casejoinFollowVisitId,
          caseFollowVisitTaskDetailId: this.row.caseFollowVisitDetailId,
        }
        this.$emit('delCaseFollowVisitDetail', params)
      }
      if (i == 60) {
        // 作废随访任务
        // this["changeDate"](this.row);
        const params = {
          caseJoinFollowVisitId: this.row.casejoinFollowVisitId,
          caseFollowVisitTaskDetailId: this.row.caseFollowVisitDetailId,
        }
        this.$emit('canceledTask', params)
      }
      if (i == 52) {
        // 启用
      }
      if (i == 73) {
        // 上移随访计划
        const params = {
          caseJoinFollowVisitId: this.row.casejoinFollowVisitId,
          caseFollowVisitTaskId: this.row.caseFollowVisitTaskId,
        }
        this.$emit('moveUpCaseFollowVisitPlan', params)
      }
      if (i == 74) {
        // 下移随访计划
        const params = {
          caseJoinFollowVisitId: this.row.casejoinFollowVisitId,
          caseFollowVisitTaskId: this.row.caseFollowVisitTaskId,
        }
        this.$emit('moveDownCaseFollowVisitPlan', params)
      }
    },
    handleCommand(command) {
      this.handleClick(command)
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-dropDowm {
  margin-left: 10px;
}
</style>
