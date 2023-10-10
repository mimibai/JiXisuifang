<template>
  <div class="frinendlinks">
    <el-row style="flex">
      <el-col :span="4">
        <span class="frinendlinks-title">{{frinendLinksTitle}}</span>
      </el-col>
      <el-col :span="20">
        <div class="frinendlinks-items">
          <div
            class="frinendlinks-items-item"
            v-for="item in frinendLinks"
            :key="item.index"
          >
            <a
              :href="item.link"
              target="_blank"
            >
              {{ item.name }}
            </a>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getFriendLinkList } from '@/api/friendLink'
export default {
  data() {
    return {
      frinendLinks: null,
      frinendLinksTitle: '友情链接：',
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData: function () {
      getFriendLinkList().then((response) => {
        const { Data } = response
        if (Data.length == 0) {
          this.frinendLinksTitle = ''
        } else {
          this.frinendLinks = Data
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
$light_gray: #ddd;
.frinendlinks-items {
  display: flex;
  &-item {
    padding: 0 8px;
    border-right: 1px solid $light_gray;
  }
  &-item:last-child {
    border-right: none;
  }
}
</style>

