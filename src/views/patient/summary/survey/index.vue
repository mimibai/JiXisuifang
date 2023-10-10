<template>
  <div class="survey">
    <div class="survey-banner">
      <Banner
        :banner-list="bannerList"
        :height="height"
        :arrow="arrow"
        :indicator-position="indicatorPosition"
      />
    </div>
    <div
      id="scrollFP"
      v-loading="loading"
      class="container"
    >
      <div class="survey-main">
        <div
          v-if="consentVisible"
          class="survey-main-consent"
        >
          请阅读知情同意书后进行填写！<span
            class="survey-main-consent-dialogOpen"
            @click="dialogVisible = true"
          >知情同意书</span>
        </div>
        <div
          v-else
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
                  <div v-if="item.topicTypeId == 3" class="">
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
                        },
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
                  <div v-if="item.topicTypeId == 5 && item.maxNum ===null&&item.minNum === null">
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
                :loading="prevPageLoading"
                icon="el-icon-arrow-left"
                style="border-radius: 20px 0 0 20px"
                @click="prevPage()"
              >上一页</el-button>
              <el-button
                v-if="!isLastPage"
                type="primary"
                :disabled="nextBtnable"
                :loading="nextPageLoading"
                style="border-radius: 0 20px 20px 0"
                @click="nextPage()"
              >下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
              <el-button
                v-else
                type="primary"
                style="border-radius: 0 20px 20px 0; width: 103px"
                @click="updateFinishState"
              >提交<i class="el-icon-arrow-right el-icon--right" /></el-button>
            </el-button-group>
          </div>
          <div class="survey-main-content-bottomtip">
            *完成所有题目后方可提交
          </div>
        </div>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="40%"
      >
        <div
          class="dialogContent1"
          v-html="dialogContent.content1"
        >
          {{ dialogContent.content1 }}
        </div>
        <div class="dialogContent2">
          <el-checkbox v-model="dialogChecked" />
          <div v-html="dialogContent.content2">
            {{ dialogContent.content2 }}
          </div>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="handleClose(false)">取 消</el-button>
          <el-button
            type="primary"
            :disabled="!dialogChecked"
            @click="handleClose(true)"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Banner from '@/components/Banner/index'
import variables from '@/styles/variables.scss'
import { validNumber, validFloatNumber } from '@/utils/validate'
import { Dialog, MessageBox, Message } from 'element-ui'
import {
  getCaseProgressPeriodList,
  getConsent,
  updateConsentState,
  getFollowupMINIPageList,
  updateFinishState,
  lockCaseJoinProtocol,
  getNewMINIPage,
  getFollowupMINITriggerEventsByTopicCode,
  postGenerateFillTopic,
  postFilledPageSub
} from '@/api/summaryPatient'
import { log } from 'video.js'
export default {
  components: {
    Banner
  },
  data() {
    return {
      loading: true, // 全局loading
      height: '100%',
      arrow: 'never',
      indicatorPosition: 'none',
      bannerList: [
        {
          id: 1,
          imgUrl: require('@/assets/summary/bannerSurvey.jpg'),
          link: 'javascript:void(0)',
          title: '',
          alt: ''
        }
      ],
      labelWidth: '',
      labelPosition: 'top',
      dialogVisible: false,
      dialogChecked: false,
      consentVisible: true,
      caseJoinProtocolId: 0,
      caseProgressPeriodId: 0,
      caseProgressItemId: 0,
      followupMINIPageId: null,
      pageName: '',
      pageNumber: 1,
      lastPageId: 0,
      nextPageId: 0,
      isLocked: false, // 当前问卷是否锁定，锁定后不可点击
      miniPageIdList: [],
      multiSelectIds: [],
      triggerEventList: [], // 事件集合
      percentage: 0,
      prevBtnable: true,
      nextBtnable: false,
      prevPageLoading: false,
      nextPageLoading: false,
      dialogContent: {
        content1: '',
        content2: ''
      },
      pageData: {
        pageItems: []
      },
      isLastPage: false,
      testNum: 0
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
  methods: {
    format(percentage) {
      return percentage === 100
        ? `第${this.miniPageIdList.length}/${this.miniPageIdList.length}(页)`
        : `第${this.pageNumber}/${this.miniPageIdList.length}(页)`
    },
    getData() {
      const caseJoinProtocolId = this.$route.query.caseJoinProtocolId
      if (caseJoinProtocolId) {
        this.caseJoinProtocolId = caseJoinProtocolId
        this.getCaseProgressPeriodList({
          caseJoinProtocolId: this.caseJoinProtocolId
        })
      } else {
        this.$router.push({
          path: '/patient/home'
        })
      }
    },
    // 获取就诊人当前进行阶段
    getCaseProgressPeriodList(param) {
      getCaseProgressPeriodList(param).then((response) => {
        const { Data } = response
        // 循环阶段，看是否有知情同意书
        for (let index = 0; index < Data.length; index++) {
          const item = Data[index]
          if (item.followupProjectTypeId == 1) {
            this.caseJoinProtocolId = item.caseJoinProtocolId
            this.caseProgressPeriodId = item.caseProgressPeriodId
            this.getConsent({
              caseProgressPeriodId: this.caseProgressPeriodId,
              caseJoinProtocolId: this.caseJoinProtocolId
            })
            break
          } else if (item.followupProjectTypeId == 2) {
            this.caseJoinProtocolId = item.caseJoinProtocolId
            this.caseProgressPeriodId = item.caseProgressPeriodId
            this.getFollowupMINIPageList(item)
            this.consentVisible = false
          }
        }
      })
    },
    // 弹窗读取知情同意书
    getConsent(param) {
      // 获取知情同意书内容
      getConsent(param).then((response) => {
        const { Data } = response
        this.dialogContent.content1 = Data.content1
        this.dialogContent.content2 = Data.content2
      })
      this.loading = false
      this.dialogVisible = true
    },
    // 弹窗关闭若同意知情书加载问卷，若不同意展示提示信息。
    handleClose(param) {
      if (this.dialogChecked && param) {
        updateConsentState({
          caseJoinProtocolId: this.caseJoinProtocolId,
          caseProgressPeriodId: this.caseProgressPeriodId
        }).then((response) => {
          const { Data } = response
          const { transferMsg } = Data
          // 获取就诊人参与方案
          this.getFollowupMINIPageList(transferMsg)
          this.dialogVisible = false
          this.consentVisible = false
        })
      } else {
        this.dialogVisible = false
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
        this.miniPageIdList = pageList.map((list) => {
          return list.miniPageId
        })
        this.caseProgressItemId = Data.caseProgressItemId
        this.caseProgressPeriodId = Data.caseProgressPeriodId
        this.caseJoinProtocolId = param.caseJoinProtocolId
        // 加载第一页
        this.getPageData(this.miniPageIdList[0])
        // 头部进度条
        this.percentageChange(this.pageNumber, this.miniPageIdList.length)
      })
    },
    // 获取问卷
    getPageData(miniPageId) {
      // 设置当前页的followupMINIPageId
      this.followupMINIPageId = miniPageId
      let param = {
        caseProgressItemId: this.caseProgressItemId,
        caseProgressPeriodId: this.caseProgressPeriodId
      }
      param = Object.assign(param, { followupMINIPageId: miniPageId })
      getNewMINIPage(param).then((response) => {
        const { Data } = response
        const { data, pageName } = Data
        console.log('Data', Data)
        this.lastPageId = Data.lastPageId
        this.nextPageId = Data.nextPageId
        this.isLocked = Data.isLocked
        // 如果是第一页，不能点击上一页按钮
        if (this.lastPageId == 0) {
          this.prevBtnable = true
        }
        // 如果是最后一页，不能点击下一页按钮
        if (this.nextPageId == -2) {
          this.nextBtnable = true
          this.isLastPage = true
        } else {
          this.isLastPage = false
        }
        this.pageData.pageItems = data
        this.pageName = pageName
        this.percentageChange(this.pageNumber, this.miniPageIdList.length)
        this.loading = false
        this.prevPageLoading = false
        this.nextPageLoading = false
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
    // form表单事件
    inputChange(formItemData) {
      // this.testNum = this.testNum++
      const { followupMINITopicId, textValue, isExistEvent } = formItemData
      const triggerEventData = {
        followupMINITopicId: followupMINITopicId,
        value: textValue,
        score: textValue,
        isExistEvent: isExistEvent
      }
      // console.log('触发了2', triggerEventData)
      this.checkTriggerEvent(triggerEventData)
      // console.log('触发了3', triggerEventData)
    },
    radionChange(formItemData) {
      const { answerOptionList, followupMINITopicId, notTextValue } =
        formItemData
      const triggerEventData = { followupMINITopicId }
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
      const { id, notTextValue, answerOptionList, followupMINITopicId } = item
      const triggerEventData = {
        followupMINITopicId
      }
      let value = notTextValue
      // 根据下标判断当前选定项
      const currentInputData = answerOptionList[itemIndex]
      // 如果当前选中项为其它置空项
      if (itemIndex >= 0) {
        console.log('itemIndex', itemIndex)
        if (currentInputData.isOnly === true) {
          // 判断是初次点中还是最后一次点中
          const currentInputDataValue = Number(currentInputData.value)
          if (value.includes(currentInputDataValue)) {
            // 重置当前复选框
            item.notTextValue = []
            item.notTextValue.push(currentInputDataValue)
            value = [currentInputDataValue]
          }
        } else if (currentInputData.isOnly == false) {
          // 如果当前选中项为正常项，需要清除置空项按钮
          // 获取置空项按钮的value
          const newArr = answerOptionList.filter((res) => {
            // if (res.isOnly == true) {
            //   return res
            // }
            return res.isOnly === true
          })
          console.log('res', newArr)
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
      console.log('itemIndex', itemIndex)
      for (let i = 0; i < value.length; i++) {
        const formItemVlaue = String(value[i])
        for (let j = 0; j < answerOptionList.length; j++) {
          const element = answerOptionList[j]
          if (formItemVlaue === element.value) {
            triggerEventData.value =
              (triggerEventData.value != undefined &&
              triggerEventData.value != null &&
              triggerEventData.value != ''
                ? triggerEventData.value + ','
                : '') + formItemVlaue
            triggerEventData.score =
              (triggerEventData.score != undefined &&
              triggerEventData.score != null &&
              triggerEventData.score != ''
                ? triggerEventData.score + ','
                : '') + element.score
          }
        }
      }
      if (
        triggerEventData.score != undefined &&
        triggerEventData.score != null &&
        triggerEventData.score != ''
      ) {
        triggerEventData.score = ',' + triggerEventData.score + ','
      }
      this.checkTriggerEvent(triggerEventData)
      // 匹配对应值，控制元素显示隐藏
    },
    // 校验事件数据集合来控制其它formItem显示与隐藏
    checkTriggerEvent(triggerEventData) {
      console.log(triggerEventData, arguments)
      const triggerEventList = this.triggerEventList
      for (let index = 0; index < triggerEventList.length; index++) {
        const element = triggerEventList[index]
        // 循环找到与foritem当前选择的value的值一样的情况
        if (
          element.formula != null &&
          element.formula.indexOf(
            '#' + triggerEventData.followupMINITopicId + '#'
          ) != -1
        ) {
          // 替换与本题followupMINITopicId一样的项,并把它改为对应的score
          let currentFormula = element.formula.replace(
            new RegExp('#' + triggerEventData.followupMINITopicId + '#', 'g'),
            "'" + triggerEventData.score + "'"
          )
          console.log(currentFormula)
          // 如果还有#号需去除
          if (currentFormula.indexOf('#') != -1) {
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
        if (i % 2 == 1) {
          arryIds.push(arryStr[i].trim())
        }
      }
      if (arryIds.length > 0) {
        // 检查当前页面表单数据的值是否包含事件的id，并跟你局
        const forItemData = this.pageData.pageItems
        for (let index = 0; index < forItemData.length; index++) {
          const element = forItemData[index]
          const followupMINITopicIdStr = String(element.followupMINITopicId)
          if (arryIds.indexOf(followupMINITopicIdStr) != -1) {
            // 如果有该题需要找到它的score
            // 根据题目类型判断获取score
            let topicScore = ''
            // 单选复选score为对应项
            for (let i = 0; i < arryIds.length; i++) {
              const arryId = arryIds[i]
              if (arryId === followupMINITopicIdStr) {
                if (element.topicTypeId === 1 || element.topicTypeId == 2) {
                  const childrens = element.answerOptionList
                  for (let index = 0; index < childrens.length; index++) {
                    const child = childrens[index]
                    console.log(element, child.value)
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
      // console.log(formDatas)
      for (let index = 0; index < triggerEventParameters.length; index++) {
        const triggerEventParameter = triggerEventParameters[index]
        // 循环表单集合
        for (let i = 0; i < formDatas.length; i++) {
          const formItem = formDatas[i]
          // 匹配到对应form数据
          if (
            formItem.followupMINITopicId == triggerEventParameter.miniTopic_id
          ) {
            console.log(triggerEventParameter)
            //  1、隐藏，2、显示，3、不可修改，4、可以修改，5、赋值
            if (Number(triggerEventParameter.triggeredMode_id) === 1) {
              formItem.isDisplay = false
              formItem.textValue = ''
              formItem.value = ''
              formItem.score = ''
              // 如果formItem为单选或复选类型，需清空notTextVlaue
              if (formItem.topicTypeId === 1 || formItem.topicTypeId === 2) {
                formItem.notTextValue = []
                // 同时需要触发一次子级的隐藏事件
                this.radionChange(formItem)
              }
              if (formItem.topicTypeId === 5) {
                this.inputChange(formItem)
              }
            }
            if (Number(triggerEventParameter.triggeredMode_id) === 2) {
              formItem.isDisplay = true
              // 类型为整数的需要触发一次input事件
              // console.log('触发了', formItem)
              this.inputChange(formItem)
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
      var fn = Function
      return new fn('return ' + str)()
    },
    // 上一页
    prevPage() {
      this.prevPageLoading = true
      this.pageNumber = this.miniPageIdList.indexOf(this.lastPageId) + 1
      this.getPageData(this.lastPageId)
      this.nextBtnable = false
      this.goToAnchor('#scrollFP')
    },
    // 下一页
    nextPage() {
      this.$refs.dynamicValidateForm.validate((valid, object) => {
        if (valid) {
          // 循环获取当前页数据
          this.nextPageLoading = true
          this.submitMinPage().then((res) => {
            if (this.nextPageId != -2) {
              this.pageNumber = this.miniPageIdList.indexOf(this.nextPageId) + 1
              this.getPageData(this.nextPageId)
              this.prevBtnable = false
              this.goToAnchor('#scrollFP')
              this.nextPageLoading = false
            } else {
              // 返回-2时 直接走提交
              // this.isLastPage = true
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
                )
                  .then(() => {
                    // 锁定问卷
                    lockCaseJoinProtocol(param).then((res) => {
                      Message({
                        message: '提交成功，前往查看评测结果',
                        type: 'success',
                        duration: 5 * 1000
                      })
                    })
                    this.$router.push({
                      path: '/patient/summary/result',
                      query: {
                        caseJoinProtocolId: this.caseJoinProtocolId
                      }
                    })
                  })
                  .catch(() => {
                    this.nextPageLoading = false
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
      formSubmitData.subJsonString = JSON.stringify(newFormData)
      await postFilledPageSub(formSubmitData)
        .then((res) => {
          const { Data } = res
          this.nextPageId = Data.jumpUrlMINIPageId
        })
        .catch(() => {
          Message({
            message: '请稍后重试',
            type: 'error',
            duration: 5 * 1000
          })
        })
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
                    message: '提交成功，前往查看评测结果',
                    type: 'success',
                    duration: 5 * 1000
                  })
                })
                this.$router.push({
                  path: '/patient/summary/result',
                  query: {
                    caseJoinProtocolId: this.caseJoinProtocolId
                  }
                })
              })
            })
          })
        } else {
          this.scrollToFormItem(object)
        }
      })
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
      console.log(rule)
      if (!validNumber(value)) {
        return callback(new Error('请输入正确的整数'))
      } else {
        return callback()
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
    limitMaxMin(formItem) {
      // 值比最大值大取最大值
      if (
        formItem.maxNum != null &&
        Number(formItem.textValue) > formItem.maxNum
      ) {
        formItem.textValue = String(formItem.maxNum)
      }
      // 值比最小值下取最大小
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
.survey-banner {
  height: 400px;
  .el-carousel {
    height: 100%;
  }
  .el-carousel__arrow {
    height: 50px;
    width: 50px;
    font-size: 34px;
  }
  .el-carousel__button {
    width: 50px;
    height: 4px;
  }
  img {
    max-width: 100%;
  }
}
.el-progress-bar {
  padding-right: 96px;
  margin-right: -96px;
}
.el-progress__text {
  color: $bg;
  font-weight: bold;
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
  &-main {
    padding: 24px 60px;
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
