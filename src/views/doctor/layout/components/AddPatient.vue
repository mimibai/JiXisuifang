<template>
  <!--根据身份证搜索就诊人并添加弹窗组件-->
  <div>
    <el-row type="flex">
      <el-col :span="16">
        <el-form
          ref="creatPatientForm"
          :model="creatPatientForm"
        >
          <div
            v-for="(item, index) in creatPatientForm.dialogFormItems"
            :key="index"
            :style="item.type == 'display' || item.type == null || item.isdisplay == true ? 'display:none' : ''"
          >
            <template v-if="!item.isdisplay">
              <div>
                <!-- 证件类型picker -->
                <el-form-item
                  v-if="item.type == 'picker'"
                  :label-width="formLabelWidth"
                  :label="item.title"
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="{
                    required: item.isMust,
                    message: item.title + '不能为空',
                    trigger: 'change'
                  }"
                >
                  <el-select
                    v-model="item.value"
                    :placeholder="item.placeholder"
                    :disabled="item.disabled"
                    :label="item.title"
                    @change="pickerCtrlShowOrHide(creatPatientForm.dialogFormItems,item)"
                  >
                    <el-option
                      v-for="(itemChild,itemIndex) in item.list"
                      :key="itemIndex"
                      :label="itemChild.name"
                      :value="Number(itemChild.id)"
                    />
                  </el-select>
                </el-form-item>
                <!-- 身份证号 -->
                <el-form-item
                  v-if="item.type == 'idcard'"
                  :label-width="formLabelWidth"
                  :label="item.title"
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="[
                    { required: item.isMust, message: item.title + '不能为空' },
                    { trigger: 'blur', validator: validIdCardNumberData },
                  ]"
                >
                  <el-input
                    v-model="item.value"
                    autocomplete="off"
                    :name="item.name"
                    :placeholder="item.placeholder"
                    style="max-width: 200px"
                    :disabled="item.disabled"
                    @blur="checkInputValue(creatPatientForm.dialogFormItems,item)"
                  />
                </el-form-item>
                <!-- 护照 -->
                <el-form-item
                  v-if="item.name == 'PassportNum' || item.name == 'GuardianPassportNum'"
                  :label-width="formLabelWidth"
                  :label="item.title "
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="[
                    { required: item.isMust, message: item.title + '不能为空' },
                    { trigger: 'blur' , validator: validPassPortCardData },
                  ]"
                >
                  <el-input
                    v-model="item.value"
                    :name="item.name"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    style="max-width: 200px"
                    @blur="checkInputValue(creatPatientForm.dialogFormItems,item)"
                  />
                </el-form-item>
                <!-- 军官证 -->
                <el-form-item
                  v-if="item.name == 'MilitaryOfficerNum'|| item.name == 'GuardianMilitaryOfficerNum'"
                  :label-width="formLabelWidth"
                  :label="item.title "
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="[
                    { required: item.isMust, message: item.title + '不能为空' },
                    { trigger: 'blur' , validator: validOfficerCardData},
                  ]"
                >
                  <el-input
                    v-model="item.value"
                    :name="item.name"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    style="max-width: 200px"
                    @blur="checkInputValue(creatPatientForm.dialogFormItems,item)"
                  />
                </el-form-item>
                <!-- 港澳居民来往内地通行证 -->
                <el-form-item
                  v-if="item.name == 'HKAndMacaoPermitNum' || item.name == 'GuardianHKAndMacaoPermitNum'"
                  :label-width="formLabelWidth"
                  :label="item.title "
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="[
                    { required: item.isMust, message: item.title + '不能为空' },
                    { trigger: 'blur' , validator: validIsHKAndMacaoPermitCardData},
                  ]"
                >
                  <el-input
                    v-model="item.value"
                    :name="item.name"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    style="max-width: 200px"
                    @blur="checkInputValue(creatPatientForm.dialogFormItems,item)"
                  />
                </el-form-item>
                <!-- 内地居民往来港澳通行证 -->
                <el-form-item
                  v-if="item.name == 'NDToHKAndMacaoPermitNum' || item.name == 'GuardianNDToHKAndMacaoPermitNum'"
                  :label-width="formLabelWidth"
                  :label="item.title "
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="[
                    { required: item.isMust, message: item.title + '不能为空' },
                    { trigger: 'blur' , validator: validNDToHKAndMacaoPermitNumData},
                  ]"
                >
                  <el-input
                    v-model="item.value"
                    :name="item.name"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    style="max-width: 200px"
                    @blur="checkInputValue(creatPatientForm.dialogFormItems,item)"
                  />
                </el-form-item>
                <!-- 外国人永久居留身份证 -->
                <el-form-item
                  v-if="item.name == 'FPerManentResidentNum' || item.name == 'GuardianFPerManentResidentNum'"
                  :label-width="formLabelWidth"
                  :label="item.title "
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="[
                    { required: item.isMust, message: item.title + '不能为空' },
                    { trigger: 'blur' , validator: validIsRegexpIsFPerManentCardData},
                  ]"
                >
                  <el-input
                    v-model="item.value"
                    :name="item.name"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    style="max-width: 200px"
                    @blur="checkInputValue(creatPatientForm.dialogFormItems,item)"
                  />
                </el-form-item>
                <!-- 台湾居民来往大陆通行证 -->
                <el-form-item
                  v-if="item.name == 'MTPsNum'||item.name == 'GuardianMTPsNum'"
                  :label-width="formLabelWidth"
                  :label="item.title "
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="[
                    { required: item.isMust, message: item.title + '不能为空' },
                    { trigger: 'blur' , validator: validIsMTPsCardData},
                  ]"
                >
                  <el-input
                    v-model="item.value"
                    :name="item.name"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    style="max-width: 200px"
                    @blur="checkInputValue(creatPatientForm.dialogFormItems,item)"
                  />
                </el-form-item>
                <!-- 港澳台居民居住证 -->
                <el-form-item
                  v-if="item.name == 'HKAndMacaoAndMTPsResidenceNum' ||item.name == 'GuardianHKAndMacaoAndMTPsResidenceNum'"
                  :label-width="formLabelWidth"
                  :label="item.title "
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="[
                    { required: item.isMust, message: item.title + '不能为空' },
                    { trigger: 'blur' , validator: validHKAndMacaoAndMTPIDCardData},
                  ]"
                >
                  <el-input
                    v-model="item.value"
                    :name="item.name"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    style="max-width: 200px"
                    @blur="checkInputValue(creatPatientForm.dialogFormItems,item)"
                  />
                </el-form-item>
                <el-form-item
                  v-if="item.name == 'GuardianName'"
                  :label-width="formLabelWidth"
                  :label="item.title"
                  :prop="'dialogFormItems.' + index + '.value'"
                  :rules="[
                    { required: item.isMust, message: item.title + '不能为空' },
                    { trigger: 'blur', validator: validFullNameData },
                  ]"
                >
                  <el-input
                    v-model="item.value"
                    autocomplete="off"
                    :name="item.name"
                    :placeholder="item.placeholder"
                    style="max-width: 200px"
                    :disabled="item.disabled"
                  />
                </el-form-item>
                <template v-if="showAddPatientDetail">
                  <!-- 姓名 -->
                  <el-form-item
                    v-if="item.name == 'PatientName'"
                    :label-width="formLabelWidth"
                    :label="item.title"
                    :prop="'dialogFormItems.' + index + '.value'"
                    :rules="[
                      { required: item.isMust, message: item.title + '不能为空' },
                      { trigger: 'blur', validator: validFullNameData },
                    ]"
                  >
                    <el-input
                      v-model="item.value"
                      autocomplete="off"
                      :name="item.name"
                      :placeholder="item.placeholder"
                      style="max-width: 200px"
                      :disabled="item.disabled"
                    />
                  </el-form-item>
                  <!-- 联系电话 -->
                  <el-form-item
                    v-if="item.type == 'phone'"
                    :label-width="formLabelWidth"
                    :label="item.title"
                    :prop="'dialogFormItems.' + index + '.value'"
                    :rules="[
                      { required: item.isMust, message: item.title + '不能为空' },
                      { trigger: 'blur', validator: validMobileNumberData },
                    ]"
                  >
                    <el-input
                      v-model="item.value"
                      autocomplete="off"
                      :name="item.name"
                      :placeholder="item.placeholder"
                      style="max-width: 200px"
                      :disabled="item.disabled"
                    />
                  </el-form-item>
                  <!-- 单选 -->
                  <el-form-item
                    v-if="item.type == 'radio'"
                    :label-width="formLabelWidth"
                    :label="item.title"
                    :prop="'dialogFormItems.' + index + '.value'"
                    :rules="{ required: item.isMust, message: item.title + '不能为空', trigger: 'change' }"
                  >
                    <el-radio-group
                      v-model="item.value"
                      @change="pickerCtrlShowOrHide(creatPatientForm.dialogFormItems,item)"
                    >
                      <el-radio
                        v-for="itemChild in item.list"
                        :key="itemChild.name"
                        :label="Number(itemChild.id)"
                        :disabled="item.disabled"
                      >{{ itemChild.name }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <!-- 日期 -->
                  <el-form-item
                    v-if="item.type == 'pickerDate'"
                    :label-width="formLabelWidth"
                    :label="item.title"
                    :prop="'dialogFormItems.' + index + '.value'"
                    :rules="{
                      required: item.isMust,
                      message: item.title + '不能为空',
                      trigger: 'blur',
                    }"
                  >
                    <el-date-picker
                      v-model="item.value"
                      type="date"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                      style="max-width: 200px"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :size="createFormInputSize"
                      @change="checkInputValue(creatPatientForm.dialogFormItems,item)"
                    />
                  </el-form-item>
                </template>
              </div>
            </template>

          </div>
        </el-form>
      </el-col>
      <el-col
        v-if="isShowNextBtn"
        :span="8"
        class="addPatientForm-right"
      >
        <el-button
          type="primary"
          :loading="searchPatientNexLoading"
          @click="searchPatientByIdCard"
        >下一步</el-button>
      </el-col>
    </el-row>
    <div
      v-if="showAddPatientDetail"
      class="dialog-footer"
    >
      <span>
        <el-button @click="closeAddPatientDailog">取 消</el-button>
        <el-button
          type="primary"
          :loading="addPatientDailogPostBtnLoading"
          @click="addPatientDailogPost"
        >确 定</el-button>
      </span>
    </div>
  </div>
</template>
<script>
import {
  CreatePatientGet,
  CreatePatientPost,
  GetPatientByDocumentType
} from '@/api/doctor'
import {
  validFullName,
  validIdCardNumber,
  validMobileNumber,
  validPassPortCard, // 护照验证
  validOfficerCard, // 军官证验证
  validHKAndMacaoAndMTPIDCard, // 验证港澳台居民居住证
  validIsRegexpIsFPerManentCard, // 验证外国人永久居留身份证
  validIsMTPsCard, // 验证台湾居民来往大陆通行证
  validIsHKAndMacaoPermitCard, // 验证港澳居民来往内地通行证
  validNDToHKAndMacaoPermitNum
} from '@/utils/validate'
import { Message } from 'element-ui'
export default {
  name: 'AddPatients',
  props: {},
  data() {
    return {
      addPatientForm: {
        patientId: '',
        idCardNo: '',
        patientName: '',
        mobileNumber: ''
      },
      canAddPatientInput: true, // 手机号姓名是否可填写
      searchPatientNexLoading: false,
      showAddPatientDetail: false,
      isShowNextBtn: true,
      addPatientByIdCardData: {},
      addPatientDailogPostBtnLoading: false, // 提交按钮loading
      creatPatientForm: {
        dialogFormItems: []
      },
      formLabelWidth: '150px',
      submitData: {}, // 用于提交表单信息到后台
      createFormInputSize: 'small '
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      CreatePatientGet()
        .then((res) => {
          const { Data } = res
          for (let index = 0; index < Data.length; index++) {
            const element = Data[index]
            if (element.type === 'picker' && element.value === 0) {
              element.value = null
            }
          }
          this.creatPatientForm.dialogFormItems = Data
        })
        .catch(() => {})
    },
    // 显示隐藏联动
    pickerCtrlShowOrHide(list, currentListChild) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (element.name !== null && element.name !== '') {
          if (element.pshow === null && element.pshowval === null) {
            element.pshow === ''
            element.pshowval === ''
          }
          // 由于下拉框默认是0，会显示第一个选项。所以判断下拉框值如果是0将其value改为空
          if (element.value === 0 && element.name === currentListChild.name) {
            element.value = null
          }
          if (element.pshow === currentListChild.name) {
            const pshowArr = element.pshow.split('|')
            const pshowval = element.pshowval.split('|')
            for (let i = 0; i < pshowArr.length; i++) {
              const pshowItem = pshowArr[i]
              const pshowvalItem = pshowval[i]
              const pshowvalItemArr = pshowvalItem.split(',')
              for (let j = 0; j < pshowvalItemArr.length; j++) {
                const pshowvalItemChild = pshowvalItemArr[j]
                if (currentListChild.name === pshowItem) {
                  if (Number(currentListChild.value) === Number(pshowvalItemChild)) {
                    element.isdisplay = false
                    element.isMust = true
                    break
                  } else {
                    element.isdisplay = true
                    element.isMust = false
                  }
                }
              }
            }
          }
          if (currentListChild.name === 'DocumentTypeId') {
            this.showAddPatientDetail = false
            this.isShowNextBtn = true
            if (element.pshow === 'GuardianDocumentTypeId') {
              element.isdisplay = true
              element.value = null
            }
            if (element.name === 'GuardianName' || element.name === 'GuardianDocumentTypeId') {
              element.isdisplay = true
              element.value = null
            }
          }
        }
      }
    },
    // 多证件input填写后其余input项置空
    checkInputValue(list, currentListChild) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (
          (element.pshow === 'DocumentTypeId' && element.type === 'text') ||
          (element.pshow === 'DocumentTypeId' && element.type === 'idcard') ||
          (element.pshow === 'DocumentTypeId' && element.type === 'radio') ||
          (element.pshow === 'DocumentTypeId' && element.type === 'pickerDate')
        ) {
          if (element.isdisplay) {
            element.value = null
          }
        }
      }
      // // 根据传入的currentListChild判断如果是患者证件类型切换，清空隐藏监护人表单填写
      // if (currentListChild.name === 'DocumentTypeId') {
      //   this.idCardAgeCtrlShowOrHide(list, true)
      // }
      // 根据身份证判断年龄小于18岁，展示监护人信息填写
      if (currentListChild.name === 'IdCardNo') {
        if (validIdCardNumber(currentListChild.value)) {
          let birthday = currentListChild.value.substring(6, 14)
          const nowTime = this.$moment(new Date()).format('YYYY-MM-DD')
          birthday = this.$moment(birthday).format('YYYY-MM-DD')
          // 小于18岁为true，大于18为false
          if (this.$moment(nowTime).isBefore(this.$moment(birthday).add(18, 'years')) === true) {
            this.idCardAgeCtrlShowOrHide(list, false)
          } else {
            this.idCardAgeCtrlShowOrHide(list, true)
          }
        } else {
          this.idCardAgeCtrlShowOrHide(list, true)
        }
      }
      // 根据出生日期判断年龄小于18岁，展示监护人信息填写
      if (currentListChild.name === 'Birthday') {
        if (currentListChild.value != null) {
          const nowTime = this.$moment(new Date()).format('YYYY-MM-DD')
          const birthday = currentListChild.value
          // 小于18岁为true，大于18为false
          if (this.$moment(nowTime).isBefore(this.$moment(birthday).add(18, 'years')) === true) {
            console.log('小于18岁')
            this.idCardAgeCtrlShowOrHide(list, false)
          } else {
            console.log('大于18岁')
            this.idCardAgeCtrlShowOrHide(list, true)
          }
        } else {
          console.log('生日下边')
          this.idCardAgeCtrlShowOrHide(list, true)
        }
      }
    },
    // 根据身份证判断监护人选项显示隐藏
    idCardAgeCtrlShowOrHide(list, showOrHide) {
      let IsMultiType = 0
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        // IsMultiType代表是否为多证件类型  1：是  0  否
        if (element.name === 'IsMultiType') {
          IsMultiType = element.value
        }
        if (IsMultiType === 1 && element.name === 'GuardianDocumentTypeId') {
          element.isdisplay = showOrHide
        } else if (IsMultiType === 0 && element.name === 'GuardianDocumentTypeId') {
          element.isdisplay = true
        }
        if (element.name === 'GuardianName') {
          element.isdisplay = showOrHide
        }
      }
    },
    // 通过身份证查找患者
    searchPatientByIdCard() {
      this.$refs.creatPatientForm.validate((valid) => {
        if (valid) {
          this.searchPatientNexLoading = false
          const data = this.creatPatientForm.dialogFormItems
          const param = {}
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
            // 判断下拉框值将其value改为空
            if (item.value === 0 && item.name === 'DocumentTypeId') {
              item.value = null
            }
            param.documentTypeId = this.submitData.DocumentTypeId
            if (this.submitData.HKAndMacaoAndMTPsResidenceNum != null) {
              param.cardNo = this.submitData.HKAndMacaoAndMTPsResidenceNum
            }
            if (this.submitData.HKAndMacaoPermitNum != null) {
              param.cardNo = this.submitData.HKAndMacaoPermitNum
            }
            if (this.submitData.IdCardNo != null) {
              param.cardNo = this.submitData.IdCardNo
            }
            if (this.submitData.MTPsNum != null) {
              param.cardNo = this.submitData.MTPsNum
            }
            if (this.submitData.MilitaryOfficerNum != null) {
              param.cardNo = this.submitData.MilitaryOfficerNum
            }
            if (this.submitData.PassportNum != null) {
              param.cardNo = this.submitData.PassportNum
            }
            if (this.submitData.NDToHKAndMacaoPermitNum != null) {
              param.cardNo = this.submitData.NDToHKAndMacaoPermitNum
            }
          }
          GetPatientByDocumentType(param)
            .then((res) => {
              const { Data } = res
              this.isShowNextBtn = false
              const datas = this.creatPatientForm.dialogFormItems
              for (let index = 0; index < datas.length; index++) {
                const item = datas[index]
                if (item.name === 'PatientName') {
                  item.value = Data.patientName
                  item.disabled = true
                }
                if (item.name === 'Birthday') {
                  item.value = Data.birthday
                  item.disabled = true
                }
                if (item.name === 'Gender') {
                  item.value = Data.genderId
                  item.disabled = true
                }
                if (item.name === 'MobileNumber') {
                  item.value = Data.mobileNumber
                  item.disabled = true
                }
                if (
                  item.name === 'DocumentTypeId' ||
                  item.pshow === 'DocumentTypeId'
                ) {
                  item.disabled = true
                }
              }
              this.this.creatPatientForm.dialogFormItems = datas
              this.searchPatientNexLoading = false
              this.showAddPatientDetail = true
            })
            .catch(() => {
              this.showAddPatientDetail = true
              this.searchPatientNexLoading = false
            })
        } else {
          return false
        }
      })
    },
    // 添加患者
    addPatientDailogPost() {
      this.$refs.creatPatientForm.validate((valid) => {
        if (valid) {
          this.addPatientDailogPostBtnLoading = true
          const data = this.creatPatientForm.dialogFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
          }
          CreatePatientPost(this.submitData)
            .then((response) => {
              const { Msg, Code, Data } = response
              Message({
                message: Msg || '添加成功！',
                type: 'success',
                duration: 5 * 1000
              })
              if (Code === 1) {
                // 添加完毕后回填数据
                this.$emit('addPatientDailogReturnData', Data)
                this.addPatientDailogPostBtnLoading = false
              }
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    // 关闭添加就诊人弹窗
    closeAddPatientDailog() {
      this.$emit('closeAddPatientDailog')
    },
    // 自定义校验规则:姓名
    validFullNameData(rule, value, callback) {
      if (!validFullName(value)) {
        return callback(new Error('请输入正确的姓名'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:身份证号
    validIdCardNumberData(rule, value, callback) {
      if (!validIdCardNumber(value)) {
        return callback(new Error('请输入正确的身份证号'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:护照
    validPassPortCardData(rule, value, callback) {
      if (!validPassPortCard(value)) {
        return callback(new Error('请输入正确的护照'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:军官证
    validOfficerCardData(rule, value, callback) {
      if (!validOfficerCard(value)) {
        return callback(new Error('请输入正确的军官证'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:港澳台居民居住证
    validHKAndMacaoAndMTPIDCardData(rule, value, callback) {
      if (!validHKAndMacaoAndMTPIDCard(value)) {
        return callback(new Error('请输入正确的港澳台居民居住证'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:外国人永久居留身份证
    validIsRegexpIsFPerManentCardData(rule, value, callback) {
      if (!validIsRegexpIsFPerManentCard(value)) {
        return callback(new Error('请输入正确的外国人永久居留身份证'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:台湾居民来往大陆通行证
    validIsMTPsCardData(rule, value, callback) {
      if (!validIsMTPsCard(value)) {
        return callback(new Error('请输入正确的台湾居民来往大陆通行证'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:港澳居民来往内地通行证
    validIsHKAndMacaoPermitCardData(rule, value, callback) {
      if (!validIsHKAndMacaoPermitCard(value)) {
        return callback(new Error('请输入正确的港澳居民来往内地通行证'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:内地居民往来港澳通行证
    validNDToHKAndMacaoPermitNumData(rule, value, callback) {
      if (!validNDToHKAndMacaoPermitNum(value)) {
        return callback(new Error('请输入正确的内地居民往来港澳通行证'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:手机号
    validMobileNumberData(rule, value, callback) {
      if (!validMobileNumber(value)) {
        return callback(new Error('请输入正确的手机号'))
      } else {
        return callback()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.addPatientForm-right {
  text-align: center;
}
.dialog-footer {
  padding: 20px;
  padding-top: 10px;
  text-align: right;
  box-sizing: border-box;
}
</style>
