<template>
  <div>
    <el-form
      ref="dynamicValidateForm"
      :model="formData"
      label-width="150px"
      class="demo-dynamic"
    >
      <div class="input-content">
        <div
          v-for="(item, index) in formData.formItems"
          :key="item.name"
          class="input-content-items"
          :style="item.type == 'display' || item.type == null || item.isdisplay == true ? 'display:none' : ''"
        >
          <el-form-item
            v-if="item.type == 'display'"
            style="display: none"
            :label="item.title + '：'"
            :prop="'formItems.' + index + '.value'"
            :rules="{
              required: true,
              message: item.title + '不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="item.value" />
          </el-form-item>
          <template v-if="!item.isdisplay">
            <div>
              <el-form-item
                v-if="item.type == 'text' && item.name !== 'GuardianPassportNum'&& item.name !== 'GuardianFPerManentResidentNum'&& item.name !== 'GuardianMilitaryOfficerNum'&& item.name !== 'GuardianHKAndMacaoPermitNum'&& item.name !== 'GuardianMTPsNum'&&item.name !== 'GuardianHKAndMacaoAndMTPsResidenceNum'&& item.name !== 'GuardianNDToHKAndMacaoPermitNum'"
                :label="item.title + '：'"
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
              <!-- 护照 -->
              <el-form-item
                v-if="item.name == 'GuardianPassportNum'"
                :label="item.title + '：'"
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
                />
              </el-form-item>
              <!-- 军官证 -->
              <el-form-item
                v-if="item.name == 'GuardianMilitaryOfficerNum'"
                :label="item.title + '：'"
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
                />
              </el-form-item>
              <!-- 港澳居民来往内地通行证 -->
              <el-form-item
                v-if="item.name == 'GuardianHKAndMacaoPermitNum'"
                :label="item.title + '：'"
                :prop="'formItems.' + index + '.value'"
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
                />
              </el-form-item>
              <!-- 内地前往港澳台通行证 -->
              <el-form-item
                v-if="item.name == 'GuardianNDToHKAndMacaoPermitNum'"
                :label="item.title + '：'"
                :prop="'formItems.' + index + '.value'"
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
                />
              </el-form-item>
              <!-- 外国人永久居留身份证 -->
              <el-form-item
                v-if="item.name == 'GuardianFPerManentResidentNum'"
                :label="item.title + '：'"
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
                />
              </el-form-item>
              <!-- 台湾居民来往大陆通行证 -->
              <el-form-item
                v-if="item.name == 'GuardianMTPsNum'"
                :label="item.title + '：'"
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
                />
              </el-form-item>
              <!-- 台湾居民来往大陆通行证 -->
              <el-form-item
                v-if="item.name == 'GuardianHKAndMacaoAndMTPsResidenceNum'"
                :label="item.title + '：'"
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
                />
              </el-form-item>
              <el-form-item
                v-if="item.type == 'idcard'"
                :label="item.title + '：'"
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
                />
              </el-form-item>
              <el-form-item
                v-if="item.type == 'phone' && item.name == 'MobileNumber'"
                :label="item.title + '：'"
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
                />
              </el-form-item>
              <el-form-item
                v-if="item.type == 'phone' && item.name != 'MobileNumber'"
                :label="item.title + '：'"
                :prop="'formItems.' + index + '.value'"
                :rules="[
                  { required: item.isMust, message: item.title + '不能为空' },
                ]"
              >
                <el-input
                  v-model="item.value"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder"
                />
              </el-form-item>
              <el-form-item
                v-if="item.type == 'picker'"
                :label="item.title + '：'"
                :rules="[
                  {
                    required: item.isMust,
                    message: item.title + '不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-select
                  v-model="item.value"
                  :placeholder="item.placeholder"
                  :disabled="item.disabled"
                  @change="pickerCtrlShowOrHide(formData.formItems,item)"
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
                :label="item.title + '：'"
                :prop="'formItems.' + index + '.value'"
                :rules="{
                  required: item.isMust,
                  message: item.title + '不能为空',
                  trigger: 'blur',
                }"
              >
                <el-cascader
                  v-model="item.value"
                  :class="item.addClass"
                  :disabled="item.disabled"
                  :props="ganged"
                  :placeholder="item.placeholder"
                  @change="cascaderChange"
                />
              </el-form-item>
              <el-form-item
                v-if="item.type == 'radio'"
                :label="item.title + '：'"
                :rules="{
                  required: item.isMust,
                  trigger: 'change'
                }"
              >
                <el-radio-group v-model="item.value">
                  <el-radio
                    v-for="(itemChild,itemIndex) in item.list"
                    :key="itemIndex"
                    :label="Number(itemChild.id)"
                    :disabled="item.disabled"
                  >{{ itemChild.name }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </template>
        </div>
      </div>
      <div v-if="showSubmit">
        <p class="mine-container-patient-tips">
          注意：*为必填项，确保个人基本信息填写无误方可提交
        </p>
        <div style="text-align: center">
          <el-button
            type="primary"
            :loading="btnLoading"
            style="width: 200px"
            @click="onSubmit"
          >提交</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getProvinceList, getCityList, getCountyList } from '@/api/region'
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
  props: {
    formItems: Array,
    btnLoading: Boolean,
    showSubmit: Boolean
  },
  data() {
    return {
      formData: {
        formItems: []
      },
      provinceName: '',
      cityName: '',
      countyName: '',
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
      },
      regionObj: {},
      submitData: {} // 用于提交表单信息到后台
    }
  },
  watch: {
    formItems() {
      this.formData.formItems = this.formatData(this.formItems)
    }
  },
  methods: {
    // 格式数据
    formatData(Data) {
      for (let index = 0; index < Data.length; index++) {
        let oldTit = Data[index].title
        // 循环去掉title中的无意义字符
        if (oldTit != null) {
          oldTit = oldTit.substring(0, oldTit.length - 1)
        }
        Data[index].title = oldTit
        // 循环将数据中picker类型的默认key转为value
        if (Data[index].type === 'picker') {
          const sList = Data[index].list
          const oldValue = Data[index].value
          if (oldValue != null) {
            if (oldValue === 0 || oldValue == null) {
              Data[index].value = null
            } else {
              for (let i = 0; i < sList.length; i++) {
                const items = sList[i]
                if (oldValue === Number(items.id)) {
                  Data[index].value = items.id
                }
              }
            }
          }
        }
        if (Data[index].type === 'regionSelect') {
          const nameArr = Data[index].value.split(',')
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
        }
      }
      return Data
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
          if (element.value === 0 && element.name === currentListChild.name) {
            element.value = null
          }
          if (element.pshow === currentListChild.name) {
            // 下拉框切换将关联项清空
            console.log('触发了2')
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
        }
      }
    },
    // cascaderChange;
    cascaderChange(e) {
      console.log(this)
    },
    // 表单提交
    onSubmit() {
      this.$refs.dynamicValidateForm.validate((valid) => {
        if (valid) {
          // 拼接
          const data = this.formData.formItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            // regionSelect的name为多个字段拼接而成，需分割
            // console.log(item)
            if (item.type === 'regionSelect') {
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
                  this.regionObj[nameArr[i]] = valueArr[i]
                }
              }
            } else {
              this.submitData[item.name] = item.value
            }
          }
          this.submitData = Object.assign(this.submitData, this.regionObj)
          this.$emit('submitForm', this.submitData)
          // 提交
        }
      })
    },
    // 获取省市县
    async getProvinceData(arr) {
      // 后台数据为0是“请选择..”所以跳过
      if (Number(arr[0]) === 0) {
        return false
      } else {
        let provinceId = 0
        let provinceName = ''
        let newArr = []
        await getProvinceList().then((response) => {
          const { Data } = response
          provinceId = Number(arr[0])
          for (let index = 0; index < Data.length; index++) {
            const eProvince = Data[index]
            if (eProvince.provinceId === provinceId) {
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
          if (eCity.cityId === cityId) {
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
          if (eCounty.countyId === countyId) {
            countyName = eCounty.Name
          }
        }
      })
      return countyName
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
.sepcialInput .el-input__inner::-webkit-input-placeholder {
  color: #606266;
}
</style>
<style lang="scss" scoped>
.input-content {
  display: flex;
  flex-wrap: wrap;
  &-items {
    width: 50%;
    padding: 0px 20px;
  }
}
.mine-container-patient-tips {
  font-size: 12px;
  text-align: center;
  color: #d9001b;
  margin-bottom: 25px;
}
</style>
