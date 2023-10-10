<template>
  <div>
    <span v-if="prop == 'checkSignStr'">
      <el-tag
        v-if="row[prop] == '未登记'"
        type="danger"
      >未登记</el-tag>
      <el-tag
        v-if="row[prop] == '登记'"
        type="warning"
      >登记</el-tag>
      <el-tag
        v-if="row[prop] == '在检'"
        type="info"
      >在检</el-tag>
      <el-tag
        v-if="row[prop] == '科室结束'"
        type="warning"
      >科室结束</el-tag>
      <el-tag
        v-if="row[prop] == '预总检'"
        type="danger"
      >预总检</el-tag>
      <el-tag
        v-if="row[prop] == '总检审核'"
        type="danger"
      >总检审核</el-tag>
      <el-tag
        v-if="row[prop] == '报告打印'"
        type="danger"
      >报告打印</el-tag>
      <el-tag
        v-if="row[prop] == '报告交接'"
        type="success"
      >报告交接</el-tag>
      <el-tag
        v-if="row[prop] == '交接完成'"
        type="success"
      >交接完成</el-tag>
      <el-tag
        v-if="row[prop] == '已取消'"
        type="info"
      >已取消</el-tag>
    </span>
    <div v-else-if="prop == 'buttonList'">
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
      <!-- <el-dropdown
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
            >{{ item.title }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
    <span v-else-if="prop == '序号'">
      <el-popover v-if="row.isShowLabel" trigger="hover" placement="top">
        <p>随访便签: <span class="guardianInfo-span">{{ row.followVisitLabelNames }}</span></p>
        <p>阳性指征信息: <span class="guardianInfo-span">{{ row.followVisitIndicativeLabelNames }}</span></p>
        <div slot="reference" class="name-wrapper">
          <span style="font-weight:bold;"> {{ rowIndex }}</span>
        </div>
      </el-popover>
      <span v-else> {{ rowIndex }}</span>
    </span>
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
    <span v-else>{{ row[prop] }}</span>
  </div>
</template>

<script>
export default {
  name: 'VisitCell',
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
      showSelect: false
    }
  },
  watch: {
    row() {
      this.btnList = this.row.buttonList
      this.selectList = this.row.moreButtonList
      this.checkBtnList()
    }
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
      if (i === 21) {
        // 编辑
        this.$emit('editCaseJoinFollowVisit', this.row.casejoinFollowVisitId)
      }
      if (i === 22) {
        // 复制
        this.$emit('copyCaseJoinFollowVisit', this.row.casejoinFollowVisitId)
      }
      if (i === 50) {
        // 任务明细
        // this["changeDate"](this.row);
      }
      if (i === 52) {
        // 启用
        this.$emit('openCaseJoinFollowVisit', this.row.casejoinFollowVisitId)
      }
      if (i === 53) {
        // 删除
        this.$emit('delCaseJoinFollowVisit', this.row.casejoinFollowVisitId)
      }
      if (i === 51) {
        // 终止
        this.$emit('endCaseFollowVisitTask', this.row.casejoinFollowVisitId)
      }
      if (i === 54) {
        // 随访计划
      }
    },
    handleCommand(command) {
      this.handleClick(command)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.btn-dropDowm {
  margin-left: 10px;
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
