<template>
  <div class="mine-container-msg">
    <div class="article-list">
      <div v-for="(item,index) in dataList" :key="index" class="article-item">
        <div class="article-item-inner" @click="gotoDetial(item)">
          <div class="article-item-content">
            <div class="article-item-header">
              {{ item.title }}
            </div>
            <i class="article-item-icon el-icon-arrow-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserUseProtocolList } from '@/api/user'
export default {
  // 注册组件
  data() {
    return {
      dataList: []
    }
  },
  created() {
    this.getUserUseProtocolList()
  },
  methods: {
    getUserUseProtocolList() {
      getUserUseProtocolList().then((res) => {
        const { Data } = res
        this.dataList = Data
      }).catch((err) => {
        console.log(err)
      })
    },
    gotoDetial(param) {
      this.$router.push(
        {
          path: '/patient/account/agreementDesDetail',
          query: {
            id: param.id,
            typeId: param.typeId
          }
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.article-item{
    border-bottom: 1px solid #ebeef5;
    color: #303133;
    padding: 15px 0;
    .article-item-inner{
        cursor: pointer;
        &:hover{
            color: $bg;
            .article-item-icon{
                color: $bg;
            }
        }
    }
}
    .article-item-content{
        display: flex;
        align-items: center;
        .article-item-icon{
            margin: 0 8px 0 auto;
        }
    }
</style>

