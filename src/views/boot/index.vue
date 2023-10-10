<template>
  <div class="boot">
    <div class="boot-logo">
      <h6 class="big-tit">早癌筛查智能管理平台</h6>
      <div class="boot-Item">
        <img
          src="@/assets/boot/boot-logo1.png"
          alt=""
          class="boot-logo-1"
        />
        <div class="boot-line hidden-xs-only"></div>
        <img
          src="@/assets/boot/boot-logo2.png"
          alt=""
          class="boot-logo-2"
        />
      </div>
    </div>
    <div class="boot-menu">
      <el-row
        type="flex"
        class="boot-menu-top"
        justify=""
      >
        <el-col
          :span="9"
          :offset="3"
          :xs="{ span: 24, offset: 0 }"
        >
          <el-col :span="14">
            <div class="boot-menu-top-left">
              <router-link :to="{ path: '/patient/home' }">
                <img
                  class="boot-icon"
                  src="@/assets/boot/boot-icon1.png"
                  alt=""
                />
                <span>患者版</span>
              </router-link>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="boot-menu-top-right">
              <a
                href="javascript:void(0);"
                class="qr-block"
              >
                <img
                  :src="publicCodeUrl"
                  class="qr-img"
                  alt=""
                >
                <span>微信服务号</span>
                <!-- <div class="qr-content">
                  <img
                    :src="publicCodeUrl"
                    class="qr-img"
                    alt=""
                  >
                  <p class="qr-desc">打开微信“扫一扫”</p>
                </div> -->
              </a>
            </div>
          </el-col>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        class="boot-menu-top"
        justify=""
      >
        <el-col
          :span="9"
          :offset="2"
          :xs="{ span: 24, offset: 0 }"
        >
          <el-col :span="10">
            <div class="boot-menu-top-left">
              <a
                href="javascript:void(0);"
                class="qr-block"
              >
                <img
                  :src="qrCodeUrl"
                  class="qr-img"
                  alt=""
                >
                <span>微信小程序</span>
                <!-- <div class="qr-content">
                  <img
                    :src="qrCodeUrl"
                    class="qr-img"
                    alt=""
                  >
                  <p class="qr-desc">打开微信“扫一扫”</p>
                </div> -->
              </a>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="boot-menu-top-right">
              <a @click="checkLogin">
                <img
                  class="boot-icon"
                  src="@/assets/boot/boot-icon4.png"
                  alt=""
                />
                <span>专业版</span>
              </a>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <div class="footer-bottom">
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="24">
          <p>
            <span class="footer-bottom-span">备案号：<a
                href="https://beian.miit.gov.cn/"
                target="_blank"
              >{{icp}}</a></span>
            <span class="footer-bottom-span">工信部链接：<a
                href="https://beian.miit.gov.cn/"
                target="_blank"
              >https://beian.miit.gov.cn</a></span>
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
      </el-row>
    </div>
  </div>
</template>
<script>
import { checkLogin } from '@/utils/common'
export default {
  data() {
    const setHtmlFontSize = () => {
      if (this.$route.path == '/') {
        const htmlDom = document.getElementsByTagName('html')[0]
        const htmlWidth =
          document.documentElement.clientWidth || document.body.clientWidth
        if (htmlWidth >= 750) {
          htmlDom.style.fontSize = `${htmlWidth / 19.2}px`
        } else {
          htmlDom.style.fontSize = `${htmlWidth / 7.5}px`
        }
      }
    }
    window.onresize = setHtmlFontSize
    setHtmlFontSize()
    return {
      qrCodeUrl: require('@/assets/common/wechatApplet.jpg'), //微信小程序
      publicCodeUrl: require('@/assets/common/wechatPublic.png'), //微信公众号
      copyRight: '佰惠早筛健康技术（北京）有限公司　CopyRight ©2022',
      icp: '京ICP备2021032145号-1',
    }
  },
  methods: {
    checkLogin() {
      checkLogin()
    },
  },
}
</script>
<style lang="scss">
.el-message.el-message--info {
  font-size: 14px;
}
.el-message__icon {
  font-size: 14px;
}
</style>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.boot {
  background: url(../../assets/boot/boot-bg.jpg) no-repeat center;
  background-size: cover;
  height: 100%;
  overflow: hidden;
  padding: 0.15rem;
  position: relative;
  .boot-logo {
    padding: 0.68rem 1rem 0.6rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (orientation: portrait) {
      display: block;
      text-align: center;
      padding: 0.6rem 0.2rem 0.2rem;
      img {
        margin-top: 0.4rem;
        margin-bottom: 0.4rem;
      }
      .hidden-xs-only {
        display: none;
      }
    }
    .boot-Item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .big-tit {
      font-size: 0.4rem;
      color: #fff;
    }
    .boot-logo-1 {
      width: 3.56rem;
    }
    .boot-logo-2 {
      width: 2.25rem;
    }
    .boot-logo-3 {
      width: 4.87rem;
    }
    .boot-line {
      width: 0.02rem;
      height: 0.7rem;
      background: #fff;
      margin: 0 0.6rem;
    }
  }
  .boot-menu {
    .boot-menu-top {
      margin-bottom: 0.3rem;
    }
    .boot-menu-top,
    .boot-menu-bottom {
      .boot-menu-top-left {
        text-align: center;
        background: rgba($color: #fff, $alpha: 0.2);
        border-radius: 0.1rem;
        margin: 0 0.15rem;
      }
      .boot-menu-top-right {
        text-align: center;
        background: rgba($color: #fff, $alpha: 0.2);
        border-radius: 0.1rem;
        margin: 0 0.15rem;
      }
    }
    a {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 0.1rem;
    }
    a:hover {
      background: url(../../assets/boot/boot-hover.png) repeat;
    }
    .qr-block {
      position: relative;
      .qr-content {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 0.4rem 0.2rem 0.2rem 0.2rem;
        background: url(../../assets/boot/boot-hover.png) repeat;
        opacity: 0;
        z-index: -1;
        transition: all 0.2s linear;
        .qr-img {
          width: 1.5rem;
        }
      }
      .qr-desc {
        font-size: 0.15rem;
        color: #fff;
        text-align: center;
      }
      &:hover {
        .qr-content {
          opacity: 1;
          z-index: 10;
        }
      }
    }

    .boot-icon {
      width: 1rem;
      height: 1rem;
      margin: 0.7rem auto 0.4rem;
      display: block;
    }
    .qr-img {
      width: 1.5rem;
      height: 1.5rem;
      margin: 0.3rem auto 0.3rem;
      display: block;
    }
    span {
      font-size: 0.3rem;
      color: #fff;
      display: block;
      margin-bottom: 0.3rem;
    }
  }
  .footer-bottom {
    line-height: inherit;
    font-size: 0.15rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    .footer-bottom-span {
      margin-left: 20px;
      display: flex;
      align-items: center;
    }
    p {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0;
      a {
        color: #fff;
      }
      a.wangBei {
        display: flex;
        align-items: center;
        justify-content: start;
        img {
          margin-right: 5px;
        }
      }
    }
    a:hover {
      text-decoration: underline;
    }
  }
}
</style>

