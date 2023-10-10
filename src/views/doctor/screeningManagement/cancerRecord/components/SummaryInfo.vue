<template>
  <div
    class="relative"
  >
    <div id="printMe" class="result-box">
      <div
        class="print-outer"
      >
        <el-button
          type="primary"
          class="no-print"
          size="mini"
          :icon="uploadBtn"
          @click="uploadPages()"
        >上传问卷</el-button>
        <el-button
          v-if="IsPrint"
          v-print="'#printMe'"
          type="primary"
          class="printMe no-print"
          size="mini"
          icon="el-icon-printer"
          @click="printPages"
        >问卷打印</el-button>
      </div>
      <div class="result-main">
        <div class="result-logo">
          <img :src="resultList.hospitalLogoUrl != null && resultList.hospitalLogoUrl != ''?resultList.hospitalLogoUrl:require('@/assets/common/headerLogo1.png')" alt="">
        </div>
        <div
          v-if="resultList.reportName"
          class="peNumber"
        >
          <span v-if="resultList.peNumber">体检编号：{{ resultList.peNumber }}</span>
        </div>
        <div class="results_list">
          <div class="result_Guide">{{ resultList.reportName }}</div>
          <div class="time">
            <div class="Time">测评时间：{{ resultList.joinDate }}</div>
          </div>
          <!-- 个人信息 -->
          <div
            v-if="resultList.patientMsgData.patientMsgIsShow"
            class="resultMsg"
          >
            <!-- 接口未返标题先写死 -->
            <div class="resList_title">基本信息</div>
            <div class="resList_box">
              <div
                v-for="item in patientMsgGroup1"
                :key="item.index"
                class="resList_Msg"
              >
                <span>{{ item.showText }}</span>
                <span>{{ item.result }}</span>
              </div>
            </div>
            <div class="resList_box">
              <div
                v-for="item in patientMsgGroup2"
                :key="item.index"
                class="resList_Msg"
              >
                <span>{{ item.showText }}</span>
                <span>{{ item.result }}</span>
              </div>
            </div>
            <div class="resList_box">
              <div
                v-for="item in patientMsgGroup3"
                :key="item.index"
                class="resList_Msg"
              >
                <span>{{ item.showText }}</span>
                <span>{{ item.result }}</span>
              </div>
            </div>
          </div>
          <!--结果-->
          <div class="resList">
            <!-- <div class="result_guide_title">风险评估</div> -->
            <template v-if="resultList.reportResultData.reportResultIsShow">
              <div class="resListItem">
                <div
                  v-for="Item in resultList.reportResultData.data"
                  :key="Item.index"
                  :class="'resListChildItem ' + Item.mainClassName"
                >
                  <div
                    v-if="Item.mainTitle != '危险度评估'"
                    class="resList_title"
                  >
                    {{ Item.mainTitle }}
                  </div>
                  <div
                    v-for="childOne in Item.childData1"
                    :key="childOne.id"
                  >
                    <div class="resList_Main">
                      <div :class="'childrenTitle ' + childOne.childClassName">
                        {{ childOne.childtitle }}
                      </div>
                      <div
                        v-if="
                          childOne.childRresult != null &&
                            childOne.childRresult.length > 0
                        "
                        :class="'resList_list ' + childOne.childClassName"
                      >
                        <div
                          v-for="(
                            childres, indexchild
                          ) in childOne.childRresult"
                          :key="childres.id"
                          :class="'circleCli ' + childOne.childClassName"
                        >
                          <div
                            v-if="Item.mainClassName != 'danger' && showItemNo"
                            class="number"
                          >
                            {{ indexchild + 1 }}
                          </div>
                          <div class="circleMain">{{ childres }}</div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="
                        childOne.remark != null && childOne.remark.length > 0
                      "
                      class="remark"
                    >
                      <div>
                        <span v-html="childOne.remark">{{
                          childOne.remark
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="(childTwo, idst) in Item.childData2"
                    :key="childTwo.id"
                  >
                    <text :class="'childrenTitle ' + childTwo.childClassName">{{
                      childTwo.childtitle
                    }}</text>
                    <div
                      v-if="
                        childTwo.childRresult != null &&
                          childTwo.childRresult.length > 0
                      "
                      :class="'resList_list ' + childTwo.childClassName"
                    >
                      <div
                        v-for="(childres, indexchild) in childTwo.childRresult"
                        :key="childres.id"
                      >
                        <div :class="'circleCli ' + childTwo.childClassName">
                          <div
                            v-if="Item.mainClassName != 'danger' && showItemNo"
                            class="number"
                          >
                            {{ indexchild + 1 }}
                          </div>
                          <text>{{ childres }}</text>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="
                        childTwo.remark != null && childTwo.remark.length > 0
                      "
                      class="remark"
                    >
                      <div>
                        <span v-html="childTwo.remark">{{
                          childTwo.remark
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="record-tips">
              注：本报告仅供参考，以医生诊断为准
            </div>
          </div>
          <!-- 补充资料 -->
          <div
            v-if="resultList.supplementInformationData.supplementInformationIsShow"
            id="addSurveyInfoPage"
            class="resultMsg"
          >
            <div class="resList_box">
              <div class="resList_title">
                <div>补充资料</div>
                <el-button
                  v-if="isShow"
                  type="primary"
                  size="mini"
                  :disabled="isProhibitEdit"
                  class="no-print"
                  @click="openAddSurveyInfo"
                >编辑</el-button>
              </div>
              <div
                class="resList_Msg_advice"
                style="display: block"
              >
                <div
                  v-if="resultList.supplementInformationData.data"
                  class="mb20 advice_border"
                >
                  {{ resultList.supplementInformationData.data }}
                </div>
              </div>
            </div>
          </div>
          <!-- 医生建议 -->
          <div
            v-if="resultList.adviceMsgData.adviceMsgIsShow"
            id="doctorAdvice"
            class="resultMsg"
          >
            <div class="resList_box">
              <div class="resList_title">
                <div>医生建议</div>
                <el-button
                  v-if="isShow"
                  type="primary"
                  size="mini"
                  :disabled="isProhibitEdit"
                  class="no-print"
                  @click="openAdvice"
                >编辑</el-button>
              </div>
              <div
                v-for="item in resultList.adviceMsgData.data"
                :key="item.index"
                class="resList_Msg_advice"
                style="display: block"
              >
                <div
                  v-if="item.advice"
                  class="mb20 advice_border"
                >
                  {{ item.advice }}
                </div>
                <div class="advice_date">
                  <div
                    v-if="item.doctorName"
                    class="mb20"
                  >
                    评估医生：{{ item.doctorName }}
                  </div>
                  <div
                    v-if="item.hospitalName"
                    class="mb20"
                  >
                    评估机构：{{ item.hospitalName }}
                  </div>
                  <div
                    v-if="item.adviceDate"
                    class="mb20"
                  >
                    日期：{{ item.adviceDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 补充资料弹窗 -->
        <el-dialog
          title="补充资料"
          :visible.sync="addSurveyInfoVisible"
        >
          <div style="overflow: hidden">
            <el-form
              ref="adviceForm"
              :model="addSurveyInfoList"
              class="demo-dynamic"
            >
              <div class="input-content">
                <div
                  v-for="(item,index) in addSurveyInfoList.list"
                  :key="index"
                  class="input-content-items"
                  :style="item.type == 'display' ? 'display:none' : ''"
                >
                  <el-form-item
                    v-if="item.type == 'display'"
                    style="display: none"
                    :label="item.title"
                  >
                    <el-input v-model="item.value" />
                  </el-form-item>
                  <el-form-item v-if="item.type == 'text' || item.type == 'number'">
                    <el-input
                      v-model="item.value"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                      :autosize="{ minRows: 2, maxRows: 5}"
                      type="textarea"
                      :rules="{
                        required: true,
                        message: item.title + '不能为空',
                        trigger: 'blur',
                      }"
                      style="font-size: 18px"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="item.type == 'radio'"
                    :label="item.title"
                    :style="item.isdisplay ? 'display:none' : ''"
                  >
                    <el-radio-group v-model="item.value">
                      <el-radio
                        v-for="itemChild in item.list"
                        :key="itemChild.index"
                        :label="Number(itemChild.id)"
                        :disabled="item.disabled"
                      >{{ itemChild.name }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="addSurveyInfoVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="postAddSurveyInfo()"
            >确 定</el-button>
          </div>
        </el-dialog>
        <!-- 编辑医生建议弹窗 -->
        <el-dialog
          title="编辑医生建议"
          :visible.sync="adviceFormVisible"
        >
          <div style="overflow: hidden">
            <el-form
              ref="adviceForm"
              :model="adviceInfoList"
              class="demo-dynamic"
            >
              <div class="input-content">
                <div
                  v-for="item in adviceInfoList.list"
                  :key="item.index"
                  class="input-content-items"
                  :style="item.type == 'display' ? 'display:none' : ''"
                >
                  <el-form-item
                    v-if="item.type == 'display'"
                    style="display: none"
                    :label="item.title"
                  >
                    <el-input v-model="item.value" />
                  </el-form-item>
                  <el-form-item v-if="item.type == 'text' || item.type == 'number'">
                    <el-input
                      v-model="item.value"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                      :autosize="{ minRows: 2, maxRows: 5}"
                      type="textarea"
                      :rules="{
                        required: true,
                        message: item.title + '不能为空',
                        trigger: 'blur',
                      }"
                      style="font-size: 18px"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="item.type == 'radio'"
                    :label="item.title"
                    :style="item.isdisplay ? 'display:none' : ''"
                  >
                    <el-radio-group v-model="item.value">
                      <el-radio
                        v-for="itemChild in item.list"
                        :key="itemChild.index"
                        :label="Number(itemChild.id)"
                        :disabled="item.disabled"
                      >{{ itemChild.name }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="adviceFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="postAdvice()"
            >确 定</el-button>
          </div>
        </el-dialog>

        <!-- 医生端不显示 -->
        <div
          v-if="showContent"
          class="relults_checkDoor"
        >
          <img
            src="@/assets/checkOrder/checkDoor.png"
            alt=""
            style="width: 100%"
          >
        </div>
        <!-- 联系我们 医生端不显示-->
        <div
          v-if="showContent"
          class="contactUs"
        >
          <div class="resList_title">联系我们</div>
          <div class="remake">
            肿瘤发病原因复杂，此报告仅提供初步评估结果，具体筛查还需到专业早筛机构与医生面诊诊断。为了您的健康，请及时与我们联系。
          </div>
          <el-row
            type="flex"
            justify="start"
            :gutter="15"
          >
            <el-col
              v-for="item in friendlyLink.slice(0, 3)"
              :key="item.id"
              :span="8"
            >
              <div class="contact_link_items">
                <div class="contact_link_left">
                  <img :src="getImgUrl(item.imgId)">
                </div>
                <div class="contact_link_right">
                  <div class="contact_link_right_title">{{ item.title }}</div>
                  <div class="contact_link_right_phone">
                    <span>Tel:{{ item.phoneNumber }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            justify="start"
            :gutter="15"
          >
            <el-col
              v-for="item in friendlyLink.slice(3, 6)"
              :key="item.id"
              :span="8"
            >
              <div class="contact_link_items">
                <div class="contact_link_left">
                  <img :src="getImgUrl(item.imgId)">
                </div>
                <div class="contact_link_right">
                  <div class="contact_link_right_title">{{ item.title }}</div>
                  <div class="contact_link_right_phone">
                    <span>Tel:{{ item.phoneNumber }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getSupplementInformation,
  postSupplementInformation,
  getDocAdvice,
  postDocAdvice
} from '@/api/doctor'
import { SendDoctorCensure } from '@/api/upload'
import { Dialog, MessageBox, Message } from 'element-ui'
export default {
  props: {
    resultList: {
      type: Object
    },
    showContent: {
      type: Boolean,
      default: true // 默认显示
    },
    IsPrint: {
      type: Boolean,
      default: true // 默认显示
    },
    isShow: {
      type: Boolean,
      default: true // 默认显示
    },
    showItemNo: {
      type: Boolean, // 是否显示病情序号
      default: true // 默认显示
    }
  },
  data() {
    return {
      is_show: false,
      pageShow: true,
      editShow: true,
      isProhibitEdit: this.resultList.isProhibitEdit, // 医生建议和补充信息是否锁定，锁定不可编辑修改
      uploadBtn: 'el-icon-upload2',
      patientMsgGroup1: [],
      patientMsgGroup2: [],
      patientMsgGroup3: [],
      friendlyLink: [
        {
          title: '北京京西肿瘤医院',
          imgId: 1,
          phoneNumber: '400-656-1616'
        },
        {
          title: '黄山首康医院',
          imgId: 2,
          phoneNumber: '182-5591-5505'
        },
        {
          title: '合肥长荣医院',
          imgId: 3,
          phoneNumber: '0551-69116911'
        },
        {
          title: '太原和平医院',
          imgId: 4,
          phoneNumber: '0351-2735511'
        },
        {
          title: '天津石氏医院',
          imgId: 5,
          phoneNumber: '022-81370822'
        }
      ],
      adviceInfoList: {
        // 建议弹窗内容渲染
        list: null
      },
      adviceFormVisible: false, // 医生建议弹窗
      addSurveyInfoList: {
        // 建议弹窗内容渲染
        list: null
      },
      addSurveyInfoVisible: false // 补充资料弹窗
    }
  },
  computed: {},
  created() {
    // this.$emit("goToAnchor");
    // console.log(this.resultList)
    // 基本信息分块展示
    const patientMsg = this.resultList.patientMsgData.data
    this.patientMsgGroup1 = patientMsg.slice(0, 6)
    this.patientMsgGroup2 = patientMsg.slice(6, 8)
    this.patientMsgGroup3 = patientMsg.slice(8, 15)
  },
  methods: {
    printPages() {
      this.is_show = true
      this.pageShow = false
    },
    uploadPages() {
      MessageBox({
        title: '提示',
        message: '确定上传问卷',
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消'
      }).then(() => {
        this.uploadBtn = 'el-icon-loading'
        const param = { caseJoinProtocolId: this.resultList.caseJoinProtocolId }
        SendDoctorCensure(param)
          .then((response) => {
            if (response.Code === 1) {
              Message({
                message: response.Msg,
                type: 'success',
                duration: 5 * 1000
              })
              this.uploadBtn = 'el-icon-upload2'
            } else {
              Message({
                message: response.Msg,
                type: 'warning',
                duration: 5 * 1000
              })
              this.uploadBtn = 'el-icon-upload2'
            }
          })
          .catch((err) => {
            console.log(err)
            Message({
              message: err.Msg,
              type: 'warning',
              duration: 5 * 1000
            })
            this.uploadBtn = 'el-icon-upload2'
          })
      })
    },
    getImgUrl(icon) {
      return require('@/assets/checkOrder/checkOrder-icon' + icon + '.png')
    },
    // 打开补充资料弹窗
    openAddSurveyInfo() {
      this.addSurveyInfoVisible = true
      const param = { caseJoinProtocolId: this.resultList.caseJoinProtocolId }
      getSupplementInformation(param).then((res) => {
        const { Data } = res
        this.addSurveyInfoList.list = Data
      })
    },
    // 补充资料提交
    postAddSurveyInfo() {
      const param = {}
      const data = this.addSurveyInfoList.list
      for (let index = 0; index < data.length; index++) {
        const item = data[index]
        param[item.name] = item.value
      }
      postSupplementInformation(param).then((res) => {
        const { Data } = res
        if (res.Code === 1) {
          Message({
            message: res.Msg,
            type: 'success',
            duration: 5 * 1000
          })
          this.addSurveyInfoVisible = false
          this.$emit('toReportPage')
        } else if (res.Code === 12) {
          for (let index = 0; index < Data.length; index++) {
            const item = Data[index]
            Message({
              message: item.errorMsg,
              type: 'warning',
              duration: 5 * 1000
            })
          }
          this.addSurveyInfoVisible = false
        }
      })
    },
    // 打开医生建议弹窗
    openAdvice() {
      this.adviceFormVisible = true
      const param = { caseJoinProtocolId: this.resultList.caseJoinProtocolId }
      getDocAdvice(param).then((response) => {
        this.adviceInfoList.list = response.Data
        console.log(response)
      })
    },
    postAdvice() {
      const param = {}
      const data = this.adviceInfoList.list
      for (let index = 0; index < data.length; index++) {
        const item = data[index]
        if (item.name === 'CaseJoinProtocolId') {
          param.CaseJoinProtocolId = data[index].value
        }
        if (item.name === 'Advice') {
          param.Advice = data[index].value
        }
      }
      postDocAdvice(param).then((res) => {
        const { Data } = res
        if (res.Code === 1) {
          Message({
            message: res.Msg,
            type: 'success',
            duration: 5 * 1000
          })
          this.adviceFormVisible = false
          this.$emit('toReportPage')
        } else if (res.Code === 12) {
          for (let index = 0; index < Data.length; index++) {
            const item = Data[index]
            Message({
              message: item.errorMsg,
              type: 'warning',
              duration: 5 * 1000
            })
          }
        }
      })
    }
  }
}
</script>
