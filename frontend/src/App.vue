<template>
  <v-app id="inspire">
    <PageHeader />
    <SideBar />

    <v-main>
      
        <router-view></router-view>
     
    </v-main>

    <page-footer></page-footer>
  </v-app>
</template>

<script>
import PageHeader from "./components/Header.vue";
import SideBar from "./components/Sidebar.vue";
import PageFooter from "./components/Footer.vue";
export default {
  name: "App",
  components: {
    PageHeader,
    SideBar,
    PageFooter,
  },
  data: () => ({
    drawer: true,
    //
  }),
};
</script>