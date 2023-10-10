<template>
  <div>
    <Banner
      :banner-list="bannerList"
      :height="height"
      :arrow="arrow"
      :indicator-position="indicatorPosition"
    />
    <div class="container">
      <div
        v-loading="loading"
        class="container-combo"
      >
        <div class="combo-title">
          <h2>{{ pePackageDate.pePackageName }}</h2>
          <p>{{ pePackageDate.pePackageDetailCountText }}</p>
        </div>
        <div
          v-if="pePackageDate.detail!==undefined"
          class="combo-mess"
        >
          <h2>{{ pePackageDate.detail.name }}</h2>
          <p>{{ pePackageDate.detail.msg }}</p>
        </div>
        <div
          v-if="pePackageDate.notice!==undefined && pePackageDate.notice.cont.length > 0"
          class="combo-mess"
        >
          <h2>{{ pePackageDate.notice.name }}</h2>
          <div
            v-for="(item,index) in pePackageDate.notice.cont"
            :key="item.index"
          >
            <p class="com-info-p">
              {{ index+1 }}、{{ item }}
            </p>
          </div>
        </div>
        <div class="combo-mess">
          <h2>项目名称</h2>
          <div
            v-for="(item,index) in pePackageDate.pePackageDetails"
            :key="item.index"
          >
            <p class="com-info-p">
              {{ index+1 }}、{{ item.tpItemName }}
            </p>
          </div>
        </div>
        <div class="combo-link">
          <el-button
            round
            type="primary"
            @click="changeDatePe()"
          >
            下一步
          </el-button>
        </div>
      </div>
    </div>

    <!--预约改期弹窗-->
    <el-dialog
      title="体检预约"
      :visible.sync="changeDatedialog"
      width="35%"
    >
      <div>
        <change-date
          :is-show-patient="isShowPatient"
          :change-pe-date-patient="changePeDatePatient"
          :pe-package-id="pePackageId"
          @chooseTimeFun="chooseTimeFun"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="changeDatedialog = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="changeDateSubmitLoading"
          @click="changeDateSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { GetPEPackage } from '@/api/peAppointment'
import Banner from '@/components/Banner/index'
import ChangeDate from '@/components/ChoosePeDate/index.vue'
import { CancelPEReserve, CreatePEReserve } from '@/api/peOrder'
import { Message, MessageBox } from 'element-ui'
export default {
  // 注册组件
  components: {
    Banner,
    ChangeDate,
  },
  data() {
    return {
      loading: true,
      height: '440px',
      arrow: 'never',
      indicatorPosition: 'none',
      bannerList: [
        {
          id: 1,
          alt: '',
          title: '',
          link: '',
          imgUrl: require('@/assets/screening/banner1.jpg'),
        },
      ],
      pePackageDate: [],
      changeDatedialog: false, // 预约改期弹窗
      changePeDatePatient: {}, // 预约改期弹窗内人物信息
      isShowPatient: false,
      changeDateSubmitLoading: false,
      succaAppointment: [],
      pePackageId: 7,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    goToRegist(pePackageId, PatientId) {
      this.$router.push({
        name: 'PeAppointmentRegistration',
        params: {
          pePackageId: pePackageId,
          PatientId: PatientId,
          peReserveId: 51,
        },
      })
    },
    getData() {
      GetPEPackage({ pePackageId: this.pePackageId }).then((res) => {
        this.pePackageDate = res.Data
        this.loading = false
      })
    },
    // 新增体检预约
    changeDatePe(param) {
      this.changeDatedialog = true
    },
    // 选择体检时间
    chooseTimeFun(chosePeDatas) {
      this.chosePeDatas = chosePeDatas
    },
    // 改期提交
    changeDateSubmit() {
      this.changeDateSubmitLoading = true
      if (this.chosePeDatas != null && this.chosePeDatas.time != null) {
        console.log(this.chosePeDatas)
        CreatePEReserve(this.chosePeDatas)
          .then((res) => {
            this.succaAppointment = res.Data
            this.$router.push({
              name: 'PeAppointmentRegistration',
              params: {
                pePackageId: this.pePackageId,
                PatientId: 13,
                peReserveTemporaryId:
                  this.succaAppointment.peReserveTemporaryId,
              },
            })
            this.changeDateSubmitLoading = false
            this.changeDatedialog = false
          })
          .catch((err) => {
            console.log(err)

            Message({
              message: '操作失败！',
              type: 'error',
              duration: 5 * 1000,
            })
            this.changeDatedialog = false
            return err
          })
      } else {
        Message({
          message: '请选择正确的日期！',
          type: 'error',
          duration: 5 * 1000,
        })
        this.changeDateSubmitLoading = false
      }
    },
    // 取消预约
    cancelPEReserve(param) {
      MessageBox.confirm('你确定要取消当前预约吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        CancelPEReserve(param).then((res) => {
          const { Code } = res
          if (Code === 1) {
            Message({
              message: '取消成功！',
              type: 'success',
              duration: 5 * 1000,
            })
            const parm = Object.assign(this.searchFormData, {
              page: this.currentPage,
            })
            this.fetchData(parm)
            this.$forceUpdate()
          }
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.container {
  margin: 50px auto;
  padding: 50px;
  box-sizing: border-box;
  background: #ffffff;
  .container-combo {
    .combo-title {
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
      color: $bg;
      h2 {
        font-weight: normal;
        font-size: 20px;
      }
      p {
        font-size: 16px;
        color: #676767;
        margin-top: 10px;
      }
    }
    .combo-mess {
      padding: 20px 0;
      border-bottom: 1px solid #ebeef5;
      h2 {
        font-size: 18px;
        font-weight: normal;
        color: $bg;
        margin-bottom: 10px;
      }
      p {
        line-height: 28px;
        font-size: 14px;
      }
    }
    .combo-link {
      padding-top: 30px;
      text-align: center;
    }
  }
}
</style>

