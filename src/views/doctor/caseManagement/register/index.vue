<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="mine-container-patient">
      <el-form ref="formData" :model="formData" label-width="120px">
        <div class="input-content">
          <div
            v-for="(item, index) in formData.formItems"
            :key="item.id"
            :class="item.name == '' ? 'input-content-title' : ''"
            :style="(item.isdisplay ? 'display:none' : '',item.type=='upload'?'width:100%;':'')"
            class="input-content-item"
          >
            <div
              v-if="item.name == '' && item.title == '用药记录'"
              class="mine-container-patient-title"
            >
              <h4>{{ item.title }}</h4>
            </div>
            <div v-if="item.name == '' && item.title == '用药记录'">
              <el-row
                v-for="(medicaItem, medicaItemIndex) in item.childrens"
                :key="medicaItemIndex"
                class="medicaItem"
              >
                <el-col :span="20">
                  <div
                    v-for="(
                      medicaItems, medicaItemsIndex
                    ) in medicaItem.recordList"
                    :key="medicaItemsIndex"
                  >
                    <el-form-item
                      v-if="
                        medicaItems.type == 'text' && !medicaItems.isdisplay
                      "
                      :label="medicaItems.title"
                      :label-width="formLabelWidth"
                    >
                      <el-input
                        v-model="medicaItems.value"
                        :disabled="medicaItems.disabled"
                        :placeholder="medicaItems.placeholder"
                      />
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-button
                    v-if="item.childrens.length > 1 && medicaItemIndex > 0"
                    type="primary"
                    @click="deletMedicationRecordList(index, medicaItemIndex)"
                  >删除用药记录</el-button>
                </el-col>
              </el-row>
              <el-button
                type="primary"
                @click="addMedicationRecordList(index)"
              >添加用药记录</el-button>
            </div>
            <div
              v-if="item.name == '' && item.title != '用药记录'"
              class="mine-container-patient-title"
            >
              <h4>{{ item.title }}</h4>
            </div>
            <el-form-item
              v-if="item.type == 'picker' && !item.isdisplay"
              :label="item.title"
              :label-width="formLabelWidth"
              :rules="{
                required: item.isMust,
              }"
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                style="width: 100%"
                @change="pickerChange(formData.formItems, item)"
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
              v-if="item.type == 'text' && !item.isdisplay"
              :label="item.title"
              :label-width="formLabelWidth"
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
              v-if="item.type == 'display' && !item.isdisplay"
              :label="item.title"
              :label-width="formLabelWidth"
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
              v-if="item.type == 'radio' && !item.isdisplay"
              :label="item.title"
              :label-width="formLabelWidth"
              :rules="{
                required: item.isMust,
              }"
            >
              <el-radio-group
                v-model="item.value"
                @change="rideoChange(formData.formItems, item)"
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
              v-if="item.type == 'pickerDate'"
              :label="item.title"
              :label-width="formLabelWidth"
              :rules="{
                required: item.isMust,
              }"
            >
              <el-date-picker
                v-model="item.value"
                type="date"
                :placeholder="item.placeholder"
                style="width: 100%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'upload' && !item.isdisplay"
              :label="item.title"
              :label-width="formLabelWidth"
              :rules="{
                required: item.isMust,
              }"
            >
              <Upload ref="Upload" :limit="3" :file-list="item.value" />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="formSubmitLoading"
          @click="formSubmit()"
        >保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Upload from '@/components/Upload/index'
import {
  CreateInpatientRegistrationRecord,
  CreateInpatientRegistrationRecordPost
} from '@/api/records'
import { Message, MessageBox } from 'element-ui'
export default {
  components: {
    Upload
  },
  data() {
    return {
      formData: {
        formItems: [],
        MediItems: ''
      },
      SubmitData: {},
      formLabelWidth: '220px',
      loading: true, // 全局loading
      tableData: [],
      imgUrl: {},
      hasMedicationRecord: false,
      formSubmitLoading: false,
      baseUrl: ''
    }
  },
  computed: {
    uploadDisabled: function() {
      return this.imagelist.length > 0
    }
  },
  created() {
    this.getUserToken()
  },
  methods: {
    getUserToken() {
      const hasToken = getToken('userToken')
      if (hasToken) {
        this.getData()
      } else {
        // 做进一步处理
        return false
      }
    },
    getData() {
      const inpatientRecordId = this.$route.query.inpatientRecordId
      if (inpatientRecordId) {
        this.inpatientRecordId = Number(this.$route.query.inpatientRecordId)
      } else {
        this.$router.push({ path: '/doctor/caseManagement' })
        return false
      }
      const operatType = { inpatientRecordId: this.inpatientRecordId }
      CreateInpatientRegistrationRecord(operatType).then((response) => {
        const { Data } = response
        // 判断当前患者是否有用药记录
        if (Data.medicationRecordPageData) {
          this.hasMedicationRecord = true
        }
        const data = Data.registerPageData
        for (let index = 0; index < data.length; index++) {
          const oldValue = data[index].value
          if (data[index].type != 'radio' && oldValue == 0) {
            data[index].value = null
          }
          // 循环将数据中picker类型的默认key转为value
          if (data[index].type == 'picker') {
            const sList = data[index].list
            if (oldValue != null) {
              if (oldValue == 0) {
                data[index].value = null
              } else {
                const sValue = sList[oldValue].id
                data[index].value = sValue
              }
            }
          }
          if (
            data[index].title == '用药记录' &&
            this.hasMedicationRecord == false
          ) {
            data[index].childrens = []
          } else if (
            data[index].title == '用药记录' &&
            this.hasMedicationRecord == true
          ) {
            data[index].childrens = Data.medicationRecordPageData
          }
          // 循环将upload类型value改为arry
          if (data[index].type == 'upload') {
            // 将value改为Arry展示到upload组件
            if (data[index].value != null && data[index].value.length > 0) {
              // 调用split将string分割为Arry
              const imgArr = data[index].value.split(',')
              // 将value数组渲染到upload
              data[index].value = []
              for (let j = 0; j < imgArr.length; j++) {
                const fileData = {
                  name: data[index].name + index,
                  url: this.baseUrl + imgArr[j]
                }
                data[index].value.push(fileData)
              }
            } else {
              data[index].value = []
            }
          }
        }
        this.formData.formItems = Data.registerPageData
        this.formData.MediItems = JSON.stringify(
          Data.createMedicationRecordPageData
        )
        this.loading = false
      })
    },
    // 提交
    formSubmit() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // this.formSubmitLoading = true;
          const data = this.formData.formItems
          // console.log(data);
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            if (item.type == 'upload') {
              if (item.value != null && item.value.length > 0) {
                // value提交为逗号分隔的String
                for (let j = 0; j < item.value.length; j++) {
                  if (j == 0) {
                    this.SubmitData[item.name] = item.value[j].url.replace(this.baseUrl, '')
                  } else {
                    this.SubmitData[item.name] += ',' + item.value[j].url.replace(this.baseUrl, '')
                  }
                }
              }
            } else if (item.title == '用药记录') {
              const medicaArr = []
              for (let j = 0; j < item.childrens.length; j++) {
                const medicaItem = item.childrens[j]
                const medicaObj = {}
                for (let i = 0; i < medicaItem.recordList.length; i++) {
                  const medicaItemChild = medicaItem.recordList[i]
                  medicaObj[medicaItemChild.name] = medicaItemChild.value
                }
                medicaArr.push(medicaObj)
              }
              this.SubmitData['MedicationRecordList'] =
                JSON.stringify(medicaArr)
            } else {
              this.SubmitData[item.name] = item.value
            }
          }
          this.SubmitData = Object.assign(this.SubmitData)

          CreateInpatientRegistrationRecordPost(this.SubmitData).then(
            (response) => {
              const { Msg, Code } = response
              if (Code == 1) {
                // 添加完毕后刷新数据
                this.formSubmitLoading = false
                this.getData()
                Message({
                  message: Msg || '添加成功',
                  type: 'success',
                  duration: 5 * 1000
                })
              } else {
                this.formSubmitLoading = false
              }
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    rideoChange(formItems, item) {
      for (let index = 0; index < formItems.length; index++) {
        const eitem = formItems[index]
        if (eitem.pshow == item.name) {
          if (Number(eitem.pshowval) == item.value) {
            eitem.isdisplay = false
          } else {
            eitem.isdisplay = true
          }
        }
      }
    },
    // 添加用药记录
    addMedicationRecordList(index) {
      const medicaInputs = JSON.parse(this.formData.MediItems)
      const medicaInputsObj = { recordList: medicaInputs }
      const thisData = this.formData.formItems[index]
      thisData.childrens.push(medicaInputsObj)
    },
    deletMedicationRecordList(index, medicaItemIndex) {
      const thisData = this.formData.formItems[index]
      thisData.childrens.splice(medicaItemIndex, 1)
    },
    // 判断是否显示input
    pickerChange(formItems, item) {}
    // 子级获取上传文件的链接
  }
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.el-button--primary {
  color: #fff;
  background-color: $bg;
  border-color: $bg;
  &:hover {
    background-color: $bg;
    border-color: $bg;
  }
}
.mine-container-patient {
  width: 80%;
  margin: 0 auto;
  padding: 50px;
  &-title {
    padding: 8px 16px;
    margin: 16px 0;
    h4 {
      line-height: 33px;
      font-size: 15px;
      text-align: center;
      color: $bg;
    }
  }
  .input-content {
    display: flex;
    flex-wrap: wrap;

    &-item {
      width: 50%;
      input,
      .el-select {
        width: 100%;
      }
    }
  }
  .input-content-title {
    width: 100%;
  }
  .el-button {
    display: block;
    margin: 0 auto;
  }
  .mine-container-patient-title {
    width: 100%;
  }
  .medicaItem {
    padding: 20px 22px 0 20px;
    border: 1px solid $bg;
    margin-bottom: 22px;
    border-radius: 4px;
  }
}
</style>
