<template>
  <div
    v-loading="loading"
    class="survey"
  >
    <div
      id="scrollFP"
      class="container"
    >
      <div
        ref="surveyLeft"
        class="survey-left"
      >
        <div :class="isFixedScroll &&'survey-left-fix'">
          <div
            v-if="showPatientMsg"
            class="survey-left-patient"
          >
            <h1 class="itemFirst checked">
              <svg-icon icon-class="user" />
              <span style="margin-left:10px">基本信息</span>
            </h1>
            <div class="survey-left-patient-detail">
              <el-descriptions :column="2">
                <el-descriptions-item label="姓名">{{ patientInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ patientInfo.gender }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{ patientInfo.age }}</el-descriptions-item>
              </el-descriptions>
              <el-descriptions :column="1">
                <el-descriptions-item label="联系电话">{{ patientInfo.mobilenumber }}</el-descriptions-item>
                <el-descriptions-item label="身份证号">{{ patientInfo.idcardno }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <div class="survey-left-meniu">
            <div
              v-for="item in leftBox"
              :key="item.index"
            >
              <h1
                class="itemFirst"
                :class="{
                  checked: caseProgressPeriodId == item.caseProgressPeriodId,
                  type1: item.followupProjectTypeId == 1,
                  type2: item.followupProjectTypeId == 2,
                }"
                :data-caseProgressPeriodId="item.caseProgressPeriodId"
                :data-type="item.followupProjectTypeId"
                @click="haveAgreement == true ? 'getContent' : ''"
              >
                <template v-if="item.followupProjectTypeId == 1">
                  <img
                    src="@/assets/doctorSurvey/agreeWhite.png"
                    alt=""
                  >
                  <img
                    src="@/assets/doctorSurvey/agreeColor.png"
                    alt=""
                    class="chk"
                  >
                </template>
                <template v-if="item.followupProjectTypeId == 2">
                  <img
                    src="@/assets/doctorSurvey/questionWhite.png"
                    alt=""
                  >
                  <img
                    src="@/assets/doctorSurvey/questionColor.png"
                    alt=""
                    class="chk"
                  >
                </template>
                {{ item.name }}
              </h1>
              <div
                v-if="
                  item.list &&
                    item.list.length > 0 &&
                    caseProgressPeriodId == item.caseProgressPeriodId
                "
                class="listBox"
              >
                <el-tabs
                  v-model="activeName"
                  tab-position="left"
                  @tab-click="handleClick"
                >
                  <el-tab-pane
                    v-for="(listItem, idx) in item.list"
                    :key="listItem.index"
                    class="itemSecond"
                    :data-idx="idx"
                    :name="listItem.code"
                    :label="listItem.name"
                    :disabled="!listItem.isEnable"
                  />
                  <el-tab-pane
                    v-if="isShowDoctorCensure"
                    class="itemSecond"
                    label="问卷信息汇总"
                    name="doctorCensure"
                  />
                  <el-tab-pane
                    class="itemSecond"
                    label="评估报告"
                    name="first"
                  />
                  <el-tab-pane
                    class="itemSecond"
                    label="补充资料"
                    name="addSurveyInfo"
                  />
                  <el-tab-pane
                    class="itemSecond"
                    label="医生建议"
                    name="second"
                  />
                  <el-tab-pane
                    class="itemSecond"
                    label="筛查项目"
                    name="third"
                  />
                  <el-tab-pane
                    class="itemSecond"
                    label="终检报告"
                    name="fourth"
                  />
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="resutlData === false && doctorCensureData === false"
        class="survey-main survey-right"
      >
        <!-- <div
          class="dialogContentBox"
          v-if="consentVisible && physicalListData && FinalRoport == false"
        >
          <div v-html="dialogContent.content1" class="dialogContent1">
            {{ dialogContent.content1 }}
          </div>
          <div class="dialogContent2">
            <el-checkbox v-model="dialogChecked"></el-checkbox>
            <div v-html="dialogContent.content2">
              {{ dialogContent.content2 }}
            </div>
          </div>
          <el-button @click="handleClose(false)">取 消</el-button>
          <el-button
            class="mt20"
            type="primary"
            @click="handleClose(true)"
            :disabled="!dialogChecked"
            >确 定</el-button
          >
        </div> -->
        <div
          v-show="!consentVisible"
          class="survey-main-content"
        >
          <h3 class="survey-main-content-tit">{{ pageName }}</h3>
          <el-divider />
          <div class="survey-main-content-tips">
            请您仔细阅读每一道题，根据实际情况填写，我们将严格保护您的问卷隐私。本问卷仅提供初步评估建议，具体评估还需到肿瘤专科医院进行医生诊断。
          </div>
          <div class="survey-main-content-progress">
            <div class="survey-main-content-progress-left">
              <h4>填写进度：</h4>
            </div>
            <div class="survey-main-content-progress-right">
              <el-progress
                :percentage="percentage"
                :format="format"
                :color="variables.progressColor"
                :stroke-width="8"
              />
            </div>
          </div>
          <div class="survey-main-content-line" />
          <div class="survey-main-content-body">
            <el-form
              ref="dynamicValidateForm"
              :model="pageData"
              class="dynamic"
              :label-width="labelWidth"
              :label-position="labelPosition"
            >
              <div
                v-for="(item, index) in pageData.pageItems"
                :key="item.index"
              >
                <div v-if="item.isRealQuestion">
                  <!-- 单选：1 -->
                  <div v-if="item.topicTypeId == 1">
                    <el-form-item
                      v-if="item.isDisplay"
                      :ref="'pageItems.' + index + '.notTextValue[0]'"
                      :label="item.title + item.additional + item.remark"
                      :prop="'pageItems.' + index + '.notTextValue[0]'"
                      :rules="{
                        required: item.isRequired,
                        message: '请至少选择一个',
                        trigger: 'change',
                      }"
                    >
                      <el-radio-group
                        v-model="item.notTextValue[0]"
                        :disabled="isLocked"
                        @change="
                          radionChange(item)
                        "
                      >
                        <el-radio
                          v-for="itemRadio in item.answerOptionList"
                          :key="itemRadio.name"
                          :label="Number(itemRadio.value)"
                        >{{ itemRadio.name }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                  <!-- 复选：2 -->
                  <div v-if="item.topicTypeId == 2">
                    <el-form-item
                      v-if="item.isDisplay"
                      :ref="'pageItems.' + index + '.notTextValue'"
                      :label="item.title + item.additional + item.remark"
                      :prop="'pageItems.' + index + '.notTextValue'"
                      :rules="{
                        required: item.isRequired,
                        message: '请至少选择一个',
                        trigger: 'change',
                      }"
                    >
                      <el-checkbox-group
                        v-model="item.notTextValue"
                        :disabled="isLocked"
                      >
                        <el-checkbox
                          v-for="(
                            itemCheck, itemIndex
                          ) in item.answerOptionList"
                          :key="itemCheck.name"
                          :label="Number(itemCheck.value)"
                          @change="
                            checkBoxChange(
                              item,
                              itemIndex
                            )
                          "
                        >{{ itemCheck.name }}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </div>
                  <!-- 下拉：3-->
                  <div v-if="item.topicTypeId == 3">
                    <el-form-item
                      v-if="item.isDisplay"
                      :ref="'pageItems.' + index + '.textValue'"
                      :label="item.title + item.additional + item.remark"
                      :prop="'pageItems.' + index + '.textValue'"
                      :rules="{
                        required: item.isRequired,
                        message: '必填项不能为空',
                        trigger: 'blur',
                      }"
                    >
                      <el-input v-model="item.textValue" />
                    </el-form-item>
                  </div>
                  <!-- 文本：4 -->
                  <div v-if="item.topicTypeId == 4">
                    <el-form-item
                      v-if="item.isDisplay"
                      :ref="'pageItems.' + index + '.textValue'"
                      :label="item.title + item.additional + item.remark"
                      :prop="'pageItems.' + index + '.textValue'"
                      :rules="[
                        {
                          required: item.isRequired,
                          message: '必填项不能为空',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input
                        v-model="item.textValue"
                        :disabled="isLocked"
                      />
                    </el-form-item>
                  </div>
                  <!-- 整数：5且有大小值限制 -->
                  <div v-if="item.topicTypeId == 5 && (item.maxNum !=null ||item.minNum != null)">
                    <el-form-item
                      v-if="item.isDisplay"
                      :ref="'pageItems.' + index + '.textValue'"
                      :label="item.title + item.additional + item.remark"
                      :prop="'pageItems.' + index + '.textValue'"
                      :rules="[
                        {
                          required: item.isRequired,
                          message: '必填项不能为空',
                          trigger: 'blur',
                        }
                      ]"
                    >
                      <el-input
                        v-model="item.textValue"
                        :max="item.maxNum"
                        :min="item.minNum"
                        type="number"
                        :disabled="isLocked"
                        @change="limitMaxMin(item),inputChange(item)"
                      />
                    </el-form-item>
                  </div>
                  <!-- 整数：5且无大小值限制 -->
                  <div v-if="item.topicTypeId === 5 && item.maxNum ===null&&item.minNum === null">
                    <el-form-item
                      v-if="item.isDisplay"
                      :ref="'pageItems.' + index + '.textValue'"
                      :label="item.title + item.additional + item.remark"
                      :prop="'pageItems.' + index + '.textValue'"
                      :rules="[
                        {
                          required: item.isRequired,
                          message: '必填项不能为空',
                        },
                        {
                          trigger: 'blur',
                          validator: validateNumber,
                        },
                      ]"
                    >
                      <el-input
                        v-model="item.textValue"
                        :disabled="isLocked"
                        @blur="inputChange(item)"
                      />
                    </el-form-item>
                  </div>
                  <!-- 浮点：6   -->
                  <div v-if="item.topicTypeId == 6">
                    <el-form-item
                      v-if="item.isDisplay"
                      :ref="'pageItems.' + index + '.textValue'"
                      :label="item.title + item.additional + item.remark"
                      :prop="'pageItems.' + index + '.textValue'"
                      :rules="[
                        {
                          required: item.isRequired,
                          message: '必填项不能为空',
                          trigger: 'blur',
                        },
                        {
                          trigger: 'blur',
                          validator: validateFloatNumber,
                        },
                      ]"
                    >
                      <el-input
                        v-model="item.textValue"
                        :disabled="isLocked"
                      />
                    </el-form-item>
                  </div>
                  <!--日期 7-->
                  <div v-if="item.topicTypeId == 7">
                    <el-form-item
                      v-if="item.isDisplay"
                      :ref="'pageItems.' + index + '.dateValue'"
                      :label="item.title + item.additional + item.remark"
                      :prop="'pageItems.' + index + '.dateValue'"
                      :rules="[
                        {
                          required: item.isRequired,
                          message: '必填项不能为空',
                          trigger: 'blur',
                        }
                      ]"
                    >
                      <el-date-picker
                        v-model="item.dateValue"
                        type="date"
                        :disabled="isLocked"
                        style="width: 200px"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      />
                    </el-form-item>
                  </div>
                  <!--时间 8-->
                  <div v-if="item.topicTypeId == 8">
                    <el-form-item
                      v-if="item.isDisplay"
                      :ref="'pageItems.' + index + '.dateValue'"
                      :label="item.title + item.additional + item.remark"
                      :prop="'pageItems.' + index + '.dateValue'"
                      :rules="[
                        {
                          required: item.isRequired,
                          message: '必填项不能为空',
                          trigger: 'blur',
                        }
                      ]"
                    >
                      <el-date-picker
                        v-model="item.dateValue"
                        type="datetime"
                        :disabled="isLocked"
                        style="width: 200px"
                      />
                    </el-form-item>
                  </div>
                </div>
                <div v-if="!item.isRealQuestion">
                  <h4
                    v-if="item.isDisplay"
                    class="big-tit"
                  >
                    {{ item.title }}
                  </h4>
                </div>
              </div>
            </el-form>
          </div>
          <div class="survey-main-content-line" />
          <div class="survey-main-content-btn">
            <el-button-group>
              <el-button
                type="primary"
                :disabled="prevBtnable"
                icon="el-icon-arrow-left"
                style="border-radius: 20px 0 0 20px"
                @click="prevPage()"
              >上一页</el-button>
              <el-button
                v-if="!isLastPage"
                type="primary"
                style="border-radius: 0 20px 20px 0"
                @click="nextPage()"
              >下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
              <el-button
                v-else
                type="primary"
                style="border-radius: 0 20px 20px 0; width: 103px"
                :disabled="isLocked"
                @click="updateFinishState"
              >提交<i class="el-icon-arrow-right el-icon--right" /></el-button>
            </el-button-group>
          </div>
          <div class="survey-main-content-bottomtip">
            *完成所有题目后方可提交
          </div>
        </div>
        <!-- 筛查项目 -->
        <div
          v-if="physicalListData"
          class="physicalList"
        >
          <ScreeningProject
            :recommend-list="recommendList"
            :show-p-e-reserve-list="showPEReserveList"
            :show-p-e-reserve-detail-list="showPEReserveDetailList"
          />
        </div>
        <div v-if="FinalRoport">
          <h3 class="survey-main-content-tit">终检报告</h3>
          <div
            v-if="isHaveFinalRoport"
            class="survey-main-content-pdf"
          >
            <ViewPdf :pdf-url="pdfUrl" />
          </div>
          <div v-else>
            <el-empty description="暂无终检报告！" />
          </div>
        </div>
      </div>
      <!--评估报告-->
      <div
        v-if="resutlData != false"
        class="result"
      >
        <div class="">
          <div
            v-if="resultMsg == null"
            class=""
          >
            <SurveyResult
              :result-list="Result"
              :is-print="IsPrint"
              :show-content="showContent"
              @toReportPage="toReportPage"
              @goToAnchor="goToAnchor"
            />
          </div>
          <div v-else>{{ resultMsg }}</div>
        </div>
      </div>
      <!--问卷信息汇总-->
      <div
        v-if="doctorCensureData != false"
        class="result"
      >
        <div class="">
          <div
            v-if="doctorCensureMsg == null"
            class=""
          >
            <SummaryInfo
              :result-list="Result"
              :is-print="true"
              :is-show="false"
              :show-content="showContent"
              :show-item-no="false"
              @toReportPage="toReportPage"
              @goToAnchor="goToAnchor"
            />
          </div>
          <div v-else>{{ doctorCensureMsg }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SurveyResult from '@/components/SurveyResult/index'
import ScreeningProject from './components/ScreeningProject.vue'
import SummaryInfo from './components/SummaryInfo.vue'
import ViewPdf from '@/components/ViewPdf/index'
import variables from '@/styles/variables.scss'
import { validNumber, validFloatNumber } from '@/utils/validate'
import { MessageBox, Message } from 'element-ui'
import {
  CheckIsShowDoctorCensure,
  getCaseProgressPeriodList,
  getConsent,
  updateConsentState,
  getFollowupMINIPageList,
  updateFinishState,
  lockCaseJoinProtocol,
  getSurveyResult,
  GetCheckItemData,
  FinalReport,
  getNewMINIPage,
  getFollowupMINITriggerEventsByTopicCode,
  postGenerateFillTopic,
  postFilledPageSub,
  getDoctorCensure
} from '@/api/summary'
import { getPatientInfo } from '@/api/doctor'
import { getPdf } from '@/api/requestPdf'
export default {
  components: { SurveyResult, ViewPdf, ScreeningProject, SummaryInfo },
  data() {
    return {
      showContent: false, // 控制报告页组件中内容显示与隐藏
      IsPrint: false, // 控制报告页组件中内容显示与隐藏
      height: '100%',
      arrow: 'never',
      indicatorPosition: 'none',
      labelWidth: '',
      labelPosition: 'top',
      isFixedScroll: false, // 页面触发左侧导航滚动
      dialogChecked: false,
      consentVisible: true,
      physicalListData: false, // 筛查项目
      patientId: null,
      caseJoinProtocolId: 0,
      caseProgressPeriodId: null,
      caseProgressItemId: null,
      followupMINIPageId: null,
      patientInfo: {},
      pageName: '',
      pageNumber: 1,
      lastPageId: 0,
      nextPageId: 0,
      miniPageIdList: [],
      codeList: [],
      percentage: 0,
      prevBtnable: true,
      nextBtnable: false,
      dialogContent: {
        content1: null,
        content2: null
      },
      pageData: {
        pageItems: []
      },
      triggerEventList: [], // 当前页事件集合
      isLocked: false, // 当前问卷是否锁定或可编辑，锁定后不可点击
      isLastPage: false,
      leftBox: [],
      loading: true, // 全局loading状态
      nowPageId: null, // 记录pageid
      Result: {
        patientMsgData: {
          patientMsgIsShow: false
        },
        reportResultData: {
          reportResultIsShow: false
        },
        adviceMsgData: {
          adviceMsgIsShow: false
        },
        checkItemListData: {
          checkItemListIsShow: false
        },
        supplementInformationData: {
          supplementInformationIsShow: false
        }
      },
      resutlData: false,
      resultMsg: null, // 汇总提示
      doctorCensureData: false, // 问卷信息汇总数据
      doctorCensureMsg: null, // 问卷信息汇总返回信息
      haveAgreement: null, // 标识是否有知情同意书 true为有 false为没有
      adviceIsShow: true,
      checkItemList: [],
      recommendList: [],
      showPEReserveList: [],
      showPEReserveDetailList: [],
      FinalRoport: false, // 是否展示终检报告页
      isHaveFinalRoport: false, // 是否有终检报告
      pdfUrl: '', // pdf预览路径
      activeName: null,
      isShowDoctorCensure: false, // 是否显示问卷信息汇总
      showPatientMsg: true // 是否显示个人信息
    }
  },

  computed: {
    variables() {
      return variables
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },

  created() {
    this.getData()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    getParams() {
      const routerParams = this.$route.query.clickTypeId
      this.caseJoinProtocolId = this.$route.query.caseJoinProtocolId
      if (routerParams === 38) {
        setTimeout(() => {
          this.activeName = 'first'
        }, 1800)
        this.toReportPage()
      } else if (routerParams === 78) {
        setTimeout(() => {
          this.activeName = 'doctorCensure'
        }, 1800)
        this.toDoctorCensure()
      }
    },
    format(percentage) {
      return percentage === 100
        ? `第${this.miniPageIdList.length}/${this.miniPageIdList.length}(页)`
        : `第${this.pageNumber}/${this.miniPageIdList.length}(页)`
    },
    getData() {
      this.getParams()
      const patientId = this.$route.query.patientId
      this.caseJoinProtocolId = this.$route.query.caseJoinProtocolId
      this.checkIsShowDoctorCensure(this.caseJoinProtocolId)
      this.getCaseProgressPeriodList({
        caseJoinProtocolId: this.caseJoinProtocolId
      })
      // 导航患者信息
      this.getPatientInfo(patientId)
    },
    // 检查当前问卷是否开启医生指摘
    checkIsShowDoctorCensure(caseJoinProtocolId) {
      CheckIsShowDoctorCensure({ caseJoinProtocolId }).then((res) => {
        const { Data } = res
        this.isShowDoctorCensure = Data
      })
    },
    // 获取患者信息
    getPatientInfo(patientId) {
      if (patientId === 0) {
        this.showPatientMsg = false
      } else {
        getPatientInfo({ patientId }).then((res) => {
          const { Data } = res
          this.patientInfo = Data
        })
      }
    },
    // 跳转知情同意书
    getContent(e) {
      this.loading = true
      if (Number(e.currentTarget.dataset.type) === 1) {
        this.consentVisible = true
        const param = {}
        const data = this.leftBox
        for (let index = 0; index < data.length; index++) {
          const item = data[index]
          if (item.followupProjectTypeId === 1) {
            param.caseProgressPeriodId = item.caseProgressPeriodId
            param.caseJoinProtocolId = item.caseJoinProtocolId
            this.caseProgressPeriodId = item.caseProgressPeriodId
            this.caseJoinProtocolId = item.caseJoinProtocolId
          }
        }
        getConsent(param).then((response) => {
          const { Data } = response
          this.dialogContent.content1 = Data.content1
          this.dialogContent.content2 = Data.content2
          this.$forceUpdate()
          this.loading = false
        })
      } else {
        // this.handleClose(true);
        this.getFollowupMINIPageList({
          caseJoinProtocolId: this.caseJoinProtocolId,
          caseProgressPeriodId: e.currentTarget.dataset.caseprogressperiodid
        })
      }
      this.loading = true
    },
    // 左侧问卷子项跳转
    toOtherPage(isEnable, miniPageId, index) {
      if (isEnable) {
        this.loading = true
        this.resutlData = false
        this.doctorCensureData = false
        this.physicalListData = false
        this.FinalRoport = false

        if (index === 0) {
          this.prevBtnable = true
        } else {
          this.prevBtnable = false
        }
        this.getPageData(miniPageId)
        this.pageNumber = Number(index) + 1
      }
    },
    handleClick(tab, event) {
      for (let index = 0; index < this.leftBox.length; index++) {
        const item = this.leftBox[index]
        for (let j = 0; j < item.list.length; j++) {
          const ele = item.list[j]
          if (tab.name === ele.code) {
            this.toOtherPage(ele.isEnable, ele.miniPageId, j)
          }
        }
      }
      if (tab.name === 'first') {
        this.toReportPage()
      }
      if (tab.name === 'second') {
        this.toAdvicePage()
      }
      if (tab.name === 'third') {
        this.toCheckPage()
      }
      if (tab.name === 'fourth') {
        this.toFinalPage()
      }
      if (tab.name === 'addSurveyInfo') {
        this.toaddSurveyInfoPage()
      }
      if (tab.name === 'doctorCensure') {
        this.toDoctorCensure()
      }
    },
    // 获取问卷信息汇总
    toDoctorCensure() {
      const operatType = {
        caseJoinProtocolId: this.caseJoinProtocolId,
        isNeedCheckItem: true
      }
      getDoctorCensure(operatType).then((response) => {
        this.loading = true
        const { Data } = response
        // console.log(response)
        if (response.Code === 1) {
          this.consentVisible = true
          this.IsPrint = false
          this.resutlData = false
          this.physicalListData = false
          this.FinalRoport = false
          this.doctorCensureData = true
          this.doctorCensureMsg = null
          this.Result = Data
        } else {
          this.resultMsg = response.Msg
          MessageBox(response.Msg, '提示', {
            confirmButtonText: '确定',
            callback: (action) => {
              this.$message({
                type: 'info',
                message: `action: ${action}`
              })
            }
          })
        }
        this.loading = false
      })
    },
    // 获取问卷结果
    toReportPage() {
      const operatType = {
        caseJoinProtocolId: this.caseJoinProtocolId,
        isNeedCheckItem: true
      }
      getSurveyResult(operatType).then((response) => {
        const { Data } = response
        if (response.Code === 1) {
          this.consentVisible = true
          this.IsPrint = true
          this.resutlData = true
          this.doctorCensureData = false
          this.physicalListData = false
          this.FinalRoport = false
          this.resultMsg = null
          this.Result = Data
        } else {
          this.resultMsg = response.Msg
          MessageBox(response.Msg, '提示', {
            confirmButtonText: '确定',
            callback: (action) => {
              this.$message({
                type: 'info',
                message: `action: ${action}`
              })
            }
          })
        }
        this.loading = false
      })
    },
    // 补充资料跳转
    toaddSurveyInfoPage() {
      this.toReportPage()
      this.goToAnchor('#addSurveyInfoPage')
    },
    // 医生建议跳转
    toAdvicePage() {
      this.toReportPage()
      this.goToAnchor('#doctorAdvice')
    },
    // 获取筛查项目
    toCheckPage() {
      const operatType = {
        caseJoinProtocolId: this.caseJoinProtocolId
      }
      GetCheckItemData(operatType).then((response) => {
        const { Data } = response
        if (response.Code === 1) {
          this.resutlData = false
          this.doctorCensureData = false
          this.consentVisible = true
          this.physicalListData = true
          this.FinalRoport = false
          this.nowPageId = 9999
          this.checkItemList = Data.checkItemList
          for (let index = 0; index < this.checkItemList.length; index++) {
            const item = this.checkItemList[index]
            this.recommendList = item.recommendList
            this.showPEReserveList = item.showPEReserveList
            for (let j = 0; j < this.showPEReserveList.length; j++) {
              const idx = this.showPEReserveList[j]
              this.showPEReserveDetailList = idx.showPEReserveDetailList
            }
          }
        } else {
          MessageBox(response.Msg, '提示', {
            confirmButtonText: '确定',
            callback: (action) => {
              this.$message({
                type: 'info',
                message: `action: ${action}`
              })
            }
          })
        }
      })
    },
    // 查询报告
    // toFinalPage() {
    //   let operatType = {
    //     peReserveId: 73,
    //   };
    //   GetReportResulto(operatType).then((response) => {
    //     const { Data } = response;
    //     this.getPdfUrl(Data.pdfUrl).then((res) => {
    //       this.pdfUrl = res;
    //     });
    //     if (response.Code == 1) {
    //       this.resutlData = false;
    //       this.consentVisible = true;
    //       this.physicalListData = false;
    //       this.FinalRoport = true;
    //       this.nowPageId = 9999;
    //     }
    //   });
    // },
    // 获取终检报告
    toFinalPage() {
      const patientParam = {
        caseJoinProtocolId: this.caseJoinProtocolId
      }
      FinalReport(patientParam)
        .then((response) => {
          const { Data } = response
          if (Data != null && Data.length < 1) {
            Message({
              message: '暂无终检报告！',
              type: 'error',
              duration: 5 * 1000
            })
          } else {
            if (Data[0].pdfUrl != null && Data[0].pdfUrl !== '') {
              this.loading = true
              this.nowPageId = 9999
              this.consentVisible = true
              this.FinalRoport = true
              this.getPdfUrl(Data[0].pdfUrl)
                .then((res) => {
                  this.pdfUrl = res
                  this.resutlData = false
                  this.doctorCensureData = false
                  this.physicalListData = false
                  this.isHaveFinalRoport = true
                  this.loading = false
                })
                .catch(() => {
                  this.isHaveFinalRoport = false
                  this.loading = false
                })
            } else {
              Message({
                message: '暂无终检报告！',
                type: 'error',
                duration: 5 * 1000
              })
            }
          }
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
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    // 获取就诊人当前进行阶段
    getCaseProgressPeriodList(param) {
      getCaseProgressPeriodList(param).then((response) => {
        const { Data } = response
        // console.log("大阶段", Data);
        this.leftBox = Data
        // 获取左侧组成信息
        // console.log("当前左侧list", this.leftBox);
        // 循环阶段，看是否有知情同意书
        for (let index = 0; index < Data.length; index++) {
          const item = Data[index]
          if (item.followupProjectTypeId === 1) {
            this.caseJoinProtocolId = item.caseJoinProtocolId
            this.caseProgressPeriodId = item.caseProgressPeriodId
            this.haveAgreement = true
            this.getConsent({
              caseProgressPeriodId: this.caseProgressPeriodId,
              caseJoinProtocolId: this.caseJoinProtocolId
            })
            break
          } else if (item.followupProjectTypeId === 2) {
            this.caseJoinProtocolId = item.caseJoinProtocolId
            this.caseProgressPeriodId = item.caseProgressPeriodId
            this.haveAgreement = false
            this.getFollowupMINIPageList(item)
            this.consentVisible = false
          }
        }
      })
    },
    // 读取知情同意书
    getConsent(param) {
      // 获取知情同意书内容
      getConsent(param).then((response) => {
        const { Data } = response
        // console.log('知情同意书', Data)
        if (Data.isAgree === true) {
          // 已填写知情同意书
          this.dialogChecked = true
          this.handleClose(true)
        } else {
          this.dialogContent.content1 = Data.content1
          this.dialogContent.content2 = Data.content2
          this.loading = false
        }
      })
    },
    // 弹窗关闭若同意知情书加载问卷，若不同意展示提示信息。
    handleClose(param) {
      if (this.dialogChecked && param) {
        updateConsentState({
          caseJoinProtocolId: this.caseJoinProtocolId,
          caseProgressPeriodId: this.caseProgressPeriodId
        }).then((response) => {
          if (response.Code === 1 && response.Data != null) {
            const { Data } = response
            const { transferMsg } = Data
            // 获取就诊人参与方案
            this.getFollowupMINIPageList(transferMsg)
            this.consentVisible = false
          }
        })
      } else {
        this.consentVisible = true
      }
    },
    // 获取就诊人参与方案
    getFollowupMINIPageList(data) {
      const param = {
        caseJoinProtocolId: data.caseJoinProtocolId,
        caseProgressPeriodId: data.caseProgressPeriodId
      }
      getFollowupMINIPageList(param).then((response) => {
        const { Data } = response
        const { pageList } = Data
        // console.log(pageList);
        // 将获取到的问卷项填入左侧list中并追加结果项
        for (let i = 0; i < this.leftBox.length; i++) {
          if (this.leftBox[i].followupProjectTypeId === 2) {
            this.leftBox[i].list = JSON.parse(JSON.stringify(pageList))
          }
        }
        this.miniPageIdList = pageList.map((list) => {
          return list.miniPageId
        })
        this.codeList = pageList.map((list) => {
          return list.code
        })
        this.caseProgressItemId = Data.caseProgressItemId
        this.caseProgressPeriodId = Data.caseProgressPeriodId
        this.caseJoinProtocolId = param.caseJoinProtocolId
        // 加载第一页
        this.getPageData(this.miniPageIdList[0])
        this.activeName = this.codeList[0]
        // 头部进度条
        this.percentageChange(this.pageNumber, this.miniPageIdList.length)
        this.$forceUpdate()
      })
    },
    // 获取问卷
    getPageData(miniPageId) {
      // console.log("加载", this.$refs.dynamicValidateForm);
      // 设置当前页的followupMINIPageId
      this.followupMINIPageId = miniPageId
      // 如果页面有未填提，不可点击下一页
      // 如果是第一页，不能点击上一页按钮
      let param = {
        caseProgressItemId: this.caseProgressItemId,
        caseProgressPeriodId: this.caseProgressPeriodId
      }
      this.nowPageId = miniPageId // 存储当前pageid
      param = Object.assign(param, { followupMINIPageId: miniPageId })
      getNewMINIPage(param).then((response) => {
        const { Data } = response
        const { data, pageName, isProhibitEdit } = Data
        this.lastPageId = Data.lastPageId
        this.nextPageId = Data.nextPageId
        // 判断问卷是否锁定或者可编辑
        this.isLocked = isProhibitEdit
        if (this.lastPageId === 0) {
          this.prevBtnable = true
        }
        // 如果是最后一页，不能点击下一页按钮
        if (this.nextPageId === -2) {
          this.isLastPage = true
        } else {
          this.isLastPage = false
        }
        this.pageData.pageItems = data
        this.pageName = pageName
        this.percentageChange(this.pageNumber, this.miniPageIdList.length)
        this.loading = false
        this.consentVisible = false
        this.activeName = Data.pageCode
        this.$forceUpdate()
        // 解决页面刷新出现表单验证bug，数据加载完毕清除表单验证。
        this.$nextTick(() => {
          this.$refs.dynamicValidateForm.clearValidate()
        })
      })
      // 同时获取当前页面所用到的触发事件
      const getEventParam = {
        caseProgressItemId: this.caseProgressItemId,
        caseProgressPeriodId: this.caseProgressPeriodId,
        followupMINIPageId: miniPageId
      }
      this.getEventsCode(getEventParam)
      // 同时生成真实题目信息
      this.postGenerateFillTopic(getEventParam)
    },
    // 获取当前页面所用到的触发事件
    getEventsCode(getEventParam) {
      getFollowupMINITriggerEventsByTopicCode(getEventParam).then((res) => {
        const { Data } = res
        this.triggerEventList = Data
      })
    },
    // 生成当前填写页面真实题目信息
    postGenerateFillTopic(params) {
      postGenerateFillTopic(params).then((res) => {})
    },
    // 提交数据文本类
    // form表单事件
    inputChange(formItemData) {
      const { followupMINITopicId, textValue, isExistEvent } = formItemData
      const triggerEventData = {
        followupMINITopicId: followupMINITopicId,
        value: textValue,
        score: textValue,
        isExistEvent: isExistEvent
      }
      this.checkTriggerEvent(triggerEventData)
    },
    radionChange(formItemData) {
      const {
        answerOptionList,
        followupMINITopicId,
        notTextValue,
        isExistEvent
      } = formItemData
      const triggerEventData = { followupMINITopicId, isExistEvent }
      const itemValue = notTextValue[0]
      for (let index = 0; index < answerOptionList.length; index++) {
        const element = answerOptionList[index]
        if (element.value === String(itemValue)) {
          triggerEventData.score = element.score
          break
        }
      }
      this.checkTriggerEvent(triggerEventData)
    },
    // 选择框param：当前点击的formItem，复选框题目位置
    checkBoxChange(item, itemIndex) {
      // console.log(itemIndex, item)
      const { notTextValue, answerOptionList, followupMINITopicId } = item
      const triggerEventData = {
        followupMINITopicId
      }
      let value = notTextValue
      // 根据下标判断当前选定项
      // 点击唯一值时其它值清空
      if (itemIndex >= 0) {
        const currentInputData = answerOptionList[itemIndex]
        // 如果当前选中项为其它置空项
        if (currentInputData.isOnly === true) {
          // 判断是初次点中还是最后一次点中
          const currentInputDataValue = Number(currentInputData.value)
          if (value.includes(currentInputDataValue)) {
            // 重置当前复选框
            item.notTextValue = []
            item.notTextValue.push(currentInputDataValue)
            value = [currentInputDataValue]
          }
        } else if (currentInputData.isOnly === false) {
          // 如果当前选中项为正常项，需要清除置空项按钮
          // 获取置空项按钮的value
          const newArr = answerOptionList.filter((res) => {
            if (res.isOnly === true) {
              return res
            }
          })
          if (newArr.length > 0) {
            // 唯一值可能有多个，删除value中的对应值
            for (let index = 0; index < newArr.length; index++) {
              const isOnlyValue = newArr[index]
              for (let i = 0; i < value.length; i++) {
                const element = value[i]
                if (element === Number(isOnlyValue.value)) {
                  value.splice(i, 1)
                }
              }
            }
          }
        }
      }
      console.log('1', value)
      for (let i = 0; i < value.length; i++) {
        const formItemVlaue = String(value[i])
        console.log('2', answerOptionList)
        for (let j = 0; j < answerOptionList.length; j++) {
          const element = answerOptionList[j]

          if (formItemVlaue === element.value) {
            triggerEventData.value =
              (triggerEventData.value !== undefined &&
              triggerEventData.value !== null &&
              triggerEventData.value !== ''
                ? triggerEventData.value + ','
                : '') + formItemVlaue
            triggerEventData.score =
              (triggerEventData.score !== undefined &&
              triggerEventData.score !== null &&
              triggerEventData.score !== ''
                ? triggerEventData.score + ','
                : '') + element.score
          }
        }
      }
      if (
        triggerEventData.score !== undefined &&
        triggerEventData.score !== null &&
        triggerEventData.score !== ''
      ) {
        triggerEventData.score = ',' + triggerEventData.score + ','
      }
      console.log('3', triggerEventData)
      this.checkTriggerEvent(triggerEventData)
      // 匹配对应值，控制元素显示隐藏
    },
    // 校验事件数据集合来控制其它formItem显示与隐藏
    checkTriggerEvent(triggerEventData) {
      // console.log(triggerEventData)
      const triggerEventList = this.triggerEventList
      for (let index = 0; index < triggerEventList.length; index++) {
        const element = triggerEventList[index]
        // 循环找到与foritem当前选择的value的值一样的情况
        if (
          element.formula != null &&
          element.formula.indexOf(
            '#' + triggerEventData.followupMINITopicId + '#'
          ) !== -1
        ) {
          // console.log(element)
          // 替换与本题followupMINITopicId一样的项,并把它改为对应的score
          let currentFormula = element.formula.replace(
            new RegExp('#' + triggerEventData.followupMINITopicId + '#', 'g'),
            "'" + triggerEventData.score + "'"
          )
          // console.log(currentFormula)
          // 如果还有#号需去除
          if (currentFormula.indexOf('#') !== -1) {
            currentFormula = this.replaceTriggerVal(currentFormula)
          }
          // console.log(currentFormula)
          // console.log(this.new_eval(currentFormula))
          // 判断score与事件验证的值是否相同，相同则触发事件
          if (
            this.new_eval(currentFormula) &&
            element.triggerEventParameters.length > 0
          ) {
            this.handelTriggerEvent(element.triggerEventParameters)
            // console.log(element)
          }
        }
      }
    },
    // 替换规则中的数据---不是本题，是之前的题目
    replaceTriggerVal(currentFormula) {
      // 获取#号之间的id
      const arryStr = currentFormula.split('#')
      const arryIds = []
      for (let i = 0; i < arryStr.length; i++) {
        if (i % 2 === 1) {
          arryIds.push(arryStr[i].trim())
        }
      }
      if (arryIds.length > 0) {
        // 检查当前页面表单数据的值是否包含事件的id，并跟你局
        const forItemData = this.pageData.pageItems
        for (let index = 0; index < forItemData.length; index++) {
          const element = forItemData[index]
          const followupMINITopicIdStr = String(element.followupMINITopicId)
          if (arryIds.indexOf(followupMINITopicIdStr) !== -1) {
            // 如果有该题需要找到它的score
            // 根据题目类型判断获取score
            let topicScore = ''
            // 单选复选score为对应项
            for (let i = 0; i < arryIds.length; i++) {
              const arryId = arryIds[i]
              if (arryId === followupMINITopicIdStr) {
                if (element.topicTypeId === 1 || element.topicTypeId === 2) {
                  const childrens = element.answerOptionList
                  for (let index = 0; index < childrens.length; index++) {
                    const child = childrens[index]
                    // console.log(element, child.value)
                    // console.log(element.notTextValue[0], child.value)
                    if (element.notTextValue.length > 0) {
                      if (element.notTextValue[0] === Number(child.value)) {
                        topicScore = child.score
                        break
                      }
                    } else {
                      topicScore = "''" // 命名为空字符串中的空字符串做算数表达式用
                    }
                  }
                }
                // 整数类型score为value
                if (element.topicTypeId === 5) {
                  topicScore = String(element.value)
                }
                currentFormula = currentFormula.replace(
                  new RegExp('#' + followupMINITopicIdStr + '#', 'g'),
                  topicScore
                )
              }
            }
          }
        }
      }
      // console.log(currentFormula)
      return currentFormula
    },
    handelTriggerEvent(triggerEventParameters) {
      // 循环事件集合
      // console.log(triggerEventParameters)
      const formDatas = this.pageData.pageItems
      for (let index = 0; index < triggerEventParameters.length; index++) {
        const triggerEventParameter = triggerEventParameters[index]
        // 循环表单集合
        for (let i = 0; i < formDatas.length; i++) {
          const formItem = formDatas[i]
          // 匹配到对应form数据
          if (
            formItem.followupMINITopicId == triggerEventParameter.miniTopic_id
          ) {
            //  1、隐藏，2、显示，3、不可修改，4、可以修改，5、赋值
            if (Number(triggerEventParameter.triggeredMode_id) === 1) {
              formItem.isDisplay = false
              formItem.textValue = null
              formItem.value = ''
              formItem.score = ''
              // console.log(formItem)
              // 如果formItem为单选或复选类型，需清空notTextVlaue
              if (formItem.topicTypeId === 1) {
                formItem.notTextValue = []
                // 同时需要触发一次子级的隐藏事件
                this.radionChange(formItem)
                // 同时子级隐藏
              }
              if (formItem.topicTypeId === 2) {
                formItem.notTextValue = []
                // console.log(formItem)
                this.checkBoxChange(formItem)
              }
              // 如果formItem为整数类型，需要清空值关联的formitem
              if (formItem.topicTypeId === 5) {
                // 同时需要触发一次子级的隐藏事件
                this.inputChange(formItem)
              }
            }
            if (Number(triggerEventParameter.triggeredMode_id) === 2) {
              formItem.isDisplay = true
            }
            if (Number(triggerEventParameter.triggeredMode_id) === 3) {
              formItem.disable = true
            }
            if (Number(triggerEventParameter.triggeredMode_id) === 4) {
              formItem.disable = false
            }
            if (Number(triggerEventParameter.triggeredMode_id) === 5) {
              formItem.value = triggerEventParameter.voluation
              formItem.score = triggerEventParameter.voluation
            }
          }
        }
      }
    },
    new_eval(str) {
      var Fn = Function
      return new Fn('return ' + str)()
    },

    // 上一页
    prevPage() {
      this.pageNumber = this.miniPageIdList.indexOf(this.lastPageId) + 1
      this.getPageData(this.lastPageId)
      this.$forceUpdate()
      this.goToAnchor('#scrollFP')
    },
    // 下一页
    nextPage() {
      // console.log("点击下一页时的左侧数据", this.leftBox);
      this.$refs.dynamicValidateForm.validate((valid, object) => {
        if (valid) {
          this.loading = true
          this.submitMinPage().then((res) => {
            if (this.nextPageId !== -2) {
              // console.log(res)
              const param = {
                caseJoinProtocolId: this.caseJoinProtocolId,
                caseProgressPeriodId: this.caseProgressPeriodId
              }
              this.pageNumber = this.miniPageIdList.indexOf(this.nextPageId) + 1
              this.getPageData(this.nextPageId)
              // 重新获取左侧菜单数据并替换旧有数据
              getFollowupMINIPageList(param).then((response) => {
                const { Data } = response
                const { pageList } = Data
                // 将获取到的问卷项填入左侧list中并追加结果项
                for (let i = 0; i < this.leftBox.length; i++) {
                  if (this.leftBox[i].followupProjectTypeId === 2) {
                    this.leftBox[i].list = JSON.parse(JSON.stringify(pageList))
                  }
                }
                // console.log("请求后", this.leftBox);
                this.$forceUpdate()
              })
              this.prevBtnable = false
              this.goToAnchor('#scrollFP')
            } else {
              const param = {
                caseProgressItemId: this.caseProgressItemId,
                caseProgressPeriodId: this.caseProgressPeriodId
              }
              updateFinishState(param).then((response) => {
                MessageBox.confirm(
                  '确定提交后将无法更改，是否确定提交？',
                  '确定提交',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                ).then(() => {
                  // 锁定问卷
                  lockCaseJoinProtocol(param).then((res) => {
                    Message({
                      message: '提交成功，请查看评测结果',
                      type: 'success',
                      duration: 5 * 1000
                    })
                    this.toReportPage()
                  })
                  // 更新左侧菜单
                  const leftParam = {
                    caseJoinProtocolId: this.caseJoinProtocolId,
                    caseProgressPeriodId: this.caseProgressPeriodId
                  }
                  getFollowupMINIPageList(leftParam).then((response) => {
                    const { Data } = response
                    const { pageList } = Data
                    // 将获取到的问卷项填入左侧list中并追加结果项
                    for (let i = 0; i < this.leftBox.length; i++) {
                      if (this.leftBox[i].followupProjectTypeId === 2) {
                        this.leftBox[i].list = JSON.parse(
                          JSON.stringify(pageList)
                        )
                      }
                    }
                    this.$forceUpdate()
                  })
                  this.activeName = 'first'
                })
              })
            }
          })
        } else {
          this.scrollToFormItem(object)
        }
      })
    },
    // 当前页提交
    async submitMinPage() {
      // 判断当前问卷是否锁定，锁定后不可提交
      if (this.isLocked === false) {
        const formData = this.pageData.pageItems
        const formSubmitData = {
          caseProgressItemId: this.caseProgressItemId,
          caseProgressPeriodId: this.caseProgressPeriodId,
          followupMINIPageId: this.followupMINIPageId
        }
        const newFormData = formData.map((list) => {
          if (list.notTextValue != null && list.notTextValue.length > 0) {
            list.textValue = list.notTextValue.join(',')
          }
          if (list.dateValue != null && list.dateValue !== '') {
            list.textValue = list.dateValue
          }
          return {
            followupMINITopicId: list.followupMINITopicId,
            value: list.textValue,
            isDisplay: list.isDisplay
          }
        })
        // console.log(newFormData)
        formSubmitData.subJsonString = JSON.stringify(newFormData)
        await postFilledPageSub(formSubmitData)
          .then((res) => {
            const { Data } = res
            this.nextPageId = Data.jumpUrlMINIPageId
            console.log(this.nextPageId)
          })
          .catch(() => {
            Message({
              message: '请稍后重试',
              type: 'error',
              duration: 5 * 1000
            })
          })
      }
    },
    // 修改问卷完成标记
    updateFinishState() {
      this.$refs.dynamicValidateForm.validate((valid, object) => {
        if (valid) {
          this.submitMinPage().then((res) => {
            const param = {
              caseProgressItemId: this.caseProgressItemId,
              caseProgressPeriodId: this.caseProgressPeriodId
            }
            updateFinishState(param).then((response) => {
              MessageBox.confirm(
                '确定提交后将无法更改，是否确定提交？',
                '确定提交',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              ).then(() => {
                // 锁定问卷
                lockCaseJoinProtocol(param).then((res) => {
                  Message({
                    message: '提交成功，请查看评测结果',
                    type: 'success',
                    duration: 5 * 1000
                  })
                  this.toReportPage()
                })
                // 更新左侧菜单
                const leftParam = {
                  caseJoinProtocolId: this.caseJoinProtocolId,
                  caseProgressPeriodId: this.caseProgressPeriodId
                }
                getFollowupMINIPageList(leftParam).then((response) => {
                  const { Data } = response
                  const { pageList } = Data
                  // 将获取到的问卷项填入左侧list中并追加结果项
                  for (let i = 0; i < this.leftBox.length; i++) {
                    if (this.leftBox[i].followupProjectTypeId === 2) {
                      this.leftBox[i].list = JSON.parse(
                        JSON.stringify(pageList)
                      )
                    }
                  }
                  this.$forceUpdate()
                })
                this.activeName = 'first'
              })
            })
          })
        } else {
          this.scrollToFormItem(object)
        }
      })
    },
    // 获取pdf bold url
    async getPdfUrl(param) {
      let url = ''
      await getPdf(param).then((res) => {
        // 生成blob图片,需要参数(字节数组, 文件类型)
        const blob = new Blob([res], { type: 'application/pdf' })
        // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
        url = window.URL.createObjectURL(blob)
      })
      return url
    },
    // 滚动到指定位置
    goToAnchor(selector) {
      this.$el.querySelector(selector).scrollIntoView({
        behavior: 'smooth', // 平滑过渡
        block: 'start' // 上边框与视窗顶部平齐
      })
    },
    // 进度条
    percentageChange(strokeWith, fullWidth) {
      const size = Math.floor((strokeWith / fullWidth) * 100)
      this.percentage = size
    },
    // 自定义校验规则
    validateFloatNumber(rule, value, callback) {
      if (!validFloatNumber(value)) {
        return callback(new Error('请输入正确的数字'))
      } else {
        return callback()
      }
    },
    validateNumber(rule, value, callback) {
      if (!validNumber(value)) {
        return callback(new Error('请输入正确的整数'))
      } else {
        return callback()
      }
    },
    // 页面滚动时，左侧导航跟随滚动
    handleScroll(e) {
      const scrollTop =
        e.target.documentElement.scrollTop || e.target.body.scrollTop
      const documentHeight = document.body.scrollHeight
      const windowHeight = document.documentElement.clientHeight
      const lefNavHeight = this.$refs.surveyLeft.offsetHeight
      if (lefNavHeight < windowHeight) {
        if (documentHeight > 1019 && scrollTop > 174) {
          this.isFixedScroll = true
        } else {
          this.isFixedScroll = false
        }
      }
    },
    // 校验未通过跳到屏幕滚动到该题目
    scrollToFormItem(object) {
      for (const i in object) {
        let dom = this.$refs[i]
        if (Object.prototype.toString.call(dom) !== '[object Object]') {
          // 这里是针对遍历的情况（多个输入框），取值为数组
          dom = dom[0]
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({
          // 滚动到指定节点
          block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
          behavior: 'smooth' // 值有auto、instant,smooth，缓动动画（当前是慢速的）
        })
        break // 只需要检测一项即可,跳出循环
      }
    },
    // 限制有最小值最大值input框的值
    limitMaxMin(formItem) {
      // 值比最大值大取最大值
      if (
        formItem.maxNum != null &&
        Number(formItem.textValue) > formItem.maxNum
      ) {
        formItem.textValue = String(formItem.maxNum)
      }
      // 值比最小值下取最小值
      if (
        formItem.minNum != null &&
        Number(formItem.textValue) < formItem.minNum
      ) {
        formItem.textValue = String(formItem.minNum)
      }
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.el-tabs--left .el-tabs__header.is-left {
  margin-right: 0;
  width: 100%;
}
.el-tabs--left .el-tabs__item.is-left {
  text-align: center;
}
.listBox .el-tabs__content {
  display: none;
}
.mt20 {
  margin-top: 20px;
}
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
.resList_title {
  font-size: 28px;
  color: $bg;
  margin: 20px auto 40px;
}
.el-progress-bar {
  padding-right: 80px;
  margin-right: -85px;
}
.el-progress__text {
  color: $bg;
  font-weight: bold;
}
.dialogContentBox {
  text-align: center;
}
.dialogContent1 {
  h2 {
    text-align: center;
    color: $bg;
    margin-bottom: 24px;
  }
  h4 {
    text-align: center;
    color: $bg;
    margin: 15px 0;
  }
  p {
    text-indent: 2em;
    line-height: 1.5;
  }
}
.dialogContent2 {
  font-weight: bold;
  .el-checkbox {
    margin-right: 5px;
  }
  div {
    display: inline;
  }
  p {
    display: inline;
  }
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.survey {
  overflow: hidden;
  &-left {
    float: left;
    width: 240px;
    margin: 50px 20px 50px 0;
    padding-top: 20px;
    min-height: 450px;
    h1 {
      margin: 0;
      font-weight: normal;
      color: #8a8a8a;
      padding: 20px 0 20px 30px;
      font-size: 18px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: start;
      align-items: center;
      letter-spacing: 2px;
      img {
        margin-right: 10px;
      }
      img.chk {
        display: none;
      }
    }
    h1.checked {
      color: $bg;
    }
    h1.checked {
      img {
        display: none;
      }
      img.chk {
        display: block;
      }
    }
    h1:hover {
      color: $bg;
    }
    h1:hover {
      img {
        display: none;
      }
      img.chk {
        display: block;
      }
    }
    .listBox {
      border-top: none;
      .itemSecond {
        padding: 20px 0 20px 60px;
        font-size: 18px;
      }
      .itemSecond[data-clk] {
        cursor: pointer;
      }
      .itemSecond.checked {
        color: $bg;
      }
      .itemSecond:hover {
        color: $bg;
      }
      .itemSecond.cant {
        color: #aaa;
        background: #eee;
      }
      .itemSecond.cant:hover {
        color: #aaa;
      }
    }
    &-fix {
      position: fixed;
      width: 240px;
      top: 20px;
    }
    &-patient {
      box-shadow: 1px 2px 6px 0px rgb(0 0 0 / 11%);
      margin-bottom: 20px;
      &-detail {
        padding: 20px 12px 0 20px;
      }
    }
    &-meniu {
      box-shadow: 1px 2px 6px 0px rgb(0 0 0 / 11%);
    }
  }
  &-right {
    float: left;
  }
  &-main {
    width: 880px;
    padding: 24px 29px;
    margin: 50px 0;
    background: #ffffff;
    &-consent {
      padding-top: 80px;
      padding-bottom: 60px;
      text-align: center;
      &-dialogOpen {
        color: $bg;
      }
    }
    &-content {
      &-tit {
        text-align: center;
        color: $bg;
      }
      &-subtit {
        text-align: left;
        color: $bg;
        font-weight: normal;
        margin: 20px 0;
      }
      &-tips {
        font-size: 14px;
        color: #666666;
        line-height: 1.5;
      }
      &-progress {
        margin: 24px 0;
        color: $bg;
        display: flex;
        &-left {
          width: 80px;
        }
        &-right {
          width: calc(100% - 80px);
        }
      }
      &-line {
        display: block;
        height: 1px;
        width: 100%;
        background-color: #ebebeb;
      }
      &-body {
        padding: 24px 0;
      }
      &-btn {
        text-align: center;
        margin-top: 24px;
      }
      &-primary {
        text-align: center;
        margin-top: 24px;
      }
      &-bottomtip {
        color: red;
        font-size: 12px;
        text-align: center;
        margin-top: 24px;
      }
    }
    .big-tit {
      color: $bg;
      margin: 24px 0;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.survey-main-content-pdf {
  margin-top: 22px;
  min-height: 1100px;
}
.survey-main-content-pdf {
  margin-top: 22px;
  min-height: 1100px;
}
</style>

