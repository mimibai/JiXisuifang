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
          :style="
            item.type == 'display' || item.isdisplay == true
              ? 'display:none'
              : ''
          "
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
            <el-form-item
              v-if="item.type == 'text'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
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
                :size="createFormInputSize"
                style="max-width: 200px"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'textarea'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
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
                :size="createFormInputSize"
                style="max-width: 200px"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'radio'"
              :label="item.title"
              :style="item.isdisplay ? 'display:none' : ''"
              :rules="{
                required: item.isMust,
              }"
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
            <el-form-item
              v-if="item.type == 'picker'"
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
            <!-- <el-form-item
              v-if="item.type == 'picker' && item.name == 'PatientId'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'blur',
              }"
              :class="
                item.name == 'PatientId'? 'hasSearchInput' : ''
              "
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                filterable
                :label="item.title"
                :size="createFormInputSize"
              >
                <el-option
                  v-for="itemChild in item.list"
                  :key="itemChild.id"
                  :label="itemChild.name"
                  :value="Number(itemChild.id)"
                />
              </el-select>
              <el-button
                type="primary"
                size="mini"
                style="margin-left: 15px"
                icon="el-icon-search"
                @click.native="openAddPatientModal"
              />
            </el-form-item> -->
            <el-form-item
              v-if="item.type == 'pickerTime'"
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
                style="width: 200px"
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
                style="width: 200px"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :size="createFormInputSize"
                :picker-options="pickerOptions"
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
                @change="bindPadTwoLevel(item, item.value)"
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
              v-if="item.type == 'number' && item.name=='Score'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="[{
                required: item.isMust,
                message: item.title + '不能为空',
              },{ trigger: 'blur', validator: validPositiveNumberData },]"
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                :size="createFormInputSize"
                style="max-width: 200px"
              />
            </el-form-item>

            <el-form-item
              v-if="item.type == 'checkbox' && item.name == 'SkipVoteItemIds'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: '请至少选择一个',
                trigger: 'change',
              }"
            >
              <el-checkbox-group v-model="item.value">
                <el-checkbox
                  v-for="( itemCheck, itemIndex) in item.list"
                  :key="itemCheck.id"
                  :label="String(itemCheck.id)"
                  :disabled="item.disabled"
                  style="max-width: 200px"
                >{{ itemCheck.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              v-if="item.type == 'checkbox' && item.name == 'PEItemIds'"
              :label="item.title"
              :prop="'list.' + index + '.value'"
              :rules="{
                required: item.isMust,
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
                  v-for="(peName, peIndex) in dialogpeformTransShowValue"
                  :key="peIndex"
                  class="form-transfer-peName"
                >
                  {{ peName }}
                </span>
              </div>
              <!-- start  -->
              <el-dialog
                title="请选择体检项"
                :visible.sync="dialogpeItem"
                width="45%"
                append-to-body
                class="gggg"
              >
                <el-transfer
                  v-model="dialogpeItemValue"
                  :titles="dialogpeTransferTit"
                  filterable
                  filter-placeholder="请输入体检项"
                  :data="dialogpeItemTransferData"
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
                    @click="peItemDialogSubmit(item)"
                  >确 定</el-button>
                </span>
              </el-dialog>
              <!-- end -->
            </el-form-item>

          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getAllPatientList } from '@/api/doctor'
import { getCaseJoinVisitByPatientId } from '@/api/followVisits'
import { validPositiveNumber } from '@/utils/validate'
export default {
  name: 'PlanTaskForm',
  props: {
    createForm: Array,
    operatTypeId: Number
  },
  data() {
    return {
      createFormLabelWidth: '220px',
      formData: {
        list: this.createForm
      },
      dialogpeItem: false,
      dialogpeItemValue: [],
      dialogpeformTransShowValue: [],
      dialogpeformTransNeedValue: '',
      dialogpeItemTransferData: [],
      submitData: {}, // 提交数据
      dialogpeTransferTit: ['尚未选择', '已选择'],
      createFormInputSize: 'small ',
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }
        ]
      }
    }
  },
  watch: {
    createForm: {
      handler: function(newValue, oldValue) {
        this.formData.list = this.arrangement(newValue)
        // console.log(this.formData.list)
      },
      immediate: true
    }
  },
  methods: {
    // 自定义校验正数
    validPositiveNumberData(rule, value, callback) {
      if (!validPositiveNumber(value)) {
        return callback(new Error('请输入正确的数值'))
      } else {
        return callback()
      }
    },
    // openAddPatientModal() {
    //   this.$emit('openAllPatientDailog')
    // },
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
    // 控制单选与子级关联
    changeHandler(list, item) {
      for (let index = 0; index < list.length; index++) {
        const eitem = list[index]
        if (eitem.pshow === item.name) {
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
      let patientId = null
      for (let index = 0; index < Data.length; index++) {
        const element = Data[index]
        const oldValue = element.value

        if (element.type !== 'radio' && oldValue === 0) {
          element.value = null
        }
        // 循环从接口中患者信息进行查找并回填
        if (element.name === 'PatientId') {
          // this.getPatientList().then((res) => {
          //   element.list = res
          // })
          patientId = element.value
        }
        // 体检项过多，改为特殊弹窗显示
        if (element.name === 'PEItemIds' && element.value !== null) {
          const valueArr = element.value.split(',')
          const listArr = element.list
          if (valueArr.length > 0) {
            const dresArr = []
            const idsArr = []
            for (let b = 0; b < valueArr.length; b++) {
              const valueItem = valueArr[b]
              for (let c = 0; c < listArr.length; c++) {
                const listItem = listArr[c]
                if (valueItem === listItem.id) {
                  dresArr.push(listItem.name)
                  idsArr.push(listItem.id)
                }
              }
            }
            this.dialogpeformTransShowValue = dresArr
            this.dialogpeformTransNeedValue = idsArr.join(',')
          }

          // this.getPatientList().then((res) => {
          //   element.list = res
          //   // console.log(res);
          // })
        }
        // 从接口中查找获取当前就诊人下运行中参与随访方案记录并回填
        if (
          element.name === 'CaseJoinFollowVisitId' &&
          element.type !== '' &&
          patientId !== null
        ) {
          this.getCaseJoinVisitByPatientId(patientId).then((res) => {
            element.list = res
            // console.log(res)
            if (res.length < 2) {
              element.value = 0
            }
          })
        }
        // 二级联动将父级项填到子级
        if (element.type === 'twolevel') {
          const childIndex = Number(element.value)
          const dataList = element.list
          dataList.forEach((element) => {
            if (Number(element.id) === childIndex) {
              twoLevelChildName = element.twoLevelName
              twoLevelChildList = element.twoLevelList
            }
          })
        }
        if (
          element.name === twoLevelChildName &&
          twoLevelChildName.length > 0
        ) {
          element.list = twoLevelChildList
        }
      }
      // console.log(Data);
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
    // 获取就诊人可用随访方案集合
    async getCaseJoinVisitByPatientId(patientId) {
      let data = []
      await getCaseJoinVisitByPatientId({ patientId }).then((res) => {
        data = res.Data.map((list) => {
          return {
            id: list.id,
            name: list.name
          }
        })
      })
      return data
    },
    // picker控制其它项显示或隐藏
    pickerCtrlShowOrHide(list, currentListChild) {
      // 显示隐藏联动
      // console.log(list)
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        // let pshowItemName = "";
        // let pshowvalItemChild="";
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
            // console.log(currentListChild.name == pshowItem);
            // for (let j = 0; j < pshowvalItemArr.length; j++) {
            //   const pshowvalItemChild = pshowvalItemArr[j];
            //   if (currentListChild.name == pshowItem) {
            //     if (currentListChild.value == Number(pshowvalItemChild)) {
            //       element.isdisplay = false;
            //       break;
            //     } else {
            //       element.isdisplay = true;
            //       console.log(element);
            //     }
            //   }
            // }
          }
        }
      }
    },
    // 打开体检项弹窗
    peItemDialog(formItem) {
      // console.log(formItem)
      const dataList = formItem.list
      const { disabled } = formItem
      if (disabled === false) {
        this.dialogpeItemTransferData = dataList.map((list) => {
          return {
            key: list.id,
            label: list.name
          }
        })
        this.dialogpeItem = true
      } else {
        return false
      }
    },
    peItemDialogSubmit(formItem) {
      const valueArr = this.dialogpeItemValue
      this.dialogpeformTransNeedValue = valueArr.join(',')
      const dataList = formItem.list
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
      this.dialogpeformTransShowValue = newArr
      console.log('333', newArr)
      this.dialogpeItem = false
    },
    // 获取表单数据后提交
    getFormData() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          const data = this.formData.list
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            if (item.name !== '') {
              if (item.name === 'PEItemIds') {
                // 体检项改为对应value
                this.submitData[item.name] = this.dialogpeformTransNeedValue
                console.log('111', this.dialogpeformTransNeedValue)
              } else if (item.type === 'radio' && item.list.length < 3) {
                if (Number(item.value) === 0) {
                  this.submitData[item.name] = false
                } else if (Number(item.value) === 1) {
                  this.submitData[item.name] = true
                }
              } else {
                this.submitData[item.name] = item.value
              }
            }
          }
          if (this.operatTypeId) {
            this.submitData = Object.assign(this.submitData, {
              operatTypeId: this.operatTypeId
            })
          }
          console.log('222', this.dialogpeformTransNeedValue)
          console.log('333', this.submitData)
          this.$emit('postAddFollowVistPlan', this.submitData)
          this.$emit('postAddFollowVistTask', this.submitData)
        } else {
          return false
        }
      })
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
.form-transfer-div {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  display: inline-block;
  box-sizing: border-box;
  padding: 0 15px;
  min-height: 32px;
  line-height: 32px;
  width: 200px;
}
.form-transfer-div-disabled {
  background-color: #f5f7fa;
  color: #c0c4cc;
  border-color: #e4e7ed;
}
.form-transfer-peName {
  display: inline-block;
  padding: 0 5px;
}
</style>

