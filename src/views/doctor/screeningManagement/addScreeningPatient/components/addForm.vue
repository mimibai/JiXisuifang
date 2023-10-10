<template>
  <div>
    <el-form
      ref="dynamicValidateForm"
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
            <el-form-item
              v-if="item.type == 'text' && item.name !='HKAndMacaoPermitNum' && item.name !='MTPsNum' && item.name !='HKAndMacaoAndMTPsResidenceNum' && item.name !='FPerManentResidentNum' && item.name !='PassportNum' && item.name !='MilitaryOfficerNum'&& item.name !='NDToHKAndMacaoPermitNum'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="[{
                required: item.isMust,
                message: item.title + '不能为空',
              },{ trigger: 'blur', validator: validFullNameData }]"
              :class="
                item.name == 'PatientName' && isAdd ? 'hasSearchInput' : ''
              "
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                size="mini"
              />
              <el-button
                v-if="item.name == 'PatientName' && isAdd"
                type="primary"
                size="mini"
                style="margin-left: 15px"
                icon="el-icon-search"
                @click="openAddPatientModal"
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
                @blur="checkInputValue(formData.formItems,item)"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'number'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="[{
                required: item.isMust,
                message: item.title + '不能为空',
              },{ trigger: 'blur', validator: validPositiveNumberData },]"
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                size="mini"
              />
            </el-form-item>
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
                size="mini"
                @blur="checkInputValue(formData.formItems,item)"
              />
            </el-form-item>
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
                size="mini"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'radio'"
              :label="item.title"
              :style="item.isdisplay ? 'display:none' : ''"
              :prop="'formItems.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'change'
              }"
            >
              <el-radio-group
                v-model="item.value"
                @change="changeHandler(formData.formItems, item)"
              >
                <el-radio
                  v-for="(itemChild,itemIndex) in item.list"
                  :key="itemIndex"
                  :label="Number(itemChild.id)"
                  :disabled="item.disabled"
                >{{ itemChild.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="
                item.type == 'picker' &&
                  item.name != 'DoctorId' &&
                  item.name != 'DepartmentId' &&
                  item.name != 'HospitalId' &&
                  item.name != 'DocumentTypeId'
              "
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
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
                size="mini"
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
              v-if="item.type == 'picker' && item.name == 'DocumentTypeId'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
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
                size="mini"
                @change="pickerCtrlShowOrHide(formData.formItems,item)"
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
                style="width: 100%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="small"
              />
            </el-form-item>
            <el-form-item
              v-if="item.name == 'HospitalId'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
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
                size="mini"
                @change="hospitalChange"
              >
                <el-option
                  v-for="(itemChild,itemIndex) in item.list"
                  :key="itemIndex"
                  :label="itemChild.hosName"
                  :value="Number(itemChild.hosId)"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.name == 'DepartmentId'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'change'
              }"
            >
              <el-select
                v-model="item.value"
                filterable
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                :label="item.title"
                size="mini"
                @change="departmentChange"
              >
                <el-option
                  v-for="(itemChild,itemIndex) in item.list"
                  :key="itemIndex"
                  :label="itemChild.depatName"
                  :value="Number(itemChild.deptId)"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.name == 'DoctorId'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'change'
              }"
            >
              <el-select
                v-model="item.value"
                filterable
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                :label="item.title"
                size="mini"
              >
                <el-option
                  v-for="(itemChild,itemIndex) in item.list"
                  :key="itemIndex"
                  :label="itemChild.docName"
                  :value="Number(itemChild.docId)"
                />
              </el-select>
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
                size="mini"
                @change="bindPadTwoLevel(item, item.value)"
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
              v-if="item.type == 'regionSelect'"
              :label="item.title"
              :prop="'formItems.' + index + '.value'"
              :rules="{
                required: item.isMust,
                message: item.title + '不能为空',
                trigger: 'change'
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
    <div class="ce-table">
      <div class="ce-table-title">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col :span="4">
            <p>体检订单关联</p>
          </el-col>
          <el-col :span="4">
            <div style="text-align: right">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :disabled="openPeorderDisable"
                @click.native.prevent="openPeorderDailog"
              >关联订单</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="ce-table-content">
        <el-table
          v-loading="tableListLoading"
          :data="tableList"
          style="width: 100%"
          border
          :row-class-name="TableRowClassName"
          :show-overflow-tooltip="true"
          :header-cell-style="getRowClass"
        >
          <el-table-column
            prop="checkNo"
            label="体检号"
            align="center"
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="100"
            align="center"
          />
          <el-table-column
            prop="age"
            label="年龄"
            width="60"
            align="center"
          />
          <el-table-column
            prop="sex"
            label="性别"
            width="60"
            align="center"
          />
          <el-table-column
            prop="pePackageName"
            label="体检套餐"
            align="center"
          />
          <el-table-column
            label="体检状态"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.checkSignStr }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reserveTime"
            label="预约时间"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.reserveDate }}　{{ row.reserveTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="registTime"
            label="订单时间"
            align="center"
          />
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="small"
                @click="cancleRelation(row)"
              >取消关联</el-button>
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="noTableData">
              暂无数据
              <!--，或点击 <span @click="getMakeList(1)">“刷新”</span>-->
            </div>
          </template>
        </el-table>
      </div>
    </div>
    <p class="mine-container-patient-tips">
      注意：*为必填项，确保患者基本信息填写无误方可提交
    </p>
    <div class="dialog-footer">
      <el-button
        type="primary"
        :loading="submitBtnLoading"
        @click="createPatient(createdParam)"
      >{{ buttonMsg }}</el-button>
      <el-button @click="goBack">取 消</el-button>
    </div>
    <el-dialog
      v-loading="allPatientPeLoading"
      :visible.sync="peDialogShow"
      @close="resetForm"
    >
      <div
        class="allPatient"
        style="text-align: center"
      >
        <div class="allPatientBtns">
          <span class="mb20">选择订单</span>
          <!-- <div v-show="opSearchPatientPeName" class="mb20">
            <el-input
              v-model="searchPatientPeName"
              placeholder="请输入姓名进行查询"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchPatientInfo"
                circle
              ></el-button>
            </el-input>
          </div> -->
        </div>
        <!-- 所有就诊人条目 -->
        <div>
          <el-table
            :data="allPatientPeList"
            width="100%"
            max-height="300px"
            :row-style="{ padding: '5px' }"
            border
            :row-class-name="PatientPeTableRowClassName"
            :show-overflow-tooltip="true"
            @row-click="patientChoose"
          >
            <el-table-column
              label="序号"
              align="center"
              width="50"
            >
              <template scope="scope">
                <span>{{
                  (allPatientPePageIndex - 1) * allPatientPeTotal +
                    scope.$index +
                    1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="checkNo"
              label="体检号"
              align="center"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="reservationType"
              label="预约类型"
              align="center"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              width="100"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="age"
              label="年龄"
              align="center"
              width="60"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="sex"
              label="性别"
              width="60"
              align="center"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="pePackageName"
              label="体检套餐"
              align="center"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="体检状态"
              align="center"
              width="80"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.checkSignStr }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="registTime"
              label="预约时间"
              align="center"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="reserveTime"
              label="订单时间"
              align="center"
              :show-overflow-tooltip="true"
            />
            <template slot="empty">
              <div class="noTableData">
                暂无数据
                <!--，或点击 <span @click="getMakeList(1)">“刷新”</span>-->
              </div>
            </template>
          </el-table>
          <!-- 分页器 -->
          <div
            class="health-content-pagination"
            style="margin-top: 15px"
          >
            <el-pagination
              background
              :current-page="allPatientPePageIndex"
              :page-size="1"
              layout="prev, pager, next, jumper"
              :total="allPatientPeTotal"
              align="center"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getProvinceList, getCityList, getCountyList } from '@/api/region'
import { upperJSONKey } from '@/utils/upperOrLowerJSONKey'
import { GetAllPEReserves } from '@/api/peOrder'
import { Message, MessageBox } from 'element-ui'
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
  validIsHKAndMacaoPermitCard, // 验证港澳居民来往内地通行证
  validNDToHKAndMacaoPermitNum // 内地居民往来港澳通行证
} from '@/utils/validate'
export default {
  props: {
    formDatas: Array, // 表单数据
    patientDatas: Object, // 编辑时或新增从路由中获取到的个人信息
    addPersonDatas: Object, // 新增时通过查找获取到的个人信息
    submitLoading: Boolean // 表单提交loading
  },
  data() {
    return {
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
      formData: {
        formItems: this.formDatas
      },
      tableList: [],
      hospitalId: null, // 当前选择的医院id
      tableListLoading: false,
      isAdd: true, // 是否为添加
      openPeorderDisable: false, // 关联订单按钮是否可点击
      formLabelWidth: '120px',
      submitData: {},
      addPersonDatasObj: this.addPersonDatas, // 患者信息
      caseJoinProtocolId: null, // 癌筛参与方案id
      submitBtnLoading: this.submitLoading,
      buttonMsg: '确 定',
      createdParam: { operatTypeId: 1 }, // 默认为新建
      peopleParam: this.patientDatas,
      regionObj: {}, // 添加就诊人的返回数据
      peDialogShow: false,
      opSearchPatientPeName: true,
      searchPatientPeName: null,
      allPatientPeLoading: false,
      allPatientPePageIndex: 1,
      allPatientPePageSize: 20,
      allPatientPeTotal: null,
      allPatientPeList: [],
      PEReserveId: null, // 体检订单id
      PEReserveIds: null, // 体检订单id集合
      tableBtnShow: false // 体检订单是否显示操作按钮
    }
  },
  watch: {
    formDatas() {
      this.formData.formItems = this.formDatas
      this.checkIsBindPe(this.formData.formItems)
    },
    submitLoading() {
      this.submitBtnLoading = this.submitLoading
    },
    addPersonDatas: {
      handler(newValue, oldValue) {
        this.addPersonDatasObj = newValue
      },
      deep: true,
      immediate: true
    },
    patientDatas: {
      handler(newValue, oldValue) {
        this.peopleParam = newValue
        this.checkParam(this.peopleParam)
      },
      deep: true,
      immediate: true
    },
    tableList() {
      // 当已订单关联大与1条时不可再关联
      if (this.tableList.length > 0) {
        this.openPeorderDisable = true
      } else {
        this.openPeorderDisable = false
      }
    }
  },
  created() {
    this.checkParam(this.peopleParam)
  },
  methods: {
    checkParam(param) {
      if (param.operatTypeId === 3) {
        this.isAdd = false
        this.buttonMsg = '保 存'
        this.caseJoinProtocolId = param.caseJoinProtocolId
      }
      this.createdParam.operatTypeId = param.operatTypeId
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
          if (element.value === 0 && element.name === 'DocumentTypeId') {
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
    },
    // 判断当前就诊人是否绑定体检订单
    checkIsBindPe(param) {
      // console.log(param)
      let patientId = null
      for (let index = 0; index < param.length; index++) {
        const element = param[index]
        if (element.name === 'PEReserveIds') {
          this.PEReserveIds = element.value
        }
        if (element.name === 'PatientId') {
          patientId = element.value
        }
      }
      // 不为空，说明已绑定订单
      if (this.PEReserveIds != null) {
        const ordersParam = {
          peReserveIds: this.PEReserveIds,
          patientId: patientId
        }
        this.getPeOrders(ordersParam)
      }
    },
    // 选择医院
    hospitalChange(e) {
      const hospitalId = e
      this.hospitalId = hospitalId
      this.$emit('handleHospitalChange', hospitalId)
    },
    // 选择科室
    departmentChange(e) {
      const doctorParam = {
        hospitalId: this.hospitalId,
        departmentId: e
      }
      this.$emit('handleDepartmentChange', doctorParam)
    },
    // 新建或编辑患者
    createPatient(param) {
      this.$refs.dynamicValidateForm.validate((valid) => {
        if (valid) {
          // 拼接
          const data = this.formData.formItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            if (item.name !== '') {
              if (item.type === 'radio' && item.name === 'IsMarriage') {
                if (item.value === '0' || item.value === 0) {
                  this.submitData[item.name] = false
                } else if (item.value === '1' || item.value === 1) {
                  this.submitData[item.name] = true
                }
              } else if (
                item.type === 'idcard' &&
                this.idCardNoPlaintext != null
              ) {
                // 返回存储的真实身份证
                this.submitData[item.name] = this.idCardNoPlaintext
              } else if (item.type === 'regionSelect') {
                // regionSelect的name为多个字段拼接而成，需分割
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
          }
          this.submitData = Object.assign(this.submitData, this.regionObj)
          param = upperJSONKey(param)
          this.submitData = Object.assign(this.submitData, param)
          // 如果绑定预约订单信息，需提交时添加订单
          if (this.tableList.length > 0) {
            const newList = this.tableList.map((list) => {
              return list.peReserveId
            })
            const PEReserveIds = newList.join(',')
            this.submitData = Object.assign(this.submitData, {
              PEReserveIds: PEReserveIds
            })
          } else {
            this.submitData = Object.assign(this.submitData, {
              PEReserveIds: null
            })
          }
          // 如果绑定预约订单信息，需提交时添加方案id
          if (this.caseJoinProtocolId != null) {
            this.submitData = Object.assign(this.submitData, {
              caseJoinProtocolId: this.caseJoinProtocolId
            })
          }
          this.$emit('submitData', this.submitData)
          console.log(this.submitData)
        } else {
          return false
        }
      })
    },
    // 获取当前人的体检订单
    getPeOrders(param) {
      GetAllPEReserves(param).then((res) => {
        const { Data } = res
        if (Data.buttonList && Data.buttonList.length > 0) {
          this.tableBtnShow = true
        }
        // console.log(res)
        this.tableList = Data
      })
    },
    // 控制结婚年龄与状态关联
    changeHandler(formItems, item) {
      for (let index = 0; index < formItems.length; index++) {
        const eitem = formItems[index]
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
    // 绑定终端二级联动
    bindPadTwoLevel(item, param) {
      let twoLevelList = []
      let twoLevelName = ''
      // 选中项的对应二级列
      // console.log(item)
      for (let i = 0; i < item.list.length; i++) {
        const itemChild = item.list[i]
        if (Number(itemChild.id) === param) {
          twoLevelName = itemChild.twoLevelName
          twoLevelList = itemChild.twoLevelList
        }
      }
      const dataList = this.formData.formItems
      for (let index = 0; index < dataList.length; index++) {
        const element = dataList[index]
        if (element.name === twoLevelName) {
          if (twoLevelList.length > 0) {
            element.list = twoLevelList
          } else {
            element.value = null
          }
        }
      }
    },
    // 返回上一页
    goBack() {
      this.$emit('goLastPage')
    },
    // 打开选择就诊人弹窗
    openAddPatientModal() {
      this.$emit('openAddPatientDailog')
    },
    // 打开体检订单弹窗
    openPeorderDailog() {
      // 判断是编辑还是新建
      let patientId = null
      // 路径参数不为空，为编辑
      // console.log(this.peopleParam)
      if (this.peopleParam) {
        patientId = this.peopleParam.patientId
      }
      // 选择就诊人数据不为空，为新建
      if (this.addPersonDatasObj != null) {
        patientId = this.addPersonDatasObj.patientId
      }
      if (patientId == null) {
        Message({
          message: '请选择正确的患者后进行操作！',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.peDialogShow = true
        this.allPatientPeLoading = true
        const param = {
          patientId: patientId
        }
        GetAllPEReserves(param)
          .then((res) => {
            const { Data } = res
            this.allPatientPeList = Data
            this.allPatientPeLoading = false
          })
          .catch(() => {
            this.allPatientPeLoading = false
          })
      }
    },
    // 设置患者所有订单表格行的下标
    PatientPeTableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 设置体检订单关联表格下标
    TableRowClassName({ row, rowIndex }) {
      row.dataIndex = rowIndex
    },
    // 选中当前订单
    patientChoose(row) {
      // const arr = []
      MessageBox.confirm('确定要关联此订单？', '确定关联订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 判断已关联表格是否已存在当前数据
        const checkNo = row.checkNo
        let isHas = false
        for (let index = 0; index < this.tableList.length; index++) {
          const element = this.tableList[index]
          if (element.checkNo === checkNo) {
            isHas = true
          }
        }
        if (!isHas) {
          // 同时列表内删除该行
          this.allPatientPeList.splice(row.index, 1)
          this.tableList.push(row)
        } else {
          Message({
            message: '已存在该记录，请重新选择！',
            type: 'error',
            duration: 5 * 1000
          })
        }
        this.peDialogShow = false
      })
    },
    // 关联订单
    relation(param) {
      // console.log(param)
    },
    // 取消关联订单
    cancleRelation(row) {
      MessageBox.confirm('您确定要取消当前关联体检订单', '取消关联订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableList.splice(row.dataIndex, 1)
        this.PEReserveId = null
      })
    },
    // 查询订单
    searchPatientInfo() {},
    // 重置搜索
    resetForm() {
      // 重置新增患者弹窗
      this.allPatientList = null
      this.peDialogShow = false
      this.searchPatientPeName = null
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.allPatientPeLoading = true
      // console.log(`当前页: ${val}`);
      this.allPatientPePageIndex = val
      // const params = { page: val }
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
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
    // 自定义校验正数
    validPositiveNumberData(rule, value, callback) {
      if (!validPositiveNumber(value)) {
        return callback(new Error('请输入正确的数值'))
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
    // 自定义校验规则:内地居民往来港澳通行证
    validNDToHKAndMacaoPermitNumData(rule, value, callback) {
      if (!validNDToHKAndMacaoPermitNum(value)) {
        return callback(new Error('请输入正确的内地居民往来港澳通行证'))
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
<style lang="scss">
.sepcialInput .el-input__inner::-webkit-input-placeholder {
  color: #606266;
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.mb20 {
  margin-bottom: 20px;
}
.mine-container-patient-tips {
  font-size: 12px;
  text-align: center;
  color: #d9001b;
  margin-bottom: 25px;
}
.input-content {
  &-items {
    width: 25%;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 10px;
  }
  .form-titles {
    width: 100%;
    display: block;
    h5 {
      padding-bottom: 22px;
      color: $bg;
    }
  }
}
.addNewPatient {
  .el-form-item.hasSearchInput {
    div {
      width: calc(100% - 60px);
    }
  }
  .idCard {
    margin-bottom: 0;
  }
}
.dialog-footer {
  text-align: center;
  margin-top: 22px;
}
.ce-table {
  .ce-table-title {
    margin-bottom: 10px;
    color: $bg;
  }
}
.ce-table-content {
  margin-bottom: 22px;
}
.allPatientBtns {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    font-size: 24px;
  }
}
@media only screen and (max-width: 1680px) {
  .input-content {
    &-items {
      width: 33%;
    }
  }
}
</style>
