<template>
  <div>
    <Banner
      :banner-list="bannerList"
      :height="height"
      :arrow="arrow"
      :indicator-position="indicatorPosition"
    />
    <div class="mine-container-msg">
      <div v-loading="loading" class="order-com">
        <div v-show="pEReserveDate.checkSign==200" class="order-com-top">
          <img class="order-com-img" src="@/assets/common/success.png">
          <span class="order-com-title" style="color:#d87d39">
            {{ pEReserveDate.checkState }}
          </span>
        </div>
        <div v-show="pEReserveDate.checkSign!=200" class="order-com-top">
          <img class="order-com-img" src="@/assets/common/hint.png">
          <span class="order-com-title" style="color:#717070">
            {{ pEReserveDate.checkState }}
          </span>
        </div>
        <div class="order-com-hosp">
          <el-row type="flex" justify="space-between">
            <el-col :span="18">
              <h2>{{ pEReserveDate.hospitalName }}</h2>
              <h2 class="hosp-name">{{ pEReserveDate.reserveDate }}  {{ pEReserveDate.reserveTime }}  <span class="hosp-change" @click="changeDatePe()">改期</span></h2>
            </el-col>
            <el-col :span="2">
              <div class="order-com-posi" @click="mapShow">
                <i class="el-icon-position" style="font-size: 28px; color: #d87d39;vertical-align: middle;" />
                <span>导航</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="order-com-map" :style="isShow==false?'position: absolute;z-index: -1;':''">
          <baidu-map :hospital-loacation="hospitalLoacation" />
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
            <i class="el-icon-user-solid" /><span>姓名</span>：{{ pEReserveDate.name }}
          </p>
          <p class="order-com-info">
            <i class="el-icon-phone" /><span>手机号码</span>：{{ pEReserveDate.phone }}
          </p>
          <p class="order-com-info">
            <i class="el-icon-postcard" /><span>证件号码</span>：{{ pEReserveDate.idCard }}
          </p>
        </div>
        <div class="order-com-detail">
          <div class="order-com-meal">
            <el-row type="flex" justify="space-between">
              <el-col :span="19">
                <p class="order-com-title">
                  {{ pEReserveDate.pePackageName }}
                </p>
              </el-col>
              <el-col :span="4">
                <a class="order-com-state" @click="goToPeDetail(pEReserveDate.pePackageId)">查看详情</a>
              </el-col>
            </el-row>
            <p class="order-com-num">{{ pEReserveDate.pePackageDetailCountText }}</p>
          </div>
          <div v-if="pEReserveDate.pePackageDetails!==undefined && pEReserveDate.pePackageDetails.length > 0" class="order-com-info">
            <div v-for="(item,index) in pEReserveDate.pePackageDetails" :key="item.index" class="com-info-wrapper">
              <el-row type="flex" justify="space-between">
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
              <div v-for="(item,index) in pEReserveDate.addItems" :key="item.index" class="com-info-wrapper">
                <el-row type="flex" justify="space-between">
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
        <div v-if="pEReserveDate.checkSign==200 && pEReserveDate.payAmount!=''" class="order-com-price">
          预估金额：{{ pEReserveDate.payAmount }}
        </div>
        <!-- 备注 暂时没有备注，医院没有地方存 -->
        <div class="order-com-remark">
          <p class="remark-tit">备注（选填）</p>
          <textarea class="remark-text" rows="8" placeholder="如有特殊需求请在此留言" maxlength="-1" name="remark" />
        </div>
        <!-- 注意事项 -->
        <div v-if="pEReserveDate.additionalData!== undefined && pEReserveDate.additionalData!==null" class="order-com-attent">
          <p class="attent-tit">{{ pEReserveDate.additionalData.noteData.title }}</p>
          <p v-for="(item,index) in pEReserveDate.additionalData.noteData.dataList" :key="item.index" class="attent-matters">
            {{ index+1 }}、{{ item }}
          </p>
        </div>
        <div class="order-com-link">
          <el-button
            round
            type="primary"
            :loading="submitPEReserveLoading"
            @click="submitPEReserve"
          >
            立即预约
          </el-button>
        </div>
      </div>
    </div>

    <!--预约改期弹窗-->
    <el-dialog title="体检预约" :visible.sync="changeDatedialog" width="35%">
      <div>
        <change-date
          :is-show-patient="isShowPatient"
          :change-pe-date-patient="changePeDatePatient"
          @chooseTimeFun="chooseTimeFun"
        />
      </div>
      <span slot="footer" class="dialog-footer">
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
import { GetPEReserve, GetHospitalLoacation, SubmitPEReserve, UpdateReserveTime } from '@/api/peOrder'
import Banner from '@/components/Banner/index'
import BaiduMap from '@/components/BaiduMap/index'
import ChangeDate from '@/components/ChoosePeDate/index.vue'
import { Message, MessageBox } from 'element-ui'
export default {
  // 注册组件
  components: {
    Banner,
    BaiduMap,
    ChangeDate
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
          imgUrl: require('@/assets/screening/banner1.jpg')
        }
      ],
      isShow: false,
      pEReserveDate: [],
      hospitalLoacation: [],
      submitPEReserveLoading: false,
      changeDatedialog: false, // 预约改期弹窗
      changePeDatePatient: {}, // 预约改期弹窗内人物信息
      isShowPatient: false,
      changeDateSubmitLoading: false,
      succaAppointment: [],
      chosePeDatas: null // 改期后信息
    }
  },
  created() {
    this.getData()
    GetHospitalLoacation().then(res => {
      this.hospitalLoacation = res.Data
      this.loading = false
      console.log(res.Data)
    })
  },
  methods: {
    getData() {
      const pePackageId = this.$route.params.pePackageId
      const PatientId = this.$route.params.PatientId
      const peReserveId = this.$route.params.peReserveId
      const peReserveTemporaryId = this.$route.params.peReserveTemporaryId
      console.log('体检套餐Id：' + pePackageId)
      console.log('体检人Id：' + PatientId)
      console.log('体检人Id：' + peReserveId)
      console.log('临时体检人Id：' + peReserveTemporaryId)
      GetPEReserve({ peReserveTemporaryId: peReserveTemporaryId }).then((res) => {
        this.pEReserveDate = res.Data
        console.log(res.Data)
        this.loading = false
      })
    },
    mapShow() {
      this.isShow = !this.isShow
    },
    goToPeDetail(id) {
      this.$router.push({
        name: 'PeAppointmentDetail',
        params: { pePackageId: id }
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
        peReserveTemporaryId: this.$route.params.peReserveTemporaryId
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
        console.log(this.chosePeDatas.peReserveId)
        UpdateReserveTime(this.chosePeDatas)
          .then((res) => {
            this.succaAppointment = res.Data
            Message({
              message: '预约改期成功！',
              type: 'success',
              duration: 5 * 1000
            })
            this.getData()
            this.changeDateSubmitLoading = false
            this.changeDatedialog = false
          })
          .catch((err) => {
            Message({
              message: '操作失败！',
              type: 'error',
              duration: 5 * 1000
            })
            this.changeDatedialog = false
            return err
          })
      } else {
        Message({
          message: '请选择正确的日期！',
          type: 'error',
          duration: 5 * 1000
        })
        this.changeDateSubmitLoading = false
      }
    },
    submitPEReserve() {
      MessageBox.confirm('你确定要预约当前号源吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SubmitPEReserve({ peReserveTemporaryId: this.$route.params.peReserveTemporaryId }).then((res) => {
          Message({
            message: '预约成功！',
            type: 'success',
            duration: 5 * 1000
          })
          this.$router.push({
            name: 'PeOrderDetail',
            params: { peReserveId: res.Data }
          })
        })
        this.submitPEReserveLoading = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .mine-container-msg {
        padding: 50px;
        background: #ffffff;
        width: 1200px;
        margin: 50px auto;
    }
    .order-com{
        width: 100%;
        border-radius: 10px;
        background: #fbfbfb;
        position: relative;
        .order-com-top{
            padding: 10px 20px;
            border-bottom: 1px solid #ebeef5;
            line-height: 30px;
            font-weight: 600;
            background: #f4f4f4;
            text-align: center;
            font-size: 20px;
            .order-com-img{
                width: 28px;
                vertical-align: middle;
                margin-right: 5px;
            }
            .order-com-title{
                vertical-align: middle;
                font-size: 22px;
            }
        }
        .order-com-hosp{
            padding: 10px 20px;
            border-bottom: 1px solid #ebeef5;
            h2{
                line-height: 36px;
                font-size: 22px;
            }
            .hosp-name{
                color: #B2642A;
                .hosp-change{
                  margin-left: 30px;
                  font-size: 20px;
                  cursor: pointer;
                }
            }
            .order-com-posi{
                line-height: 70px;
                cursor: pointer;
                span{
                    margin-left: 5px;
                }
            }
        }
        .order-com-map{
            width: 100%;
        }
        .order-com-mess{
            padding: 10px 20px;
            border-bottom: 1px solid #ebeef5;
            .order-com-info{
                font-size: 16px;
                line-height: 30px;
                span{
                    font-weight: 600;
                    display: inline-block;
                    width: 75px;
                    text-align: justify;
                    text-align-last: justify;
                    margin-left: 10px;
                }
                i{
                    font-size: 20px;
                    color: #B2642A;
                    vertical-align: middle;
                }
            }
            h2{
                line-height: 36px;
                font-size: 22px;
            }
        }
        .order-com-detail{
            padding: 10px 20px;
            .order-com-meal{
                .order-com-title{
                    line-height: 36px;
                    font-size: 20px;
                    font-weight: 600;
                }
                .order-com-state{
                    float: right;
                    line-height: 36px;
                    font-size: 16px;
                    &:hover{
                        color: #c37032;
                    }
                }
                .order-com-num{
                    font-size: 16px;
                    color: #676767;
                    line-height: 26px;
                    margin-bottom: 10px;
                }
            }
            .order-com-info{
                .com-info-wrapper{
                    background: #fdf2ea;
                    padding: 0 10px;
                    .com-info-p{
                        font-size: 16px;
                        line-height: 24px;
                        padding: 10px 0;

                    }
                }
            }
        }
        .order-com-price{
            text-align: right;
            padding-right: 20px;
            box-sizing: border-box;
            font-size: 20px;
            color: #B2642A;
            font-weight: 600;
            line-height: 50px;
            border-bottom: 1px solid #ebeef5;
        }
        .order-com-remark{
            padding: 10px 20px;
            border-bottom: 1px solid #ebeef5;
            .remark-tit{
                line-height: 36px;
                font-size: 20px;
                font-weight: 600;
            }
            .remark-text{
                resize: none;
                width: 100%;
                border: 1px solid #ebeef5;
                padding: 10px;
                box-sizing: border-box;
                margin-top: 10px;
            }
        }
        .order-com-attent{
            padding: 10px 20px;
            border-bottom: 1px solid #ebeef5;
            .attent-tit{
                line-height: 36px;
                font-size: 20px;
                font-weight: 600;
            }
            .attent-matters{
                font-size: 16px;
                padding: 5px 0;
                line-height: 24px;
            }
        }
        .order-com-link{
            padding: 20px 0;
            text-align: center;
        }
    }
</style>
