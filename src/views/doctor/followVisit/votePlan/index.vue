<template>
  <div
    v-loading="mainLoading"
    class="dashboard-container"
  >
    <!-- 搜索表单 -->
    <el-form
      ref="searchForm"
      :model="{ searchForm }"
      :inline="true"
      label-width="100px"
      :label-position="labelPosition"
    >
      <template v-for="(item,index) in searchForm">
        <el-form-item
          v-if="item.type == 4 || item.type == 3"
          :key="index"
          :label="item.title"
          :prop="item.name"
        >
          <el-select
            v-model="item.value"
            :placeholder="'请选择' + item.title"
            :style="'width:' + styleWidth"
          >
            <el-option
              v-for="(items, idx) in item.dataList"
              :key="idx"
              :label="items.name"
              :value="items.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="item.type == 1"
          :key="index"
          :label="item.title"
          :prop="item.name"
        >
          <el-input
            v-model="item.value"
            :placeholder="'请填写'+item.title"
            :style="'width:' + styleWidth"
          />
        </el-form-item>
      </template>
    </el-form>
    <div class="primaryBtn">
      <el-button
        class="searchBtn"
        type="primary"
        icon="el-icon-search"
        @click="onSearchSubmit"
      >查询</el-button>
      <el-button
        class="restBtn"
        icon="el-icon-refresh-left"
        @click="restSearchForm"
      >重置</el-button>
    </div>
    <div class="table_warpper">
      <div class="table_con">
        <!-- 新增随访问卷 -->
        <div
          class="addNewPlan"
          v-if="checkPermission([1])"
        >
          <div>
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col style="text-align:right;padding-right:30px;">
                <el-button
                  class="opButton"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addNewVote"
                >新增问卷</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 随访列表 -->
        <div class="table_info">
          <el-table
            ref="voteTable"
            v-loading="voteListLoading"
            :data="voteList"
            style="width: 100%"
            border
            :show-overflow-tooltip="true"
            :header-cell-style="getRowClass"
            :expand-row-keys="expands"
            :row-key="getRowKeys"
            @expand-change="expandChange"
          >
            <!-- 问卷下的题目 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div class="childTable-wrapper">
                  <el-table
                    ref="voteTable1"
                    v-loading="childItemLoading"
                    :data="scope.row.childItemData"
                    style="width: 100%"
                    border
                    :show-overflow-tooltip="true"
                    :header-cell-style="getRowClass"
                    :expand-row-keys="expandsItem"
                    :row-key="getRowKeysItem"
                    @expand-change="expandChangeItem"
                  >
                    <!-- 题目下的明细 -->
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <div class="childTable-wrapper">
                          <el-table
                            ref="voteTable2"
                            v-loading="childItemLoadingMx"
                            :data="childItemDataMx"
                            style="width: 100%"
                            border
                            :show-overflow-tooltip="true"
                            :header-cell-style="getRowClass"
                          >
                            <el-table-column
                              v-for="(col, index) in colsChildItem"
                              :key="index"
                              :prop="col.prop"
                              :label="col.label"
                              align="center"
                              :width="col.width"
                            >
                              <template slot-scope="scopeTM">
                                <vote-cell
                                  :prop="col.prop"
                                  :row="scopeTM.row"
                                  @moveUpVoteDetail="moveUpVoteDetail"
                                  @moveDownVoteDetail="moveDownVoteDetail"
                                  @delVoteDetail="delVoteDetail"
                                  @createVoteDetail="createVoteDetail"
                                  @GetVoteDetailDetails="GetVoteDetailDetails"
                                />
                              </template>
                            </el-table-column>
                          </el-table>
                          <template v-if="checkPermission([1])">
                            <el-button
                              class="addVoteButton"
                              type="primary"
                              size="mini"
                              @click="addVoteMx"
                            >新增明细</el-button>
                          </template>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-for="(col, index) in colsChild"
                      :key="index"
                      :prop="col.prop"
                      :label="col.label"
                      align="center"
                      :width="col.width"
                    >
                      <template slot-scope="scopeMx">
                        <vote-cell
                          :prop="col.prop"
                          :row="scopeMx.row"
                          @moveUpVote="moveUpVote"
                          @moveDownVote="moveDownVote"
                          @closeVoteItem="closeVoteItem"
                          @openVoteItem="openVoteItem"
                          @delVoteItem="delVoteItem"
                          @editVoteItem="editVoteItem"
                          @goVoteItemDetail="goVoteItemDetail"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                  <template v-if="checkPermission([1])">
                    <el-button
                      class="addVoteButton"
                      type="primary"
                      size="mini"
                      @click="addVote"
                    >新增题目</el-button>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, index) in cols"
              :key="index"
              :prop="col.prop"
              :label="col.label"
              align="center"
              :width="col.width"
            >
              <template slot-scope="scope">
                <vote-cell
                  :prop="col.prop"
                  :row="scope.row"
                  :rowIndex="(currentPage-1)*pageSize+(scope.$index + 1)"
                  @closeVote="closeVote"
                  @openVote="openVote"
                  @delVote="delVote"
                  @editVote="editVote"
                  @goVotePlanDetail="goVotePlanDetail"
                />
              </template>
            </el-table-column>
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
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[20, 40, 60, 80]"
              layout="sizes, prev, pager, next, jumper"
              :page-count="pageCount"
              align="center"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 新建问卷弹窗 -->
    <el-dialog
      v-loading="createLoading"
      :title="dialogTitle"
      :visible.sync="creatFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="createVoteForm"
        :model="createVoteForm"
      >
        <div class="input-content">
          <div
            v-for="(item, index) in createVoteForm.createFormItems"
            :key="index"
            class="input-content-item"
            :style="item.type == null || item.isdisplay ? 'display:none' : ''"
          >
            <el-form-item
              v-if="item.type == 'text'"
              :label-width="formLabelWidth"
              :label="item.title"
              :prop="'createFormItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-input
                v-model="item.value"
                autocomplete="off"
                :name="item.name"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                class="case-el-input"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'textarea'"
              :label-width="formLabelWidth"
              :label="item.title"
              :prop="'createFormItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-input
                v-model="item.value"
                autocomplete="off"
                :name="item.name"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
                class="case-el-input"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'picker'"
              :label="item.title"
              :prop="'createFormItems.' + index + '.value'"
              :label-width="formLabelWidth"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :label="item.title"
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
              v-if="item.type == 'radio'"
              :label="item.title"
              :label-width="formLabelWidth"
              :style="item.isdisplay ? 'display:none' : ''"
              :rules="{
                required: item.isMust,
              }"
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
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="creatFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="formSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建题目弹窗 -->
    <el-dialog
      v-loading="voteLoading"
      :title="voteDialogTitle"
      :visible.sync="voteFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="voteItemForm"
        :model="voteItemForm"
        label-width="150px"
      >
        <div class="input-content">
          <div
            v-for="(item, index) in voteItemForm.voteFormItems"
            :key="index"
            class="input-content-item"
            :style="item.type == null || item.isdisplay ? 'display:none' : ''"
          >
            <el-form-item
              v-if="item.type == 'text' || item.type == 'textarea'"
              :label-width="formLabelWidth"
              :label="item.title"
              :prop="'voteFormItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-input
                v-model="item.value"
                :disabled="item.disabled"
                autocomplete="off"
                :name="item.name"
                :placeholder="item.placeholder"
                class="case-el-input"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'picker'"
              :label="item.title"
              :prop="'voteFormItems.' + index + '.value'"
              :label-width="formLabelWidth"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :label="item.title"
                @change="pickerCtrlShowOrHide(voteItemForm.voteFormItems, item)"
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
              v-if="item.type == 'radio'"
              :label="item.title"
              :style="item.isdisplay ? 'display:none' : ''"
              :rules="{
                required: item.isMust,
              }"
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
            <el-form-item
              v-if="item.type == 'pickerDate'"
              :label="item.title"
              :label-width="formLabelWidth"
              :style="item.isdisplay ? 'display:none' : ''"
              :rules="{
                required: item.isMust,
              }"
            >
              <el-date-picker
                v-model="item.value"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                class="case-el-input"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="voteFormVisible =false">取 消</el-button>
        <el-button
          :loading="buttonLoading"
          type="primary"
          @click="voteFormSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建题目明细弹窗 -->
    <el-dialog
      v-loading="voteItemLoading"
      :title="voteItemDialogTitle"
      :visible.sync="voteItemFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="voteItemChildForm"
        :model="voteItemChildForm"
      >
        <div class="input-content">
          <div
            v-for="(item, index) in voteItemChildForm.voteChildFormItems"
            :key="index"
            class="input-content-item"
            :style="item.type == null || item.isdisplay ? 'display:none' : ''"
          >
            <el-form-item
              v-if="item.type == 'text' || item.type == 'textarea' || item.type == 'number'"
              :label-width="formLabelWidth"
              :label="item.title"
              :prop="'voteChildFormItems.' + index + '.value'"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-input
                v-model="item.value"
                autocomplete="off"
                :name="item.name"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                class="case-el-input"
              />
            </el-form-item>
            <el-form-item
              v-if="item.type == 'picker'"
              :label="item.title"
              :prop="'voteChildFormItems.' + index + '.value'"
              :label-width="formLabelWidth"
              :rules="[
                { required: item.isMust, message: item.title + '不能为空' },
              ]"
            >
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :label="item.title"
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
              v-if="item.type == 'radio'"
              :label="item.title"
              :label-width="formLabelWidth"
              :style="item.isdisplay ? 'display:none' : ''"
              :rules="{
                required: item.isMust,
              }"
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
            <el-form-item
              v-if="item.type == 'pickerDate'"
              :label="item.title"
              :label-width="formLabelWidth"
              :style="item.isdisplay ? 'display:none' : ''"
              :rules="{
                required: item.isMust,
              }"
            >
              <el-date-picker
                v-model="item.value"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                class="case-el-input"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="voteItemFormVisible =false">取 消</el-button>
        <el-button
          :loading="buttonLoading"
          type="primary"
          @click="voteItemFormSubmit()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getVoteList,
  closeVote,
  openVote,
  delVote,
  createVoteGet,
  createVotePost,
  getVoteItemList,
  moveUpVoteItem,
  moveDownVoteItem,
  closeVoteItem,
  openVoteItem,
  delVoteItem,
  createVoteItemGet,
  createVoteItemPost,
  getVoteDetailList,
  moveUpVoteDetail,
  moveDownVoteDetail,
  delVoteDetail,
  createVoteDetailGet,
  createVoteDetailPost,
} from '@/api/followVisits'
import VoteCell from '@/views/doctor/followVisit/caseJoinFollowVisit/components/voteCell.vue'
import checkPermission from '@/utils/permission' // 权限判断函数
import { Message, MessageBox } from 'element-ui'
export default {
  components: {
    VoteCell,
  },
  data() {
    return {
      voteList: [],
      searchForm: null,
      labelPosition: 'right',
      styleWidth: '204px',
      mainLoading: true, // 全局loading
      searchFormData: {},
      voteListLoading: false,
      pageCount: null,
      cols: [
        // 列名集合
        { prop: '序号', label: '序号', width: '75px' },
        { prop: 'name', label: '问卷名称', width: null },
        { prop: 'voteExecutiveName', label: '执行人类别', width: null },
        { prop: 'isStorageData', label: '退出后是否继续填写', width: null },
        {
          prop: 'isAssignLastResult',
          label: '是否自动赋值上一次结果',
          width: null,
        },
        { prop: 'isEnable', label: '是否启用', width: null },
        { prop: 'buttonList', label: '功能', width: '350px' },
      ],
      colsChild: [
        // 列名集合
        { prop: 'voteItemName', label: '题目名称', width: null },
        { prop: 'isRealItem', label: '是否真正题目', width: null },
        { prop: 'voteItemTypeName', label: '题目类型', width: null },
        { prop: 'isRequired', label: '是否必填', width: null },
        { prop: 'isEnable', label: '是否启用', width: null },
        { prop: 'buttonList', label: '功能', width: '350px' },
      ],
      colsChildItem: [
        // 列名集合
        { prop: 'voteDetailName', label: '明细名称', width: null },
        { prop: 'score', label: '	分值', width: null },
        { prop: 'isEmptyOption', label: '是否清空其他选项', width: null },
        { prop: 'isAppendText', label: '是否附加文本', width: null },
        { prop: 'buttonList', label: '功能', width: '350px' },
      ],
      creatFormVisible: false, // 新建问卷弹窗
      createLoading: true,
      createVoteForm: {
        createFormItems: [], // 新建随访方案集合
      },
      submitData: {}, // 用于提交表单信息到后台
      formLabelWidth: '150px',
      dialogTitle: '',
      operatTypeId: null,
      voteId: null,
      childItemLoading: false,
      expands: [],
      expandsItem: [],
      voteFormVisible: false,
      voteDialogTitle: '',
      voteLoading: true,
      voteItemForm: {
        voteFormItems: [], // 新建随访方案集合
      },
      voteSubmitData: {},
      voteItemId: null,
      childItemLoadingMx: false,
      voteItemList: [],
      voteItemFormVisible: false,
      voteItemDialogTitle: '',
      voteItemLoading: true,
      voteItemChildForm: {
        voteChildFormItems: [], // 新建随访方案集合
      },
      voteItemSubmitData: {},
      childItemDataMx: [],
      buttonLoading: false,
      pageSize: 20,
      pageCount: 1,
      currentPage: 1,
      searchData: {},
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData: function (param) {
      if (param) {
        param = Object.assign(
          param,
          {
            pageSize: this.pageSize,
            page: this.currentPage,
          },
          this.searchData
        )
      }
      getVoteList(param).then((res) => {
        this.pageCount = res.Pages
        this.searchForm = res.Data.searchForm
        res.Data.dataList.map((item) => {
          item.childItemData = []
        })
        this.voteList = res.Data.dataList
        this.mainLoading = false
        this.voteListLoading = false
      })
    },
    // 题目table数据刷新函数
    getChildList: function () {
      getVoteItemList({ voteId: this.voteId }).then((res) => {
        // 遍历当前页面表
        for (let index = 0; index < this.voteList.length; index++) {
          const item = this.voteList[index]
          if (item.voteId === this.voteId) {
            item.childItemData = res.Data
          }
        }
      })
    },
    // 题目明细table数据刷新函数
    getChildItemList: function () {
      getVoteDetailList({ voteItemId: this.voteItemId }).then((res) => {
        this.childItemDataMx = res.Data
      })
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    // 条件搜索事件
    onSearchSubmit(params) {
      let searchParams = {}
      if (params == undefined) {
        params = {}
      }
      this.mainLoading = true
      for (let index = 0; index < this.searchForm.length; index++) {
        const item = this.searchForm[index]
        if (item.name === 'voteName') {
          searchParams.voteName = item.value
        }
        if (item.name === 'voteExecutiveId') {
          searchParams.voteExecutiveId = item.value
        }
      }
      this.searchData = searchParams
      params = Object.assign(params, searchParams)
      this.getData(params)
    },
    // 重置条件搜索框
    restSearchForm() {
      this.$refs.searchForm.resetFields()
      this.mainLoading = true
      this.getData()
      this.pageSize = 20
      this.currentPage = 1
      this.searchData = {}
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      const params = { pageSize: val }
      this.getData(params)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      const param = { page: val }
      // 判断是否有路径传参，如果有则在路径传参基础上进行分页
      if (!this.isNullObject) {
        param.patientId = this.urlParams.patientId
      }
      this.getData(param)
    },
    // 获取row的key值
    getRowKeys(row) {
      return row.voteId
    },
    expandChange(row, index) {
      this.childItemLoading = true
      this.voteId = row.voteId
      const that = this
      if (index.length > 0) {
        getVoteItemList({ voteId: this.voteId }).then((res) => {
          console.log(res)
          // 遍历当前页面表
          row.childItemData = res.Data
          // row.childItemData.map(item => {
          //   item.childItemDataMx = []
          // })
          this.voteItemList = res.Data
          that.expands = []
          if (row) {
            that.expands.push(this.voteId) // 每次push进去的是每行的ID
          }
        })
      } else {
        that.expands = [] // 默认不展开
      }
      this.childItemLoading = false // 设置table中的扩展项，展开的voteId
    },
    // 停用问卷
    closeVote(parmas) {
      this.voteListLoading = true
      MessageBox.confirm('您确定要停用此问卷吗  ?', '问卷停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          closeVote(parmas)
            .then((res) => {
              Message({
                message: '停用成功！',
                type: 'success',
                duration: 5 * 1000,
              })
              this.getData()
            })
            .catch((err) => {
              Message({
                message: '停用失败！',
                type: 'error',
                duration: 5 * 1000,
              })
              this.voteListLoading = false
              return err
            })
        })
        .catch((err) => {
          console.log(err)
        })
      this.voteListLoading = false
    },
    // 开启问卷
    openVote(params) {
      this.voteListLoading = true
      MessageBox.confirm('您确定要开启此问卷吗  ?', '问卷开启', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          openVote(params)
            .then((res) => {
              Message({
                message: '开启成功！',
                type: 'success',
                duration: 5 * 1000,
              })
              this.getData()
            })
            .catch((err) => {
              Message({
                message: '开启失败',
                type: 'error',
                duration: 5 * 1000,
              })
              this.voteListLoading = false
              return err
            })
        })
        .catch((err) => {
          console.log(err)
        })
      this.voteListLoading = false
    },
    // 删除问卷
    delVote(params) {
      this.voteListLoading = true
      MessageBox.confirm('您确定要删除此问卷吗  ?', '问卷删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delVote(params)
            .then((res) => {
              Message({
                message: '删除成功！',
                type: 'success',
                duration: 5 * 1000,
              })
              this.getData()
            })
            .catch((err) => {
              Message({
                message: '删除失败',
                type: 'error',
                duration: 5 * 1000,
              })
              this.voteListLoading = false
              return err
            })
        })
        .catch((err) => {
          console.log(err)
        })
      this.voteListLoading = false
    },
    editVote(params) {
      this.createLoading = true
      this.dialogTitle = '编辑随访问卷'
      this.operatTypeId = params.operatTypeId
      createVoteGet(params).then((res) => {
        this.creatFormVisible = true // 打开弹窗
        const { Data } = res
        this.createVoteForm.createFormItems = Data
        const createFormItem = this.createVoteForm.createFormItems
        for (let index = 0; index < createFormItem.length; index++) {
          const item = createFormItem[index]
          if (item.type === 'picker' && item.value === 0) {
            item.value = null
          }
        }
        this.createLoading = false
      })
    },
    addNewVote() {
      this.createLoading = true
      this.dialogTitle = '新增随访问卷'
      this.operatTypeId = 1
      createVoteGet({ operatTypeId: this.operatTypeId }).then((res) => {
        this.creatFormVisible = true // 打开弹窗
        const { Data } = res
        this.createVoteForm.createFormItems = Data
        // 判断类型为picker的下拉框将其value改为空
        const createFormItem = this.createVoteForm.createFormItems
        for (let index = 0; index < createFormItem.length; index++) {
          const item = createFormItem[index]
          if (item.type === 'picker') {
            item.value = null
          }
        }
      })
    },
    handleClose(done) {
      done()
    },
    // 随访问卷提交
    formSubmit() {
      this.$refs.createVoteForm.validate((valid) => {
        if (valid) {
          const data = this.createVoteForm.createFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.submitData[item.name] = item.value
          }
          // 提交时需要传operatTypeId
          const operatData = { operatTypeId: this.operatTypeId }
          this.submitData = Object.assign(this.submitData, operatData)
          createVotePost(this.submitData).then((res) => {
            const { Code } = res
            if (Code === 1) {
              this.creatFormVisible = false
              this.$refs.createVoteForm.resetFields()
              // 添加完毕后刷新数据
              this.getData()
              if (this.operatTypeId === 3) {
                Message({
                  message: '问卷修改成功！',
                  type: 'success',
                  duration: 5 * 1000,
                })
              } else {
                Message({
                  message: '问卷添加成功！',
                  type: 'success',
                  duration: 5 * 1000,
                })
              }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    pickerCtrlShowOrHide(list, currentListChild) {
      // 显示隐藏联动
      console.log(currentListChild)
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
                    break
                  } else {
                    element.isdisplay = true
                    //隐藏后如果属于二级则需要置空二级切隐藏三级
                    element.value = null
                    this.pickerCtrlShowOrHide(list, element)
                  }
                }
              }
            }
          }
        }
      }
    },
    // 随访问卷题目上移
    moveUpVote(parma) {
      this.childItemLoading = true
      moveUpVoteItem(parma)
        .then((res) => {
          // 操作之后刷新子table数据
          this.getChildList()
          this.childItemLoading = false
        })
        .catch((err) => {
          Message({
            message: err.Msg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
    },
    // 随访问卷题目下移
    moveDownVote(parma) {
      this.childItemLoading = true
      moveDownVoteItem(parma)
        .then((res) => {
          // 操作之后刷新子table数据
          this.getChildList()
          this.childItemLoading = false
        })
        .catch((err) => {
          Message({
            message: err.Msg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
    },
    // 停用题目
    closeVoteItem(parmas) {
      this.childItemLoading = true
      MessageBox.confirm('您确定要停用此题目吗  ?', '题目停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          closeVoteItem(parmas)
            .then((res) => {
              Message({
                message: '停用成功！',
                type: 'success',
                duration: 5 * 1000,
              })
              // 操作之后刷新子table数据
              this.getChildList()
              this.childItemLoading = false
            })
            .catch((err) => {
              Message({
                message: '停用失败！',
                type: 'error',
                duration: 5 * 1000,
              })
              this.childItemLoading = false
              return err
            })
        })
        .catch((err) => {
          console.log(err)
        })
      this.childItemLoading = false
    },
    // 开启题目
    openVoteItem(params) {
      this.childItemLoading = true
      MessageBox.confirm('您确定要开启此题目吗  ?', '题目开启', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          openVoteItem(params)
            .then((res) => {
              Message({
                message: '开启成功！',
                type: 'success',
                duration: 5 * 1000,
              })
              // 操作之后刷新子table数据
              this.getChildList()
              this.childItemLoading = false
            })
            .catch((err) => {
              Message({
                message: '开启失败',
                type: 'error',
                duration: 5 * 1000,
              })
              this.childItemLoading = false
              return err
            })
        })
        .catch((err) => {
          console.log(err)
        })
      this.childItemLoading = false
    },
    // 删除题目
    delVoteItem(params) {
      this.childItemLoading = true
      MessageBox.confirm('您确定要删除此题目吗  ?', '题目删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delVoteItem(params)
            .then((res) => {
              Message({
                message: '删除成功！',
                type: 'success',
                duration: 5 * 1000,
              })
              // 操作之后刷新子table数据
              this.getChildList()
              this.childItemLoading = false
            })
            .catch((err) => {
              Message({
                message: '删除失败',
                type: 'error',
                duration: 5 * 1000,
              })
              this.childItemLoading = false
              return err
            })
        })
        .catch((err) => {
          console.log(err)
        })
      this.childItemLoading = false
    },
    // 编辑题目
    editVoteItem(param) {
      this.voteLoading = true
      this.voteDialogTitle = '编辑题目'
      this.operatTypeId = param.operatTypeId
      const params = {
        operatTypeId: param.operatTypeId,
        voteItemId: param.voteItemId,
        voteId: this.voteId,
      }
      createVoteItemGet(params).then((res) => {
        this.voteFormVisible = true // 打开弹窗
        const { Data } = res
        this.voteItemForm.voteFormItems = Data
        const voteFormItem = this.voteItemForm.voteFormItems
        for (let index = 0; index < voteFormItem.length; index++) {
          const item = voteFormItem[index]
          if (item.type === 'picker' && item.value === 0) {
            item.value = null
          }
          if (item.type === 'text') {
            if (item.value === false || item.value === true) {
              item.value = null
            }
          }
          if (item.name === 'VoteItemTypeId') {
            item.isMust = true
          }
        }
        this.voteLoading = false
      })
    },
    // 新增题目
    addVote() {
      this.voteLoading = true
      this.voteDialogTitle = '新增题目'
      this.operatTypeId = 1
      const params = {
        operatTypeId: 1,
        voteId: this.voteId,
      }

      createVoteItemGet(params).then((res) => {
        this.voteFormVisible = true // 打开弹窗
        const { Data } = res
        this.voteItemForm.voteFormItems = Data
        const voteFormItem = this.voteItemForm.voteFormItems
        for (let index = 0; index < voteFormItem.length; index++) {
          const item = voteFormItem[index]
          if (item.type === 'picker' && item.value === 0) {
            item.value = null
          }
          if (item.type === 'text') {
            if (item.value === false || item.value === true) {
              item.value = null
            }
          }
          if (item.name === 'VoteItemTypeId') {
            item.isMust = true
          }
        }
        // 解决页面刷新出现表单验证bug，数据加载完毕清除表单验证。
        this.$nextTick(() => {
          this.$refs.voteItemForm.clearValidate()
        })
        this.voteLoading = false
      })
      this.voteLoading = false
    },
    // 新建编辑题目提交
    voteFormSubmit() {
      this.$refs.voteItemForm.validate((valid) => {
        if (valid) {
          this.childItemLoading = true
          this.buttonLoading = true
          const data = this.voteItemForm.voteFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            this.voteSubmitData[item.name] = item.value
          }
          // 编辑时需要传operatTypeId
          const operatData = { operatTypeId: this.operatTypeId }
          this.voteSubmitData = Object.assign(this.voteSubmitData, operatData)
          createVoteItemPost(this.voteSubmitData)
            .then((res) => {
              const { Code } = res
              if (Code === 1) {
                this.voteFormVisible = false
                this.$refs.voteItemForm.resetFields()
                // 操作之后刷新子table数据
                this.getChildList()
                if (this.operatTypeId === 3) {
                  Message({
                    message: '题目修改成功！',
                    type: 'success',
                    duration: 5 * 1000,
                  })
                } else {
                  Message({
                    message: '题目添加成功！',
                    type: 'success',
                    duration: 5 * 1000,
                  })
                }
                this.childItemLoading = false
              }
              this.buttonLoading = false
            })
            .catch((err) => {
              console.log(err)
              this.buttonLoading = false
            })
        } else {
          this.buttonLoading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取row的key值
    getRowKeysItem(row) {
      return row.voteItemId
    },
    expandChangeItem(row, index) {
      this.childItemLoadingMx = true
      this.voteItemId = row.voteItemId
      const that = this
      if (index.length > 0) {
        getVoteDetailList({ voteItemId: this.voteItemId }).then((res) => {
          // 遍历当前页面表
          this.childItemDataMx = res.Data
          that.expandsItem = []
          if (row) {
            that.expandsItem.push(this.voteItemId) // 每次push进去的是每行的ID
          }
        })
      } else {
        that.expandsItem = [] // 默认不展开
      }
      this.childItemLoadingMx = false // 设置table中的扩展项，展开的voteId
    },

    // 随访问卷题目明细上移
    moveUpVoteDetail(parma) {
      this.childItemLoadingMx = true
      moveUpVoteDetail(parma)
        .then((res) => {
          // 操作之后刷新子table数据
          this.getChildItemList()
          this.childItemLoadingMx = false
        })
        .catch((err) => {
          Message({
            message: err.Msg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
      this.childItemLoadingMx = false
    },
    // 随访问卷题目明细下移
    moveDownVoteDetail(parma) {
      this.childItemLoadingMx = true
      moveDownVoteDetail(parma)
        .then((res) => {
          // 操作之后刷新子table数据
          this.getChildItemList()
          this.childItemLoadingMx = false
        })
        .catch((err) => {
          Message({
            message: err.Msg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
      this.childItemLoadingMx = false
    },
    // 删除题目明细
    delVoteDetail(parmas) {
      this.childItemLoadingMx = true
      MessageBox.confirm('您确定要删除此明细吗  ?', '明细删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delVoteDetail(parmas)
            .then((res) => {
              Message({
                message: '删除成功！',
                type: 'success',
                duration: 5 * 1000,
              })
              // 操作之后刷新子table数据
              this.getChildItemList()
              this.childItemLoadingMx = false
            })
            .catch((err) => {
              Message({
                message: '删除失败！',
                type: 'error',
                duration: 5 * 1000,
              })
              this.childItemLoadingMx = false
              return err
            })
        })
        .catch((err) => {
          console.log(err)
        })
      this.childItemLoadingMx = false
    },
    // 编辑题目明细
    createVoteDetail(param) {
      this.voteItemDialogTitle = '编辑题目明细'
      this.operatTypeId = param.operatTypeId
      this.voteItemLoading = true
      const params = {
        operatTypeId: param.operatTypeId,
        VoteDetailId: param.voteDetailId,
        VoteItemId: this.voteItemId,
        VoteId: this.voteId,
      }
      createVoteDetailGet(params)
        .then((res) => {
          this.voteItemFormVisible = true // 打开弹窗
          const { Data } = res
          this.voteItemChildForm.voteChildFormItems = Data
          const voteChildFormItem = this.voteItemChildForm.voteChildFormItems
          for (let index = 0; index < voteChildFormItem.length; index++) {
            const item = voteChildFormItem[index]
            if (item.type === 'picker' && item.value === 0) {
              item.value = null
            }
            if (item.type === 'text') {
              if (item.value === false || item.value === true) {
                item.value = null
              }
            }
          }
        })
        .catch((err) => {
          Message({
            message: err.Data.errorMsg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
      this.voteItemLoading = false
    },
    // 新增题目明细
    addVoteMx() {
      this.voteItemDialogTitle = '新增题目明细'
      this.operatTypeId = 1
      const params = {
        operatTypeId: this.operatTypeId,
        VoteItemId: this.voteItemId,
        VoteId: this.voteId,
      }
      createVoteDetailGet(params)
        .then((res) => {
          this.voteItemFormVisible = true // 打开弹窗
          this.voteItemLoading = true
          const { Data } = res
          this.voteItemChildForm.voteChildFormItems = Data
          const voteChildFormItem = this.voteItemChildForm.voteChildFormItems
          for (let index = 0; index < voteChildFormItem.length; index++) {
            const item = voteChildFormItem[index]
            if (item.type === 'picker' && item.value === 0) {
              item.value = null
            }
            if (item.type === 'text') {
              if (item.value === false || item.value === true) {
                item.value = null
              }
            }
          }
          this.voteItemLoading = false
        })
        .catch((err) => {
          Message({
            message: err.Data.errorMsg,
            type: 'error',
            duration: 5 * 1000,
          })
        })
      this.voteItemLoading = false
    },
    // 新建编辑题目明细提交
    voteItemFormSubmit() {
      this.voteItemLoading = true
      this.buttonLoading = true
      this.$refs.voteItemChildForm.validate((valid) => {
        if (valid) {
          const data = this.voteItemChildForm.voteChildFormItems
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            if (item.name !== '') {
              this.voteItemSubmitData[item.name] = item.value
            }
          }
          // 编辑时需要传operatTypeId
          const operatData = { operatTypeId: this.operatTypeId }
          this.voteItemSubmitData = Object.assign(
            this.voteItemSubmitData,
            operatData
          )
          createVoteDetailPost(this.voteItemSubmitData)
            .then((res) => {
              const { Code } = res
              if (Code === 1) {
                this.voteItemFormVisible = false
                this.$refs.voteItemChildForm.resetFields()
                // 操作之后刷新子table数据
                this.getChildItemList()
                if (this.operatTypeId === 3) {
                  Message({
                    message: '题目明细修改成功！',
                    type: 'success',
                    duration: 5 * 1000,
                  })
                } else {
                  Message({
                    message: '题目明细添加成功！',
                    type: 'success',
                    duration: 5 * 1000,
                  })
                }
              }
              this.buttonLoading = false
            })
            .catch((err) => {
              Message({
                message: err.Data.errorMsg,
                type: 'error',
                duration: 5 * 1000,
              })
            })
          this.voteItemLoading = false
        } else {
          this.voteItemLoading = false
          console.log('error submit!!')
          return false
        }
      })
      this.voteItemLoading = false
    },
    //随访问卷详情
    goVotePlanDetail(parma) {
      this.$router.push({
        path: '/doctor/followVisit/votePlan/detail',
        query: parma,
      })
    },
    //随访问卷题目详情
    goVoteItemDetail(parma) {
      this.$router.push({
        path: '/doctor/followVisit/votePlan/detail',
        query: parma,
      })
    },
    //随访问卷题目明细详情
    GetVoteDetailDetails(parma) {
      this.$router.push({
        path: '/doctor/followVisit/votePlan/detail',
        query: parma,
      })
    },
    checkPermission,
  },
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: $bg;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  /*color: $bg;*/
  cursor: pointer;
}
</style>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.dashboard {
  &-container {
    margin: 30px 0 0;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.table_warpper {
  background: #ecf1f5;
  padding: 20px;
  box-sizing: border-box;
}
.table_con {
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(169, 169, 169, 0.08);
  border-radius: 5px;
}
.addNewPlan {
  border-bottom: 1px solid #efefef;
  line-height: 60px;
}
.table_info {
  padding: 20px 30px;
  box-sizing: border-box;
}
.primaryBtn {
  padding: 0 0 30px 60px;
  display: flex;
  justify-content: center;
  .restBtn {
    background: #e1e5ec;
    margin-left: 20px;
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
.checkBtn {
  text-align: center;
  cursor: pointer;
  position: relative;
  font-size: 18px;
  color: #999999;
  &.check {
    color: $bg;
    &::before {
      content: '';
      display: block;
      width: 80%;
      height: 3px;
      background: $bg;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 12px;
    background: #cecece;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
.childTable-wrapper {
  padding: 15px;
  position: relative;
  .addVoteButton {
    position: absolute;
    right: 25px;
    top: 25px;
  }
}

.dialog-footer {
  text-align: center;
}
</style>
