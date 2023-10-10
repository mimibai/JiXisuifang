<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      ref="searchForm"
      :model="{ searchForm }"
      :inline="true"
      :label-width="labelWidth"
      :label-position="labelPosition"
    >
      <template v-for="(item,index) in searchForm">
        <el-form-item
          v-if="item.type == 4 || item.type == 3"
          :key="item.index"
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
          v-if="item.type == 5 && item.name == 'startExecuteDate' || item.name == 'joinDate'"
          :key="item.index"
          :label="item.title"
          :prop="item.name"
        >
          <el-col>
            <el-date-picker
              v-model="item.value"
              type="daterange"
              start-placeholder="任务开始时间"
              end-placeholder="任务结束时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:330px"
              :clearable="false"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="item.type == 1 && item.name == 'startAge'"
          :key="item.index"
          :label="item.title"
          :prop="'searchForm.' + index + '.value'"
          :rules="[
            {required:false},
            { trigger: 'blur', validator: validPositiveNumber },
            { trigger: 'blur', validator:validMinNumber3}
          ]"
        >
          <el-input
            v-model="item.value"
            placeholder="请填写开始年龄"
            :style="'width:' + styleWidth"
          />
        </el-form-item>
        <el-form-item
          v-if="item.type == 1 && item.name == 'endAge'"
          :key="item.index"
          :prop="'searchForm.' + index + '.value'"
          :rules="[
            {required:false},
            { trigger: 'blur', validator: validPositiveNumber },
            { trigger: 'blur', validator:validMaxNumber100}
          ]"
        >
          <el-input
            v-model="item.value"
            placeholder="请填写结束年龄"
            :style="'width:' + styleWidth"
          />
        </el-form-item>
        <el-form-item
          v-if="
            item.type == 1 && item.name != 'startAge' && item.name != 'endAge'
          "
          :key="item.index"
          :label="item.title"
        >
          <el-input
            v-model="item.value"
            :placeholder="'请填写' + item.title"
            :style="'width:' + styleWidth"
          />
        </el-form-item>
      </template>
    </el-form>
    <div class="primaryBtn">
      <el-button
        class="searchBtn"
        icon="el-icon-search"
        type="primary"
        @click="onSearchSubmit"
      >查询</el-button>
      <el-button
        class="restBtn"
        icon="el-icon-refresh-left"
        @click="restSearchForm"
      >重置</el-button>
    </div>
  </div>
</template>
<script>
import { validPositiveNumber } from '@/utils/validate'

export default {
  components: {},
  props: {
    searchForm: Array,
    labelPosition: String,
    params: Object,
    styleWidth: String,
    labelWidth: String
  },
  data() {
    return {
      searchData: {
      },
      minAge: null,
      maxAge: null
    }
  },
  methods: {
    // 条件搜索事件
    onSearchSubmit(params) {
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          const searchParams = {}
          if (params === undefined) {
            params = {}
          }
          for (let index = 0; index < this.searchForm.length; index++) {
            const item = this.searchForm[index]
            // 处理开始和结束日期
            if (item.name === 'startExecuteDate') {
              for (let j = 0; j < item.value.length; j++) {
                searchParams['startExecuteDate'] = item.value[0]
                searchParams['endExecuteDate'] = item.value[1]
              }
            } else if (item.name !== 'endExecuteDate' && item.name !== 'joinEndDate') {
              searchParams[item.name] = item.value
            }
            if (item.name === 'joinDate') {
              for (let j = 0; j < item.value.length; j++) {
                searchParams['joinDate'] = item.value[0]
                searchParams['joinEndDate'] = item.value[1]
              }
            }
          }
          this.searchData = searchParams
          params = Object.assign(this.params, searchParams)
          this.$emit('GetSearchData', this.searchData)
          this.$emit('getData', params)
        } else {
          return false
        }
      })
    },
    // 重置条件搜索框
    restSearchForm() {
      this.$refs.searchForm.resetFields()
      this.$emit('restSearchForm')
      this.searchData = {}
      this.$emit('GetSearchData', this.searchData)
    },
    // 自定义校验规则：正整数
    validPositiveNumber(rule, value, callback) {
      if (value === '') {
        return callback()
      } else if (!validPositiveNumber(value)) {
        return callback(new Error('请输入正确的年龄'))
      } else {
        return callback()
      }
    },
    // 自定义校验规则:整数大与3
    validMinNumber3(rule, value, callback) {
      if (value === '') {
        return callback()
      } else if (value < 3 || value > 100) {
        return callback(new Error('开始年龄需大与3小于100'))
      } else {
        this.minAge = value
        console.log(this.minAge, this.maxAge)
        if (this.maxAge != null && Number(this.minAge) > Number(this.maxAge)) {
          return callback(new Error('开始年龄需小与结束年龄'))
        } else {
          return callback()
        }
      }
    },
    // 自定义校验规则:整数小与100
    validMaxNumber100(rule, value, callback) {
      if (value === '') {
        return callback()
      } else if (value < 3 || value > 100) {
        return callback(new Error('结束年龄需小与100大与3'))
      } else {
        this.maxAge = value
        if (this.minAge != null && Number(this.minAge) > Number(value)) {
          return callback(new Error('结束年龄需大与开始年龄'))
        } else {
          return callback()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.primaryBtn {
  display: flex;
  justify-content: center;
  padding: 0 0 30px 60px;
  .restBtn {
    background: #e1e5ec;
    margin-left: 20px;
  }
}
</style>
