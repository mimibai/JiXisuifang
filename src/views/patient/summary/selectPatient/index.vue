
<template>
  <div class="container">
    <div
      v-loading="loading"
      class="mine-container-patient"
    >
      <!-- 警示条 11.10需求去除就诊人选择暂时隐藏-->
      <!-- <el-alert
        :title="tips"
        :type="isCanAddPatient ? 'success' : 'warning'"
        show-icon
      >
      </el-alert> -->
      <!-- 就诊人列表 11.10需求去除就诊人选择暂时隐藏-->
      <!-- <div class="mine-container-patient-title">
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
        <el-row
          :gutter="12"
          v-if="isPatientList"
        >
          <el-col
            :span="8"
            v-for="(item, index) in tableData"
            :key="index"
            class="mine-container-patient-Card"
          >
            <el-card shadow="hover">
              <div
                @click="openMsg(index, item.patientId)"
                :class="{ bgHover: index == isactive }"
              >
                <div class="mine-container-patient-Item">
                  姓名：{{ item.patientName }}
                </div>
                <div class="mine-container-patient-Item">
                  性别：{{ item.gender }}
                </div>
                <div class="mine-container-patient-Item">
                  证件类型：
                  <span v-if="item.documentTypeId == null||item.documentTypeId == 1">居民身份证</span>
                  <span v-if="item.documentTypeId == 2">港澳居民来往内地通行证</span>
                  <span v-if="item.documentTypeId == 3">台湾居民来往大陆通行证</span>
                  <span v-if="item.documentTypeId == 4">港澳台居民居住证</span>
                  <span v-if="item.documentTypeId == 5">外国人永久居留身份证</span>
                  <span v-if="item.documentTypeId == 6">护照</span>
                  <span v-if="item.documentTypeId == 7">军官证</span>
                </div>
                <div class="mine-container-patient-Item">
                  证件号：
                  <span v-if="item.patientIdCardNo!=''&&item.patientIdCardNo!=null">{{item.patientIdCardNo}}</span>
                  <span v-if="item.fperManentResidentNum!=''&&item.fperManentResidentNum!=null">{{item.fperManentResidentNum}}</span>
                  <span v-if="item.hkAndMacaoAndMTPsResidenceNum!=''&&item.hkAndMacaoAndMTPsResidenceNum!=null">{{item.hkAndMacaoAndMTPsResidenceNum}}</span>
                  <span v-if="item.hkAndMacaoPermitNum!=''&&item.hkAndMacaoPermitNum!=null">{{item.hkAndMacaoPermitNum}}</span>
                  <span v-if="item.militaryOfficerNum!=''&&item.militaryOfficerNum!=null">{{item.militaryOfficerNum}}</span>
                  <span v-if="item.mtpsNum!=''&&item.mtpsNum!=null">{{item.mtpsNum}}</span>
                  <span v-if="item.passportNum!=''&&item.passportNum!=null">{{item.passportNum}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-else>
          <el-alert
            title="暂无就诊人信息，请点击右上角“新增就诊人”按钮添加就诊人"
            type="info"
          >
          </el-alert>
        </div>
      </div> -->
      <!-- 新建就诊人弹窗 -->
      <el-dialog
        v-loading="diaLoading"
        title="新建就诊人"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :before-close="handleClose"
        width="35%"
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
              />
            </el-form-item>
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
            <el-form-item
              v-if="item.type == 'idcard' && !item.isdisplay"
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
            <!-- 护照 -->
            <el-form-item
              v-if="item.name == 'PassportNum' && !item.isdisplay"
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
              v-if="item.name == 'MilitaryOfficerNum' && !item.isdisplay"
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
              v-if="item.name == 'HKAndMacaoPermitNum' && !item.isdisplay"
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
            <!-- 外国人永久居留身份证 -->
            <el-form-item
              v-if="item.name == 'FPerManentResidentNum' && !item.isdisplay"
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
              v-if="item.name == 'MTPsNum' && !item.isdisplay"
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
              v-if="item.name == 'HKAndMacaoAndMTPsResidenceNum' && !item.isdisplay"
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
            <el-form-item
              v-if="item.type == 'radio' && !item.isdisplay"
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
            <el-form-item
              v-if="item.type == 'pickerDate' && !item.isdisplay"
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
              />
            </el-form-item>
          </div>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="closeDialog()">取 消</el-button>
          <el-button
            type="primary"
            :loading="dailogButtonLoading"
            @click="formSubmit({ operatTypeId: 1 })"
          >确 定</el-button>
        </div>
      </el-dialog>
      <div :style="ispatient ? 'display:none;' : ''">
        <div class="mine-container-patient-title">
          <h4>个人基本信ff息</h4>
        </div>
        <p class="mine-container-patient-tips">
          尊敬的用户，您好！为了更全面地为您定制治疗方案，请您如实填写以下信息。
        </p>
        <div class="mine-container-patient-content">
          <el-form
            ref="dynamicValidateForm"
            :model="formData"
            label-width="120px"
            class="demo-dynamic"
          >
            <div class="input-content">
              <el-row :gutter="20">
                <el-col
                  v-for="(item, index) in formData.formItems"
                  :key="item.name"
                  :span="12"
                  class="input-content-items"
                  :style="item.type == 'display' ? 'display:none' : ''"
                >
                  <el-form-item
                    v-if="item.type == 'text' && !item.isdisplay"
                    :label="item.title"
                    :prop="'formItems.' + index + '.value'"
                    :rules="{
                      required: item.isMust,
                      message: item.title + '不能为空',
                      trigger: 'blur',
                    }"
                  >
                    <el-input
                      v-model="item.value"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="item.type == 'number' && !item.isdisplay"
                    :label="item.title"
                    :prop="'formItems.' + index + '.value'"
                    :rules="{
                      required: item.isMust,
                      message: item.title + '不能为空',
                      trigger: 'blur',
                    }"
                  >
                    <el-input
                      v-model="item.value"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="item.type == 'idcard' && !item.isdisplay"
                    :label="item.title"
                    :prop="'formItems.' + index + '.showvalue'"
                    :rules="{
                      required: item.isMust,
                      message: item.title + '不能为空',
                      trigger: 'blur',
                    }"
                  >
                    <el-input
                      v-model="item.showvalue"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="item.type == 'radio' && !item.isdisplay"
                    :label="item.title"
                    :prop="'formItems.' + index + '.value'"
                    :rules="{
                      required: item.isMust,
                      message: item.title + '不能为空',
                      trigger: 'blur',
                    }"
                  >
                    <el-radio-group
                      v-model="item.value"
                      @change="changeHandler(formData.formItems, item)"
                    >
                      <el-radio
                        v-for="itemChild in item.list"
                        :key="itemChild.name"
                        :label="Number(itemChild.id)"
                        :disabled="item.disabled"
                      >{{ itemChild.name }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    v-if="item.type == 'picker'"
                    :label="item.title"
                    :prop="'formItems.' + index + '.value'"
                    :rules="{
                      required: item.isMust,
                      message: item.title + '不能为空',
                      required: item.isMust,
                    }"
                  >
                    <el-select
                      v-model="item.value"
                      :placeholder="item.placeholder"
                      :disabled="item.disabled"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="itemChild in item.list"
                        :key="itemChild.name"
                        :label="itemChild.name"
                        :value="itemChild.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="item.type == 'regionSelect'"
                    :label="item.title"
                    :prop="'formItems.' + index + '.value'"
                    :rules="{
                      required: item.isMust,
                      message: item.title + '不能为空',
                      trigger: 'blur',
                    }"
                  >
                    <el-cascader

                      v-model="item.value"
                      :props="ganged"
                      :class="item.addClass"
                      :placeholder="item.placeholder"
                      style="width: 100%"
                      @change="cascaderChange"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <p class="mine-container-patient-tips">
              注意：*为必填项，确保个人基本信息填写无误方可提交
            </p>
            <div style="text-align: center">
              <el-button
                type="primary"
                :loading="buttonLoading"
                style="width: 200px"
                @click="onSubmit"
              >开始测评</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import {
  validFullName,
  validIdCardNumber,
  validMobileNumber,
  validPassPortCard, // 护照验证
  validOfficerCard, // 军官证验证
  validHKAndMacaoAndMTPIDCard, // 验证港澳台居民居住证
  validIsRegexpIsFPerManentCard, // 验证外国人永久居留身份证
  validIsMTPsCard, // 验证台湾居民来往大陆通行证
  validIsHKAndMacaoPermitCard // 验证港澳居民来往内地通行证
} from '@/utils/validate'
import { getPatientList, creatPatient, creatPatientPost } from '@/api/patient'
import {
  CaseJoinProtocol,
  CaseJoinProtocolPost,
  checkIsExistNotSucProtocal
} from '@/api/summaryPatient'
import { getProvinceList, getCityList, getCountyList } from '@/api/region'
import { Dialog, Message, MessageBox } from 'element-ui'
export default {
  data() {
    return {
      loading: true,
      ispatient: false,
      isactive: '',
      patientId: '',
      isCanAddPatient: false, // 是否可以添加就诊人
      listLoading: true, // 表格加载数据显示loading
      isPatientList: false, // PatientList是否为空
      dialogTableVisible: false,
      dialogFormVisible: false,
      tips: '',
      tableData: [],
      creatPatientForm: {
        dialogFormItems: []
      },
      formData: {
        formItems: []
      },
      cascaderPlaceHolder: '请选择',
      regionObj: {},
      submitData: {}, // 用于提交表单信息到后台
      formLabelWidth: '120px',
      buttonLoading: false,
      ganged: {
        label: 'Name',
        value: 'provinceId',
        lazy: true,
        async lazyLoad(node, resolve) {
          if (node.level === 0) {
            const res = await getProvinceList()
            const nodes = res.Data
            resolve(nodes)
          } else if (node.level === 1) {
            this.value = 'cityId'
            const res = await getCityList({ provinceId: node.value })
            const nodes = res.Data
            resolve(nodes)
          } else if (node.level === 2) {
            this.value = 'countyId'
            const res = await getCountyList({ cityId: node.data.cityId })
            const nodes = res.Data
            nodes.forEach((item) => {
              // 关闭第四级
              item.leaf = true
            })
            resolve(nodes)
          }
        }
        // checkStrictly: true
      },
      diaLoading: false,
      createFormInputSize: 'small ',
      dailogButtonLoading: false
    }
  },
  created() {
    if (this.$route.query.followupProtocolId) {
      this.followupProtocolId = Number(this.$route.query.followupProtocolId)
    } else {
      this.$router.push({
        path: '/patient/screening'
      })
      return false
    }
    this.getUserToken()
  },
  methods: {

    // fetc() {
    //   // 发送异步请求获取数据
    //   getProvinceList().then(response => {
    //     // 处理返回的数据
    //     const data = response.Data
    //     console.log('response', data)
    //     const formattedOptions = data.map(item => ({
    //       value: item.provinceId,
    //       label: item.Name,
    //       provinceId: item.provinceId,
    //       children: []

    //     }))
    //     const promises = formattedOptions.map((item, index) => {
    //       return getCityList(item.value).then(res => {
    //         const cityData = res.Data
    //         console.log('cityData', cityData)
    //         formattedOptions[index].children = cityData.map(child => ({
    //           value: child.cityId,
    //           label: child.Name,
    //           provinceId: item.provinceId
    //         }))
    //       })
    //     })
    //     return Promise.all(promises).then(() => {
    //       this.options = formattedOptions
    //     })
    //   })
    // },
    tableRowClassName({ row, rowIndex }) {
      if (row.isDefult) {
        return 'default-row'
      }
    },

    getUserToken() {
      const hasToken = getToken('userToken')
      if (hasToken) {
        // 11.10需求 不获取就诊人数据 改为直接获取表单数据
        // this.fetchData()
        this.getData()
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
        const { isCanAddPatient, patientList, tips } = Data
        // 获取默认就诊人patientId
        for (let index = 0; index < patientList.length; index++) {
          const isDefult = patientList[index].isDefult
          if (isDefult) {
            const patientId = patientList[index].patientId
            this.patientId = patientId
            this.isactive = index
            this.getData(patientId)
          }
        }
        this.isCanAddPatient = isCanAddPatient
        this.tips = tips
        if (patientList.length == 0) {
          this.isPatientList = false
          this.listLoading = true
          this.ispatient = true
        } else {
          this.isPatientList = true
          this.tableData = patientList
          this.ispatient = false
        }
        this.loading = false
      })
    },
    // 添加就诊人operatTypeId: 1为新建，operatTypeId: 3为编辑
    creatNewPatient(operatType) {
      this.dialogFormVisible = true // 打开弹窗
      this.diaLoading = true
      creatPatient(operatType).then((response) => {
        const { Data } = response
        this.creatPatientForm.dialogFormItems = Data
        this.diaLoading = false
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
      })
    },
    // 提交信息
    formSubmit(operatType) {
      this.$refs.creatPatientForm.validate((valid) => {
        if (valid) {
          const data = this.creatPatientForm.dialogFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
          }
          this.submitData = Object.assign(this.submitData, operatType)
          creatPatientPost(this.submitData).then((response) => {
            const { Msg, Code } = response
            Message({
              message: Msg || '错误',
              type: 'success',
              duration: 5 * 1000
            })
            // 添加完毕后刷新数据
            if (Code == 1) {
              this.dialogFormVisible = false // 添加完毕后刷新数据
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 卡片点击事件
    openMsg(index, patientId) {
      this.isactive = index
      this.patientId = patientId
      this.loading = true
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.formData.formItems.length; j++) {
          if (i == index) {
            const LowerName =
              this.formData.formItems[j].name.charAt(0).toLowerCase() +
              this.formData.formItems[j].name.slice(1)
            if (LowerName == 'height') {
              this.formData.formItems[j].value = this.tableData[i].height
            }
            if (LowerName == 'weight') {
              this.formData.formItems[j].value = this.tableData[i].weight
            }
            if (LowerName == 'age') {
              this.formData.formItems[j].value = this.tableData[i].age
            }
            if (LowerName == 'genderId') {
              this.formData.formItems[j].value = this.tableData[i].genderId
            }
            if (LowerName == 'isMarriage') {
              this.formData.formItems[j].value =
                this.tableData[i].ismarriage == null ||
                this.tableData[i].ismarriage == false
                  ? 0
                  : 1
            }
            if (LowerName == 'marriageAge') {
              if (
                this.tableData[i].ismarriage == null ||
                this.tableData[i].ismarriage == false
              ) {
                this.formData.formItems[j].isdisplay = true
              } else {
                this.formData.formItems[j].isdisplay = false
              }
              this.formData.formItems[j].value =
                this.tableData[i].marriageage == null
                  ? ''
                  : this.tableData[i].marriageage
            }
            if (LowerName == 'educationTitleId') {
              if (this.tableData[i].educationTitleId == null) {
                this.formData.formItems[j].value =
                  this.tableData[i].educationTitleId
              } else {
                this.formData.formItems[j].value = String(
                  this.tableData[i].educationTitleId
                )
              }
            }
            if (LowerName == 'provinceId,CityId,CountyId') {
              if (
                this.tableData[i].provinceid != null &&
                this.tableData[i].provinceid > 0
              ) {
                const provinceid = this.tableData[i].provinceid
                const cityid = this.tableData[i].cityid
                const countyid = this.tableData[i].countyid
                this.formData.formItems[
                  j
                ].value = `${provinceid},${cityid},${countyid}`
              } else {
                this.formData.formItems[j].value = '0,0,0'
              }
            }
            if (
              LowerName ==
              'ancestralProvinceId,AncestralCityId,AncestralCountyId'
            ) {
              if (
                this.tableData[i].ancestralProvinceId != null &&
                this.tableData[i].ancestralProvinceId > 0
              ) {
                const ancestralProvinceId = this.tableData[i].ancestralProvinceId
                const ancestralCityId = this.tableData[i].ancestralCityId
                const ancestralCountyId = this.tableData[i].ancestralCountyId
                this.formData.formItems[
                  j
                ].value = `${ancestralProvinceId},${ancestralCityId},${ancestralCountyId}`
              } else {
                this.formData.formItems[j].value = '0,0,0'
              }
            }
          }
        }
      }
      const assData = this.arrangement(this.formData.formItems)
      this.formData.formItems = assData
      this.loading = false
      // 检查当前就诊人是否有未完成方案
      this.checkIsExistNotSucProtocal(patientId, this.followupProtocolId)
    },

    getData(patientId) {
      const followupProtocolId = this.followupProtocolId
      CaseJoinProtocol({ followupProtocolId: followupProtocolId }).then(
        (response) => {
          const { Data } = response
          const assData = this.arrangement(Data)
          this.formData.formItems = assData
          this.loading = false
          // 11.10需求 去除检查当前就诊人是否存在历史未完成记录
          // this.checkIsExistNotSucProtocal(patientId, followupProtocolId)
        }
      )
    },
    changeHandler(formItems, item) {
      for (let index = 0; index < formItems.length; index++) {
        const eitem = formItems[index]
        if (eitem.pshow == item.name) {
          if (Number(eitem.pshowval) == item.value) {
            eitem.isdisplay = false
          } else {
            eitem.isdisplay = true
            eitem.value = null
          }
        }
      }
    },
    // 检查当前就诊人是否存在未完成的方案
    checkIsExistNotSucProtocal(patientId, followupProtocolId) {
      this.loading = true
      checkIsExistNotSucProtocal({
        patientId: patientId,
        followupProtocolId: followupProtocolId
      }).then((response) => {
        const { Data } = response
        // 为0表示无，其它则为有
        if (Data != 0) {
          MessageBox.confirm('您近期有一次测评未完成，是否继续？', '系统提示', {
            confirmButtonText: '继续上一次评测',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              // 继续评测
              Message({
                message: '前往继续评测填写',
                type: 'success',
                duration: 5 * 1000
              })
              this.$router.push({
                path: '/patient/summary/survey',
                query: {
                  caseJoinProtocolId: Data
                }
              })
              this.loading = false
            })
            .catch((err) => {
              this.loading = false
              // console.log(err)
            })
        } else {
          this.loading = false
        }
      })
    },

    cascaderChange() {},
    // 表单提交
    onSubmit() {
      this.$refs.dynamicValidateForm.validate((valid) => {
        if (valid) {
          // 拼接
          this.buttonLoading = true
          const data = this.formData.formItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            // regionSelect的name为多个字段拼接而成，需分割
            if (item.type == 'regionSelect') {
              const nameArr = item.name.split(',')
              let valueArr
              if (Array.isArray(item.value)) {
                valueArr = item.value
              } else {
                valueArr = item.value.split(',')
              }
              for (let i = 0; i < nameArr.length; i++) {
                if (Number(valueArr[i]) === 0) {
                  this.regionObj[nameArr[i]] = null
                } else {
                  this.regionObj[nameArr[i]] = Number(valueArr[i])
                }
              }
            } else {
              this.submitData[item.name] = item.value
            }
          }
          this.followupProtocolId = Number(this.$route.query.followupProtocolId)

          this.submitData.PatientId = this.patientId
          this.submitData = Object.assign(this.submitData, this.regionObj)
          this.submitData = Object.assign(this.submitData, {
            FollowupProtocolId: this.followupProtocolId
          })
          // 提交
          // console.log(this.submitData)
          CaseJoinProtocolPost(this.submitData)
            .then((response) => {
              const { Msg, Data } = response
              Message({
                message: '信息填写成功！前往问卷填写',
                type: 'success',
                duration: 5 * 1000
              })
              this.buttonLoading = false
              // 添加完毕后跳转至问卷填写页面
              this.$router.push({
                path: '/patient/summary/survey',
                query: {
                  caseJoinProtocolId: Data
                }
              })
            })
            .catch((err) => {
              this.buttonLoading = false
            })
        }
      })
    },

    arrangement(Data) {
      for (let index = 0; index < Data.length; index++) {
        const oldValue = Data[index].value
        if (Data[index].type != 'radio' && oldValue == 0) {
          Data[index].value = null
        }
        if (Data[index].type == 'radio' && oldValue === 0) {
          Data[index].value = null
        }
        // 循环将数据中picker类型的默认key转为value
        if (Data[index].type == 'picker') {
          const sList = Data[index].list
          if (oldValue != null) {
            if (oldValue == 0) {
              Data[index].value = null
            } else {
              const sValue = sList[oldValue].id
              Data[index].value = sValue
            }
          }
        }
        if (Data[index].type == 'regionSelect') {
          const nameArr = Data[index].value.split(',')
          // 如果value为“0,0,0”表示未选择
          if (nameArr[0] > 0) {
            this.getProvinceData(nameArr).then((res) => {
              if (res) {
                const provinceName = res[0]
                let cityName = ''
                let countyName = ''
                res[1].then((res1) => {
                  cityName = res1[0]
                  res1[1].then((res2) => {
                    countyName = res2
                    Data[
                      index
                    ].placeholder = `${provinceName}/${cityName}/${countyName}`
                    // Data[index].value = [provinceName,cityName,countyName]
                    Data[index].addClass = 'sepcialInput'
                  })
                })
              }
            })
          } else {
            // Data[index].value = null
            Data[index].addClass = ''
          }
        }
      }
      return Data
    },

    closeDialog() {
      this.dialogFormVisible = false
      this.$refs.creatPatientForm.resetFields()
    },

    handleClose(done) {
      this.dialogFormVisible = false
      this.$refs.creatPatientForm.resetFields()
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
          // 判断下拉框值将其value改为空
          if (element.value === 0 && element.name == 'DocumentTypeId') {
            element.value = null
          }
          if (element.pshow === 'DocumentTypeId') {
            const pshowArr = element.pshow.split('|')
            const pshowval = element.pshowval.split('|')
            for (let i = 0; i < pshowArr.length; i++) {
              const pshowItem = pshowArr[i]
              const pshowvalItem = pshowval[i]
              const pshowvalItemArr = pshowvalItem.split(',')
              for (let j = 0; j < pshowvalItemArr.length; j++) {
                const pshowvalItemChild = pshowvalItemArr[j]
                if (currentListChild.name === pshowItem) {
                  if (currentListChild.value === Number(pshowvalItemChild)) {
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
        }
      }
    },

    // 多证件input填写后其余input项置空
    checkInputValue(list, currentListChild) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (
          (element.pshow == 'DocumentTypeId' && element.type == 'text') ||
          (element.pshow == 'DocumentTypeId' && element.type == 'idcard') ||
          (element.pshow == 'DocumentTypeId' && element.type == 'radio') ||
          (element.pshow == 'DocumentTypeId' && element.type == 'pickerDate')
        ) {
          if (element.isdisplay) {
            element.value = null
          }
        }
      }
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
    // 自定义校验规则:手机号
    validMobileNumberData(rule, value, callback) {
      if (!validMobileNumber(value)) {
        return callback(new Error('请输入正确的手机号'))
      } else {
        return callback()
      }
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
          console.log('response', response)
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
<style lang="scss">
.sepcialInput .el-input__inner::-webkit-input-placeholder {
  color: #606266;
}
</style>
<style lang="scss">
@import '~@/styles/variables.scss';
.el-table .default-row {
  background: oldlace;
}
.el-card__body {
  padding: 0;
}
.el-button--primary {
  color: #fff;
  background-color: $bg;
  border-color: $bg;
  &:hover {
    background-color: #c37032;
    border-color: #c37032;
  }
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.el-card__body {
  padding: 0;
}
.container {
  padding-top: 50px;
  padding-bottom: 50px;
}
.mine-container-patient {
  padding: 40px;
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
  &-Card {
    margin-bottom: 15px;
    font-size: 14px;
    cursor: pointer;
  }
  .el-card__body {
    padding: 0;
  }
  &-Item {
    padding: 10px 20px;
  }
  &-tips {
    font-size: 12px;
    color: #d9001b;
    margin-bottom: 25px;
    padding: 0 16px;
  }
  .bgHover div {
    background: oldlace;
  }
}
</style>
