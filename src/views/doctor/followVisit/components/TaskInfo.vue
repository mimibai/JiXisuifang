<template>
  <div class="descriptions-baseline">
    <el-descriptions :column="2">
      <el-descriptions-item label="任务名称">{{
        taskInfo.taskName
      }}</el-descriptions-item>
      <el-descriptions-item label="任务时间">{{
        taskInfo.taskStartDate
      }}</el-descriptions-item>
      <el-descriptions-item label="执行人类别">{{
        taskInfo.executive
      }}</el-descriptions-item>
      <el-descriptions-item label="任务状态">
        <el-tag
          size="mini"
          :type="taskInfoStateType"
        >
          {{ taskInfo.state }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="运行时长">
        {{ taskInfo.runTime }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="1">
      <el-descriptions-item label="最近异常回访">
        <template v-if="taskInfo.abnormalVisitCount > 0">
          <span class="font-error">{{ taskInfoAbnormalVisit.currentDateTime }}&nbsp;&nbsp;&nbsp;&nbsp;{{
            taskInfoAbnormalVisit.abnormalTypeName
          }}
            <el-badge
              :value="taskInfo.abnormalVisitCount"
              class="item"
            />
          </span>
          <el-dropdown class="description-taskdropdown">
            <span class="el-dropdown-link">
              查看更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in taskInfo.abnormalData"
                :key="index"
              >
                <div class="dropdown-desc-items">
                  <div class="dropdown-desc-items-item">
                    <span>时间:</span>
                    <span class="font-color-orange">{{
                      item.currentDateTime
                    }}</span>
                  </div>
                  <div class="dropdown-desc-items-item">
                    <span>医生:</span>
                    <span class="font-color-orange">{{
                      item.currentOperationDoctorName
                    }}</span>
                  </div>
                  <div class="dropdown-desc-items-item">
                    <span>描述:</span>
                    <span class="font-color-orange">{{
                      item.abnormalTypeName
                    }}</span>
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button
            type="text"
            size="mini"
          >暂无</el-button>
        </template>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="1">
      <el-descriptions-item label="消息发送情况">
        <template v-if="taskInfo.messageCount > 0">
          <span class="font-error">{{ taskInfoMessage.sendDate }}&nbsp;&nbsp;&nbsp;&nbsp;{{
            taskInfoMessage.isRead === true ?'已读':'未读'
          }}
            <el-badge
              :value="taskInfo.messageCount"
              class="item"
            />
          </span>
          <el-dropdown class="description-taskdropdown">
            <span class="el-dropdown-link">
              查看更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in taskInfo.messageData"
                :key="index"
              >
                <div class="dropdown-desc-items">
                  <div class="dropdown-desc-items-item">
                    <span>时间:</span>
                    <span class="font-color-orange">{{
                      item.sendDate
                    }}</span>
                  </div>
                  <div class="dropdown-desc-items-item">
                    <span>描述:</span>
                    <span class="font-color-orange">{{
                      item.isRead === true ?'已读':'未读'
                    }}</span>
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button
            type="text"
            size="mini"
          >暂无</el-button>
        </template>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="1">
      <el-descriptions-item label="任务详情"><span class="font-color-orange">{{
        taskInfo.taskDetail
      }}</span></el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
export default {
  props: {
    taskData: Object
  },
  data() {
    return {
      taskInfo: this.taskData,
      taskInfoStateType: 'success',
      taskInfoAbnormalVisit: {
        abnormalTypeName: '',
        currentDateTime: '',
        currentOperationDoctorName: ''
      },
      taskInfoMessage: {
        sendDate: '',
        isRead: true
      }
    }
  },
  watch: {
    taskData() {
      this.taskInfo = this.taskData
      if (this.taskInfo.state == '等待执行') {
        this.taskInfoStateType = ''
      } else if (this.taskInfo.state == '进行中') {
        this.taskInfoStateType = 'success'
      } else if (this.taskInfo.state == '已超期') {
        this.taskInfoStateType = 'danger'
      } else if (this.taskInfo.state == '已完成') {
        this.taskInfoStateType = 'success'
      } else if (this.taskInfo.state == '超期完成') {
        this.taskInfoStateType = 'warning'
      } else {
        this.taskInfoStateType = 'info'
      }
      this.taskInfoAbnormalVisit = this.taskData.abnormalData[0]
      this.taskInfoMessage = this.taskData.messageData[0]
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scope>
.font-color-orange {
  color: #b2642a;
}
.font-error {
  color: #f56c6c;
}
.descriptions-baseline .el-descriptions-item__container {
  align-items: baseline;
}
.description-taskdropdown {
  margin-left: 25px;
  font-size: 12px;
}
.dropdown-desc-items {
  display: flex;
  &-item {
    margin-right: 10px;
  }
}
</style>
