<template>
  <el-form
    ref="voteForm"
    :model="voteForm"
    :label-width="labelWidth"
    :label-position="labelPosition"
  >
    <div class="input-content">
      <div
        v-for="(item, index) in voteForm.list"
        :key="item.id"
        class=""
      >
        <form-item
          :item="item"
          :index="index"
          :can-edit="canEdit"
        />
      </div>
    </div>
    <el-form-item>
      <el-button
        type="primary"
        round
        size="mini"
        :disabled="canEdit"
        :loading="voteSubmitLoadingN"
        @click="submitVoteForm"
      >保存</el-button>
      <el-button
        round
        size="mini"
        :disabled="canEdit"
        @click="resetVoteForm"
      >重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import FormItem from './FormItem.vue'
export default {
  components: {
    FormItem
  },
  props: {
    voteData: Object,
    isCanEditForVote: Boolean,
    caseFollowVisitTaskDetailId: Number,
    voteSubmitLoading: Boolean
  },
  data() {
    return {
      voteForm: this.voteData,
      labelPosition: 'top',
      labelWidth: '',
      canEdit: !this.isCanEditForVote,
      caseFollowVisitTaskDetailIdN: this.caseFollowVisitTaskDetailId,
      voteFormData: {},
      voteSubmitLoadingN: this.voteSubmitLoading
    }
  },
  watch: {
    voteData() {
      this.voteForm = this.voteData
    },
    caseFollowVisitTaskDetailId() {
      this.caseFollowVisitTaskDetailIdN = this.caseFollowVisitTaskDetailId
    },
    isCanEditForVote() {
      this.canEdit = !this.isCanEditForVote
    },
    voteSubmitLoading() {
      this.voteSubmitLoadingN = this.voteSubmitLoading
    }
  },
  created() {},
  methods: {
    // 表单提交
    submitVoteForm() {
      this.$refs.voteForm.validate((valid) => {
        if (valid) {
          // 格式化数据
          const formData = {}
          const data = this.voteForm.list
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            console.log(item)
            // 复选框或者省市县或者图片上传
            if (item.voteItemTypeId == 1 || item.voteItemTypeId == 6) {
              formData['VoteItem' + item.id] = item.list.join(',')
            } else {
              formData['VoteItem' + item.id] = item.value
            }
            if (item.voteItemTypeId == 8 || item.voteItemTypeId == 9) {
              const urlList = item.list.map((list) => {
                return list.url
              })
              const urlListStr = urlList.join(',')
              formData['VoteItem' + item.id] = urlListStr
            }
          }
          const voteIdObj = {
            VoteId: this.voteForm.voteId
          }
          const TaskDetailIdObj = {
            CaseFollowVisitTaskDetailId: this.caseFollowVisitTaskDetailIdN
          }
          const param = Object.assign(formData, voteIdObj, TaskDetailIdObj)
          console.log(param)
          this.$emit('submitVote', param)
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetVoteForm() {
      this.$refs.voteForm.resetFields()
    }
  }
}
</script>
<style lang="scss" scope>
.font-color-orange {
  color: #b2642a;
}
.descriptions-baseline .el-descriptions-item__container {
  align-items: baseline;
}
.description-taskdropdown {
  margin-left: 25px;
  font-size: 12px;
}
</style>
