<template>
  <div class="navbar">
    <el-menu
      :default-active="$route.path"
      mode="horizontal"
      class="el-menu-demo"
      router
      :text-color="textColor"
      :active-text-color="activeTextColor"
      @select="handleSelect"
    >
      <!-- 循环一级路由 -->
      <template v-for="item in navList">
        <!-- 判断一级路由是否有子级，hidden判断是否显示 -->
        <template v-if="item.children">
          <!-- 循环二级路由 -->
          <template v-for="child in item.children">
            <!-- 判断是否有三级路由 -->
            <el-submenu v-if="child.children" :index="child.index + ''" :key="child.index">
              <template slot="title">{{child.meta.title}}</template>
              <template v-for="child_2 in child.children">
                <template v-if="!child_2.hidden">
                  <el-menu-item :index="child_2.index + ''" :key="child_2.index">
                    {{ child_2.meta.title }}
                  </el-menu-item>
                </template>
              </template>
            </el-submenu>
            <template v-else>
              <el-menu-item v-if="!child.hidden" :key="child.path" :index="child.path">
                {{ child.meta.title }}
              </el-menu-item>
            </template>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import variables from "@/styles/variables.scss";
export default {
  data() {
    return {
      textColor: variables.subMenuHover,
      activeTextColor: variables.bg,
      navList: [],
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      // console.log(this.$route);
    },
  },
  created() {
    this.navList = this.$router.options.routes;
  },
  computed: {
    variables() {
      return variables;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
</style>



