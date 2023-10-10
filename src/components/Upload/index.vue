<template>
  <div>
    <el-form>
      <el-upload
        name="file"
        :limit="limit"
        action=""
        accept="image/*"
        :http-request="uploadFile"
        list-type="picture-card"
        :file-list="fileList"
        :on-exceed="handleExceed"
        :disabled="canEdit"
        ref="upload"
        :on-preview="handlePictureCardPreview"
        :on-remove="beforeRemove"
        v-loading='loading'
        :before-upload="beforeAvatarUpload"
      >
        <i
          slot="default"
          class="el-icon-plus"
        ></i>
        <div
          slot="file"
          slot-scope="{file}"
        >
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          >
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="beforeRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
      <el-progress
        :percentage="progressPercent"
        :class="{ proDisplay: progressFlag }"
      ></el-progress>
      <el-dialog :visible.sync="dialogVisible">
        <img
          width="100%"
          :src="dialogImageUrl"
          alt=""
        />
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
import { uploadImg } from '@/api/upload'

export default {
  props: {
    limit: Number,
    fileList: Array,
    canEdit: Boolean,
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      baseUrl: '', //为防止前后端不在同一服务器可能需要添加此项
      progressPercent: 0,
      progressFlag: true, // 关闭进度条
      loading: false,
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isType =
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/jpg' ||
        file.type === 'image/jpeg'
      const isLt5M = file.size / 1024 < 1024 * 5
      if (!isType) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为png, gif, jpg, jpeg的图片',
        })
      }
      if (!isLt5M) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于5Mb',
        })
      }
      return isType && isLt5M
    },
    uploadFile(e) {
      const file = e.file
      const params = new FormData()
      params.append('files', file) // 图片
      this.loading = true
      uploadImg(params).then((res) => {
        console.log(res)
        if (res.Code === 1) {
          this.$message.success('上传成功')
          this.loading = false
          if (this.fileList.length > 0) {
            let fileData = {
              name: file.name,
              url: this.baseUrl + res.Data,
            }
            this.fileList.push(fileData)
            console.log('多张')
          } else {
            let fileData = {
              name: file.name,
              url: this.baseUrl + res.Data,
            }
            this.fileList.push(fileData)
            console.log('一张')
          }
        } else {
          this.$message.error('上传失败')
        }
      })
    },
    // 图片上传超过数量限制
    handleExceed(files, fileList) {
      this.$message.error('图片数量超出限制!')
      console.log(files, fileList)
    },
    //图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //图片下载
    handleDownload(file) {
      console.log(file)
      const image = new Image()
      // 解决跨域 canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        const url = canvas.toDataURL('image/png')//默认为png格式
        // 生成一个 a 标签
        const a = document.createElement('a')
        // 创建一个点击事件
        const event = new MouseEvent('click')
        // 将 a 的 download 属性设置为我们想要下载的图片的名称，若 name 不存在则使用'图片'作为默认名称
        a.download = file.name || '图片'
        // 将生成的 URL 设置为 a.href 属性
        a.href = url
        // 触发 a 的点击事件
        a.dispatchEvent(event)
      }
      image.src = file.url
    },

    // 删除图片
    beforeRemove(file, fileList) {
      if (this.fileList.indexOf(file) > -1) {
        // 1.获取将要删除图片的临时路径
        const url = file.url
        // console.log("删除图片", file.url);
        const filePath = url
        // 2.从this.fileList数组中，找到图片对应的索引值
        const i = this.fileList.findIndex((x) => x.url === filePath)
        // 3.调用splice方法，移除图片信息
        this.fileList.splice(i, 1)
      }
    },
  },
}
</script>
<style lang="scss">
.disabled .el-upload--picture-card {
  display: none;
}
// .el-upload-list__item.is-ready {
//   display: none !important;
// }
.el-upload-list__item {
  transition: none !important;
}
.proDisplay {
  display: none;
}
</style>

