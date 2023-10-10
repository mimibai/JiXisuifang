<template>
  <div>
    <span v-if="
        prop == 'isEnable' || prop == 'isStorageData' || prop == 'isAssignLastResult'
          || prop == 'isRealItem'|| prop == 'isRequired' || prop == 'isEmptyOption'|| prop == 'isAppendText'
      ">
      <el-tag
        v-if="row[prop] === true"
        type="success"
      >是</el-tag>
      <el-tag
        v-else-if="row[prop] === false"
        type="danger"
      >否</el-tag>
    </span>
    <div v-else-if="prop == 'buttonList'">
      <el-button
        v-for="(item, i) in btnList"
        :key="i"
        :type="item.type"
        size="small"
        @[eventName]="
          handleClick({
            clickTypeId: item.clickTypeId,
          })
        "
      >{{ item.title }}</el-button>
      <el-dropdown
        v-if="showSelect"
        class="btn-dropDowm"
        @command="handleCommand"
      >
        <el-button size="small">
          更多功能<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in selectList"
            :key="item.clickTypeId"
            :command="{
              clickTypeId: item.clickTypeId,
              state:
                item.clickTypeId == 9 && row.isPublicResult == true ? '1' : '2',
            }"
          >{{ item.title }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <span v-else-if="prop == '序号'">
      {{ rowIndex }}
    </span>
    <span v-else>{{ row[prop] }}</span>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'VoteCell',
  props: {
    prop: String,
    row: Object,
    rowIndex: Number,
  },
  data() {
    return {
      eventName: 'click',
      btnList: this.row.buttonList,
      selectList: this.row.moreButtonList,
      showSelect: false,
    }
  },
  watch: {
    row() {
      this.btnList = this.row.buttonList
      this.selectList = this.row.moreButtonList
      this.checkBtnList()
    },
  },
  created() {
    this.checkBtnList()
  },
  methods: {
    // 如果moreButtonList个数大于1，则显示更多工能按钮
    checkBtnList() {
      if (
        this.row.moreButtonList != null &&
        this.row.moreButtonList.length >= 1
      ) {
        this.showSelect = true
      } else {
        this.showSelect = false
      }
    },
    // 动态绑定操作按钮的点击事件
    handleClick(param) {
      const i = param.clickTypeId
      // console.log(i)
      // 随访问卷启用
      if (i === 32) {
        this['openVote']()
      }
      // 随访问卷停用
      if (i === 33) {
        this['closeVote']()
      }
      // 随访问卷编辑
      if (i === 31) {
        this['editVote']()
      }
      // 随访问卷删除
      if (i === 34) {
        this['delVote']()
      }
      // 随访问卷题目编辑
      if (i === 39) {
        this['editVoteItem']()
      }
      // 随访问卷题目启用
      if (i === 40) {
        this['openVoteItem']()
      }
      // 随访问卷题目停用
      if (i === 41) {
        this['closeVoteItem']()
      }
      // 随访问卷题目删除
      if (i === 42) {
        this['delVoteItem']()
      }
      // 随访问卷题目上移
      if (i === 43) {
        this['moveUpVote']()
      }
      // 随访问卷题目下移
      if (i === 44) {
        this['moveDownVote']()
      }
      // 随访问卷题目明细编辑
      if (i === 45) {
        this['createVoteDetail']()
      }
      // 随访问卷题目明细删除
      if (i === 46) {
        this['delVoteDetail']()
      }
      // 随访问卷题目明细上移
      if (i === 47) {
        this['moveUpVoteDetail']()
      }
      // 随访问卷题目明细下移
      if (i === 48) {
        this['moveDownVoteDetail']()
      }
      // 随访问卷详情
      if (i === 81) {
        this['goVotePlanDetail']()
      }
      // 随访问卷题目详情
      if (i === 82) {
        this['goVoteItemDetail']()
      }
      // 随访问卷题目详情
      if (i === 83) {
        this['GetVoteDetailDetails']()
      }
    },
    // 随访问卷停用
    closeVote() {
      this.$emit('closeVote', {
        voteId: this.row.voteId,
      })
    },
    // 随访问卷开启
    openVote() {
      this.$emit('openVote', {
        voteId: this.row.voteId,
      })
    },
    // 随访问卷编辑
    editVote() {
      const param = {
        voteId: this.row.voteId,
        operatTypeId: 3,
      }
      this.$emit('editVote', param)
    },
    // 随访问卷删除
    delVote() {
      this.$emit('delVote', {
        voteId: this.row.voteId,
      })
    },
    // 随访方问卷题目上移
    moveUpVote() {
      this.$emit('moveUpVote', {
        voteItemId: this.row.voteItemId,
      })
    },
    // 随访问卷题目下移
    moveDownVote() {
      this.$emit('moveDownVote', {
        voteItemId: this.row.voteItemId,
      })
    },
    // 随访问卷题目启用
    openVoteItem() {
      this.$emit('openVoteItem', {
        VoteItemId: this.row.voteItemId,
      })
    },
    // 随访问卷题目停用
    closeVoteItem() {
      this.$emit('closeVoteItem', {
        VoteItemId: this.row.voteItemId,
      })
    },
    // 随访问卷题目删除
    delVoteItem() {
      this.$emit('delVoteItem', {
        voteItemId: this.row.voteItemId,
      })
    },
    // 随访问卷题目编辑
    editVoteItem() {
      const param = {
        operatTypeId: 3,
        voteItemId: this.row.voteItemId,
      }
      this.$emit('editVoteItem', param)
    },
    // 随访方问卷题目上移
    moveUpVoteDetail() {
      this.$emit('moveUpVoteDetail', {
        voteDetailId: this.row.voteDetailId,
      })
    },
    // 随访问卷题目下移
    moveDownVoteDetail() {
      this.$emit('moveDownVoteDetail', {
        voteDetailId: this.row.voteDetailId,
      })
    },
    // 随访问卷题目删除
    delVoteDetail() {
      this.$emit('delVoteDetail', {
        voteDetailId: this.row.voteDetailId,
      })
    },
    // 随访问卷题目明细编辑
    createVoteDetail() {
      const param = {
        operatTypeId: 3,
        voteDetailId: this.row.voteDetailId,
      }
      this.$emit('createVoteDetail', param)
    },
    // 随访问卷详情
    goVotePlanDetail() {
      this.$emit('goVotePlanDetail', {
        voteId: this.row.voteId,
      })
    },
    // 随访问卷题目详情
    goVoteItemDetail() {
      this.$emit('goVoteItemDetail', {
        voteItemId: this.row.voteItemId,
      })
    },
    // 随访问卷题目明细详情
    GetVoteDetailDetails() {
      this.$emit('GetVoteDetailDetails', {
        voteDetailId: this.row.voteDetailId,
      })
    },
    handleCommand(command) {
      this.handleClick(command)
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-dropDowm {
  margin-left: 10px;
}
</style>
