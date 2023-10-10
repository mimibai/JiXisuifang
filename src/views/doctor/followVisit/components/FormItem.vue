<template>
  <div>
    <div v-if="item.isRealItem">
      <!--类型：1.多选2.单选3.textarea 4.日期 5.picker 6.省市县 7.时间-->
      <!--多选-->
      <div v-if="item.voteItemTypeId == 1">
        <el-form-item
          :ref="'list.' + index + '.value'"
          :label="item.title"
          :prop="'list.' + index + '.value'"
          :rules="{
            required: item.isRequired,
            message: '请至少选择一个',
            trigger: 'change',
          }"
        >
          <!--复选框需要数组绑定，所以用list，提交时需转换-->
          <el-checkbox-group v-model="item.list">
            <el-checkbox
              v-for="(
                itemCheck, itemIndex
              ) in item.detailList"
              :key="itemCheck.id"
              :label="String(itemCheck.id)"
              :disabled="canEdit"
              @change="
                checkBoxChange(
                  item,
                  itemIndex
                )
              "
            >{{ itemCheck.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <!--单选-->
      <div v-if="item.voteItemTypeId == 2">
        <el-form-item
          :label="item.title"
          :prop="'list.' + index + '.value'"
          :rules="{
            required: item.isRequired,
            message: '请至少选择一个',
            trigger: 'change',
          }"
        >
          <el-radio-group
            v-model="item.value"
            :disabled="canEdit"
          >
            <el-radio
              v-for="itemRadio in item.detailList"
              :key="itemRadio.name"
              :label="String(itemRadio.id)"
            >{{ itemRadio.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <!--文本-->
      <div v-if="item.voteItemTypeId == 3">
        <el-form-item
          :label="item.title"
          :prop="'list.' + index + '.value'"
          :rules="[
            {
              required: item.isRequired,
              message: '必填项不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="item.value"
            :placeholder="item.textPlaceholder"
            :disabled="canEdit"
            :autosize="{ minRows: 2, maxRows: 5}"
            type="textarea"
          />
        </el-form-item>
      </div>
      <!--日期-->
      <div v-if="item.voteItemTypeId == 4">
        <el-form-item
          :label="item.title"
          :prop="'list.' + index + '.value'"
          :rules="[
            {
              required: item.isRequired,
              message: '必填项不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-date-picker
            v-model="item.value"
            type="date"
            :disabled="canEdit"
            :placeholder="item.placeholder"
            style="width: 200px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </div>
      <!--下拉框-->
      <el-form-item
        v-if="item.voteItemTypeId == 5"
        :label="item.title"
        :prop="'list.' + index + '.value'"
        :rules="{
          required: item.isRequired,
          message: item.title + '不能为空',
          trigger: 'blur',
        }"
      >
        <el-select
          v-model="item.value"
          :placeholder="item.placeholder"
          :disabled="canEdit"
          filterable
          :label="item.title"
        >
          <el-option
            v-for="itemChild in item.detailList"
            :key="itemChild.id"
            :label="itemChild.name"
            :value="String(itemChild.id)"
          />
        </el-select>
      </el-form-item>
      <!--省市县-->
      <div v-if="item.voteItemTypeId == 6">
        <el-form-item
          :label="item.title"
          :prop="'list.' + index + '.value'"
          :rules="{
            required: item.isRequired,
            message: item.title + '不能为空',
            trigger: 'blur',
          }"
        >
          <el-cascader
            v-model="item.list"
            :disabled="canEdit"
            :class="item.addClass"
            :props="ganged"
            :placeholder="item.placeholder"
          />
        </el-form-item>
      </div>
      <!--时间-->
      <div v-if="item.voteItemTypeId == 7">
        <el-form-item
          :label="item.title"
          :prop="'list.' + index + '.value'"
          :rules="[
            {
              required: item.isRequired,
              message: '必填项不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-time-picker
            v-model="item.value"
            :picker-options="{
              selectableRange:'00:00:00 - 23:59:59'
            }"
            value-format="HH:mm:ss"
            :placeholder="item.placeholder"
            :disabled="canEdit"
          />
        </el-form-item>
      </div>
      <!-- 单图片上传 -->
      <el-form-item
        v-if="item.voteItemTypeId === 8"
        :label="item.title"
        label-width="80"
        :rules="{
          required: item.isRequired,
        }"
      >
        <Upload
          ref="Upload"
          :limit="1"
          :disabled="canEdit"
          :file-list="item.list"
        />
      </el-form-item>
      <!-- 多图片上传 -->
      <el-form-item
        v-if="item.voteItemTypeId === 9"
        :label="item.title"
        label-width="80"
        :rules="{
          required: item.isRequired,
        }"
      >
        <Upload
          ref="Upload"
          :limit="10"
          :can-edit="canEdit"
          :file-list="item.list"
        />
      </el-form-item>
    </div>
    <div v-if="!item.isRealItem">
      <h4
        v-if="item.isDisplay"
        class="big-tit"
      >
        {{ item.title }}
      </h4>
    </div>
  </div>
</template>
<script>
import Upload from '@/components/Upload/index'
import { getProvinceList, getCityList, getCountyList } from '@/api/region'
export default {
  name: 'FormItem',
  components: {
    Upload // 图片上传
  },
  props: {
    index: Number,
    item: Object,
    canEdit: Boolean
  },
  data() {
    return {
      ganged: {
        label: 'Name',
        value: 'provinceId',
        lazy: true,
        async lazyLoad(node, resolve) {
          if (node.level == 0) {
            const res = await getProvinceList()
            const nodes = res.Data
            resolve(nodes)
          } else if (node.level == 1) {
            this.value = 'cityId'
            const res = await getCityList({ provinceId: node.value })
            const nodes = res.Data
            resolve(nodes)
          } else if (node.level == 2) {
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
      baseUploadUrl: '' // 上传路径
    }
  },
  watch: {
    item() {
      if (this.item.voteItemTypeId === 6) {
        this.$set(this.item, 'addClass', 'sepcialInput')
        this.$set(this.item, 'placeholder', this.item.placeholder)
      }
    }
  },
  created() {
    if (this.item.voteItemTypeId === 6) {
      // console.log(this.itess)
      this.$set(this.item, 'addClass', 'sepcialInput')
      this.$set(this.item, 'placeholder', this.item.placeholder)
    }
  },
  methods: {
    // 多选框控制子级多选单选
    checkBoxChange(item, itemIndex) {
      // 判断是否有唯一选项
      const { detailList, list } = item
      let itemValue = list
      const currentInputData = detailList[itemIndex]
      if (currentInputData.isEmptyOption === true) {
        // 判断是初次点中还是最后一次点中
        const currentInputDataValue = String(currentInputData.id)
        if (itemValue.includes(currentInputDataValue)) {
          item.list = []
          item.list.push(currentInputDataValue)
          itemValue = [currentInputDataValue]
        }
      } else if (currentInputData.isEmptyOption === false) {
        // 如果当前选中项为正常项，需要清除置空项按钮
        // 获取置空项按钮的value
        const newArr = detailList.filter((res) => {
          if (res.isEmptyOption == true) {
            return res
          }
        })
        if (newArr.length > 0) {
          // 唯一值可能有多个，删除value中的对应值
          for (let index = 0; index < newArr.length; index++) {
            const isOnlyValue = newArr[index]
            for (let i = 0; i < itemValue.length; i++) {
              const element = itemValue[i]
              if (element === String(isOnlyValue.id)) {
                itemValue.splice(i, 1)
              }
            }
          }
        }
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
