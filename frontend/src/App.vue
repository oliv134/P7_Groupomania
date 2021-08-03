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
  beforeMount() {
    // controle de la présence d'un token et d'un user id
    const token = localStorage.getItem("userToken");
    const user = JSON.parse(localStorage.getItem("userData"));
    if (token && user && !this.$store.state.isLogged) {
      this.$store.dispatch("setToken", token);
      this.$store.dispatch("setUser", user);
    }
  },
};
</script>