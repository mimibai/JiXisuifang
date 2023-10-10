<template>
  <div v-loading="allLoading">
    <div class="plan-detail-btns">
      <el-row>
        <el-button
          type="primary"
          round
          size="mini"
          @click="handleGoHistory"
        >返回</el-button>
        <template v-for="(item, index) in abnormalButtons">
          <el-button
            v-if="item.id == 1"
            :key="index"
            type="danger"
            size="mini"
            round
            @click="handleBtns(item.id)"
          >{{ item.name }}</el-button>
          <el-button
            v-if="item.id == 2"
            :key="index"
            type="warning"
            size="mini"
            round
            @click="handleBtns(item.id)"
          >{{ item.name }}</el-button>
          <el-button
            v-if="item.id == 3"
            :key="index"
            type="info"
            size="mini"
            round
            @click="handleBtns(item.id)"
          >{{ item.name }}</el-button>
          <el-button
            v-if="item.id != 1 && item.id != 2 && item.id != 3"
            :key="index"
            type="info"
            size="mini"
            round
            @click="handleBtns(item.id)"
          >{{ item.name }}</el-button>
        </template>
        <el-button
          v-for="(item, oindex) in otherButtonList"
          :key="'other' + oindex"
          type="success"
          size="mini"
          round
          @click="handleBtns(item.clickTypeId)"
        >{{ item.title }}</el-button>
        <el-button
          v-if="!nextVistdisabled"
          type="primary"
          size="mini"
          round
          @click="handleNextVisit"
        >下一条</el-button>
      </el-row>
    </div>
    <div class="plan-detail-content">
      <el-row
        type="flex"
        justify="space-between"
        :gutter="20"
      >
        <el-col :span="9">
          <div
            ref="leftContentBox"
            class="leftContentBox"
          >
            <div class="plan-detail-box patient-infomation">
              <div class="plan-detail-box-header">
                <el-row>
                  <div class="fl">
                    <p class="plan-detail-box-header-tit">基本信息</p>
                  </div>
                  <div class="fr">
                    <div class="plan-detail-box-header-links">
                      <tit-links
                        :button-list="patientData.patientButtonList"
                        :patient-id="patientId"
                        :pe-package-id="pePackageId"
                      />
                    </div>
                  </div>
                </el-row>
              </div>
              <div class="plan-detail-box-content">
                <patient-info :patient-data="patientData" />
              </div>
            </div>
            <div class="plan-detail-box patient-infomation">
              <div class="plan-detail-box-header">
                <el-row>
                  <div class="fl">
                    <p class="plan-detail-box-header-tit">方案信息</p>
                  </div>
                  <div class="fr">
                    <div class="plan-detail-box-header-links">
                      <tit-links
                        :button-list="
                          caseJoinFollowVisitData.caseJoinFollowVisitButtonList
                        "
                        :patient-id="patientId"
                        :case-join-follow-visit-id="
                          Number(caseJoinFollowVisitData.caseJoinFollowVisitId)
                        "
                        @endCaseFollowVisitTask="endCaseFollowVisitTask"
                      />
                    </div>
                  </div>
                </el-row>
              </div>
              <div class="plan-detail-box-content">
                <program-info :program-data="caseJoinFollowVisitData" />
              </div>
            </div>
            <div class="plan-detail-box patient-infomation">
              <div class="plan-detail-box-header">
                <el-row>
                  <div class="fl">
                    <p class="plan-detail-box-header-tit">任务信息</p>
                  </div>
                  <div class="fr">
                    <div class="plan-detail-box-header-links">
                      <tit-links
                        :button-list="detailData.detailbuttonList"
                        :case-follow-visit-task-detail-id="
                          Number(caseFollowVisitTaskDetailId)
                        "
                        @returnTask="returnTask"
                        @canceledCaseFollowVisitTask="
                          canceledCaseFollowVisitTask
                        "
                        @repeatCaseTaskDetailRemind="repeatCaseTaskDetailRemind"
                      />
                    </div>
                  </div>
                </el-row>
              </div>
              <div class="plan-detail-box-content">
                <task-info :task-data="detailData" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="15">
          <div
            ref="rightContentBox"
            class="visit-detail-box"
            :style="rightContentBoxHeight"
          >
            <h4 class="big-tit">随访详情</h4>
            <div class="visit-detail-box-items">
              <div
                v-if="voteData != null"
                class="visit-detail-box-item"
              >
                <div class="visit-detail-box-item-tit">随访问卷</div>
                <div class="visit-detail-box-item-content">
                  <vote-info
                    :vote-data="voteData"
                    :is-can-edit-for-vote="isCanEditForVote"
                    :case-follow-visit-task-detail-id="
                      Number(caseFollowVisitTaskDetailId)
                    "
                    :vote-submit-loading="voteSubmitLoading"
                    @submitVote="submitVote"
                  />
                </div>
              </div>
              <div
                v-if="peData != null"
                class="visit-detail-box-item"
              >
                <div class="visit-detail-box-item-tit">
                  <el-row>
                    <div class="fl">
                      <p>检查信息</p>
                    </div>
                    <div class="fr">
                      <div class="plan-detail-box-header-links">
                        <tit-links
                          v-if="isCheckUpInOurHos"
                          :button-list="pebuttonList"
                          @createPEReserveByDoctor="createPEReserveByDoctor"
                          @cancelPEReserve="cancelPEReserve"
                          @changeDatePe="changeDatePe"
                        />
                      </div>
                    </div>
                  </el-row>
                </div>
                <div class="visit-detail-box-item-content pe-items">
                  <div class="pe-item">
                    <el-descriptions>
                      <el-descriptions-item label="检查套餐">{{
                        peData.pePackageName
                      }}</el-descriptions-item>
                    </el-descriptions>
                    <div class="pe-item-desc">
                      <span class="el-descriptions-item__label has-colon">检查项目</span>
                      <span style="flex: auto">
                        <pe-table
                          :table-data="peData.peItemData"
                          :table-cols="cols"
                        />
                      </span>
                    </div>
                    <el-descriptions :column="3">
                      <el-descriptions-item label="来院检查">
                        <el-radio-group
                          v-model="peData.isCheckUpInOurHos"
                          :disabled="!isCanEditForVote"
                          @change="isChooseInOurHos"
                        >
                          <el-radio :label="true">是</el-radio>
                          <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                      </el-descriptions-item>
                      <el-descriptions-item label="预约时间">{{
                        peData.reserveTime
                      }}</el-descriptions-item>
                      <el-descriptions-item label="检查状态">{{
                        peData.checkSign
                      }}</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>
              </div>
              <!--检查报告-->
              <div
                v-if="isCheckUpInOurHos === false"
                class="visit-detail-box-item"
              >
                <div class="visit-detail-box-item-tit">
                  <el-row>
                    <div class="fl">
                      <p>检查报告</p>
                    </div>
                  </el-row>
                </div>
                <div class="visit-detail-box-item-content">
                  <vote-info
                    :vote-data="notInOurHosFormData"
                    :vote-submit-loading="voteSubmitLoading"
                    :is-can-edit-for-vote="isCanEditForVote"
                    :case-follow-visit-task-detail-id="
                      Number(caseFollowVisitTaskDetailId)
                    "
                    @submitVote="submitNotInOurHosForm"
                  />
                  <!-- <el-form
                          :model="notInOurHosFormData"
                          ref="notInOurHosFormData"
                          label-width="120px"
                        >
                          <div class="input-content">
                            <div
                              v-for="(item, index) in notInOurHosFormData.formItems"
                              :key="item.id"
                              :class="item.name == '' ? 'input-content-title' : ''"
                              :style="(item.isdisplay ? 'display:none' : '',item.type=='upload'?'width:100%;':'')"
                              class="input-content-item"
                            >
                              <el-form-item
                                v-if="item.voteItemTypeId === 9 && !item.isdisplay"
                                :label="item.title"
                                :label-width="formLabelWidth"
                                :rules="{
                              required: item.isMust,
                            }"
                              >
                                <Upload
                                  :limit="10"
                                  :file-list="item.value"
                                  ref="Upload"
                                ></Upload>
                              </el-form-item>
                            </div>
                          </div>
                        </el-form> -->
                </div>
              </div>
              <!--提示信息-->
              <div
                v-if="remindData != null && remindData.length > 0"
                class="visit-detail-box-item"
              >
                <div class="visit-detail-box-item-tit">提示信息</div>
                <div class="visit-detail-box-item-content">
                  <el-descriptions>
                    <el-descriptions-item
                      label="消息内容"
                      label-class-name="speicial_label"
                    > {{ remindData }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>
              <!--辅助问卷-->
              <div
                v-if="auxiliaryVoteData != null"
                class="visit-detail-box-item"
              >
                <div class="visit-detail-box-item-tit">辅助问卷</div>
                <div class="visit-detail-box-item-content">
                  <vote-info
                    :vote-data="auxiliaryVoteData"
                    :is-can-edit-for-vote="isCanEditForAuxiliaryVote"
                    :case-follow-visit-task-detail-id="
                      Number(caseFollowVisitTaskDetailId)
                    "
                    :vote-submit-loading="voteSubmitLoading"
                    @submitVote="submitauxiliaryVote"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--终止随访-->
    <el-dialog
      ref="endFollowVisitDialog"
      title="终止随访"
      :visible.sync="endFollowVisitDialog"
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
    <!--作废随访-->
    <el-dialog
      ref="canceledFollowVisitDialog"
      title="作废随访"
      :visible.sync="canceledFollowVisitDialog"
      width="30%"
    >
      <span>
        <el-form
          ref="canceledFollowVisitDialogForm"
          class="cancelReason"
          :model="canceledFollowVisitDialogForm"
          label-width="100px"
        >
          <template v-for="(item, index) in canceledFollowVisitDialogForm.list">
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
        <el-button @click="canceledFollowVisitDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="canceledFollowVisitDialogBtnLoading"
          @click="canceledCaseFollowVisitTaskPost"
        >确定作废</el-button>
      </span>
    </el-dialog>
    <!--预约挂号弹窗-->
    <el-dialog
      title="预约挂号"
      :visible.sync="chooseDatedialog"
      width="35%"
    >
      <div>
        <change-date
          :is-show-patient="true"
          :change-pe-date-patient="choosePeDatePatient"
          @chooseTimeFun="choosePeTime"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="chooseDatedialog = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="chooseDatedialogBtnLoading"
          @click="chooseDatedialogSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!--预约改期弹窗-->
    <el-dialog
      title="预约改期"
      :visible.sync="changeDatedialog"
      width="35%"
    >
      <div>
        <change-date
          :is-show-patient="true"
          :change-pe-date-patient="choosePeDatePatient"
          @chooseTimeFun="changeTimeFun"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="changeDatedialog = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="changeDateSubmitLoading"
          @click="changeDateSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import PatientInfo from '@/views/doctor/followVisit/components/PatientInfo'
import TitLinks from '@/views/doctor/followVisit/components/TitLinks'
import ProgramInfo from '@/views/doctor/followVisit/components/ProgramInfo'
import TaskInfo from '@/views/doctor/followVisit/components/TaskInfo'
import VoteInfo from '@/views/doctor/followVisit/components/VoteInfo'
import PeTable from '@/views/doctor/followVisit/components/PeTable/PeTable'
import Upload from '@/components/Upload/index'
import ChangeDate from '@/components/ChoosePeDate/index.vue'
import {
  getTaskDetailForDoctor,
  claimTask,
  createAbnormalRecord,
  sendBackTask,
  // cancelCaseFollowVisitTask,
  getTerminationCaseJoinFollowVisit,
  postTerminationCaseJoinFollowVisit,
  terminationCaseFollowVisitDetailGet,
  terminationCaseFollowVisitDetail,
  repeatCaseTaskDetailRemind,
  subFollowVisitVote,
  modifyIsCheckUpInOurHos,
  modifyTaskDetailState,
  rememberPEReserveId
} from '@/api/followVisits'
import {
  postCreatePEReserveByDoctor,
  CancelPEReserve,
  UpdateReserveTime
} from '@/api/peOrder'
import { getProvinceList, getCityList, getCountyList } from '@/api/region'
import { Message, MessageBox } from 'element-ui'
export default {
  components: {
    PatientInfo, // 患者信息
    ProgramInfo, // 方案信息
    TaskInfo, // 任务信息
    VoteInfo, // 问卷信息
    TitLinks, // 标题链接
    PeTable, // 体检表格
    Upload, // 检查报告
    ChangeDate // 预约挂号
  },
  data() {
    return {
      allLoading: true,
      submitVisitBtn: false, // 是否展示提交更新随访按钮
      nextVistdisabled: false, // 下一条是否可点击
      nextCaseFollowVisitTaskDetailId: null, // 下一条id
      abnormalButtons: [],
      otherButtonList: [],
      caseFollowVisitTaskDetailId: null, // 真实随访任务Id
      patientData: {}, // 患者基本信息
      patientId: null, // 当前患者id
      pePackageId: null, //
      detailData: {}, // 随访任务信息
      caseJoinFollowVisitData: {}, // 随访方案信息
      voteData: {}, // 随访问卷详情
      auxiliaryVoteData: {}, // 辅助问卷
      isCheckUpInOurHos: true, // 是否在本院区检查
      isCanEditForVote: true, // 随访问卷是否可编辑
      isCanEditForAuxiliaryVote: true, // 辅助问卷是否可编辑
      voteSubmitLoading: false, // 随访问卷loading
      peData: {}, // 检查信息
      pebuttonList: [], // 检查信息按钮
      remindData: '', // 提醒
      endFollowVisitDialog: false, // 终止随访弹窗
      endFollowVisitDialogBtnLoading: false, // 终止随访弹窗按钮loading
      endFollowVisitDialogForm: {
        list: []
      }, // 终止随访弹窗内容
      canceledFollowVisitDialog: false, // 作废随访弹窗
      canceledFollowVisitDialogBtnLoading: false, // 作废随访弹窗按钮loading
      canceledFollowVisitDialogForm: {
        list: []
      }, // 作废随访弹窗内容
      notInOurHosFormData: {}, // 检查报告表单
      baseUploadUrl: '', // 上传路径
      formLabelWidth: '180px', // 检查报告label宽度
      cols: [
        { prop: 'peItemName', label: '体检项目名称', width: null },
        { prop: 'gender', label: '性别', width: '75px' },
        { prop: 'dept', label: '所属科室', width: null }
      ],
      rightContentBoxHeight: {
        height: ''
      }, // 右侧主体高度
      chooseDatedialog: false, // 体检预约dailog
      chooseDatedialogBtnLoading: false, // 体检预约dailogBtnLoading
      choosePeDatePatient: {}, // 预约挂号患者数据
      chooseDatedialogSubmitData: {}, // 预约挂号弹窗提交数据
      chooseDatedialog: false, // 选择预约日期弹窗
      changeDatedialog: false, // 预约改期弹窗
      changePeDatePatient: {}, // 预约改期弹窗内人物信息
      isShowPatient: true,
      chosePeDatas: null, // 改期后信息
      changeDateSubmitLoading: false,
      lastPage: null // 上级页面
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.lastPage = from.path
    })
  },
  watch: {
    $route() {
      this.caseFollowVisitTaskDetailId =
        this.$route.query.caseFollowVisitTaskDetailId
      this.fenchData()
    },
    abnormalButtons() {
      if (this.abnormalButtons.length > 0) {
        this.submitVisitBtn = true
      }
    },
    pebuttonList(newVal, oldVal) {
      this.pebuttonList = newVal
    }
  },
  created() {
    const caseFollowVisitTaskDetailId =
      this.$route.query.caseFollowVisitTaskDetailId
    if (caseFollowVisitTaskDetailId) {
      this.caseFollowVisitTaskDetailId = caseFollowVisitTaskDetailId
      this.fenchData()
    } else {
      this.$router.push({ path: '/doctor/followVisit/pubilcPlan' })
      return false
    }
    // this.$nextTick(() => {
    //   this.changeRightContent();
    // });
  },
  methods: {
    // 获取随访任务详情
    fenchData() {
      this.allLoading = true
      const param = {
        caseFollowVisitTaskDetailId: this.caseFollowVisitTaskDetailId
      }
      getTaskDetailForDoctor(param).then((res) => {
        const { Data } = res
        const {
          nextCaseFollowVisitTaskDetailId,
          abnormalButtonData,
          otherButtonList,
          patientData,
          patientId,
          detailData,
          caseJoinFollowVisitData,
          voteData,
          auxiliaryVoteData,
          isCanEditForVote,
          isCanEditForAuxiliaryVote,
          peData,
          tips, // 任务提示信息
          remindData // 提醒问卷
        } = Data
        if (
          nextCaseFollowVisitTaskDetailId !== 0 &&
          nextCaseFollowVisitTaskDetailId !== null
        ) {
          this.nextVistdisabled = false
          this.nextCaseFollowVisitTaskDetailId = nextCaseFollowVisitTaskDetailId
        } else {
          this.nextVistdisabled = true
        }
        this.abnormalButtons = abnormalButtonData
        this.otherButtonList = otherButtonList
        this.patientData = patientData
        this.patientId = patientId
        this.detailData = detailData
        this.caseJoinFollowVisitData = caseJoinFollowVisitData
        this.voteData = this.formatData(voteData)
        this.auxiliaryVoteData = this.formatData(auxiliaryVoteData)
        this.isCanEditForVote = isCanEditForVote
        this.isCanEditForAuxiliaryVote = isCanEditForAuxiliaryVote
        this.peData = peData
        if (peData != null) {
          this.pePackageId = peData.pePackageId
          this.pebuttonList = peData.pebuttonList
          this.isCheckUpInOurHos = peData.isCheckUpInOurHos
          if (peData.notInOurHosCheckVoteData != null) {
            this.notInOurHosFormData = this.formatData(
              peData.notInOurHosCheckVoteData
            )
          }
          // 体检预约弹窗患者信息
          this.choosePeDatePatient = {
            patientId: patientData.patientId,
            name: patientData.patientName,
            sex: patientData.gender,
            idCardNo: patientData.idCardNo,
            phoneNumber: patientData.mobileNumber,
            pePackageId: peData.pePackageId,
            hospitalId: 200,
            pePackageName: peData.pePackageName,
            peReserveId: peData.peReserve,
            nowReserveTime: peData.reserveTime
          }
        }
        if (tips != null && tips.length > 0) {
          Message({
            message: tips,
            type: 'error',
            duration: 5 * 1000
          })
        }
        this.remindData = remindData
        this.allLoading = false
      })
    },
    // 顶部按钮操作
    handleBtns(btnId) {
      // 领取任务
      if (btnId === 23) {
        this.claimTask(this.caseFollowVisitTaskDetailId)
      }
      // 拒接，无人接听，不配合回访
      if (btnId === 1 || btnId === 2 || btnId === 3) {
        MessageBox.confirm('您是否要更新当前任务状态?', '任务更新', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.createAbnormalRecord(this.caseFollowVisitTaskDetailId, btnId)
        })
      }
      // 提交任务
      if (btnId === 76) {
        this.handleSubmitVisit(this.caseFollowVisitTaskDetailId)
      }
    },
    // 领取随访任务
    claimTask(caseFollowVisitTaskDetailId) {
      MessageBox.confirm('您是否要领取当前任务  ?', '任务领取', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        claimTask({
          caseFollowVisitTaskDetailIds: caseFollowVisitTaskDetailId
        })
          .then((res) => {
            Message({
              message: '领取成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.fenchData()
          })
          .catch((err) => {
            const { Data } = err
            Message({
              message: Data.errorMsg,
              type: 'error',
              duration: 5 * 1000
            })
          })
      })
    },
    // 拒接，不配合，无人接听
    createAbnormalRecord(caseFollowVisitTaskDetailId, abnormalTypeId) {
      const param = {
        caseFollowVisitTaskDetailId: caseFollowVisitTaskDetailId,
        abnormalTypeId: abnormalTypeId
      }
      createAbnormalRecord(param).then((res) => {
        Message({
          message: '处理成功！',
          type: 'success',
          duration: 5 * 1000
        })
        this.fenchData()
      })
    },
    // 终止随访计划
    endCaseFollowVisitTask(caseJoinFollowVisitId) {
      MessageBox.confirm('您确定终止当前随访?', '终止随访', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(caseJoinFollowVisitId)
        getTerminationCaseJoinFollowVisit({
          caseJoinFollowVisitId: caseJoinFollowVisitId
        }).then((res) => {
          const { Data } = res
          this.endFollowVisitDialogForm.list = Data
          this.endFollowVisitDialog = true
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
                message: '终止成功!返回我的任务',
                type: 'success',
                duration: 5 * 1000
              })
              this.endFollowVisitDialogBtnLoading = false
              this.endFollowVisitDialog = false
              this.$router.push({
                path: '/doctor/followVisit/myPlan'
              })
            })
            .catch((err) => {
              console.log(err)
              this.endFollowVisitDialogBtnLoading = false
              this.endFollowVisitDialog = false
            })
        } else {
          return false
        }
      })
    },
    // 作废随访计划
    canceledCaseFollowVisitTask(caseFollowVisitTaskDetailId) {
      MessageBox.confirm('您确定作废当前随访?', '作废随访', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(caseFollowVisitTaskDetailId)
        terminationCaseFollowVisitDetailGet({
          caseFollowVisitTaskDetailId
        }).then((res) => {
          const { Data } = res
          this.canceledFollowVisitDialogForm.list = Data
          this.canceledFollowVisitDialog = true
        })
      })
    },
    // 提交作废原因
    canceledCaseFollowVisitTaskPost() {
      this.$refs.canceledFollowVisitDialogForm.validate((valid) => {
        if (valid) {
          // 循环form数据组成对象
          this.canceledFollowVisitDialog = true
          const submitData = {}
          const data = this.canceledFollowVisitDialogForm.list
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            submitData[item.name] = item.value
          }
          terminationCaseFollowVisitDetail(submitData)
            .then((res) => {
              Message({
                message: '作废成功!返回我的任务',
                type: 'success',
                duration: 5 * 1000
              })
              this.canceledFollowVisitDialogBtnLoading = false
              this.canceledFollowVisitDialog = false
              this.$router.push({
                path: '/doctor/followVisit/myPlan'
              })
            })
            .catch((err) => {
              console.log(err)
              this.canceledFollowVisitDialogBtnLoading = false
              this.canceledFollowVisitDialog = false
            })
        } else {
          return false
        }
      })
    },
    // 重新发送任务提醒
    repeatCaseTaskDetailRemind(caseFollowVisitTaskDetailId) {
      MessageBox.confirm('您是否要重新发送任务提醒?', '重新发送任务提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        repeatCaseTaskDetailRemind({
          caseFollowVisitTaskDetailId
        }).then((res) => {
          Message({
            message: '重新发送任务提醒成功!',
            type: 'success',
            duration: 5 * 1000
          })
        })
      })
    },
    // 下一条随访
    handleNextVisit() {
      MessageBox.confirm('是否前往下一条任务?', '前往下一条任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/doctor/followVisit/pubilcPlan/detail',
          query: {
            caseFollowVisitTaskDetailId: this.nextCaseFollowVisitTaskDetailId
          }
        })
      })
    },
    // 返回
    handleGoHistory() {
      if (
        this.lastPage == '/doctor/followVisit/caseJoinFollowVisit' &&
        this.caseJoinFollowVisitData.caseJoinFollowVisitId
      ) {
        this.$router.push({
          path: '/doctor/followVisit/caseJoinFollowVisit',
          query: {
            caseJoinFollowVisitId:
              this.caseJoinFollowVisitData.caseJoinFollowVisitId,
            pageSize: this.$route.query.pageSize,
            page: this.$route.query.page
          }
        })
      } else {
        this.$router.go(-1)
      }
    },
    // 提交随访
    handleSubmitVisit(caseFollowVisitTaskDetailId) {
      MessageBox.confirm('您是提交当前任务  ?', '任务完成', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          caseFollowVisitTaskDetailId
        }
        modifyTaskDetailState(params).then((res) => {
          Message({
            message: '提交成功！',
            type: 'success',
            duration: 5 * 1000
          })
          // 重新加载页面
          this.fenchData()
        })
      })
    },
    // 退回任务
    returnTask(caseFollowVisitTaskDetailId) {
      const param = { caseFollowVisitTaskDetailId: caseFollowVisitTaskDetailId }
      MessageBox.confirm('您是否要退回当前任务  ?', '任务退回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sendBackTask(param).then((res) => {
          Message({
            message: '退回成功！',
            type: 'success',
            duration: 5 * 1000
          })
          this.fenchData()
        })
      })
    },
    // 随访问卷提交
    submitVote(param) {
      this.voteSubmitLoading = true
      subFollowVisitVote(param)
        .then((res) => {
          Message({
            message: '保存成功！',
            type: 'success',
            duration: 5 * 1000
          })
          this.voteSubmitLoading = false
          this.fenchData()
        })
        .catch((err) => {
          console.log(err)
          Message({
            message: '保存失败，请稍后重试！',
            type: 'error',
            duration: 5 * 1000
          })
          this.voteSubmitLoading = false
        })
    },
    // 辅助问卷提交
    submitauxiliaryVote(param) {
      this.submitVote(param)
    },
    // 检查报告提交
    submitNotInOurHosForm(param) {
      this.submitVote(param)
    },
    // 来院检查选择
    isChooseInOurHos(e) {
      if (e === true) {
        this.isCheckUpInOurHos = true
      } else {
        this.isCheckUpInOurHos = false
      }
      // 是否在本院体检状态修改
      this.modifyIsCheckUpInOurHos(
        this.isCheckUpInOurHos,
        this.caseFollowVisitTaskDetailId
      )
    },
    // 是否在本院体检状态修改
    modifyIsCheckUpInOurHos(isCheckUpInOurHos, caseFollowVisitTaskDetailId) {
      modifyIsCheckUpInOurHos({
        isCheckUpInOurHos,
        caseFollowVisitTaskDetailId
      }).then((res) => {
        const { Code } = res
        // 是否在本院体检状态修改后需要重新加载页面
        if (Code === 1) {
          this.fenchData()
        }
      })
    },
    // 预约挂号
    createPEReserveByDoctor() {
      this.chooseDatedialog = true
    },
    // 选择日期
    choosePeTime(param) {
      // 预约挂号提交数据
      this.chooseDatedialogSubmitData = {
        PatientId: this.choosePeDatePatient.patientId,
        Name: this.choosePeDatePatient.name,
        IdCard: this.choosePeDatePatient.idCardNo,
        pePackageId: this.choosePeDatePatient.pePackageId,
        PhoneNumber: this.choosePeDatePatient.phoneNumber,
        ReserveTime: param.reserveTime,
        Time: param.time
      }
    },
    // 预约挂号提交
    chooseDatedialogSubmit() {
      this.chooseDatedialogBtnLoading = true
      postCreatePEReserveByDoctor(this.chooseDatedialogSubmitData).then(
        (res) => {
          // console.log(res)
          const { Code } = res
          if (Code === 1) {
            Message({
              message: '预约成功！',
              type: 'success',
              duration: 5 * 1000
            })
            const { Data } = res
            const { peReserveId } = Data
            this.rememberPEReserveId(
              this.caseFollowVisitTaskDetailId,
              peReserveId
            )
            this.chooseDatedialogBtnLoading = false
            this.chooseDatedialog = false
          } else {
            const { Msg } = res
            Message({
              message: Msg,
              type: 'error',
              duration: 5 * 1000
            })
            this.chooseDatedialogBtnLoading = false
            this.chooseDatedialog = false
          }
        }
      )
    },
    // 反写体检预约信息至随访任务
    rememberPEReserveId(caseFollowVisitTaskDetailId, peReserveId) {
      rememberPEReserveId({ caseFollowVisitTaskDetailId, peReserveId }).then(
        (res) => {
          this.fenchData()
        }
      )
    },
    // 预约改期
    changeDatePe(param) {
      this.changeDatedialog = true
    },
    // 改期信息
    changeTimeFun(param) {
      console.log(param)
      this.changePeDatePatient = {
        PatientId: this.choosePeDatePatient.patientId,
        Name: this.choosePeDatePatient.name,
        IdCard: this.choosePeDatePatient.idCardNo,
        pePackageId: this.choosePeDatePatient.pePackageId,
        PhoneNumber: this.choosePeDatePatient.phoneNumber,
        peReserveId: param.peReserveId,
        reserveTime: param.reserveTime, // 当前预约日期
        hospitalId: param.hospitalId,
        Time: param.time
      }
    },
    // 改期提交
    changeDateSubmit() {
      console.log(this.changePeDatePatient)
      this.changeDateSubmitLoading = true
      if (
        this.changePeDatePatient != null &&
        this.changePeDatePatient.Time != null
      ) {
        UpdateReserveTime(this.changePeDatePatient)
          .then((res) => {
            if (res.Code === 1) {
              Message({
                message: '预约改期成功！',
                type: 'success',
                duration: 5 * 1000
              })
              this.fenchData()
              this.changeDateSubmitLoading = false
              this.changeDatedialog = false
            }
          })
          .catch((err) => {
            console.log(err)
            Message({
              message: '操作失败！请稍候重试',
              type: 'error',
              duration: 5 * 1000
            })
            this.changeDatedialog = false
          })
        this.changeDatedialog = false
      } else {
        Message({
          message: '请选择正确的日期！',
          type: 'error',
          duration: 5 * 1000
        })
        this.changeDateSubmitLoading = false
      }
    },
    // 取消预约
    cancelPEReserve() {
      const param = {
        peReserveId: this.choosePeDatePatient.peReserveId
      }
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
            this.fenchData()
          } else {
            const { Msg } = res
            Message({
              message: Msg,
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
      })
    },

    // 格式化form表单数据
    formatData(formItemData) {
      if (formItemData != null) {
        const formItemList = formItemData.list
        for (let index = 0; index < formItemList.length; index++) {
          const element = formItemList[index]
          // 如果是复选框，将value的值赋值在list中
          if (element.voteItemTypeId === 1) {
            element.list = element.value.split(',')
          }
          // 如果是省市县，需要将对应id转化为数据
          if (element.voteItemTypeId === 6) {
            if (
              element.value !== '' &&
              element.value !== null &&
              element.value.length > 0
            ) {
              const nameArr = element.value[0].split(',')
              this.getProvinceData(nameArr).then((res) => {
                if (res) {
                  const provinceName = res[0]
                  let cityName = ''
                  let countyName = ''
                  res[1].then((res1) => {
                    cityName = res1[0]
                    res1[1].then((res2) => {
                      countyName = res2
                      element.placeholder = `${provinceName}/${cityName}/${countyName}`
                      // Data[index].value = [provinceName,cityName,countyName]
                      element.addClass = 'sepcialInput'
                    })
                  })
                }
              })
            }
          }
          // 如果是上传组件
          if (element.voteItemTypeId === 8 || element.voteItemTypeId === 9) {
            // 将value改为Arry展示到upload组件
            if (
              element.value !== '' &&
              element.value != null &&
              element.value.length > 0
            ) {
              const urlArry = element.value.split(',')
              const upLoadNeedUrlArry = urlArry.map((url) => {
                return { url: url }
              })
              element.list = upLoadNeedUrlArry
            }
          }
        }
      }
      return formItemData
    },
    async getProvinceData(arr) {
      // 后台数据为0是“请选择..”所以跳过
      if (Number(arr[0] == 0)) {
        return false
      } else {
        let provinceId = 0
        const cityId = 0
        const countyId = 0
        let provinceName = ''
        const cityName = ''
        const countyName = ''
        let newArr = []
        await getProvinceList().then((response) => {
          const { Data } = response
          provinceId = Number(arr[0])
          for (let index = 0; index < Data.length; index++) {
            const eProvince = Data[index]
            if (eProvince.provinceId == provinceId) {
              provinceName = eProvince.Name
            }
          }
          newArr = this.getCityData(arr, provinceId)
        })

        return [provinceName, newArr]
      }
    },
    async getCityData(arr, provinceId) {
      let cityId = 0
      let cityName = ''
      let countyName = ''
      await getCityList({ provinceId: provinceId }).then((cityResponse) => {
        const cityData = cityResponse.Data
        cityId = Number(arr[1])
        for (let index = 0; index < cityData.length; index++) {
          const eCity = cityData[index]
          if (eCity.cityId == cityId) {
            cityName = eCity.Name
          }
        }
        countyName = this.getCountyData(arr, cityId)
      })
      return [cityName, countyName]
    },
    async getCountyData(arr, cityId) {
      let countyId = 0
      let countyName = ''
      await getCountyList({ cityId: cityId }).then((countyResponse) => {
        const countyData = countyResponse.Data
        countyId = Number(arr[2])
        for (let index = 0; index < countyData.length; index++) {
          const eCounty = countyData[index]
          if (eCounty.countyId == countyId) {
            countyName = eCounty.Name
          }
        }
      })

      return countyName
    }
  }
}
</script>
<style lang="scss" scope>
@import '~@/styles/variables.scss';
.fl {
  float: left;
}
.fr {
  float: right;
}
.big-tit {
  color: $bg;
  text-align: center;
  padding: 15.5px 0;
  border-bottom: 1px solid #efefef;
}
.speicial_label {
  color: $bg;
}
.plan-detail-btns {
  padding: 30px;
}
.plan-detail-content {
  padding: 20px;
  background: #a9a9a914;
  min-height: calc(100vh - 174px);
}
.plan-detail-box {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  background: #ffffff;
  &-header {
    padding: 15px;
    border-bottom: 1px solid #efefef;
    &-tit {
      font-size: 16px;
      color: $bg;
      position: relative;
    }
    &-tit::after {
      content: '';
      position: absolute;
      width: calc(100% + 10px);
      height: 2px;
      background: $bg;
      left: -5px;
      bottom: -15px;
    }
  }
  &-content {
    padding: 15px;
  }
}
.leftContentBox {
  .plan-detail-box:last-of-type {
    margin-bottom: 0;
  }
}
.visit-detail-box {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #ffffff;
  min-height: 100%;
  &-items {
    padding: 20px;
  }
  &-item {
    border: 1px solid #e4eaec;
    margin-bottom: 20px;
    &-tit {
      color: $bg;
      background: #ecf1f5;
      padding: 15px 0 15px 20px;
      border-bottom: 1px solid #efefef;
    }
    &-content {
      padding: 20px;
    }
  }
}
.pe-item-desc {
  display: flex;
  margin-bottom: 12px;
  .el-descriptions-item__label {
    color: #606266;
    font-size: 14px;
    min-width: 60px;
  }
}
</style>
