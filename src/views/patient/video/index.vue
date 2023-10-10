<template>
  <div class="container">
    <div
      class="video-content"
      v-loading="videoLoading"
    >
      <video
        id="myVideo"
        :preload="preload"
        :poster="videoImg"
        :height="height"
        :width="width"
        align="center"
        :controls="controls"
        :autoplay="false"
      >
        <source
          :src="videoSrc"
          type="video/mp4"
        >
      </video>
      <div class="video_tit">
        <h2 class="tit_h2">{{videoTit}}<span>播放次数：{{playNum}}</span></h2>
        <p class="date_p">发布时间：{{releaseDate}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import Video from 'video.js'
import { getVideoDetail } from '@/api/video'
export default {
  name: 'Video',
  data() {
    return {
      videoLoading: true,
      videoTit: '',
      releaseDate: '2021-07-14',
      playNum: '200',
      videoSrc: '',
      videoImg: '',
      playStatus: '',
      muteStatus: '',
      isMute: true,
      isPlay: false,
      width: '100%', // 设置视频播放器的显示宽度（以像素为单位）
      height: 'auto', // 设置视频播放器的显示高度（以像素为单位）
      preload: 'auto', //  建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
      controls: true, // 确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
      autoplay: '',
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      let videoArticleId = this.$route.params.videoId
      if (videoArticleId) {
        this.getVideoDetail(videoArticleId)
      } else {
        this.$router.push({
          path: '/patient/home',
        })
      }
    },
    getVideoDetail(videoArticleId) {
      getVideoDetail({ videoArticleId }).then((res) => {
        // console.log(res)
        const { Data } = res
        const { videolist } = Data
        this.videoTit = videolist.qtitle
        this.releaseDate = videolist.time
        this.playNum = videolist.readnum
        this.$route.meta.title = videolist.title
        this.loadVideo(videolist.coverVideo)
        this.videoLoading = false
      })
    },
    loadVideo(url) {
      document.getElementById('myVideo').src = url
    },
  },
  // 自动播放属性,muted:静音播放
  // autoplay: 'muted',
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.container {
  padding-top: 50px;
  padding-bottom: 50px;
}
.video-content {
  padding: 40px 40px 0;
  background: #ffffff;
  .video_tit {
    padding: 10px 0;
    margin-top: 15px;
    border-top: 1px solid #ededed;
    .tit_h2 {
      color: #b2642a;
      font-size: 16px;
      line-height: 32px;
      span {
        float: right;
        color: #666;
        font-size: 14px;
        font-weight: 400;
      }
    }
    .date_p {
      color: #666;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .video_top {
    .video_about {
      width: 300px;
      float: right;
    }
  }
}
</style>
