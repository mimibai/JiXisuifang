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
          :style="item.type == 'display' || item.isdisplay == true ? 'display:none' : ''"
        >
          <!--复选-->
          <el-form-item
            v-if="item.type == 'multipleLookUp' && item.name == 'FollowVisitLabelIds'"
            :style="item.isdisplay ? 'display:none' : ''"
            :class="item.disabled ?'form-transfer-div-disabled' :''"
            :label="item.title"
            :prop="'list.' + index + '.value'"
          >

            <div
              class="form-transfer-div"
              @click="peItemDialog(item) "
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
              width="45%"
              append-to-body
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
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!-- start  -->

    <!-- end -->
  </div>

</template>

<script>

export default {
  name: 'AddFollow',
  components: {

  },
  data() {
    return {
      createFormLabelWidth: '220px',
      dialogpeItem: false,
      dialogpeItemyx: false,
      dialogpeItemValue: [],
      yxdialogpeItemValue: [],
      dialogpeformTransShowValue: [],
      ysdialogpeformTransShowValue: [],
      dialogpeformTransNeedValue: '',
      ysdialogpeformTransNeedValue: '',
      dialogpeItemTransferData: [],
      dialogpeTransferTit: ['尚未选择', '已选择'],
      yxdialogpeTransferTit: ['尚未选择', '已选择'],
      formData: {
        list: this.createForm
      }
    }
  },
  methods: {
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
    }

  }
}
</script>

