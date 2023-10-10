<template>
  <div class="mine-container-msg">
    <div
      v-loading="loading"
      class="order-com"
    >
      <template>
        <el-alert
          v-if="pEReserveDate.checkSign==200"
          :title="pEReserveDate.checkState"
          type="success"
          show-icon
          :closable="false"
        >
        </el-alert>
        <el-alert
          v-show="pEReserveDate.checkSign!=200"
          :title="pEReserveDate.checkState"
          type="info"
          show-icon
          :closable="false"
        >
        </el-alert>
      </template>
      <div class="order-com-hosp">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col :span="18">
            <h2>{{ pEReserveDate.hospitalName }}</h2>
            <h2 class="hosp-name">{{ pEReserveDate.reserveDate }} {{ pEReserveDate.reserveTime }}
              <el-button
                type="primary"
                icon="el-icon-edit"
                v-if="pEReserveDate.checkSign==200"
                @click="changeDatePe()"
                class="hosp-change"
                size="mini"
              >改期</el-button>
            </h2>
          </el-col>
          <el-col :span="3">
            <div
              class="order-com-posi"
              @click="mapShow"
            >
              <i
                class="el-icon-position"
                style="font-size: 22px; color: #d87d39;vertical-align: middle;"
              />
              <span>导航</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div
        class="order-com-map"
        :style="isShow==false?'position: absolute;z-index: -1;':''"
      >
        <tencent-map :hospital-loacation="hospitalLoacation" />
      </div>
      <div class="order-com-mess">
        <p class="order-com-info">
          <i class="el-icon-document-remove" /><span>订单编号</span>：{{ pEReserveDate.checkCode }}
        </p>
        <p class="order-com-info">
          <i class="el-icon-alarm-clock" /><span>下单时间</span>：{{ pEReserveDate.registTime }}
        </p>
      </div>
      <div class="order-com-mess">
        <h2>体检人信息</h2>
        <p class="order-com-info">
          <i class="el-icon-user" /><span>姓名</span>：{{ pEReserveDate.name }}
        </p>
        <p class="order-com-info">
          <i class="el-icon-phone-outline" /><span>手机号码</span>：{{ pEReserveDate.phone }}
        </p>
        <p
          class="order-com-info"
          v-if="pEReserveDate.documentCode != null && pEReserveDate.documentCode !=''"
        >
          <i class="el-icon-postcard" /><span>证件号码</span>：{{ pEReserveDate.documentCode }}
        </p>
      </div>
      <div class="order-com-detail">
        <div class="order-com-meal">
          <el-row
            type="flex"
            justify="space-between"
          >
            <el-col :span="19">
              <p class="order-com-title">
                {{ pEReserveDate.pePackageName }}
              </p>
            </el-col>
            <el-col :span="4">
              <a
                class="order-com-state"
                @click="goToPeDetail(pEReserveDate.pePackageId)"
              >查看详情</a>
            </el-col>
          </el-row>
          <p class="order-com-num">{{ pEReserveDate.pePackageDetailCountText }}</p>
        </div>
        <div
          v-if="pEReserveDate.pePackageDetails!==undefined && pEReserveDate.pePackageDetails.length > 0"
          class="order-com-info"
        >
          <div
            v-for="(item,index) in pEReserveDate.pePackageDetails"
            :key="item.index"
            class="com-info-wrapper"
          >
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col :span="19">
                <p class="com-info-p">
                  {{ index+1 }}、{{ item.peItemName }}
                </p>
              </el-col>
              <el-col :span="4">
                <p class="com-info-p com-info-addPrice">{{ item.peItemPrice }}</p>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="pEReserveDate.addItems!==undefined && pEReserveDate.addItems.length > 0">
          <div class="order-com-meal">
            <p class="order-com-title">增加项目</p>
            <p class="order-com-num">{{ pEReserveDate.addItemCountText }}</p>
          </div>
          <div class="order-com-info">
            <div
              v-for="(item,index) in pEReserveDate.addItems"
              :key="item.index"
              class="com-info-wrapper"
            >
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col :span="19">
                  <p class="com-info-p">
                    {{ index+1 }}、{{ item.peItemName }}
                  </p>
                </el-col>
                <el-col :span="4">
                  <p class="com-info-p com-info-addPrice">{{ item.peItemPrice }}</p>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="pEReserveDate.checkSign==200 && pEReserveDate.payAmount!=''"
        class="order-com-price"
      >
        预估金额：{{ pEReserveDate.payAmount }}
      </div>
      <!-- 备注 暂时没有备注，医院没有地方存 -->
      <div class="order-com-remark">
        <p class="remark-tit">备注（选填）</p>
        <textarea
          class="remark-text"
          rows="8"
          placeholder="如有特殊需求请在此留言"
          maxlength="-1"
          name="remark"
        />
      </div>
      <!-- 注意事项 -->
      <div
        v-if="pEReserveDate.additionalData!== undefined && pEReserveDate.additionalData!==null"
        class="order-com-attent"
      >
        <p class="attent-tit">{{ pEReserveDate.additionalData.noteData.title }}</p>
        <p
          v-for="(item,index) in pEReserveDate.additionalData.noteData.dataList"
          :key="item.index"
          class="attent-matters"
        >
          {{ index+1 }}、{{ item }}
        </p>
      </div>
      <div
        v-show="pEReserveDate.checkSign==200"
        class="order-com-link"
      >
        <el-button
          v-for="n in pEReserveDate.buttonList"
          :key="n.index"
          round
          type="primary"
          :loading="cancelPEReserveLoading"
          @click="cancelPEReserve(n.clickTypeId)"
        >{{ n.title }}</el-button>
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
import {
  GetPEReserve,
  GetHospitalLoacation,
  CancelPEReserve,
  UpdateReserveTime,
} from '@/api/peOrder'
import TencentMap from '@/components/TencentMap/index'
import { Message, MessageBox } from 'element-ui'
import ChangeDate from '@/components/ChoosePeDate/index.vue'

export default {
  components: {
    TencentMap,
    ChangeDate,
  },
  data() {
    return {
      isShow: false,
      loading: true,
      pEReserveDate: [],
      hospitalLoacation: {},
      cancelPEReserveLoading: false,
      changeDatedialog: false, // 预约改期弹窗
      changePeDatePatient: {}, // 预约改期弹窗内人物信息
      isShowPatient: true,
      changeDateSubmitLoading: false,
      succaAppointment: [],
      chosePeDatas: null, // 改期后信息
      pePackageId: null,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const id = this.$route.params.peReserveId
      GetPEReserve({ peReserveId: id }).then((res) => {
        this.pePackageId = res.Data.pePackageId
        this.pEReserveDate = res.Data
        this.loading = false
      })
    },
    mapShow() {
      GetHospitalLoacation().then((res) => {
        this.hospitalLoacation = res.Data
        this.loading = false
        this.isShow = !this.isShow
      })
    },
    goToPeDetail(id) {
      this.$router.push({
        name: 'PeAppointmentDetail',
        params: { pePackageId: id },
      })
    },
    // 体检预约改期
    changeDatePe() {
      this.changeDatedialog = true
      this.changePeDatePatient = {
        name: this.pEReserveDate.name,
        checkCode: this.pEReserveDate.checkCode,
        pePackageName: this.pEReserveDate.pePackageName,
        sex: this.pEReserveDate.sex,
        peReserveId: this.pEReserveDate.peReserveId,
        nowReserveTime: this.pEReserveDate.reserveTime, // 当前预约日期
        hospitalId: this.pEReserveDate.hospitalId,
      }
    },
    // 选择体检时间
    chooseTimeFun(chosePeDatas) {
      this.chosePeDatas = chosePeDatas
    },
    // 改期提交
    changeDateSubmit() {
      this.changeDateSubmitLoading = true
      if (this.chosePeDatas != null && this.chosePeDatas.time != null) {
        UpdateReserveTime(this.chosePeDatas)
          .then((res) => {
            this.succaAppointment = res.Data
            Message({
              message: '预约改期成功！',
              type: 'success',
              duration: 5 * 1000,
            })
            this.getData()
            this.changeDateSubmitLoading = false
            this.changeDatedialog = false
          })
          .catch((err) => {
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
    cancelPEReserve(clickTypeId) {
      if (clickTypeId === 30) {
        MessageBox.confirm('你确定要取消当前预约吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          CancelPEReserve({ peReserveId: this.$route.params.peReserveId }).then(
            (res) => {
              const { Code } = res
              if (Code === 1) {
                Message({
                  message: '取消成功！',
                  type: 'success',
                  duration: 5 * 1000,
                })
                this.getData()
                this.cancelPEReserveLoading = true
              }
            }
          )
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.mine-container-msg {
  padding: 50px;
  background: #ffffff;
}
.order-com {
  width: 100%;
  border-radius: 10px;
  background: #fbfbfb;
  margin-bottom: 30px;
  position: relative;
  .order-com-top {
    padding: 10px 20px;
    border-bottom: 1px solid #ebeef5;
    line-height: 30px;
    font-weight: 600;
    background: #f4f4f4;
    text-align: center;
    font-size: 20px;
    .order-com-img {
      width: 28px;
      vertical-align: middle;
      margin-right: 5px;
    }
    .order-com-title {
      vertical-align: middle;
      font-size: 22px;
    }
  }
  .order-com-hosp {
    padding: 10px 20px;
    border-bottom: 1px solid #ebeef5;
    h2 {
      line-height: 36px;
      font-size: 18px;
      font-weight: normal;
    }
    .hosp-name {
      color: $bg;
      font-size: 16px;
      display: flex;
      align-items: center;
      .hosp-change {
        margin-left: 30px;
        cursor: pointer;
      }
    }
    .order-com-posi {
      line-height: 70px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: end;
      span {
        margin-left: 5px;
      }
    }
  }
  .order-com-map {
    width: 100%;
  }
  .order-com-mess {
    padding: 10px 20px;
    border-bottom: 1px solid #ebeef5;
    .order-com-info {
      font-size: 16px;
      line-height: 36px;
      span {
        display: inline-block;
        width: 75px;
        text-align: justify;
        text-align-last: justify;
        margin-left: 10px;
        color: $bg;
      }
      i {
        font-size: 20px;
        color: $bg;
        vertical-align: middle;
      }
    }
    h2 {
      line-height: 36px;
      font-size: 18px;
      font-weight: normal;
    }
  }
  .order-com-detail {
    padding: 10px 20px;
    .order-com-meal {
      .order-com-title {
        line-height: 36px;
        font-size: 18px;
        font-weight: normal;
      }
      .order-com-state {
        float: right;
        line-height: 36px;
        font-size: 14px;
        &:hover {
          color: $bg;
        }
      }
      .order-com-num {
        font-size: 16px;
        color: #676767;
        line-height: 36px;
        margin-bottom: 10px;
      }
    }
    .order-com-info {
      .com-info-wrapper {
        background: #fdf2ea;
        padding: 0 10px;
        .com-info-p {
          font-size: 16px;
          line-height: 24px;
          padding: 10px 0;
        }
      }
    }
  }
  .order-com-price {
    text-align: right;
    padding-right: 20px;
    box-sizing: border-box;
    font-size: 20px;
    color: $bg;
    font-weight: 600;
    line-height: 50px;
    border-bottom: 1px solid #ebeef5;
  }
  .order-com-remark {
    padding: 10px 20px;
    border-bottom: 1px solid #ebeef5;
    .remark-tit {
      line-height: 36px;
      font-size: 18px;
      font-weight: normal;
    }
    .remark-text {
      resize: none;
      width: 100%;
      border: 1px solid #ebeef5;
      padding: 10px;
      box-sizing: border-box;
      margin-top: 10px;
    }
  }
  .order-com-attent {
    padding: 10px 20px;
    border-bottom: 1px solid #ebeef5;
    .attent-tit {
      line-height: 36px;
      font-size: 18px;
      font-weight: normal;
    }
    .attent-matters {
      font-size: 16px;
      padding: 6px 0;
      line-height: 28px;
    }
  }
  .order-com-link {
    padding: 20px 0;
    text-align: center;
  }
}
</style>
