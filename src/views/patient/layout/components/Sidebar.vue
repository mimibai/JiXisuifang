<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.patientMenuBg"
        :text-color="variables.patientMenuText"
        :unique-opened="false"
        :active-text-color="variables.patientMenuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "@/components/SideBar/SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["sidebar", "permission_routes"]),
    routes() {
      //循环到
      let partentRouters = this.permission_routes;
      for (let index = 0; index < partentRouters.length; index++) {
        const item = partentRouters[index];
        if (item.displayLocation == 4) {
          // console.log(item.children);
          return item.children;
        }
      }
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
  },
  created() {
    // console.log(this.routes);
  },
};
</script>
