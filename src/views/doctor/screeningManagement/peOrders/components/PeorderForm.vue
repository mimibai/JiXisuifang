<template>
  <div>
    <el-form
      ref="createPeorderForm"
      :model="formData"
      label-width="120px"
      class="demo-dynamic"
    >
      <div class="input-content">
        <div
          v-for="(item, index) in formData.formItems"
          :key="index"
          class="input-content-items"
          :style="
            item.type == 'display' ||
              item.type == null ||
              item.isdisplay == true
              ? 'display:none'
              : ''
          "
        >
          <div v-if="item.type == null">
            <h5>{{ item.title }}：</h5>
          </div>
          <div v-else>
            <el-form-item
              v-if="item.type == 'display'"
              style="display: none"
              :label="item.title"
            >
              <el-input
                v-model="item.value"
                size="mini"
              />
            </el-form-item>
            <!-- text文本 姓名单独验证 -->
            <el-form-item
              v-if="item.type == 'text' && item.name =='Name'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="[{
                required: item.isMust,
                message: item.title + '不能为空',
              },{ trigger: 'blur', validator: validFullNameData }]"
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
              <el-button
                v-if="item.name == 'Name'"
                type="primary"
                size="mini"
                style="margin-left: 15px"
                icon="el-icon-search"
                @click.native="openAddPatientModal"
              />
            </el-form-item>
            <!-- text文本 -->
            <el-form-item
              v-if="item.type == 'text' && item.name !='Name' && item.name !='HKAndMacaoPermitNum' && item.name !='MTPsNum' && item.name !='HKAndMacaoAndMTPsResidenceNum' && item.name !='FPerManentResidentNum' && item.name !='PassportNum' && item.name !='MilitaryOfficerNum'&& item.name !='NDToHKAndMacaoPermitNum'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="[{
                required: item.isMust,
                message: item.title + '不能为空',
              },{ trigger: 'blur' }]"
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
            <!-- 护照 -->
            <el-form-item
              v-if="item.name == 'PassportNum' && !item.isdisplay"
              :label="item.title "
              :prop="'formItems.' + index + '.value'"
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
                @blur="checkInputValue(formData.formItems,item)"
              />
            </el-form-item>
            <!-- 军官证 -->
            <el-form-item
              v-if="item.name == 'MilitaryOfficerNum' && !item.isdisplay"
              :label="item.title "
              :prop="'formItems.' + index + '.value'"
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
                @blur="checkInputValue(formData.formItems,item)"
              />
            </el-form-item>
            <!-- 港澳居民来往内地通行证 -->
            <el-form-item
              v-if="item.name == 'HKAndMacaoPermitNum' && !item.isdisplay"
              :label="item.title "
              :prop="'formItems.' + index + '.value'"
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
                @blur="checkInputValue(formData.formItems,item)"
              />
            </el-form-item>
            <!-- 内地居民往来港澳通行证 -->
            <el-form-item
              v-if="item.name == 'NDToHKAndMacaoPermitNum' && !item.isdisplay"
              :label="item.title "
              :prop="'formItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
                { trigger: 'blur' , validator: validNDToHKAndMacaoPermitNumData},
              ]"
            >
              <el-input
                v-model="item.value"
                :name="item.pshowval"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                size="mini"
                style="max-width: 200px"
                @blur="checkInputValue(formData.formItems,item)"
              />
            </el-form-item>
            <!-- 外国人永久居留身份证 -->
            <el-form-item
              v-if="item.name == 'FPerManentResidentNum' && !item.isdisplay"
              :label="item.title "
              :prop="'formItems.' + index + '.value'"
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
                @blur="checkInputValue(formData.formItems,item)"
              />
            </el-form-item>
            <!-- 台湾居民来往大陆通行证 -->
            <el-form-item
              v-if="item.name == 'MTPsNum' && !item.isdisplay"
              :label="item.title "
              :prop="'formItems.' + index + '.value'"
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
                @blur="checkInputValue(formData.formItems,item)"
              />
            </el-form-item>
            <!-- 港澳台居民居住证 -->
            <el-form-item
              v-if="item.name == 'HKAndMacaoAndMTPsResidenceNum' && !item.isdisplay"
              :label="item.title "
              :prop="'formItems.' + index + '.value'"
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
                @blur="checkInputValue(formData.formItems,item)"
              />
            </el-form-item>
            <!-- 数字文本 -->
            <el-form-item
              v-if="item.type == 'number'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
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
            <!-- 文本域 -->
            <el-form-item
              v-if="item.type == 'textarea'"
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
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                size="small"
                style="max-width: 200px"
              />
            </el-form-item>
            <!-- 身份证号 -->
            <el-form-item
              v-if="item.type == 'idcard' && !item.isdisplay"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
                { trigger: 'blur', validator: validIdCardNumberData },
              ]"
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                size="small"
                style="max-width: 200px"
                @blur="checkAgeAndSexByIdcard(formData.formItems,item.value)"
              />
            </el-form-item>
            <!-- 联系电话 -->
            <el-form-item
              v-if="item.type == 'phone'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
                { trigger: 'blur', validator: validMobileNumberData },
              ]"
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
              :label="item.title + '：'"
              :prop="'formItems.' + index + '.value'"
              :style="item.isdisplay ? 'display:none' : ''"
              :rules="{ required: item.name=='Sex'?true:item.isMust, message: item.title + '不能为空' },"
            >
              <el-radio-group v-model="item.value">
                <el-radio
                  v-for="itemChild in item.list"
                  :key="itemChild.name"
                  :label="Number(itemChild.id)"
                  :disabled="item.disabled"
                >{{ itemChild.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- picker下拉 -->
            <el-form-item
              v-if="item.type == 'picker' && item.name != 'DocumentTypeId'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
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
              >
                <el-option
                  v-for="(itemChild,itemIndex) in item.list"
                  :key="itemIndex"
                  :label="itemChild.name"
                  :value="Number(itemChild.id)"
                />
              </el-select>
            </el-form-item>
            <!-- 证件类型 -->
            <el-form-item
              v-if="item.type == 'picker' && item.name == 'DocumentTypeId'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
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
                @change="pickerCtrlShowOrHide(formData.formItems,item)"
              >
                <el-option
                  v-for="itemChild in item.list"
                  :key="itemChild.name"
                  :label="itemChild.name"
                  :value="Number(itemChild.id)"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.type == 'pickerDate'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
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
                size="small"
                @change="dateChange(formData.formItems,item.value)"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'dynamictwolevel'&& item.name=='ReserveTime'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'blur',
              }"
              class="hasSearchInput"
            >
              <el-input
                v-model="item.value"
                :disabled="true"
                :placeholder="item.placeholder"
                size="small"
                style="max-width: 200px"
              />
              <el-button
                type="primary"
                size="mini"
                style="margin-left: 15px"
                icon="el-icon-search"
                @click.native="choosePeDate(formData.formItems)"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'twolevel'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
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
                size="small"
                @change="bindPadTwoLevel(item, item.value)"
              >
                <el-option
                  v-for="itemChild in item.list"
                  :key="itemChild.name"
                  :label="itemChild.name"
                  :value="Number(itemChild.id)"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
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
  validNDToHKAndMacaoPermitNum // 内地居民往来港澳通行证
} from '@/utils/validate'
import {
  checkAgeByIdcard,
  checkSexByIdcard,
  checkAgeByBirthday
} from '@/utils/index'
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'PeorderForm',
  props: {
    createPEReserveFormData: Array
  },
  data() {
    return {
      formData: {
        formItems: this.createPEReserveFormData
      },
      hospitalId: 200 // 医院id，默认200
    }
  },
  watch: {
    createPEReserveFormData() {
      this.formData.formItems = this.createPEReserveFormData
    }
  },
  created() {},
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
    // 打开所有就诊人弹窗
    openAddPatientModal() {
      this.$emit('openAllPatientDailog')
    },
    // 选择预约时间
    choosePeDate(data) {
      // 必须选择完套餐后才可获取时间
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.name == 'PEPackageId') {
          if (element.value != null) {
            // 下一步
            const param = {
              pePackageId: element.value,
              hospitalId: this.hospitalId
            }
            this.$emit('openChooseDateDailog', param)
          } else {
            Message({
              message: '请先选择体检套餐！',
              type: 'error',
              duration: 5 * 1000
            })
            break
          }
        }
      }
    },
    // DatePicker组件根据出生日期自动填写患者信息
    dateChange(data, value) {
      const Age = checkAgeByBirthday(value)
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.name == 'Age') {
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
        if (element.name == 'Age') {
          element.value = Number(age)
        }
        if (element.name == 'Sex') {
          element.value = sex
        }
        this.checkInputValue(data, idCard)
      }
    },
    // 表单验证并提交
    valiForm() {
      this.$refs.createPeorderForm.validate((valid) => {
        if (valid) {
          // 格式表单数据
          const DATA = this.formData.formItems
          const submitData = {}
          for (let index = 0; index < DATA.length; index++) {
            const element = DATA[index]
            submitData[element.name] = element.value
          }
          // console.log(submitData)
          this.$emit('postCreatePEReserveByDoctor', submitData)
        } else {
          return false
        }
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
    },
    // 自定义校验规则:内地居民往来港澳通行证
    validNDToHKAndMacaoPermitNumData(rule, value, callback) {
      if (!validNDToHKAndMacaoPermitNum(value)) {
        return callback(new Error('请输入正确的内地居民往来港澳通行证'))
      } else {
        return callback()
      }
    },
    // 解决页面刷新出现表单验证bug，数据加载完毕清除表单验证。
    clearVali() {
      this.$refs.createPeorderForm.clearValidate()
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-dropDowm {
  margin-left: 10px;
}
.el-form-item.hasSearchInput {
  div {
    width: calc(100% - 60px);
  }
}
</style>
