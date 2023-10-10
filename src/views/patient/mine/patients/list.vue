
<template>
  <div class="mine-container-patient">
    <el-alert
      :title="tips"
      :type="isCanAddPatient ? 'success' : 'warning'"
      show-icon
    />
    <div class="mine-container-patient-title">
      <el-row type="flex">
        <el-col :span="16">
          <h4>就诊人管理</h4>
        </el-col>
        <el-col
          :span="8"
          style="text-align: right"
        >
          <el-button
            type="success"
            icon="el-icon-plus"
            size="small"
            :disabled="isCanAddPatient ? false : true"
            @click.native="creatNewPatient({ operatTypeId: 1 })"
          >新增就诊人</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="mine-container-patient-table">
      <el-table
        v-if="isPatientList"
        v-loading="listLoading"
        :data="tableData"
        element-loading-text="加载中"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        border
        :header-cell-style="getRowClass"
      >
        <el-table-column
          label="姓名"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover v-if="scope.row.isShowGuardianInfo" trigger="hover" placement="top">
              <p>监护人姓名: <span class="guardianInfo-span">{{ scope.row.guardianName }}</span></p>
              <p>监护人监护人证件类型: <span class="guardianInfo-span">{{ scope.row.guardianDocumentTypeName }}</span></p>
              <p>监护人证件号: <span class="guardianInfo-span">{{ scope.row.guardianCertificateNo }}</span></p>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.patientName }}</span>
                <span class="icon-minority">
                  <svg-icon icon-class="minority" />
                </span>
              </div>
            </el-popover>
            <span v-else>{{ scope.row.patientName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="证件类型"
          align="center"
          width="130px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.documentTypeId == null||scope.row.documentTypeId == 1">居民身份证</span>
            <span v-if="scope.row.documentTypeId == 2">港澳居民来往内地通行证</span>
            <span v-if="scope.row.documentTypeId == 3">台湾居民来往大陆通行证</span>
            <span v-if="scope.row.documentTypeId == 4">港澳台居民居住证</span>
            <span v-if="scope.row.documentTypeId == 5">外国人永久居留身份证</span>
            <span v-if="scope.row.documentTypeId == 6">护照</span>
            <span v-if="scope.row.documentTypeId == 7">军官证</span>
            <span v-if="scope.row.documentTypeId == 8">内地居民往来港澳通行证</span>
          </template>
        </el-table-column>
        <el-table-column
          label="证件号"
          align="center"
          width="130px"
        >
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.patientIdCardNo != null">{{ scope.row.patientIdCardNo }}</span>
            <span v-if="scope.row.fperManentResidentNum != null">{{ scope.row.fperManentResidentNum }}</span>
            <span v-if="scope.row.hkAndMacaoAndMTPsResidenceNum != null">{{ scope.row.hkAndMacaoAndMTPsResidenceNum }}</span>
            <span v-if="scope.row.hkAndMacaoPermitNum != null">{{ scope.row.hkAndMacaoPermitNum }}</span>
            <span v-if="scope.row.militaryOfficerNum != null">{{ scope.row.militaryOfficerNum }}</span>
            <span v-if="scope.row.mtpsNum != null">{{ scope.row.mtpsNum }}</span>
            <span v-if="scope.row.passportNum != null">{{ scope.row.passportNum }}</span> -->
            <span v-if="scope.row.curCertificateNo != null">{{ scope.row.curCertificateNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          width="80"
          align="center"
        />
        <el-table-column
          prop="age"
          label="年龄"
          width="80"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              v-for="n in row.buttonList"
              :key="n.index"
              size="small"
              @click="operations(n.clickTypeId, row.patientId)"
            >
              {{ n.title }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-else>
        <el-alert
          title="暂无就诊人信息，请点击右上角“新增就诊人”按钮添加就诊人"
          type="info"
        />
      </div>
    </div>
    <el-dialog
      v-loading="diaLoading"
      title="新建就诊人"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="30%"
    >
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
            <el-form-item
              v-if="item.name == 'PatientName' || item.name == 'GuardianName'"
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
              />
            </el-form-item>
          </template>
          <template v-if="!item.isdisplay">
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
          </template>
          <template v-if="!item.isdisplay">
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
                @blur="checkInputValue(creatPatientForm.dialogFormItems,item)"
              />
            </el-form-item>
          </template>
          <!-- 护照 -->
          <template v-if="!item.isdisplay">
            <el-form-item
              v-if="item.name == 'PassportNum' || item.name == 'GuardianPassportNum'"
              guardian-passport-num-
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
          </template>

          <!-- 军官证 -->
          <template v-if="!item.isdisplay">
            <el-form-item
              v-if="item.name == 'MilitaryOfficerNum' || item.name == 'GuardianMilitaryOfficerNum'"
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
          </template>

          <!-- 港澳居民来往内地通行证 -->
          <template v-if="!item.isdisplay">
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
          </template>
          <!-- 内地居民往来港澳通行证 -->
          <template v-if="!item.isdisplay">
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
          </template>
          <!-- 外国人永久居留身份证 -->
          <template v-if="!item.isdisplay">
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
          </template>
          <!-- 台湾居民来往大陆通行证 -->
          <template v-if="!item.isdisplay">
            <el-form-item
              v-if="item.name == 'MTPsNum' || item.name == 'GuardianMTPsNum'"
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
          </template>

          <!-- 港澳台居民居住证 -->
          <template v-if="!item.isdisplay">
            <el-form-item
              v-if="item.name == 'HKAndMacaoAndMTPsResidenceNum' || item.name == 'GuardianHKAndMacaoAndMTPsResidenceNum'"
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
          </template>
          <template v-if="!item.isdisplay">
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
              />
            </el-form-item>
          </template>
          <template v-if="!item.isdisplay">
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
          </template>
          <template v-if="!item.isdisplay">
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
      </el-form>
      <div class="register-term">
        <el-checkbox v-model="registerChecked" />
        <div class="register-term-box">
          <span> {{ prefixStr }}</span>
          <span v-for="(item,index) in registerTermList" :key="index">
            <span class="register-term-link" @click="gotoAgreementDetial(item)">
              {{ item.title }}
            </span>
          </span>
          <span> {{ suffixStr }}</span>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button
          type="primary"
          :loading="dailogButtonLoading"
          :disabled="registerChecked === true ? false: true"
          @click="formSubmit({ operatTypeId: 1 })"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import {
  getPatientList,
  creatPatient,
  creatPatientPost,
  delPatient,
  modifyDefultPatient
} from '@/api/patient'
import { getUserUseProtocol } from '@/api/user'
import { Message, MessageBox } from 'element-ui'
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
  validNDToHKAndMacaoPermitNum // 验证内地居民往来港澳通行证
} from '@/utils/validate'
export default {
  data() {
    return {
      dailogButtonLoading: false,
      isCanAddPatient: false, // 是否可以添加就诊人
      listLoading: true, // 表格加载数据显示loading
      isPatientList: false, // PatientList是否为空
      dialogTableVisible: false,
      dialogFormVisible: false,
      diaLoading: false,
      tips: '',
      tableData: [],
      creatPatientForm: {
        dialogFormItems: []
      },
      submitData: {}, // 用于提交表单信息到后台
      formLabelWidth: '150px',
      createFormInputSize: 'small ',
      prefixStr: '', // 注册条款
      suffixStr: '',
      registerTermList: [],
      registerChecked: false
    }
  },
  created() {
    this.getUserToken()
  },
  methods: {
    // 显示隐藏联动
    pickerCtrlShowOrHide(list, currentListChild) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (element.name !== null && element.name !== '') {
          if (element.pshow === null && element.pshowval === null) {
            element.pshow === ''
            element.pshowval === ''
          }
          // 判断下拉框值将其value改为空
          if (element.value === 0 && element.name === currentListChild.name) {
            element.value = null
          }
          if (element.pshow === currentListChild.name) {
            // 下拉框切换将关联项清空
            element.value = null
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
      // 根据传入的currentListChild判断如果是患者证件类型切换，清空隐藏监护人表单填写
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
            this.idCardAgeCtrlShowOrHide(list, false)
          } else {
            this.idCardAgeCtrlShowOrHide(list, true)
          }
        } else {
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
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.isDefult) {
        return 'default-row'
      }
    },
    // handleClick() {
    //   console.log(11)
    // },
    getUserToken() {
      const hasToken = getToken('userToken')
      if (hasToken) {
        this.fetchData()
      } else {
        // 做进一步处理
        return false
      }
    },
    // 获取就诊人集合
    fetchData() {
      this.listLoading = true
      getPatientList().then((response) => {
        const { Data } = response
        // console.log(Data)
        const { isCanAddPatient, patientList, tips } = Data
        this.isCanAddPatient = isCanAddPatient
        this.tips = tips
        if (patientList.length === 0) {
          this.isPatientList = false
        } else {
          this.isPatientList = true
          this.tableData = patientList
          this.listLoading = false
        }
      })
    },
    // 添加就诊人operatTypeId: 1为新建，operatTypeId: 3为编辑
    creatNewPatient(operatType) {
      this.dialogFormVisible = true // 打开弹窗
      this.diaLoading = true
      creatPatient(operatType).then((response) => {
        const { Data } = response
        this.creatPatientForm.dialogFormItems = Data

        // 判断类型为picker的下拉框将其value改为空
        const taskFormItem = this.creatPatientForm.dialogFormItems
        for (let index = 0; index < taskFormItem.length; index++) {
          const item = taskFormItem[index]
          if (
            (item.type === 'picker' && item.value === 0) ||
            (item.type === 'radio' && item.value === 0)
          ) {
            item.value = null
          }
        }
      }).then(() => {
        // 获取用户协议
        getUserUseProtocol({ typeId: 2 }).then((res) => {
          const { Data } = res
          this.prefixStr = Data.prefixStr
          this.suffixStr = Data.suffixStr
          this.registerTermList = Data.dataList
          this.diaLoading = false
        }).catch((err) => {
          this.diaLoading = false
          console.log(err)
        })
      })
    },
    // 前往就诊人协议详情页
    gotoAgreementDetial(param) {
      this.$router.push(
        {
          path: '/patient/account/agreementDesDetail',
          query: {
            id: param.id,
            typeId: param.typeId
          }
        }
      )
    },
    // 提交信息
    formSubmit(operatType) {
      this.$refs.creatPatientForm.validate((valid) => {
        if (valid) {
          this.dailogButtonLoading = true
          const data = this.creatPatientForm.dialogFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
          }
          this.submitData = Object.assign(this.submitData, operatType)
          // console.log(this.submitData)
          creatPatientPost(this.submitData)
            .then((response) => {
              const { Msg, Code } = response
              Message({
                message: Msg || '错误',
                type: 'success',
                duration: 5 * 1000
              })
              if (Code === 1) {
                // 添加完毕后刷新数据
                this.fetchData()
                this.dailogButtonLoading = false
                this.dialogFormVisible = false
              }
            })
            .catch(() => {
              this.dailogButtonLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.$refs.creatPatientForm.resetFields()
    },
    handleClose(done) {
      this.dialogFormVisible = false
      this.$refs.creatPatientForm.resetFields()
    },
    // 表格按钮事件
    operations(clickTypeId, patientId) {
      // clickTypeId1、解绑（删除） 2、信息修改 3、设置默认
      // console.log(clickTypeId)
      if (clickTypeId === 1) {
        this.delPartient(patientId)
      } else if (clickTypeId === 2) {
        this.$router.push({
          path: '/patient/mine/patients/editPatient',
          query: { patientId: patientId }
        })
      } else if (clickTypeId === 3) {
        this.modifyDefultPatient(patientId)
      }
    },
    // 删除就诊人
    delPartient(Id) {
      MessageBox.confirm(
        '确定解绑就诊人？解绑后将无法恢复，需重新填写',
        '确认解绑',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delPatient({ patientId: Id }).then((response) => {
          const { Msg } = response
          Message({
            message: Msg || '错误',
            type: 'success',
            duration: 5 * 1000
          })
          this.fetchData()
        })
      })
    },
    // 设置默认就诊人
    modifyDefultPatient(Id) {
      MessageBox.confirm('确定设置默认就诊人？', '确认设置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modifyDefultPatient({ patientId: Id }).then((response) => {
          const { Msg } = response
          Message({
            message: Msg || '错误',
            type: 'success',
            duration: 5 * 1000
          })
          this.fetchData()
        })
      })
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
<style lang="scss">
@import '~@/styles/variables.scss';
.el-table .default-row {
  background: oldlace;
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.mine-container-patient {
  padding: 50px;
  background: #ffffff;
  &-title {
    padding: 8px 16px;
    background: #f4f4f4;
    margin: 16px 0;
    h4 {
      color: $bg;
      line-height: 33px;
      font-size: 15px;
    }
  }
  .icon-minority{
    color: $bg;
    font-size: 20px;
  }
}
.register-term{
      margin-bottom: 22px;
      display: flex;
      padding-left: 60px;
      padding-right: 63px;
      .register-term-box{
        font-size: 14px;
        padding-left: 10px;
      }
      .register-term-link{
        cursor: pointer;
        color: $bg;
      }
    }
.guardianInfo-span{
    color: $bg;
    margin-left: 10px;
}
</style>

