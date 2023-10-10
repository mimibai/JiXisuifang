<template>
  <div
    v-loading="mainLoading"
    class="taskVisit"
  >
    <el-form
      ref="taskVisitForm"
      :model="formData"
      label-width="200px"
    >
      <div class="input-content">
        <div
          v-for="(item, index) in formData.formItems"
          :key="item.name + index"
          :class="item.type == null ? 'input-content-items itemsW': 'input-content-items'"
          :style="
            item.type == 'display' ||
              item.isdisplay == true
              ? 'display:none'
              : ''
          "
        >
          <div v-if="item.type == null">
            <h5>{{ item.title }}</h5>
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
            <el-form-item
              v-if="item.type == 'text'"
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
                size="mini"
              />
            </el-form-item>
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
                :disabled="item.disabled"
                :autosize="{ minRows: 2, maxRows: 5}"
                :placeholder="item.placeholder"
                size="mini"
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
                @change="pickerCtrlShowOrHide(formData.formItems,item)"
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
              v-if="item.type == 'checkbox' && item.name == 'PEItemIds'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
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
              <el-dialog
                title="请选择体检项"
                :visible.sync="dialogpeItem"
                width="40%"
                append-to-body
                center
              >
                <div style="text-align: center">
                  <el-transfer
                    style="text-align: left; display: inline-block"
                    v-model="dialogpeItemValue"
                    :titles="dialogpeTransferTit"
                    filterable
                    filter-placeholder="请输入体检项"
                    :data="dialogpeItemTransferData"
                  />
                  <span
                    class="csdf"
                    :title="option.label"
                    slot-scope="{option}"
                  >{{ option.label }}</span>
                  </el-transfer>
                </div>
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
            </el-form-item>
            <el-form-item
              v-if="item.type == 'picker'"
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
                size="mini"
                @change="pickerCtrlShowOrHide(formData.formItems,item),pickerCtrlIsMust(formData.formItems,item)"
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
                :class="item.addClass"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                size="mini"
                :props="ganged"
              />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div class="dialog-footer">
      <el-button
        :loading="buttonLoading"
        type="primary"
        @click="taskFormSubmit()"
      >保存</el-button>
      <el-button @click="goBack">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { createVisitTaskGet, createVisitTaskPost } from '@/api/followVisits'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      formData: {
        formItems: [], // 新建随访方案集合
      },
      submitData: {}, // 用于提交表单信息到后台
      mainLoading: true,
      buttonLoading: false,
      operatTypeId: null,
      dialogpeformTransNeedValue: [],
      dialogpeformTransShowValue: [],
      dialogpeItemTransferData: [],
      dialogpeItem: false,
      dialogpeItemValue: [],
      dialogpeTransferTit: ['尚未选择', '已选择'],
      ExecutiveIdArr: null,
      TaskTypeIdArr: null,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const params = this.$route.query
      this.operatTypeId = params.operatTypeId
      createVisitTaskGet(params).then((res) => {
        const { Data } = res
        this.formData.formItems = Data
        // 判断类型为picker的下拉框将其value改为空
        const taskFormItem = this.formData.formItems
        for (let index = 0; index < taskFormItem.length; index++) {
          const item = taskFormItem[index]
          if (item.type === 'picker' && item.value === 0) {
            item.value = null
          } else if (item.name === 'PEItemIds') {
            const dataList = item.list
            if (item.value) {
              const valueArr = item.value.split(',')
              this.dialogpeformTransNeedValue = valueArr.join(',')
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
            }
          }
        }
        this.mainLoading = false
      })
    },
    pickerCtrlShowOrHide(list, currentListChild) {
      // 显示隐藏联动
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        // let pshowItemName = "";
        // let pshowvalItemChild="";
        if (element.name !== null && element.name !== '') {
          if (element.pshow === null && element.pshowval === null) {
            element.pshow === ''
            element.pshowval === ''
          }
          if (element.pshow && element.pshowval) {
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
                    // element.isMust = true
                    break
                  } else {
                    element.isdisplay = true
                    // element.isMust = false
                  }
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
    pickerCtrlIsMust(list, currentListChild) {
      if (currentListChild.name === 'ExecutiveId') {
        this.ExecutiveIdArr = currentListChild.value
      } else if (currentListChild.name === 'TaskTypeId') {
        this.TaskTypeIdArr = currentListChild.value
      }
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (
          this.ExecutiveIdArr === 1 &&
          this.TaskTypeIdArr === 1 &&
          element.name === 'PatientForVoteId'
        ) {
          element.isMust = true
        } else if (
          this.ExecutiveIdArr === 2 &&
          this.TaskTypeIdArr === 1 &&
          element.name === 'DoctorForVoteId'
        ) {
          element.isMust = true
        } else if (
          this.ExecutiveIdArr === 1 &&
          this.TaskTypeIdArr === 3 &&
          element.name === 'PEPackgeId'
        ) {
          element.isMust = true
        } else if (
          this.ExecutiveIdArr === 1 &&
          this.TaskTypeIdArr === 3 &&
          element.name === 'PatientPENotInOurHosForVoteId'
        ) {
          element.isMust = true
        } else if (
          this.ExecutiveIdArr === 2 &&
          this.TaskTypeIdArr === 3 &&
          element.name === 'PEPackgeId'
        ) {
          element.isMust = true
        }
      }
    },
    // 打开体检项弹窗
    peItemDialog(formItem) {
      const dataList = formItem.list
      const { disabled } = formItem
      if (disabled === false) {
        this.dialogpeItemTransferData = dataList.map((list) => {
          return {
            key: list.id,
            label: list.name,
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
      this.dialogpeItem = false
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    taskFormSubmit() {
      this.$refs.taskVisitForm.validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const data = this.formData.formItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            if (item.name !== '') {
              if (item.name === 'PEItemIds') {
                // 体检项改为对应value
                this.submitData[item.name] = this.dialogpeformTransNeedValue
              } else {
                this.submitData[item.name] = item.value
              }
            }
          }
          // 编辑时需要传operatTypeId
          const operatData = { operatTypeId: this.operatTypeId }
          this.submitData = Object.assign(this.submitData, operatData)
          console.log(this.submitData)
          createVisitTaskPost(this.submitData)
            .then((res) => {
              const { Code } = res
              if (Code === 1) {
                // 添加完毕后刷新数据
                this.getData()
                if (this.operatTypeId === 3) {
                  Message({
                    message: '随访任务修改成功！',
                    type: 'success',
                    duration: 5 * 1000,
                  })
                } else {
                  Message({
                    message: '随访任务添加成功！',
                    type: 'success',
                    duration: 5 * 1000,
                  })
                }
                this.$router.push({
                  name: 'schemePlan',
                })
              }
              this.buttonLoading = false
            })
            .catch((err) => {
              console.log(err)
              this.buttonLoading = false
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.taskVisit {
  width: 80%;
  margin: 0 auto;
  padding: 50px;
}
.input-content {
  &-items {
    width: fit-content;
    min-width: 50%;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 10px;
    .el-form-item {
      .checkbox-con {
        max-height: 200px;
        overflow-y: auto;
      }
    }
    &.itemsW {
      width: 100%;
      color: #b2642a;
      font-size: 20px;
      text-align: center;
      line-height: 40px;
      background: #fbfbfb;
      margin-bottom: 20px;
    }
    .el-select {
      width: 100%;
    }
  }
}
.dialog-footer {
  text-align: center;
  margin-top: 22px;
}
.form-transfer-div {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  display: inline-block;
  box-sizing: border-box;
  padding: 0 15px;
  min-height: 32px;
  line-height: 32px;
  width: 100%;
}
.form-transfer-peName {
  display: inline-block;
  padding: 0 5px;
}
</style>
