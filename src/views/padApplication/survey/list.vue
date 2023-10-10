<template>
  <div class="caseJoinList-container">
    <el-row
      v-loading="listLoading"
      type="flex"
      justify="center"
      element-loading-text="加载中"
    >
      <el-col
        :xs="24"
        :sm="24"
        :md="18"
        :lg="12"
      >
        <div class="caseJoinList-tips">
          <PaddHospitalInfo :hospital-info="terminalHospitalInfo" />
          <el-alert
            type="success"
            :closable="false"
            show-icon
          >
            <span>当前有{{ dataLength }}条癌筛评测表待评测</span>
          </el-alert>

          <div v-if="dataLength == 0">
            <el-empty :description="descContent" />
            <div class="time">
              <span>{{ second }}</span>秒后自动返回评测首页
            </div>
          </div>
          <div
            v-else
            class="caseJoinList-list"
          >
            <div class="caseJoinList-list-title">
              <el-row type="flex">
                <el-col :span="16">
                  <h4>问卷列表</h4>
                </el-col>
                <el-col
                  :span="8"
                  style="text-align: right"
                >
                  <el-button
                    type="success"
                    size="small"
                    @click.native="goIndex"
                  >退出评测</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="caseJoinList-list-table">
              <el-table
                :data="tableData"
                style="width: 100%"
                border
              >
                <el-table-column
                  prop="code"
                  label="测评密码"
                />
                <el-table-column
                  prop="patientName"
                  label="测试人姓名"
                />
                <el-table-column
                  prop="joinDate"
                  label="参加日期"
                />
                <el-table-column
                  prop="hospitalName"
                  label="医院名称"
                />
                <el-table-column
                  prop="followupProtocolName"
                  label="参与方案"
                />
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <el-button
                      size="small"
                      type="text"
                      @click="goDetail(row.caseJoinProtocolId)"
                    >
                      开始答题
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getTerminalCaseJoinList } from '@/api/summary'
import { getCookieToken } from '@/utils/cookie'
import { Message } from 'element-ui'
import PaddHospitalInfo from '../components/PaddHospitalInfo/index.vue'
export default {
  components: { PaddHospitalInfo },
  data() {
    return {
      dataLength: 0,
      descContent: '当前已无量表需作答。',
      second: 10,
      listLoading: true,
      secretKeyToken: null, // 秘钥
      terminalHospitalInfo: {
        hospitalName: null,
        terminalName: null
      },
      tableData: []
    }
  },
  created() {
    const code = this.$route.query.code
    const terminalType = this.$route.query.TerminalType
    const secretKeyToken = getCookieToken('terminalToken')
    // code,secretKeyToken可以为空
    const parm = {}
    if (code) {
      parm.code = code
    }
    if (secretKeyToken) {
      parm.secretKeyToken = secretKeyToken
      this.secretKeyToken = secretKeyToken
    } else {
      Message({
        message: '秘钥已过期，请重新输入秘钥！',
        type: 'error',
        duration: 5 * 1000
      })
      this.$router.push({
        path: '/padApplication/checkSecretKey'
      })
    }
    if (terminalType) {
      this.fenchData(parm)
    } else {
      this.$router.push({
        path: '/padApplication'
      })
    }
  },
  mounted() {
    this.terminalHospitalInfo.hospitalName = this.$store.getters.terminalHospitalInfo.hospitalName
    this.terminalHospitalInfo.terminalName = this.$store.getters.terminalHospitalInfo.terminalName
  },
  methods: {
    fenchData(parm) {
      getTerminalCaseJoinList(parm)
        .then((res) => {
          const { Data, Msg } = res
          if (Data !== null) {
            this.dataLength = Data.length
            if (this.dataLength === 0) {
              this.downTime()
            } else {
              this.tableData = Data
            }
            this.listLoading = false
          } else {
            Message({
              message: Msg || '错误',
              type: 'error',
              duration: 5 * 1000
            })
            this.downTime()
            this.listLoading = false
          }
        })
        .catch((err) => {
          const { Msg } = err
          Message({
            message: Msg || '错误',
            type: 'error',
            duration: 5 * 1000
          })
          this.downTime()
        })
    },
    // 前往癌筛详情页
    goDetail(param) {
      const params = {
        caseJoinProtocolId: param
      }
      if (this.secretKeyToken !== null) {
        params.secretKeyToken = this.secretKeyToken
      }
      this.$router.push({
        path: '/padApplication/detail',
        query: params
      })
    },
    // 倒计时
    downTime() {
      this.timer = setInterval(() => {
        this.second--
        if (this.second === 0) {
          clearInterval(this.timer)
          this.$router.push({
            path: '/padApplication'
          })
        }
      }, 1000)
    },
    // 返回首页
    goIndex() {
      this.$router.push({
        path: '/padApplication'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.time {
  text-align: center;
  font-size: 16px;
  span {
    color: $bg;
  }
}
.caseJoinList-hospitalInfo{
  padding: 10px 0;
  color: $bg;
  font-size: 20px;
  text-align: center;
}
.caseJoinList-list-title {
  padding: 8px 16px;
  background: #f4f4f4;
  margin: 16px 0;
  h4 {
    color: $bg;
    line-height: 33px;
    font-size: 15px;
  }
}
@media only screen and (max-width: 1200px) {
  .caseJoinList-list {
    padding: 0 15px;
  }
}
</style>
