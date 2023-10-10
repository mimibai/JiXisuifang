<template>
  <div
    v-loading="loading"
    class="dashboard-container"
  >
    <!-- 搜索表单 -->
    <div v-if="hasSearchForm">
      <el-form
        ref="searchForm"
        :model="{ searchForm }"
        :inline="true"
        label-width="100px"
        :label-position="labelPosition"
      >
        <template v-for="item in searchForm">
          <el-form-item
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
          </el-form-item>
          <el-form-item
            v-if="item.type == 5"
            :key="item.index"
            :label="item.title"
            :prop="item.name"
          >
            <el-col>
              <el-date-picker
                v-model="item.value"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
                :style="'width:' + styleWidth"
              />
            </el-col>
          </el-form-item>
          <el-form-item
            v-if="item.type == 1"
            :key="item.index"
            :label="item.title"
            :prop="item.name"
          >
            <el-input
              v-model="item.value"
              :placeholder="'请填写' + item.title"
              :style="'width:' + styleWidth"
            />
          </el-form-item>
          <el-form-item
            v-if="item.type == 24"
            :key="item.index"
            :label="item.title"
            :prop="item.name"
          >
            <div
              class="form-transfer-div"
              :class="item.disabled ?'form-transfer-div-disabled' :''"
              @click="peItemDialog(item)"
            >
              <span
                v-for="(peName, peIndex) in item.dialogpeformTransShowValue"
                :key="peIndex"
                class="form-transfer-peName"
              >
                {{ peName }}
              </span>
            </div>
          </el-form-item>
        </template>
      </el-form>
      <div class="primaryBtn">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="searchPeorders"
        >查询</el-button>
        <el-button
          icon="el-icon-refresh-left"
          @click="searchReset"
        >重置</el-button>
      </div>
      <!--  -->
      <el-dialog
        :title="'请输入'"
        :visible.sync="dialogpeItem"
        width="45%"
        append-to-body
      >
        <el-transfer
          v-model="transferValue"
          :titles="transferTit"
          filterable
          filter-placeholder="请输入"
          :data="searchFormTransferData"
        >
          <span
            slot-scope="{option}"
            class="csdf"
            :title="option.label"
          >{{ option.label }}</span>
        </el-transfer>

        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogpeItem = false">取 消</el-button>
          <el-button
            type="primary"
            @click="peItemDialogSubmit()"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 新增就诊人参与随访方案 -->
    <div class="addNewPeOrder">
      <el-button
        v-if="isHaveCreateRole"
        class="opButton"
        type="primary"
        icon="el-icon-plus"
        :loading="createBtnLoading"
        @click="createCaseJoinFollowVisit"
      >新建记录</el-button>
    </div>
    <!--方案目录 -->
    <el-table
      ref="followVisitListTable"
      v-loading="caseJoinFollowVisitListLoading"
      :data="caseJoinFollowVisitList"
      style="width: 100%"
      border
      :show-overflow-tooltip="true"
      :header-cell-style="getRowClass"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandChange"
      @sort-change="onSortChange"
    >
      <!--子表格-->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="childTable-wrapper">
            <el-tabs
              v-model="activeTaskTabName"
              type="border-card"
              @tab-click="handleTaskTabClick"
            >
              <template v-for="(item, index) in scope.row.moreButtonList">
                <el-tab-pane
                  :key="index"
                  :label="item.title"
                  :casejoin-follow-visit-id="scope.row.casejoinFollowVisitId"
                  :name="String(item.clickTypeId)"
                >
                  <div class="addScheButtonContent">
                    <template v-if="activeTaskTabName == '54'">
                      <div class="explan-btn-out">
                        <!--1、等待执行 2、进行中 3、已完成 4、已超期 5、超期完成 6、已作废-->
                        <!--状态为1、等待执行,2、进行中显示-->
                        <el-button
                          v-if="isHaveBatchDeleteRole"
                          class="opButton"
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          :loading="createBtnLoading"
                          :disabled="canBatchDeleteVist"
                          @click="batchDeleteVist(scope.row.casejoinFollowVisitId)"
                        >批量删除</el-button>
                        <el-button
                          v-if="isHaveBatchCancelRole"
                          class="opButton"
                          type="primary"
                          icon="el-icon-close"
                          size="mini"
                          :loading="createBtnLoading"
                          :disabled="canBatchStopVist"
                          @click="batchStopVist(scope.row.casejoinFollowVisitId)"
                        >批量停用</el-button>
                        <el-button
                          v-if="
                            (scope.row.stateId == 1 || scope.row.stateId == 2) &&isHaveCreateRole
                          "
                          class="addScheButton"
                          type="primary"
                          size="mini"
                          icon="el-icon-plus"
                          @click="
                            addFollowVistPlan(scope.row.casejoinFollowVisitId)
                          "
                        >添加计划</el-button>
                      </div>
                      <data-table
                        ref="planListTable"
                        :data-list="planList"
                        :need-select-table="true"
                        :cols="planCols"
                        :data-list-loading="planListTableLoading"
                        @getFollowPlanList="getFollowPlanList"
                        @editFollowVistPlan="editFollowVistPlan"
                      />
                    </template>
                    <template v-if="item.clickTypeId == '50'">
                      <div class="explan-btn-out">
                        <!--状态为进行中显示-->
                        <!--1、等待执行 2、进行中 3、已完成 4、已超期 5、超期完成 6、已作废-->
                        <el-button
                          v-if="scope.row.stateId == 2"
                          class="addScheButton"
                          type="primary"
                          size="mini"
                          icon="el-icon-plus"
                          @click="
                            addFollowVistTask(scope.row.casejoinFollowVisitId)
                          "
                        >添加任务</el-button>
                      </div>
                      <data-table
                        ref="taskListTable"
                        :data-list="taskList"
                        :cols="taskCols"
                        :data-list-loading="taskListTableLoading"
                        :page-size="pageSize"
                        :page="currentPage"
                        @terminationTask="terminationTask"
                        @getFollowTaskList="getFollowTaskList"
                        @editFollowVisitTasks="editFollowVisitTask"
                      />
                    </template>
                  </div>
                </el-tab-pane>
              </template>
            </el-tabs>
            <div>
              {{ scope.row.name }}
            </div>
          </div>
        </template>
      </el-table-column>
      <!--父表格列-->
      <el-table-column
        v-for="(col, index) in cols"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        align="center"
        :width="col.width"
        :min-width="col.minWidth"
        :sortable="col.sortable"
      >
        <template slot-scope="scope">
          <visit-cell
            :prop="col.prop"
            :row="scope.row"
            :row-index="(currentPage-1)*pageSize+( scope.$index+ 1)"
            @endCaseFollowVisitTask="endCaseFollowVisitTask"
            @delCaseJoinFollowVisit="delCaseJoinFollowVisit"
            @openCaseJoinFollowVisit="openCaseJoinFollowVisit"
            @copyCaseJoinFollowVisit="copyCaseJoinFollowVisit"
            @editCaseJoinFollowVisit="editCaseJoinFollowVisit"
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
    <!-- 分页器 -->
    <div
      class="health-content-pagination"
      style="margin-top: 15px"
    >
      <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[20, 40, 60, 80]"
        layout="sizes, prev,pager,next,jumper"
        :page-count="pageCount"
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--终止随访-->
    <el-dialog
      ref="endFollowVisitDialog"
      title="终止随访"
      :visible.sync="endFollowVisitDialog"
      :close-on-click-modal="false"
      width="30%"
    >
      <span>
        <el-form
          ref="endFollowVisitDialogForm"
          class="cancelReason"
          :model="endFollowVisitDialogForm"
          label-width="100px"
        >
          <template v-for="(item, index) in endFollowVisitDialogForm.list">
            <div
              v-if="item.type == 'text' && !item.isdisplay"
              :key="index"
            >
              <el-form-item
                :label="item.title"
                :prop="'list.' + index + '.value'"
                :rules="[
                  {
                    required: item.isMust,
                    message: '必填项不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model="item.value"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder"
                  :minlength="item.minvalue"
                  :maxlength="item.maxvalue"
                  :autosize="{ minRows: 2, maxRows: 5}"
                  type="textarea"
                />
              </el-form-item>
            </div>
          </template>
        </el-form>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="endFollowVisitDialog = false">取消终止</el-button>
        <el-button
          type="primary"
          :loading="endFollowVisitDialogBtnLoading"
          @click="endCaseFollowVisitTaskPost"
        >确定终止</el-button>
      </span>
    </el-dialog>
    <!--作废随访任务-->
    <el-dialog
      ref="terminationTaskDialog"
      title="任务作废"
      :visible.sync="terminationTaskDialog"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form
        ref="terminationTaskDialogForm"
        :model="terminationTaskDialogForm"
      >
        <div class="input-content">
          <div
            v-for="(item, index) in terminationTaskDialogForm.cancelReasonItems"
            :key="item.index"
            class="input-content-item"
            :style="item.type == null || item.isdisplay ? 'display:none' : ''"
          >
            <el-form-item
              v-if="item.type == 'text'"
              :label-width="formLabelWidth"
              :label="item.title"
              :prop="'cancelReasonItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-input
                v-model="item.value"
                autocomplete="off"
                :name="item.name"
                :placeholder="item.placeholder"
                class="case-el-input"
                type="textarea"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="terminationTaskDialog = false">取消作废</el-button>
        <el-button
          type="primary"
          @click="terminationSure"
        >确定作废</el-button>
      </span>
    </el-dialog>
    <!--新建、复制参与随访方案-->
    <el-dialog
      v-if="createCaseJoinFollowVisitDialog"
      ref="createCaseJoinFollowVisitDialog"
      :title="dialogTit + '随访记录'"
      :visible.sync="createCaseJoinFollowVisitDialog"
      :close-on-click-modal="false"
      :before-close="closeCreateCaseJoinFollowVisitDialog"
      width="40%"
    >
      <div>
        <create-form
          ref="createForm"
          :create-form="createCaseJoinFollowVisitDialogForm"
          :operat-type-id="operatTypeId"
          @postCreateCaseJoinFollowVisit="postCreateCaseJoinFollowVisit"
          @openAllPatientDailog="openAllPatientDailog"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeCreateCaseJoinFollowVisitDialog">取消</el-button>
        <el-button
          type="primary"
          :loading="createCaseJoinFollowVisitDialogBtnLoading"
          @click="submitCreateCaseJoinFollowVisit"
        >确定</el-button>
      </span>
    </el-dialog>
    <!--新增就诊人随访计划-->
    <el-dialog
      v-if="addFollowVistPlanDialog"
      ref="addFollowVistPlanDialog"
      v-loading="addFollowVistPlanLoading"
      :title="dialogTit+'就诊人随访计划'"
      :visible.sync="addFollowVistPlanDialog"
      :close-on-click-modal="false"
      width="40%"
    >
      <!-- 添加复用按钮【仅限新增】 -->
      <el-button
        v-if="dialogTit=='添加'"
        style="margin-bottom:20px;"
        type="primary"
        @click="openBatchDelDialog"
      >复用计划</el-button>
      <!--复用计划弹窗-->
      <el-dialog
        width="50%"
        title="复用计划"
        :visible.sync="BatchDelDialog"
        append-to-body
      >
        <all-batch
          ref="allBatchTable"
          @BatchChoose="BatchChoose"
        />
      </el-dialog>
      <addplan-form
        ref="createVisitPlanForm"
        :create-form="addFollowVistPlanDialogForm"
        :operat-type-id="operatTypeId"
        @postAddFollowVistPlan="postAddFollowVistPlan"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addFollowVistPlanDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="addFollowVistPlanDialogBtnLoading"
          @click="createVisitPlanFormSubmit"
        >确定</el-button>
      </span>
    </el-dialog>

    <!--选择就诊人弹窗-->
    <el-dialog
      v-if="allPatientDailog"
      width="50%"
      title="选择就诊人"
      :visible.sync="allPatientDailog"
      append-to-body
      @close="resetPatientsTable"
    >
      <all-patients
        ref="allPatientsTable"
        :search-patient-data="searchPatientData"
        @selectPatientData="selectPatientData"
        @closeDailog="resetPatientsTable"
        @openAddPatientDailog="openAddPatientDailog"
      />
      <!--新建就诊人dailog-->
      <el-dialog
        v-if="addPatientDailog"
        width="40%"
        title="新建就诊人"
        :visible.sync="addPatientDailog"
        :close-on-click-modal="false"
        append-to-body
      >
        <add-patients
          ref="addPatientForm"
          @closeAddPatientDailog="closeAddPatientDailog"
          @addPatientDailogReturnData="addPatientDailogReturnData"
        />
      </el-dialog>
    </el-dialog>
    <!--新增,编辑,就诊人随访任务-->
    <el-dialog
      ref="addFollowVistPlanDialog"
      :title="dialogTit+'就诊人随访任务'"
      :visible.sync="addFollowVistTaskDialog"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="40%"
    >
      <addplan-form
        ref="createVisitTaskForm"
        :create-form="addFollowVistTaskDialogForm"
        :operat-type-id="operatTypeId"
        @postAddFollowVistTask="postAddFollowVistTask"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addFollowVistTaskDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="addFollowVistTaskDialogBtnLoading"
          @click="createVisitTaskFormSubmit"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import VisitCell from './components/VisitCell.vue'
import DataTable from './components/DataTable.vue'
import CreateForm from './components/CreateForm.vue'
import AddplanForm from './components/AddplanForm.vue'
import AllBatch from './components/AllBatchDel.vue'
import AllPatients from '@/views/doctor/layout/components/AllPatients.vue'
import AddPatients from '@/views/doctor/layout/components/AddPatient.vue'
import { Message, MessageBox } from 'element-ui'
import {
  openCaseJoinFollowVisit,
  delCaseJoinFollowVisit,
  getCaseJoinFollowVisitList,
  getCreateCaseJoinFollowVisit,
  postCreateCaseJoinFollowVisit,
  getTerminationCaseJoinFollowVisit,
  postTerminationCaseJoinFollowVisit,
  getCaseFollowVisitTaskByCaseJoinVisitIdList,
  getCaseFollowVisitTaskDetailByCaseJoinVisitIdList,
  terminationCaseFollowVisitDetailGet,
  terminationCaseFollowVisitDetail,
  getCreateCaseFollowVisitTask,
  postCreateCaseFollowVisitTask,
  createCaseFollowVisitTaskDetailGet,
  createCaseFollowVisitTaskDetailPost,
  batchDelCaseFollowVisitTask,
  batchCancelCaseFollowVisitTask
} from '@/api/followVisits'
import {
  checkAgeByIdcard,
  checkSexByIdcard,
  checkAgeByBirthday
} from '@/utils/index'
export default {
  name: 'CaseJoinFollowVisit',
  components: {
    VisitCell,
    DataTable,
    CreateForm,
    AddplanForm,
    AllPatients,
    AddPatients,
    AllBatch
  },
  data() {
    return {
      urlCaseJoinFollowVisitId: null, // 路径传参caseJoinFollowVisitId
      loading: false, // 主体loading
      formLabelWidth: '180px',
      hasSearchForm: false, // 是否含有搜索
      searchForm: [], // 头部搜索
      isHaveCreateRole: false, // 是否有新建权限
      isHaveBatchCancelRole: false, // 是否有批量停用权限
      isHaveBatchDeleteRole: false, // 是否有批量删除权限
      searchFormData: {}, // 搜索值
      labelPosition: 'right', // 头部label样式
      styleWidth: '160px',
      canBatchDeleteVist: true, // 批量删除按钮可点击
      canBatchStopVist: true, // 批量停止按钮可点击
      caseJoinFollowVisitList: [], // 订单集合
      caseJoinFollowVisitListLoading: true, // 订单表格loading
      expands: [], // 子表格展开数据
      planList: [], // 随访计划集合
      taskList: [], // 随访任务集合
      changeDateSubmitLoading: false,
      planListTableLoading: true,
      taskListTableLoading: true,
      endFollowVisitDialog: false, // 终止随访弹窗
      endFollowVisitDialogBtnLoading: false, // 终止随访弹窗按钮loading
      endFollowVisitDialogForm: {
        list: []
      }, // 终止随访弹窗内容
      terminationTaskDialog: false, // 任务作废弹窗
      terminationTaskDialogForm: {
        cancelReasonItems: []
      }, // 任务作废弹窗内容
      operatTypeId: 1, // 新建或复制入参
      dialogTit: '新建',
      createBtnLoading: false, // 新建、复制参与随访方案按钮loading
      createCaseJoinFollowVisitDialog: false, // 新建、复制参与随访方案Dialog
      createCaseJoinFollowVisitDialogForm: [], // 新建、复制参与随访方案Dialog表单
      createCaseJoinFollowVisitDialogBtnLoading: false, // 新建、复制参与随访方案Dialog表单按钮loading
      addFollowVistPlanDialog: false, // 新建随访计划Dialog
      addFollowVistPlanDialogForm: [], // 新建随访计划Dialog表单
      addFollowVistPlanDialogBtnLoading: false, // 新建随访计划Dialog表单按钮loading
      addFollowVistTaskDialog: false, // 新建编辑随访任务Dialog
      addFollowVistTaskDialogForm: [], // 新建编辑随访任务Dialog表单
      addFollowVistTaskDialogBtnLoading: false, // 新建编辑随访任务Dialog表单按钮loading
      currentCaseJoinFollowVisitId: null, // 当前行的CaseJoinFollowVisitId
      allPatientDailog: false, // 选择就诊人弹窗
      searchPatientData: {}, // 就诊人弹窗传入数据
      urlParams: {}, // 路径传过来的参数
      isNullObject: true, // urlParams是否为空对象
      addPatientDailog: false,
      showAddPatientDetail: false,
      addPatientByIdCardData: {},
      cols: [
        // 订单集合列名
        { prop: '序号', label: '序号', width: '75px' },
        { prop: 'patientName', label: '就诊人姓名', width: null },
        { prop: 'followVisitPlanName', label: '参与方案', width: null },
        {
          prop: 'joinDate',
          label: '入组时间',
          width: null,
          sortable: 'custom'
        },
        {
          prop: 'startDate',
          label: '开始时间',
          width: null,
          sortable: 'custom'
        },
        { prop: 'runTime', label: '持续时间', width: null },
        { prop: 'finishTaskCount', label: '完成任务数量', width: null },
        { prop: 'overdueTaskCount', label: '超期任务数量', width: null },
        { prop: 'planTypeName', label: '方案类别', width: null },
        { prop: 'buttonList', label: '功能', width: null, minWidth: '200' }
      ],
      planCols: [
        // 随访计划列名
        { prop: 'executiveName', label: '执行人员类别', width: '200px' },
        { prop: 'taskTypeName', label: '任务类型', width: null },
        { prop: 'taskName', label: '任务名称', width: '200px' },
        { prop: 'startDate', label: '任务首次开始时间', width: '200px' },
        { prop: 'isCycle', label: '是否循环', width: '100px' },
        { prop: 'isNeedReturnVisit', label: '是否需要回访', width: '120px' },
        { prop: 'isEnable', label: '是否启用', width: '120px' },
        { prop: 'isCustomTask', label: '是否自定义计划', width: '120px' },
        { prop: 'buttonList', label: '功能', width: '300px' }
      ],
      taskCols: [
        // 随访任务列名
        { prop: 'executiveName', label: '执行人员类别', width: null },
        { prop: 'taskName', label: '任务名称', width: null },
        { prop: 'startDate', label: '任务开始时间', width: null },
        { prop: 'isNeedReturnVisit', label: '是否需要回访', width: null },
        { prop: 'stateId', label: '任务状态', width: null },
        { prop: 'buttonList', label: '功能', width: '300px' }
      ],
      activeTaskTabName: '54', // 随访计划与任务切换高亮
      pageSize: 20,
      pageCount: null,
      currentPage: 1,
      sortTypeId: 0, // 默认排序方式 不排序
      sortName: '', // 默认排序列名称
      BatchDelDialog: false, // 复用计划弹窗
      CaseJoinFollowVisitId: null,
      addFollowVistPlanLoading: true,
      dialogpeItem: false, // 搜索transfer弹窗

      name: '',
      dialogTitle: '',
      dataList: [],
      searchFormTransferData: [], // transfer弹窗数据源
      dialogpeformTransShowValue: [],
      transferValue: [],
      transferTit: ['尚未选择', '已选择'],
      searchFormTransferNeedValue: ''

    }
  },
  created() {
    const patientId = this.$route.query.patientId
    // 如果有传caseJoinFollowVisitId则需展开任务详情
    const caseJoinFollowVisitId = this.$route.query.caseJoinFollowVisitId
    if (patientId) {
      this.urlParams.patientId = patientId
      this.fetchData(this.urlParams)
    } else if (caseJoinFollowVisitId) {
      this.urlCaseJoinFollowVisitId = caseJoinFollowVisitId
      const params = this.$route.query
      this.currentPage = params.page
      this.pageSize = params.pageSize
      // 展开任务详情并跳转至对应页数页码
      this.fetchData({ page: this.currentPage, pageSize: this.pageSize })
    } else {
      this.fetchData()
    }
    // 判断是否有路径传参，如果有则在路径传参基础上进行搜索
    this.isNullObject = JSON.stringify(this.urlParams) === '{}'
  },
  methods: {
    // 获取随访记录集合获取页码
    fetchData(params) {
      this.caseJoinFollowVisitListLoading = true
      if (params) {
        params = Object.assign(
          params,
          {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName,
            pageSize: this.pageSize,
            page: this.currentPage
          },
          this.searchFormData
        )
      }
      getCaseJoinFollowVisitList(params)
        .then((res) => {
          const { Data, Pages } = res
          this.caseJoinFollowVisitList = Data.dataList
          this.isHaveCreateRole = Data.isHaveCreateRole
          if (Data.searchForm && Data.searchForm.length > 0) {
            for (let index = 0; index < Data.searchForm.length; index++) {
              const element = Data.searchForm[index]
              // console.log('elementfff', element)
              // dialogpeformTransShowValue 赋值循环内容
              // transferValue 已选数据
              // searchFormTransferData //数据源
              if (element.type === 24) {
                let dialogpeformTransShowValue = []
                const newArr = []
                // value反填
                if (element.value != null && element.value.length > 0) {
                  dialogpeformTransShowValue = element.value.split(',')
                }

                element.transferValue = dialogpeformTransShowValue
                element.searchFormTransferData = element.dataList.map((list) => {
                  return {
                    key: list.id,
                    label: list.name
                  }
                })
                // 数据反填
                for (let q = 0; q < dialogpeformTransShowValue.length; q++) {
                  const valueArrChild = dialogpeformTransShowValue[q]
                  console.log('valueArrChilddddd', valueArrChild)
                  for (let i = 0; i < element.dataList.length; i++) {
                    const vdataIndexListChild = element.dataList[i]
                    // console.log('valueArrChild', vdataIndexListChild, vdataIndexListChild.id)
                    if (valueArrChild === vdataIndexListChild.id) {
                      newArr.push(vdataIndexListChild.name)
                    }
                  }
                }
                element.dialogpeformTransShowValue = newArr
              }
            }
            this.searchForm = Data.searchForm
            // console.log(this.searchForm)
            this.hasSearchForm = true
          }
          this.pageCount = Pages
          this.caseJoinFollowVisitListLoading = false
          // 路径如果有传caseJoinFollowVisitId则需展开任务详情,需在列表加载完毕后执行
          if (this.urlCaseJoinFollowVisitId != null) {
            this.handelActiveTaskTab(this.urlCaseJoinFollowVisitId)
          }
        })
        .catch(() => {
          Message({
            message: '请稍后重试',
            type: 'error',
            duration: 5 * 1000
          })
          this.caseJoinFollowVisitListLoading = false
        })
      this.$forceUpdate()
    },
    peOrderChoose(param) {},
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      const params = { pageSize: val }
      this.fetchData(params)
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      const param = { page: val }
      // 判断是否有路径传参，如果有则在路径传参基础上进行分页
      if (!this.isNullObject) {
        param.patientId = this.urlParams.patientId
      }
      this.fetchData(param)
    },
    // 搜索
    searchPeorders() {
      const searchFormArr = this.searchForm
      for (let index = 0; index < searchFormArr.length; index++) {
        const element = searchFormArr[index]
        console.log('搜索element', element)
        this.searchFormData[element.name] = element.value
      }
      console.log('this.searchFormData', this.searchFormData)
      this.checkUrlParamAndFenchData()
    },
    // 搜索重置
    searchReset() {
      this.$refs.searchForm.resetFields()
      this.currentPage = 1
      this.pageSize = 20
      this.onSortChange()
      this.fetchData()
      this.$route.query === '{}'
    },
    //
    peItemDialog(formItem) {
      this.dialogTitle = '请选择' + formItem.title
      this.searchFormTransferData = formItem.searchFormTransferData
      this.transferValue = formItem.transferValue
      this.dataList = formItem.dataList
      this.name = formItem.name
      this.dialogpeItem = true
      console.log('formItem.transferValue', formItem)
    },

    peItemDialogSubmit() {
      const dialogpeformTransShowValue = this.transferValue
      // this.searchFormTransferNeedValue = valueArr.join(',')
      const dataList = this.dataList
      const newArr = []
      for (let index = 0; index < dataList.length; index++) {
        const element = dataList[index]
        for (let i = 0; i < dialogpeformTransShowValue.length; i++) {
          const valueArrChild = dialogpeformTransShowValue[i]
          if (element.id === valueArrChild) {
            newArr.push(element.name)
          }
        }
      }

      for (let index = 0; index < this.searchForm.length; index++) {
        const element = this.searchForm[index]
        console.log('element', element)
        if (element.name === this.name) {
          element.dialogpeformTransShowValue = newArr
          element.value = dialogpeformTransShowValue.join(',')
        }
      }
      // console.log('this.searchForm', this.searchForm)
      this.dialogpeItem = false
    },
    // 表格排序
    onSortChange(column) {
      if (column) {
        // 正序 1
        if (column.order === 'ascending') {
          this.sortTypeId = 1
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName
          }
          this.currentPage = 1
          this.fetchData(params)
        }
        // 不排序 0
        if (column.order == null) {
          this.sortTypeId = 0
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName
          }
          this.currentPage = 1
          this.fetchData(params)
        }
        // 倒序 2
        if (column.order === 'descending') {
          this.sortTypeId = 2
          this.sortName = column.prop
          const params = {
            sortTypeId: this.sortTypeId,
            sortName: this.sortName
          }
          this.currentPage = 1
          this.fetchData(params)
        }
      } else {
        // 清空排序条件，数据会恢复成未排序的状态
        this.$refs.followVisitListTable.clearSort()
        this.sortTypeId = 0
        this.sortName = ''
      }
    },
    selectPatientData(patientData) {
      // 循环表单数据，将所选数据进行回填
      const DATA = this.createCaseJoinFollowVisitDialogForm
      let patientAge = null
      let sex = 0
      // console.log(patientData)
      for (let index = 0; index < DATA.length; index++) {
        const ELEMENT = DATA[index]
        if (ELEMENT.name === 'PatientId') {
          ELEMENT.value = patientData.patientId
        }
        if (ELEMENT.name === 'PatientName') {
          ELEMENT.value = patientData.patientName
        }
        if (ELEMENT.name === 'IdCardNo') {
          ELEMENT.value = patientData.idCardNoPlaintext
          if (
            patientData.idCardNoPlaintext !== '' &&
            patientData.idCardNoPlaintext !== null
          ) {
            // 通过计算身份证得到用户年龄
            patientAge = checkAgeByIdcard(patientData.idCardNoPlaintext)
            // 通过计算身份证得到用户性别
            sex = checkSexByIdcard(patientData.idCardNoPlaintext)
          } else {
            // 通过计算出生日期得到用户年龄
            patientAge = checkAgeByBirthday(patientData.birthday)
          }
        }
        if (ELEMENT.name === 'MobileNumber') {
          ELEMENT.value = patientData.mobileNumber
        }
        if (ELEMENT.name === 'PatientAge') {
          if (patientData.age != null && patientData.age !== '') {
            ELEMENT.value = patientData.age
          } else {
            ELEMENT.value = patientAge
          }
        }
        if (ELEMENT.name === 'PatientGenderId') {
          ELEMENT.value = patientData.genderId
        }
        if (ELEMENT.name === 'DocumentTypeId') {
          if (
            patientData.documentTypeId === null &&
            patientData.idCardNoPlaintext != null
          ) {
            ELEMENT.value = 1
          } else {
            ELEMENT.value = patientData.documentTypeId
          }
          this.$refs.createForm.pickerDocumentShowOrHide(DATA, ELEMENT)
        }
        if (ELEMENT.name === 'HKAndMacaoPermitNum') {
          ELEMENT.value = patientData.hkAndMacaoPermitNum
        }
        if (ELEMENT.name === 'MTPsNum') {
          ELEMENT.value = patientData.mtpsNum
        }
        if (ELEMENT.name === 'HKAndMacaoAndMTPsResidenceNum') {
          ELEMENT.value = patientData.hkAndMacaoAndMTPsResidenceNum
        }
        if (ELEMENT.name === 'FPerManentResidentNum') {
          ELEMENT.value = patientData.fperManentResidentNum
        }
        if (ELEMENT.name === 'PassportNum') {
          ELEMENT.value = patientData.passportNum
        }
        if (ELEMENT.name === 'MilitaryOfficerNum') {
          ELEMENT.value = patientData.militaryOfficerNum
        }
        if (ELEMENT.name === 'NDToHKAndMacaoPermitNum') {
          ELEMENT.value = patientData.curCertificateNo
        }
        if (ELEMENT.name === 'Birthday') {
          ELEMENT.value = patientData.birthday
        }
        if (ELEMENT.name === 'Sex') {
          ELEMENT.value = patientData.genderId
        }
      }
    },
    // 打开新建就诊人弹窗
    openAddPatientDailog() {
      this.addPatientDailog = true
      this.showAddPatientDetail = false
    },
    // 批量删除随访计划
    batchDeleteVist(casejoinFollowVisitId) {
      const bachDatTableaListIds =
        this.$refs.planListTable[0].getBachDataTableList()
      if (bachDatTableaListIds.length > 0) {
        MessageBox.confirm('您确定要删除当前随访?', '删除随访', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const caseFollowVisitTaskIds = bachDatTableaListIds.join(',')
          batchDelCaseFollowVisitTask({
            caseFollowVisitTaskIds: caseFollowVisitTaskIds
          }).then((res) => {
            Message({
              message: '删除成功！',
              type: 'success',
              duration: 5 * 1000
            })
            this.expandgetData(casejoinFollowVisitId)
          })
        })
      } else {
        Message({
          message: '请先进行选择后操作！',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // 批量停用随访计划
    batchStopVist(casejoinFollowVisitId) {
      const bachDatTableaListIds =
        this.$refs.planListTable[0].getBachDataTableList()
      if (bachDatTableaListIds.length > 0) {
        MessageBox.confirm('您确定要停用当前随访?', '停用随访', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const caseFollowVisitTaskIds = bachDatTableaListIds.join(',')
          batchCancelCaseFollowVisitTask({
            caseFollowVisitTaskIds: caseFollowVisitTaskIds
          }).then((res) => {
            Message({
              message: '停用成功！',
              type: 'success',
              duration: 5 * 1000
            })
            this.expandgetData(casejoinFollowVisitId)
          })
        })
      } else {
        Message({
          message: '请先进行选择后操作！',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // 获取所有就诊人弹窗
    openAllPatientDailog() {
      this.allPatientDailog = true
      const formInputValueArr = this.createCaseJoinFollowVisitDialogForm
      for (let index = 0; index < formInputValueArr.length; index++) {
        const element = formInputValueArr[index]
        if (element.name === 'PatientName') {
          this.searchPatientData.name = element.value
        }
        if (element.name === 'IdCardNo') {
          this.searchPatientData.idcardno = element.value
        }
      }
    },
    // 关闭新建就诊人弹窗
    closeAddPatientDailog() {
      this.addPatientDailog = false
    },
    // 新建就诊人后，dailog返回得数据
    addPatientDailogReturnData(patientData) {
      // 数据反填
      this.selectPatientData(patientData)
      this.closeAddPatientDailog()
      this.allPatientDailog = false
    },
    // 关闭并重置所有患者弹窗
    resetPatientsTable() {
      this.allPatientDailog = false
      this.$refs.allPatientsTable.resetSearchPatientInfo()
    },
    // 新建就诊人参与方案
    createCaseJoinFollowVisit() {
      // 1为新建，3为编辑,4为复制
      this.operatTypeId = 1
      const params = {
        operatTypeId: this.operatTypeId
      }
      this.dialogTit = '新建'
      this.createBtnLoading = true
      this.createOrCopyCaseJoinFollowVisit(params)
    },
    // 复制就诊人参与方案
    copyCaseJoinFollowVisit(casejoinFollowVisitId) {
      // 1为新建，3为编辑,4为复制
      this.operatTypeId = 4
      this.dialogTit = '复制'
      const params = {
        operatTypeId: this.operatTypeId,
        casejoinFollowVisitId: casejoinFollowVisitId
      }
      this.createOrCopyCaseJoinFollowVisit(params)
    },
    // 编辑就诊人参与方案
    editCaseJoinFollowVisit(casejoinFollowVisitId) {
      // 1为新建，3为编辑,4为复制
      this.operatTypeId = 3
      this.dialogTit = '编辑'
      const params = {
        operatTypeId: this.operatTypeId,
        casejoinFollowVisitId: casejoinFollowVisitId
      }
      this.createOrCopyCaseJoinFollowVisit(params)
    },
    // 新建或复制就诊人参与方案
    createOrCopyCaseJoinFollowVisit(params) {
      getCreateCaseJoinFollowVisit(params).then((res) => {
        const { Data } = res
        this.createCaseJoinFollowVisitDialogForm = Data
        for (let index = 0; index < Data.length; index++) {
          const element = Data[index]
          // 接口默认返回的证件类型value为1时默认居民身份证，此时应把isMust改为false
          if (
            element.value === 1 &&
            element.name === 'DocumentTypeId' &&
            element.type === 'picker'
          ) {
            element.isMust = false
          }
          if (
            element.isdisplay === true &&
            element.isMust === true &&
            element.pshow === 'DocumentTypeId'
          ) {
            element.isMust = false
          }
        }
        this.createBtnLoading = false
        this.createCaseJoinFollowVisitDialog = true
      })
    },
    // 新建或复制就诊人参与方案提交
    submitCreateCaseJoinFollowVisit() {
      this.$refs.createForm.getFormData()
    },
    postCreateCaseJoinFollowVisit(params) {
      this.createCaseJoinFollowVisitDialogBtnLoading = true
      postCreateCaseJoinFollowVisit(params)
        .then((res) => {
          Message({
            message: this.dialogTit + '成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.createCaseJoinFollowVisitDialog = false
          this.createCaseJoinFollowVisitDialogBtnLoading = false
          this.checkUrlParamAndFenchData()
        })
        .catch(() => {
          this.createCaseJoinFollowVisitDialogBtnLoading = false
        })
    },
    // 关闭新建或复制参与方案弹窗
    closeCreateCaseJoinFollowVisitDialog() {
      this.$refs.createForm.resetForm()
      this.createCaseJoinFollowVisitDialog = false
    },
    // 路径传参打开对应表格
    handelActiveTaskTab(casejoinFollowVisitId) {
      const casejoinFollowVisitIdN = Number(casejoinFollowVisitId)
      this.expands.push(casejoinFollowVisitIdN)
      // 50为随访任务
      this.activeTaskTabName = '50'
      this.expandgetData(casejoinFollowVisitIdN)
    },
    // 表格点击
    expandChange(row, expand) {
      if (expand.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.casejoinFollowVisitId)
        }
      } else {
        this.expands = []
      }
      this.expandgetData(row.casejoinFollowVisitId)
    },
    // 获取rowkey
    getRowKeys(row) {
      return String(row.casejoinFollowVisitId)
    },
    // 随访计划与任务切换
    handleTaskTabClick(tab) {
      const casejoinFollowVisitId = tab.$attrs['casejoin-follow-visit-id']
      this.expandgetData(casejoinFollowVisitId)
    },
    // 表格展开数据获取
    expandgetData(casejoinFollowVisitId) {
      if (this.activeTaskTabName === '54') {
        // 加载随访计划
        this.getFollowPlanList(casejoinFollowVisitId)
      } else if (this.activeTaskTabName === '50') {
        // 加载随访任务
        this.getFollowTaskList(casejoinFollowVisitId)
      }
    },
    // 获取方案关联随访计划
    getFollowPlanList(caseJoinFollowVisitId) {
      this.planListTableLoading = true
      getCaseFollowVisitTaskByCaseJoinVisitIdList({
        caseJoinFollowVisitId
      }).then((res) => {
        const { Data } = res
        const { dataList } = Data
        let canBatchDele = false
        let canBatchStop = false
        for (let index = 0; index < dataList.length; index++) {
          const element = dataList[index]
          // console.log(element.buttonList)
          if (element.buttonList.some((item) => item.clickTypeId === 56)) {
            canBatchDele = true
            break
          }
          if (element.buttonList.some((item) => item.clickTypeId === 57)) {
            canBatchStop = true
            break
          }
        }
        this.canBatchDeleteVist = !canBatchDele
        this.canBatchStopVist = !canBatchStop
        this.planList = Data.dataList
        this.isHaveBatchCancelRole = Data.isHaveBatchCancelRole
        this.isHaveBatchDeleteRole = Data.isHaveBatchDeleteRole
        this.planListTableLoading = false
      })
    },
    // 获取关联随访任务
    getFollowTaskList(caseJoinFollowVisitId) {
      this.taskListTableLoading = true
      getCaseFollowVisitTaskDetailByCaseJoinVisitIdList({
        caseJoinFollowVisitId
      }).then((res) => {
        const { Data } = res
        this.taskList = Data.dataList
        this.taskListTableLoading = false
      })
    },
    // 作废随访任务
    terminationTask(params) {
      const { caseJoinFollowVisitId, caseFollowVisitTaskDetailId } = params
      this.currentCaseJoinFollowVisitId = caseJoinFollowVisitId
      // console.log(this.currentCaseJoinFollowVisitId)
      // 先获取作废原因
      terminationCaseFollowVisitDetailGet({
        caseFollowVisitTaskDetailId
      })
        .then((res) => {
          const { Data } = res
          this.terminationTaskDialogForm.cancelReasonItems = Data
          this.terminationTaskDialog = true
        })
        .catch((err) => {
          Message({
            message: err.Data.errorMsg,
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    // 确定任务作废
    terminationSure() {
      this.$refs.terminationTaskDialogForm.validate((valid) => {
        if (valid) {
          const data = this.terminationTaskDialogForm.cancelReasonItems
          const submitData = {}
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            submitData[item.name] = item.value
          }
          terminationCaseFollowVisitDetail(submitData)
            .then((res) => {
              if (res.Code === 1) {
                this.terminationTaskDialog = false
                Message({
                  message: '作废成功！',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.getFollowTaskList(this.currentCaseJoinFollowVisitId)
                this.terminationTaskDialog = false
              }
            })
            .catch((err) => {
              Message({
                message: err.Data.errorMsg,
                type: 'error',
                duration: 5 * 1000
              })
            })
        }
      })
    },
    // 添加随访任务
    addFollowVistTask(caseJoinFollowVisitId) {
      this.operatTypeId = 1
      const params = {
        operatTypeId: 1,
        caseJoinFollowVisitId: caseJoinFollowVisitId
      }
      this.dialogTit = '添加'
      this.addOrEditFollowVistTask(params)
    },
    // 编辑随访任务
    editFollowVisitTask(params) {
      this.operatTypeId = 3
      const param = {
        operatTypeId: 3,
        caseJoinFollowVisitId: params.caseJoinFollowVisitId,
        caseFollowVisitTaskDetailId: params.caseFollowVisitTaskDetailId
      }
      this.dialogTit = '编辑'
      this.addOrEditFollowVistTask(param)
    },
    // 添加或编辑随访任务获取
    addOrEditFollowVistTask(params) {
      createCaseFollowVisitTaskDetailGet(params)
        .then((res) => {
          const { Data } = res
          this.addFollowVistTaskDialogForm = Data
          this.addFollowVistTaskDialog = true
        })
        .catch((err) => {
          Message({
            message: err.Msg,
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    // 添加或编辑随访任务提交
    createVisitTaskFormSubmit() {
      this.$refs.createVisitTaskForm.getFormData()
    },
    // 添加或编辑随访任务提交
    postAddFollowVistTask(params) {
      this.addFollowVistTaskDialogBtnLoading = true
      createCaseFollowVisitTaskDetailPost(params)
        .then((res) => {
          this.getFollowTaskList(params.CaseJoinFollowVisitId)
          this.addFollowVistTaskDialog = false
          this.addFollowVistTaskDialogBtnLoading = false
          Message({
            message: this.dialogTit + '成功!',
            type: 'success',
            duration: 5 * 1000
          })
        })
        .catch(() => {
          this.addFollowVistTaskDialogBtnLoading = false
        })
    },
    // 添加随访计划
    addFollowVistPlan(caseJoinFollowVisitId) {
      this.operatTypeId = 1
      this.CaseJoinFollowVisitId = caseJoinFollowVisitId
      const params = {
        operatTypeId: 1,
        caseJoinFollowVisitId: caseJoinFollowVisitId
      }
      this.dialogTit = '添加'
      this.addOrEditFollowVistPlan(params)
    },
    // 编辑随访计划
    editFollowVistPlan(params) {
      this.operatTypeId = 3
      const param = {
        operatTypeId: 3,
        caseJoinFollowVisitId: params.caseJoinFollowVisitId,
        caseFollowVisitTaskId: params.caseFollowVisitTaskId
      }
      this.dialogTit = '编辑'
      this.addOrEditFollowVistPlan(param)
    },
    // 添加或编辑随访计划获取
    addOrEditFollowVistPlan(params) {
      getCreateCaseFollowVisitTask(params)
        .then((res) => {
          const { Data } = res
          this.addFollowVistPlanDialogForm = Data
          this.addFollowVistPlanDialog = true
          this.addFollowVistPlanLoading = false
        })
        .catch((err) => {
          Message({
            message: err.Msg,
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    // 添加随访计划提交
    createVisitPlanFormSubmit() {
      this.$refs.createVisitPlanForm.getFormData()
    },
    // 添加编辑随访计划提交
    postAddFollowVistPlan(params) {
      this.addFollowVistPlanDialogBtnLoading = true
      postCreateCaseFollowVisitTask(params)
        .then((res) => {
          this.getFollowPlanList(params.CaseJoinFollowVisitId)
          this.addFollowVistPlanDialog = false
          this.addFollowVistPlanDialogBtnLoading = false
          Message({
            message: this.dialogTit + '成功!',
            type: 'success',
            duration: 5 * 1000
          })
        })
        .catch((err) => {
          console.log(err)
          this.addFollowVistPlanDialogBtnLoading = false
          Message({
            message: '添加失败，请稍后重试',
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    // 终止随访计划
    endCaseFollowVisitTask(caseJoinFollowVisitId) {
      MessageBox.confirm('您确定终止当前随访?', '终止随访', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getTerminationCaseJoinFollowVisit({
          caseJoinFollowVisitId: caseJoinFollowVisitId
        }).then((res) => {
          const { Data } = res
          this.endFollowVisitDialogForm.list = Data
          this.endFollowVisitDialog = true
          this.checkUrlParamAndFenchData()
        })
      })
    },
    // 启用随访方案
    openCaseJoinFollowVisit(caseJoinFollowVisitId) {
      openCaseJoinFollowVisit({ caseJoinFollowVisitId })
        .then((res) => {
          Message({
            message: '启用成功!',
            type: 'success',
            duration: 5 * 1000
          })
          // 启用成功需更新随访计划，随访任务
          // 可用关闭当前表格代替，后续优化
          this.getFollowPlanList(caseJoinFollowVisitId)
          this.getFollowTaskList(caseJoinFollowVisitId)
          this.checkUrlParamAndFenchData()
        })
        .catch((err) => {
          const { Msg } = err
          Message({
            message: Msg,
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    // 删除随访方案
    delCaseJoinFollowVisit(caseJoinFollowVisitId) {
      MessageBox.confirm('您确定刪除当前随访?', '刪除随访', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCaseJoinFollowVisit({ caseJoinFollowVisitId })
          .then((res) => {
            this.checkUrlParamAndFenchData()
            Message({
              message: '删除成功!',
              type: 'success',
              duration: 5 * 1000
            })
          })
          .catch(() => {
            Message({
              message: '启用失败!',
              type: 'error',
              duration: 5 * 1000
            })
          })
      })
    },
    // 提交终止原因
    endCaseFollowVisitTaskPost() {
      this.$refs.endFollowVisitDialogForm.validate((valid) => {
        if (valid) {
          // 循环form数据组成对象
          this.endFollowVisitDialogBtnLoading = true
          const submitData = {}
          const data = this.endFollowVisitDialogForm.list
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            submitData[item.name] = item.value
          }
          postTerminationCaseJoinFollowVisit(submitData)
            .then((res) => {
              Message({
                message: '终止成功!',
                type: 'success',
                duration: 5 * 1000
              })
              this.endFollowVisitDialogBtnLoading = false
              this.endFollowVisitDialog = false
              const param = this.searchFormData
              // 判断是否有路径传参，如果有则在路径传参基础上进行搜索
              if (!this.isNullObject) {
                param.patientId = this.urlParams.patientId
              }
              this.fetchData()
            })
            .catch(() => {
              this.endFollowVisitDialogBtnLoading = false
              this.endFollowVisitDialog = false
            })
        } else {
          return false
        }
      })
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    // 判断当前页是否有路径传参和在搜索情况下传参，并且重新加载数据
    checkUrlParamAndFenchData() {
      const param = this.searchFormData
      // 判断是否有路径传参，如果有则在路径传参基础上进行搜索
      if (!this.isNullObject) {
        param.patientId = this.urlParams.patientId
      }
      this.fetchData(param)
    },
    // 打开复用弹窗
    openBatchDelDialog() {
      this.BatchDelDialog = true
    },
    // 选用复用计划
    BatchChoose(param) {
      const params = {
        operatTypeId: 1,
        caseJoinFollowVisitId: this.CaseJoinFollowVisitId,
        followVisitTaskId: param
      }
      this.BatchDelDialog = false
      this.addOrEditFollowVistPlan(params)
    }
  }
}
</script>
<style lang="scss" scoped>
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
.primaryBtn {
  text-align: center;
}
.addNewPeOrder {
  text-align: right;
  margin-bottom: 22px;
}
.explan-btn-out {
  text-align: right;
  margin-bottom: 15px;
}
.addPatientForm-right {
  text-align: center;
}
</style>

