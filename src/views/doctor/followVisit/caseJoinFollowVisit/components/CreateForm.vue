<template>
  <div>
    <el-form
      ref="createForm"
      :model="formData"
      :label-width="createFormLabelWidth"
    >
      <div class="input-content">
        <div
          v-for="(item, index) in formData.list"
          :key="index+'key'+item.name"
          class="input-content-items"
          :style="item.type == 'display' || item.isdisplay == true ? 'display:none' : ''"
        >
          <div v-if="item.type == null">
            <h3 class="form-item-tit">{{ item.title }}</h3>
          </div>
          <div v-else>
            <el-form-item
              v-if="item.type == 'display'"
              style="display: none"
              :label="item.title"
            >
              <el-input
                v-model="item.value"
                :size="createFormInputSize"
              />
            </el-form-item>
            <!-- text文本  姓名单独验证-->
            <el-form-item
              v-if="item.type == 'text' && item.name =='PatientName'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="[{
                required: item.isMust,
                message: item.title + '不能为空',
              },{ trigger: 'blur', validator: validFullNameData }]"
              :class="item.name == 'PatientName'"
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                :size="createFormInputSize"
                style="max-width: 200px"
              />
              <el-button
                v-if="item.name === 'PatientName' && !item.disabled"
                type="primary"
                size="mini"
                style="margin-left: 15px"
                icon="el-icon-search"
                @click.native="openAddPatientModal"
              />
            </el-form-item>
            <!-- text文本 -->
            <el-form-item
              v-if="item.type == 'text' && item.name !='PatientName' && item.name !='HKAndMacaoPermitNum' && item.name !='MTPsNum' && item.name !='HKAndMacaoAndMTPsResidenceNum' && item.name !='FPerManentResidentNum' && item.name !='PassportNum' && item.name !='MilitaryOfficerNum'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="[{
                required: item.isMust,
                message: item.title + '不能为空',
              },{ trigger: 'blur'}]"
              :class="item.name == 'PatientName'"
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                :size="createFormInputSize"
                style="max-width: 200px"
              />
            </el-form-item>
            <!-- 护照 -->
            <el-form-item
              v-if="item.name == 'PassportNum' && !item.isdisplay"
              :label="item.title "
              :prop="'list.' + index + '.value'"
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
                size="mini"
                style="max-width: 200px"
                @blur="checkInputValue(formData.list,item)"
              />
            </el-form-item>
            <!-- 军官证 -->
            <el-form-item
              v-if="item.name == 'MilitaryOfficerNum' && !item.isdisplay"
              :label="item.title "
              :prop="'list.' + index + '.value'"
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
                size="mini"
                style="max-width: 200px"
                @blur="checkInputValue(formData.list,item)"
              />
            </el-form-item>
            <!-- 港澳居民来往内地通行证 -->
            <el-form-item
              v-if="item.name == 'HKAndMacaoPermitNum' && !item.isdisplay"
              :label="item.title "
              :prop="'list.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
                { trigger: 'blur' , validator: validIsHKAndMacaoPermitCardData},
              ]"
            >
              <el-input
                v-model="item.value"
                :name="item.pshowval"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                size="mini"
                style="max-width: 200px"
                @blur="checkInputValue(formData.list,item)"
              />
            </el-form-item>
            <!-- 外国人永久居留身份证 -->
            <el-form-item
              v-if="item.name == 'FPerManentResidentNum' && !item.isdisplay"
              :label="item.title "
              :prop="'list.' + index + '.value'"
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
                size="mini"
                style="max-width: 200px"
                @blur="checkInputValue(formData.list,item)"
              />
            </el-form-item>
            <!-- 台湾居民来往大陆通行证 -->
            <el-form-item
              v-if="item.name == 'MTPsNum' && !item.isdisplay"
              :label="item.title "
              :prop="'list.' + index + '.value'"
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
                size="mini"
                style="max-width: 200px"
                @blur="checkInputValue(formData.list,item)"
              />
            </el-form-item>
            <!-- 港澳台居民居住证 -->
            <el-form-item
              v-if="item.name == 'HKAndMacaoAndMTPsResidenceNum' && !item.isdisplay"
              :label="item.title "
              :prop="'list.' + index + '.value'"
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
                size="mini"
                style="max-width: 200px"
                @blur="checkInputValue(formData.list,item)"
              />
            </el-form-item>
            <!-- 文本域 -->
            <el-form-item
              v-if="item.type == 'textarea'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'blur',
              }"
              :class="item.name == 'PatientName'"
            >
              <el-input
                v-model="item.value"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                :size="createFormInputSize"
                style="max-width: 200px"
              />
            </el-form-item>
            <!-- 身份证号 -->
            <el-form-item
              v-if="item.type == 'idcard' && !item.isdisplay"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
                { trigger: 'blur', validator: validIdCardNumberData },
              ]"
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                :size="createFormInputSize"
                style="max-width: 200px"
                @blur="checkAgeAndSexByIdcard(formData.list,item.value)"
              />
            </el-form-item>
            <!-- 联系电话 -->
            <el-form-item
              v-if="item.type == 'phone'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
                { trigger: 'blur', validator: validMobileNumberData },
              ]"
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                :size="createFormInputSize"
                style="max-width: 200px"
              />
            </el-form-item>
            <!-- 数字文本 -->
            <el-form-item
              v-if="item.type == 'number'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'blur',
              }"
              :class="
                item.name == 'Name'? 'hasSearchInput' : ''
              "
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                size="small"
                style="max-width: 200px"
              />
            </el-form-item>
            <!-- 单选 -->
            <el-form-item
              v-if="item.type == 'radio'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :style="item.isdisplay ? 'display:none' : ''"
              :rules="{ required: item.name=='PatientGenderId'?true:item.isMust, message: item.title + '不能为空' },"
            >
              <el-radio-group
                v-model="item.value"
                @change="changeHandler(formData.list, item)"
              >
                <el-radio
                  v-for="itemChild in item.list"
                  :key="itemChild.id"
                  :label="Number(itemChild.id)"
                  :disabled="item.disabled"
                >{{ itemChild.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--复选-->
            <el-form-item
              v-if="item.type == 'checkbox'"
              :style="item.isdisplay ? 'display:none' : ''"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isRequired,
                message: '请至少选择一个',
                trigger: 'change',
              }"
            >
              <el-checkbox-group
                v-model="item.showvalue"
              >
                <el-checkbox
                  v-for="(
                    itemCheck, itemIndex
                  ) in item.list"
                  :key="itemCheck.name"
                  :label="itemCheck.id"
                >{{ itemCheck.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <!-- picker下拉 -->
            <el-form-item
              v-if="item.type == 'picker' && item.name != 'FollowVisitPlanId' && item.name != 'DocumentTypeId'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'blur',
              }"
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                filterable
                :label="item.title"
                :size="createFormInputSize"
                @change="pickerCtrlShowOrHide(formData.list, item)"
              >
                <el-option
                  v-for="itemChild in item.list"
                  :key="itemChild.id"
                  :label="itemChild.name"
                  :value="Number(itemChild.id)"
                />
              </el-select>
            </el-form-item>
            <!-- 证件类型 -->
            <el-form-item
              v-if="item.type == 'picker' && item.name == 'DocumentTypeId'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'blur',
              }"
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :label="item.title"
                size="small"
                @change="pickerDocumentShowOrHide(formData.list,item)"
              >
                <el-option
                  v-for="itemChild in item.list"
                  :key="itemChild.name"
                  :label="itemChild.name"
                  :value="Number(itemChild.id)"
                />
              </el-select>
            </el-form-item>
            <!-- picker下拉 -->
            <el-form-item
              v-if="item.type == 'picker' && item.name == 'FollowVisitPlanId'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'blur',
              }"
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                filterable
                :label="item.title"
                :size="createFormInputSize"
                @change="checkIsExistPreviousTask"
              >
                <el-option
                  v-for="itemChild in item.list"
                  :key="itemChild.id"
                  :label="itemChild.name"
                  :value="Number(itemChild.id)"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.type == 'pickerTime' && item.name != 'BenchmarkDate'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
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
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'pickerDate'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
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
                @change="dateChange(formData.list,item.value)"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'pickerTime' && item.name == 'BenchmarkDate'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
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
                :picker-options="pickerOptions"
                @change="checkIsExistPreviousTask"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'twolevel'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: '请至少选择一个',
                trigger: 'change',
              }"
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :size="createFormInputSize"
                @change="bindPadTwoLevel(item, item.value),pickerCtrlShowOrHide(formData.list, item)"
              >
                <el-option
                  v-for="itemChild in item.list"
                  :key="itemChild.id"
                  :label="itemChild.name"
                  :value="Number(itemChild.id)"
                />
              </el-select>
            </el-form-item>
            <!--transfer框-->
            <el-form-item
              v-if="item.type == 'multipleLookUp'"
              :style="item.isdisplay ? 'display:none' : ''"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isRequired,
                message: '请至少选择一个',
                trigger: 'change',
              }"
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
            <!--  -->
            <el-dialog
              :title="dialogTitle"
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
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { isExistPreviousTask } from '@/api/followVisits'
import { getAllPatientList } from '@/api/doctor'
import {
  validFullName,
  validIdCardNumber,
  validMobileNumber,
  validPositiveNumber,
  validPassPortCard, // 护照验证
  validOfficerCard, // 军官证验证
  validHKAndMacaoAndMTPIDCard, // 验证港澳台居民居住证
  validIsRegexpIsFPerManentCard, // 验证外国人永久居留身份证
  validIsMTPsCard, // 验证台湾居民来往大陆通行证
  validIsHKAndMacaoPermitCard // 验证港澳居民来往内地通行证
} from '@/utils/validate'
import {
  checkAgeByIdcard,
  checkSexByIdcard,
  checkAgeByBirthday
} from '@/utils/index'
export default {
  name: 'CreateForm',
  props: {
    createForm: {
      type: Array,
      default() {
        return []
      }
    },
    operatTypeId: {
      type: Number,
      default: 0
    } // 新建或复制
  },
  data() {
    return {
      createFormLabelWidth: '220px',
      formData: {
        list: this.createForm
      },
      submitData: {}, // 提交数据
      createFormInputSize: 'small ',
      showIsGenerateByOverTime: false, // 是否展示“是否生成今天之前任务”选项
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }
        ]
      },
      dialogpeItem: false, // 搜索transfer弹窗

      name: '',
      dialogTitle: '',
      dataList: [],
      searchFormTransferData: [], // 搜索transfer弹窗数据
      dialogpeformTransShowValue: [],
      transferValue: [],
      transferTit: ['尚未选择', '已选择'],
      searchFormTransferNeedValue: ''

    }
  },
  watch: {
    createForm: {
      handler: function(newValue, oldValue) {
        this.formData.list = this.arrangement(newValue)
      },
      immediate: true
    }
  },
  methods: {
    // 搜索随访标签与阳性指征弹窗
    peItemDialog(formItem) {
      const { disabled } = formItem
      console.log('formItem', formItem)
      if (disabled === false) {
        this.searchFormTransferData = formItem.searchFormTransferData
        this.transferValue = formItem.transferValue
        this.dataList = formItem.list
        this.name = formItem.name
        // this.searchFormTransfer.valueArr = formItem.valueArr
        this.dialogpeItem = true
      } else {
        return false
      }
    },

    peItemDialogSubmit() {
      const valueArr = this.transferValue
      // this.transferValue = valueArr.join(',')
      const dataList = this.dataList
      const newArr = []
      for (let index = 0; index < dataList.length; index++) {
        const element = dataList[index]
        for (let i = 0; i < valueArr.length; i++) {
          const valueArrChild = valueArr[i]
          if (element.id === valueArrChild) {
            newArr.push(element.name)
          }
        }
      }
      // this.searchFormTransfer.valueArr = newArr
      for (let index = 0; index < this.createForm.length; index++) {
        const element = this.createForm[index]
        console.log('elementttttt', element)
        if (element.name === this.name) {
          element.dialogpeformTransShowValue = newArr
          element.value = valueArr.join(',')
        }
      }
      console.log('提交后的', this.createForm)
      this.dialogpeItem = false
    },
    // 打开所有就诊人弹窗
    openAddPatientModal() {
      this.$emit('openAllPatientDailog')
    },
    // 绑定终端二级联动
    bindPadTwoLevel(item, param) {
      let twoLevelList = []
      let twoLevelName = ''
      // 选中项的对应二级列
      for (let i = 0; i < item.list.length; i++) {
        const itemChild = item.list[i]
        if (Number(itemChild.id) === param) {
          twoLevelName = itemChild.twoLevelName
          twoLevelList = itemChild.twoLevelList
        }
      }
      const dataList = this.formData.list
      for (let index = 0; index < dataList.length; index++) {
        const element = dataList[index]
        if (element.name === twoLevelName) {
          element.list = twoLevelList
        }
      }
    },
    // picker控制其它项显示或隐藏
    pickerCtrlShowOrHide(list, currentListChild) {
      // 显示隐藏联动
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (element.name !== null && element.name !== '') {
          if (element.pshow == null && element.pshowval == null) {
            element.pshow = ''
            element.pshowval = ''
          }
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
                  break
                } else {
                  element.isdisplay = true
                }
              }
            }
          }
        }
      }
    },
    // 证件类型显示隐藏联动
    pickerDocumentShowOrHide(list, currentListChild) {
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
    // 控制单选与子级关联
    changeHandler(list, item) {
      for (let index = 0; index < list.length; index++) {
        const eitem = list[index]
        if (eitem.pshow === item.name) {
          // console.log(item.value, Number(eitem.pshowval))
          if (Number(eitem.pshowval) === item.value) {
            eitem.isdisplay = false
          } else {
            eitem.isdisplay = true
          }
        }
      }
    },
    // 格式化数据
    arrangement(Data) {
      let twoLevelChildName = ''
      let twoLevelChildList = []
      for (let index = 0; index < Data.length; index++) {
        const oldValue = Data[index].value
        const dataIndex = Data[index]
        if (dataIndex.type != 'radio' && oldValue === 0) {
          dataIndex.value = null
        }
        // 将checkbox的showvalue的改为空数组，提交时再由showvaluevalue转为字符串
        if (dataIndex.type === 'checkbox') {
          let arr = []
          if (dataIndex.value != null) {
            arr = dataIndex.value.split(',')
          }
          dataIndex.showvalue = arr
          // console.log(dataIndex.showvalue)
        }
        // 将接口中的value改为null
        if (
          dataIndex.type === 'radio' &&
          oldValue === 0 &&
          dataIndex.name === 'PatientGenderId'
        ) {
          dataIndex.value = null
        }
        // 循环从接口中获取患者信息回填
        // if (Data[index].name === 'PatientId') {
        //   this.getPatientList().then((res) => {
        //     Data[index].list = res
        //     // console.log(res);
        //   })
        // }
        // 二级联动将父级项填到子级
        if (dataIndex.type === 'twolevel') {
          const childIndex = Number(dataIndex.value)
          const dataList = dataIndex.list
          dataList.forEach((element) => {
            if (Number(element.id) === childIndex) {
              twoLevelChildName = element.twoLevelName
              twoLevelChildList = element.twoLevelList
            }
          })
        }
        if (
          dataIndex.name === twoLevelChildName &&
          twoLevelChildName.length > 0
        ) {
          dataIndex.list = twoLevelChildList
        }
        // transfer框添加数据
        if (dataIndex.type === 'multipleLookUp') {
          let dialogpeformTransShowValue = []
          const newArr = []
          if (dataIndex.value != null && dataIndex.value.length > 0) {
            dialogpeformTransShowValue = dataIndex.value.split(',')
          }
          dataIndex.transferValue = dialogpeformTransShowValue
          dataIndex.searchFormTransferData = dataIndex.list.map((list) => {
            return {
              key: list.id,
              label: list.name
            }
          })
          for (let q = 0; q < dialogpeformTransShowValue.length; q++) {
            const valueArrChild = dialogpeformTransShowValue[q]
            for (let i = 0; i < dataIndex.list.length; i++) {
              const vdataIndexListChild = dataIndex.list[i]
              if (valueArrChild === vdataIndexListChild.id) {
                newArr.push(vdataIndexListChild.name)
              }
            }
          }
          dataIndex.dialogpeformTransShowValue = newArr
        }
      }
      // console.log(Data)
      return Data
    },
    // 获取所有可用就诊人集合
    async getPatientList() {
      let data = []
      await getAllPatientList().then((res) => {
        data = res.Data
      })
      return data
    },
    // 判断是否有今天之前的任务
    checkIsExistPreviousTask() {
      // 根据formdata的value值来判断有没有填时间或勾选
      const data = this.formData.list
      let followVisitPlanId = null
      let benchmarkDate = null
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.name === 'FollowVisitPlanId') {
          followVisitPlanId = element.value
        } else if (element.name === 'BenchmarkDate') {
          benchmarkDate = element.value
        }
      }
      if (
        followVisitPlanId !== 0 &&
        followVisitPlanId != null &&
        benchmarkDate != null
      ) {
        this.isExistPreviousTask(followVisitPlanId, benchmarkDate)
      }
    },
    // 判断是否有今天之前的任务
    isExistPreviousTask(followVisitPlanId, benchmarkDate) {
      const param = {
        followVisitPlanId,
        benchmarkDate
      }
      isExistPreviousTask(param).then((res) => {
        const { Data } = res
        this.showIsGenerateByOverTime = Data
        this.showIsGenerateByOverTimeShow(this.showIsGenerateByOverTime)
      })
    },
    // 判断是否有今天之前的任务输入框展示
    showIsGenerateByOverTimeShow(boolean) {
      const data = this.formData.list
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.name === 'IsGenerateByOverTime') {
          element.isdisplay = !boolean
        }
      }
    },
    // 获取表单数据
    getFormData() {
      // console.log(this.formData.list)
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          const data = this.formData.list
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            if (item.name !== '') {
              if (item.type === 'checkbox') {
                item.value = item.showvalue.join(',')
              }
              this.submitData[item.name] = item.value
            }
          }
          const params = Object.assign(this.submitData, {
            operatTypeId: this.operatTypeId
          })
          // console.log('提交的数据', params)
          this.$emit('postCreateCaseJoinFollowVisit', params)
        } else {
          return false
        }
      })
    },
    // 表单重置
    resetForm() {
      this.$refs.createForm.resetFields()
    },
    // DatePicker组件根据出生日期自动填写患者信息
    dateChange(data, value) {
      const Age = checkAgeByBirthday(value)
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.name == 'PatientAge') {
          element.value = Number(Age)
        }
      }
    },
    // 根据身份证自动填写患者信息
    checkAgeAndSexByIdcard(data, idCard) {
      const age = checkAgeByIdcard(idCard)
      const sex = checkSexByIdcard(idCard)
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.name == 'PatientAge') {
          element.value = Number(age)
        }
        if (element.name == 'PatientGenderId') {
          element.value = sex
        }
        this.checkInputValue(data, idCard)
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
    // 自定义校验规则:手机号
    validMobileNumberData(rule, value, callback) {
      if (!validMobileNumber(value)) {
        return callback(new Error('请输入正确的手机号'))
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
    }
  }
}
</script>
<style lang="scss" scope>
@import '~@/styles/variables.scss';
.form-item-tit {
  color: $bg;
  margin-bottom: 22px;
}
.form-transfer-div-disabled {
  background-color: #f5f7fa;
  color: #c0c4cc;
  border-color: #e4e7ed;
}
</style>
