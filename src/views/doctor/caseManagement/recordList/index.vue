<template>
  <div class="Records">
    <!-- 新增住院记录 -->
    <div class="addNewPatient">
      <el-button
        class="opButton"
        type="primary"
        icon="el-icon-plus"
        :disabled="disabled"
        @click.native="creatNewRecords()"
      >新增住院记录</el-button>
    </div>
    <!-- 新增住院记录弹窗 -->
    <el-dialog
      title="新增住院记录"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="creatPatientForm"
        v-loading="creatLoading"
        :model="creatPatientForm"
        label-width="120px"
      >
        <div class="input-content">
          <div
            v-for="(item, index) in creatPatientForm.dialogFormItems"
            :key="item.id"
            class="input-content-item"
            :style="item.type == null || item.isdisplay ? 'display:none' : ''"
          >
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
                @change="pickerChange(creatPatientForm.dialogFormItems, item)"
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
              :prop="'dialogFormItems.' + index + '.value'"
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
                @change="
                  rideoChange(creatPatientForm.dialogFormItems, item.value)
                "
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
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="submit"
          @click="formSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 住院记录列表 -->
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      style="width: 100%"
      :header-cell-style="getRowClass"
      border
    >
      <el-table-column
        label="序号"
        width="75px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ (pageIndex-1)*pageSize+(scope.$index + 1) }} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="hospitalName"
        label="入院医院"
        align="center"
      />
      <el-table-column
        prop="inpatientDeptNode"
        label="入院科室"
        align="center"
      />
      <el-table-column
        prop="patientName"
        label="患者姓名"
        align="center"
      />
      <el-table-column
        prop="expectInpatientDate"
        label="预计入院时间"
        align="center"
      />
      <el-table-column
        prop="inpatientDatetime"
        label="实际入院时间"
        align="center"
      />
      <el-table-column
        prop="leaveDatetime"
        label="出院时间"
        align="center"
      />
      <el-table-column
        label="住院状态"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.stateId == 1">预约入院</span>
          <span v-if="scope.row.stateId == 2">住院中</span>
          <span v-if="scope.row.stateId == 3">已出院</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="400"
      >
        <template slot-scope="{ row }">
          <el-button
            v-for="n in row.buttonList"
            :key="n.index"
            @click="
              operations(
                n.clickTypeId,
                n.title,
                row.patientId,
                row.inpatientRecord
              )
            "
          >{{ n.title }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑住院记录弹窗 -->
    <el-dialog
      title="编辑住院记录"
      :visible.sync="EditdialogFormVisible"
    >
      <el-form
        ref="editPatientForm"
        v-loading="editLoading"
        :model="editPatientForm"
        label-width="120px"
      >
        <div class="input-content">
          <div
            v-for="(item, index) in editPatientForm.dialogFormItems"
            :key="item.id"
            class="input-content-item"
            :style="item.type == null || item.isdisplay ? 'display:none' : ''"
          >
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
                @change="pickerChange(editPatientForm.dialogFormItems, item)"
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
              :prop="'dialogFormItems.' + index + '.value'"
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
                @change="
                  rideoChange(editPatientForm.dialogFormItems, item.value)
                "
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
              :prop="'dialogFormItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-date-picker
                v-model="item.value"
                type="date"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                style="width: 100%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <!-- <el-form-item
              v-if="
                item.type == 'pickerDate' && item.name == 'InpatientDatetime'
              "
              :label="item.title"
              :label-width="formLabelWidth"
              :prop="'dialogFormItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-date-picker
                type="date"
                :placeholder="item.placeholder"
                v-model="item.value"
                style="width: 100%"
                :picker-options="pickerOptionsEnd"
                @change="datesecond(item.value)"
              ></el-date-picker>
            </el-form-item> -->
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="EditdialogFormVisible = false">取 消</el-button>
        <el-button
          type="submit"
          @click="EditformSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 登记入院时间弹窗 -->
    <el-dialog
      title="登记入院时间"
      :visible.sync="InpatientDatedialogFormVisible"
    >
      <el-form
        ref="patientDateForm"
        v-loading="patientDateLoading"
        :model="patientDateForm"
        label-width="120px"
      >
        <div class="input-content">
          <div
            v-for="(item, index) in patientDateForm.dialogFormItems"
            :key="item.id"
            class="input-content-item"
            :style="item.type == null || item.isdisplay ? 'display:none' : ''"
          >
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
                @change="pickerChange(patientDateForm.dialogFormItems, item)"
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
              :prop="'dialogFormItems.' + index + '.value'"
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
                @change="
                  rideoChange(patientDateForm.dialogFormItems, item.value)
                "
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
              :prop="'dialogFormItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
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
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="InpatientDatedialogFormVisible = false">取 消</el-button>
        <el-button
          type="submit"
          @click="InpatientDateformSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 登记出院时间弹窗 -->
    <el-dialog
      title="登记出院时间"
      :visible.sync="LeaveDialogFormVisible"
    >
      <el-form
        ref="leavetDateForm"
        v-loading="leaveDateLoading"
        :model="leavetDateForm"
        label-width="120px"
      >
        <div class="input-content">
          <div
            v-for="(item, index) in leavetDateForm.dialogFormItems"
            :key="item.id"
            class="input-content-item"
            :style="item.type == null || item.isdisplay ? 'display:none' : ''"
          >
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
                @change="pickerChange(leavetDateForm.dialogFormItems, item)"
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
              :prop="'dialogFormItems.' + index + '.value'"
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
              :prop="'dialogFormItems.' + index + '.value'"
              :rules="{
                required: item.isMust,
              }"
            >
              <el-radio-group
                v-model="item.value"
                @change="
                  rideoChange(leavetDateForm.dialogFormItems, item.value)
                "
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
              :prop="'dialogFormItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
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
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="LeaveDialogFormVisible = false">取 消</el-button>
        <el-button
          type="submit"
          @click="LeaveDateformSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页器 -->
    <div
      class="health-content-pagination"
      style="margin-top: 15px"
    >
      <el-pagination
        background
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, jumper"
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {
  GetInpatientRecordList, // 获取住院记录
  CreateRecordGet, // 新建住院记录
  CreateRecordPost, // 提交住院记录
  EditRecordGet, // 编辑住院记录
  EditRecordPost, // 提交编辑住院记录
  RegisterInpatientDatetimeGet, // 登记实际入院时间
  RegisterInpatientDatetimePost, // 提交登记实际入院时间
  LeaveDatetimeGet, // 登记出院时间
  LeaveDatetimePost // 提交登记出院时间
} from '@/api/records'
import { Message, MessageBox } from 'element-ui'
export default {
  components: {},
  data() {
    return {
      dialogFormVisible: false, // 弹窗默认关闭
      EditdialogFormVisible: false, // 弹窗默认关闭
      InpatientDatedialogFormVisible: false, // 弹窗默认关闭
      LeaveDialogFormVisible: false, // 弹窗默认关闭
      tableData: [], // 住院记录集合
      creatPatientForm: {
        dialogFormItems: [] // 新建住院记录集合
      },
      editPatientForm: {
        dialogFormItems: [] // 编辑住院记录集合
      },
      patientDateForm: {
        dialogFormItems: [] // 登记入院集合
      },
      leavetDateForm: {
        dialogFormItems: [] // 登记入院集合
      },
      tableLoading: true,
      creatLoading: true,
      editLoading: true,
      patientDateLoading: true,
      leaveDateLoading: true,
      formLabelWidth: '120px',
      disabled: true, // 是否可新增住院记录
      pageIndex: 1, // 当前页码
      pageSize: 1, // 每页数据条数
      total: null, // 总页数
      pickerValue: null, // 弹窗picke状态
      submitData: {
        // 用于提交表单信息到后台
        patientId: Number(this.$route.query.patientId),
        operatTypeId: 1
      },
      editSubmitData: {
        // 用于提交表单信息到后台
        patientId: Number(this.$route.query.patientId),
        operatTypeId: 3
      },
      InpatientDateSubmitData: {
        // 用于提交表单信息到后台
        patientId: Number(this.$route.query.patientId)
      },
      LeaveDateSubmitData: {
        // 用于提交表单信息到后台
        patientId: Number(this.$route.query.patientId)
      }
    }
  },
  computed: {},
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
    // 获取住院记录
    getData() {
      const patientId = this.$route.query.patientId
      if (patientId) {
        this.patientId = Number(this.$route.query.patientId)
      } else {
        this.$router.push({ path: '/doctor/caseManagement' })
        return false
      }
      const operatType = { patientId: this.patientId }
      GetInpatientRecordList(operatType).then((response) => {
        const { Data, Pages } = response
        this.tableData = Data.list
        this.disabled = !Data.isCanAddInpatientRecord
        this.tableLoading = false
        this.total = Pages
      })
    },
    // 新增住院记录
    creatNewRecords() {
      this.dialogFormVisible = true // 打开弹窗
      const patientId = this.$route.query.patientId
      if (patientId) {
        this.patientId = Number(this.$route.query.patientId)
      } else {
        this.$router.push({ path: '/doctor/caseManagement' })
        return false
      }
      // operatTypeId 1、新建  3、编辑
      const operatType = { patientId: this.patientId, operatTypeId: 1 }
      CreateRecordGet(operatType).then((response) => {
        const { Data } = response
        for (let index = 0; index < Data.length; index++) {
          let oldTit = Data[index].title
          const oldValue = Data[index].value
          // 循环去掉title中的无意义字符
          if (oldTit != null) {
            oldTit = oldTit.substring(0, oldTit.length - 1)
          }
          if (Data[index].type != 'radio' && oldValue == 0) {
            Data[index].value = null
          }
          Data[index].title = oldTit
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
        }
        this.creatLoading = false
        this.creatPatientForm.dialogFormItems = Data
      })
    },
    // 判断是否显示input
    pickerChange(formItems, item) {
      for (let index = 0; index < formItems.length; index++) {
        const eitem = formItems[index]
        if (eitem.name == 'InpatientStateId') {
          this.pickerValue = eitem.value
          if (Number(eitem.value) == 1 || Number(eitem.value) == 0) {
            for (let j = 0; j < formItems.length; j++) {
              if (
                formItems[j].name == 'InpatientStateId' ||
                formItems[j].name == 'InpatientDeptNodeId' ||
                formItems[j].name == 'ExpectInpatientDate'
              ) {
                formItems[j].isdisplay = false
              } else {
                formItems[j].isdisplay = true
              }
            }
          }
          if (Number(eitem.value) == 2) {
            for (let j = 0; j < formItems.length; j++) {
              if (formItems[j].name == 'IsOurHospital') {
                formItems[j].value = 1
              }
              if (
                formItems[j].name == 'InpatientStateId' ||
                formItems[j].name == 'IsOurHospital' ||
                formItems[j].name == 'InpatientDeptNodeId' ||
                formItems[j].name == 'InpatientDatetime'
              ) {
                formItems[j].isdisplay = false
              } else {
                formItems[j].isdisplay = true
              }
            }
          }
          if (Number(eitem.value) == 3) {
            for (let j = 0; j < formItems.length; j++) {
              if (formItems[j].name == 'IsOurHospital') {
                formItems[j].value = 1
              }
              if (
                formItems[j].name == 'InpatientStateId' ||
                formItems[j].name == 'IsOurHospital' ||
                formItems[j].name == 'InpatientDeptNodeId' ||
                formItems[j].name == 'InpatientDatetime' ||
                formItems[j].name == 'LeaveDatetime'
              ) {
                formItems[j].isdisplay = false
              } else {
                formItems[j].isdisplay = true
              }
            }
          }
        }
      }
    },
    rideoChange(formItems, item) {
      for (let index = 0; index < formItems.length; index++) {
        const eitem = formItems[index]
        if (eitem.name == 'IsOurHospital') {
          if (this.pickerValue == 2) {
            if (eitem.value == 1) {
              // 是本院
              for (let j = 0; j < formItems.length; j++) {
                if (
                  formItems[j].name == 'InpatientStateId' ||
                  formItems[j].name == 'IsOurHospital' ||
                  formItems[j].name == 'InpatientDeptNodeId' ||
                  formItems[j].name == 'InpatientDatetime'
                ) {
                  formItems[j].isdisplay = false
                } else {
                  formItems[j].isdisplay = true
                }
              }
            }
            if (Number(eitem.value) == 0) {
              // 不是本院
              for (let o = 0; o < formItems.length; o++) {
                if (
                  formItems[o].name == 'InpatientStateId' ||
                  formItems[o].name == 'IsOurHospital' ||
                  formItems[o].name == 'HospitalName' ||
                  formItems[o].name == 'InpatientDeptNode' ||
                  formItems[o].name == 'InpatientDatetime'
                ) {
                  formItems[o].isdisplay = false
                } else {
                  formItems[o].isdisplay = true
                }
              }
            }
          }
          if (this.pickerValue == 3) {
            if (eitem.value == 1) {
              // 是本院
              for (let j = 0; j < formItems.length; j++) {
                if (
                  formItems[j].name == 'InpatientStateId' ||
                  formItems[j].name == 'IsOurHospital' ||
                  formItems[j].name == 'InpatientDeptNodeId' ||
                  formItems[j].name == 'LeaveDatetime' ||
                  formItems[j].name == 'InpatientDatetime'
                ) {
                  formItems[j].isdisplay = false
                } else {
                  formItems[j].isdisplay = true
                }
              }
            }
            if (Number(eitem.value) == 0) {
              // 不是本院
              for (let o = 0; o < formItems.length; o++) {
                if (
                  formItems[o].name == 'InpatientStateId' ||
                  formItems[o].name == 'IsOurHospital' ||
                  formItems[o].name == 'HospitalName' ||
                  formItems[o].name == 'InpatientDeptNode' ||
                  formItems[o].name == 'LeaveDatetime' ||
                  formItems[o].name == 'InpatientDatetime'
                ) {
                  formItems[o].isdisplay = false
                } else {
                  formItems[o].isdisplay = true
                }
              }
            }
          }
        }
      }
    },
    // 提交新增住院信息
    formSubmit() {
      this.$refs.creatPatientForm.validate((valid) => {
        if (valid) {
          const data = this.creatPatientForm.dialogFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
          }
          this.submitData = Object.assign(this.submitData)
          this.tableLoading = true
          CreateRecordPost(this.submitData).then((response) => {
            const { Msg, Code } = response
            if (Code == 1) {
              this.dialogFormVisible = false
              // 添加完毕后刷新数据
              this.getData()
              this.tableLoading = false
              Message({
                message: Msg || '添加成功',
                type: 'success',
                duration: 5 * 1000
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 表格按钮事件
    operations(clickTypeId, title, patientId, inpatientRecord) {
      // clickTypeId4、信息修改 5、入院登记 14、登记入院时间
      if (clickTypeId == 4) {
        this.EditRecordGet(patientId, inpatientRecord)
      }
      if (clickTypeId == 14 && title == '登记入院时间') {
        this.InpatientDate(inpatientRecord)
      }
      if (clickTypeId == 14 && title == '登记出院时间') {
        this.LeaveDate(inpatientRecord)
      }
      if (clickTypeId == 5) {
        this.$router.push({
          name: 'Registers',
          query: { inpatientRecordId: inpatientRecord }
        })
      }
    },
    // 编辑住院记录
    EditRecordGet(patientId, inpatientRecord) {
      this.EditdialogFormVisible = true // 打开弹窗
      // operatTypeId 1、新建  3、编辑
      const operatType = {
        operatTypeId: 3,
        patientId: patientId,
        InpatientRecordId: inpatientRecord
      }
      EditRecordGet(operatType).then((response) => {
        const { Data } = response
        for (let index = 0; index < Data.length; index++) {
          let oldTit = Data[index].title
          const oldValue = Data[index].value
          // 循环去掉title中的无意义字符
          if (oldTit != null) {
            oldTit = oldTit.substring(0, oldTit.length - 1)
          }
          if (Data[index].type != 'radio' && oldValue == 0) {
            Data[index].value = null
          }
          Data[index].title = oldTit
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
        }
        this.editLoading = false
        this.editPatientForm.dialogFormItems = Data
      })
    },
    // 提交编辑住院信息
    EditformSubmit() {
      this.$refs.editPatientForm.validate((valid) => {
        if (valid) {
          const data = this.editPatientForm.dialogFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.editSubmitData[item.name] = item.value
          }
          this.editSubmitData = Object.assign(this.editSubmitData)
          this.tableLoading = true
          EditRecordPost(this.editSubmitData).then((response) => {
            const { Msg, Code } = response
            if (Code == 1) {
              this.EditdialogFormVisible = false
              // 添加完毕后刷新数据
              this.tableLoading = false
              this.getData()
              Message({
                message: Msg || '修改成功',
                type: 'success',
                duration: 5 * 1000
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 登记入院时间
    InpatientDate(inpatientRecord) {
      this.InpatientDatedialogFormVisible = true // 打开弹窗
      const operatType = {
        InpatientRecordId: inpatientRecord
      }
      RegisterInpatientDatetimeGet(operatType).then((response) => {
        const { Data } = response
        for (let index = 0; index < Data.length; index++) {
          let oldTit = Data[index].title
          const oldValue = Data[index].value
          // 循环去掉title中的无意义字符
          if (oldTit != null) {
            oldTit = oldTit.substring(0, oldTit.length - 1)
          }
          if (Data[index].type != 'radio' && oldValue == 0) {
            Data[index].value = null
          }
          Data[index].title = oldTit
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
        }
        this.patientDateLoading = false
        this.patientDateForm.dialogFormItems = Data
      })
    },
    // 提交登记入院时间
    InpatientDateformSubmit() {
      this.$refs.patientDateForm.validate((valid) => {
        if (valid) {
          const data = this.patientDateForm.dialogFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.InpatientDateSubmitData[item.name] = item.value
          }
          this.InpatientDateSubmitData = Object.assign(
            this.InpatientDateSubmitData
          )
          this.patientDateLoading = true
          RegisterInpatientDatetimePost(this.InpatientDateSubmitData).then(
            (response) => {
              const { Msg, Code } = response
              if (Code == 1) {
                this.InpatientDatedialogFormVisible = false
                // 添加完毕后刷新数据
                this.patientDateLoading = false
                this.getData()
                Message({
                  message: Msg || '添加成功',
                  type: 'success',
                  duration: 5 * 1000
                })
              }
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 登记出院时间
    LeaveDate(inpatientRecord) {
      this.LeaveDialogFormVisible = true // 打开弹窗
      const operatType = {
        InpatientRecordId: inpatientRecord
      }
      LeaveDatetimeGet(operatType).then((response) => {
        const { Data } = response
        for (let index = 0; index < Data.length; index++) {
          let oldTit = Data[index].title
          const oldValue = Data[index].value
          // 循环去掉title中的无意义字符
          if (oldTit != null) {
            oldTit = oldTit.substring(0, oldTit.length - 1)
          }
          if (Data[index].type != 'radio' && oldValue == 0) {
            Data[index].value = null
          }
          Data[index].title = oldTit
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
        }
        this.leaveDateLoading = false
        this.leavetDateForm.dialogFormItems = Data
      })
    },
    // 提交登记出院时间
    LeaveDateformSubmit() {
      this.$refs.leavetDateForm.validate((valid) => {
        if (valid) {
          const data = this.leavetDateForm.dialogFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.LeaveDateSubmitData[item.name] = item.value
          }
          this.LeaveDateSubmitData = Object.assign(this.LeaveDateSubmitData)
          this.leaveDateLoading = true
          LeaveDatetimePost(this.LeaveDateSubmitData).then((response) => {
            const { Msg, Code } = response
            if (Code == 1) {
              this.LeaveDialogFormVisible = false
              // 添加完毕后刷新数据
              this.getData()
              this.leaveDateLoading = false
              Message({
                message: Msg || '添加成功',
                type: 'success',
                duration: 5 * 1000
              })
            }
          })
        } else {
          console.log('error submit!!')
          this.leaveDateLoading = false
          return false
        }
      })
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageIndex = 1
      this.pageSize = val
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageIndex = val
      const params = { page: val }
      GetInpatientRecordList(params).then((response) => {
        const { Data } = response
        this.tableData = Data.list
        this.allPatientLoading = false
      })
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scope>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.Records {
  padding: 30px;
  .addNewPatient {
    .opButton {
      float: right;
      margin-bottom: 22px;
    }
  }
  .addNewPatient {
    .el-form-item {
      /*display: flex;*/
      label {
        width: 94px;
      }
      div {
        width: calc(100% - 120px);
      }
    }
    .idCard {
      margin-bottom: 0;
    }
  }
  .input-content {
    display: flex;
    flex-wrap: wrap;
    &-item {
      width: 50%;
      padding: 0px 43px;
      input,
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>

