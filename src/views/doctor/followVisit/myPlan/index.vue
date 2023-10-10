<template>
  <div
    v-loading="mainLoading"
    class="dashboard-container"
  >
    <my-plan
      ref="myplanList"
      :checklist="checklist"
      :taskPoolList="taskPoolList"
      :pageCount="pageCount"
      :cols="cols"
      @getData="getData"
      @GetSearchData="GetSearchData"
      :searchForm="searchForm"
    >
    </my-plan>
  </div>
</template>
<script>
import { getCaseDetailByPersonalList } from '@/api/followVisits'
import myPlan from '@/views/doctor/followVisit/myPlan/components/myPlan.vue'
export default {
  components: {
    myPlan,
  },
  data() {
    return {
      cols: [
        // 列名集合
        { prop: '序号', label: '序号', width: '75px' },
        { prop: 'taskTypeId', label: '任务类型', width: null },
        { prop: 'patientName', label: '姓名', width: '75px' },
        { prop: 'mobileNumber', label: '手机号', width: null },
        { prop: 'followVisitPlanName', label: '参与方案名称', width: null },
        {
          prop: 'startDateTime',
          label: '任务时间',
          width: null,
          sortable: 'custom',
        },
        { prop: 'runTime', label: '随访时长', width: null },
        { prop: 'executiveId', label: '执行人类别', width: null },
        { prop: 'stateName', label: '任务状态', width: null },
        { prop: 'abnormalData', label: '回访信息', width: '130px' },
        { prop: 'taskSource', label: '任务来源', width: null },
        { prop: 'buttonList', label: '功能', width: '350px' },
      ],
      taskPoolData: null,
      taskPoolList: null,
      searchForm: null,
      pageCount: null, // 总页数
      caseList: null, // 就诊人列表集合
      mainLoading: true, // 全局loading
      checklist: [],
      stateId: 1,
      createCaseForm: [], // 新建随访方案集合
      createCaseSubmitData: {},
      searchData: {},
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData: function (parmas) {
      this.mainLoading = true
      const queryStateId = this.$route.query.stateId
      if (queryStateId) {
        this.stateId = queryStateId
        this.currentIdx = queryStateId
      }
      if (parmas) {
        parmas = Object.assign(
          {
            stateId: parmas.stateId,
            sortTypeId: parmas.sortTypeId,
            sortName: parmas.sortName,
            pageSize: parmas.pageSize,
            page: parmas.page,
          },
          this.searchData
        )
      } else {
        parmas = {
          stateId: this.stateId,
        }
      }
      getCaseDetailByPersonalList(parmas).then((res) => {
        this.taskPoolData = res.Data
        this.pageCount = res.Pages
        this.taskPoolList = res.Data.list
        this.searchForm = res.Data.searchForm
        //将params中的开始和结束日期回显到value中 防止查询过后value为空
        for (let index = 0; index < this.searchForm.length; index++) {
          const element = this.searchForm[index]
          if (element.name == 'startExecuteDate') {
            if (parmas == undefined) {
              parmas = {}
            } else {
              element.value = [
                String(parmas.startExecuteDate),
                String(parmas.endExecuteDate),
              ]
            }
          }
        }
        this.mainLoading = false
        // this.taskListLoading = false
        this.checklist = [
          {
            name: '待随访',
            num: res.Data.notStartCount,
            stateId: 1,
          },
          {
            name: '已随访',
            num: res.Data.onGoingCount,
            stateId: 2,
          },
          {
            name: '已作废',
            num: res.Data.cancelCount,
            stateId: 6,
          },
          {
            name: '全部',
            num: res.Data.allCount,
            stateId: null,
          },
        ]
      })
    },
    GetSearchData(data) {
      this.searchData = data
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: $bg;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  /*color: $bg;*/
  cursor: pointer;
}
.dashboard {
  &-container {
    margin: 30px 0 0;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>