<template>
  <div class="footer">
    <div class="container">
      <div class="footer-top">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col :span="11">
            <div class="footer-top-logo">
              <img
                src="@/assets/common/footerLogo.png"
                alt="佰泽医疗集团"
                title="佰泽医疗集团"
              >
            </div>
            <div class="footer-top-friendlink">
              <friend-link />
            </div>
          </el-col>
          <el-col :span="5">
            <div class="footer-top-imgcode">
              <!-- <el-row type="flex" :gutter="20" justify="space-between">
                <el-col :span="12">
                  <img src="@/assets/common/wechatApplet.png" alt="微信小程序" title="微信小程序">
                </el-col>
                <el-col :span="12">
                  <img src="@/assets/common/wechatPublic.png" alt="微信服务号" title="微信服务号">
                </el-col>
            </el-row> -->
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="footer-line" />
    <div class="container">
      <div class="footer-bottom">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col :span="24">
            <p class="footer-bottom-p">
              <span class="footer-bottom-span">版权所有：{{ copyRight }}</span>
              <span class="footer-bottom-span">备案号：<a
                href="https://beian.miit.gov.cn/"
                target="_blank"
              >{{ icp }}</a></span>
              <span class="footer-bottom-span">
                <a
                  href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010602104401"
                  target="_blank"
                  class="wangBei"
                >　<img
                  src="@/assets/boot/wangBei.png"
                  style=""
                >京公网安备 11010602104401号</a>
              </span>
            </p>
          </el-col>
          <!-- <el-col :span="8">
            <div class="footer-bottom-right">
                  <span>技术支持：</span>
                  <a href="https://www.54doctor.net/" target="_blank"><img class="supportLogo" src="@/assets/common/54Doctor.png" alt="54Doctor"></a>
              </div>
          </el-col> -->
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import FriendLink from './FriendLink.vue'
export default {
  components: {
    FriendLink
  },
  data() {
    return {
      footerLogo: '',
      copyRight: '佰惠早筛健康技术（北京）有限公司　CopyRight ©2022',
      icp: '京ICP备2021032145号-1'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.footer {
  background: $bg;
  font-size: 15px;
  color: $lightGray;
  &-top {
    line-height: inherit;
    padding: 25px 0;
    &-logo {
      margin-bottom: 25px;
    }
    &-imgcode img {
      max-width: 100%;
    }
  }
  &-line {
    background: $lightGray;
    height: 1px;
  }
  &-bottom {
    line-height: inherit;
    padding: 25px 0;
    &-p {
      display: flex;
      .footer-bottom-span {
        margin-right: 10px;
        display: flex;
        align-items: center;
        a:hover {
          text-decoration: underline;
        }
        a.wangBei {
          display: flex;
          align-items: center;
          img {
            margin-right: 5px;
          }
        }
      }
    }
    &-right {
      text-align: right;
    }
  }
  .supportLogo {
    width: 55px;
  }
}
</style>

