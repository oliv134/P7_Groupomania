<template>
  <v-app id="inspire">
    <PageHeader />
    <SideBar />

    <v-main>
      <router-view></router-view>
    </v-main>

    <PageFooter />
    <Message />
  </v-app>
</template>

<script>
import PageHeader from "./components/Header.vue";
import SideBar from "./components/Sidebar.vue";
import PageFooter from "./components/Footer.vue";
import Message from "@/components/Message.vue";

export default {
  name: "App",
  components: {
    PageHeader,
    SideBar,
    PageFooter,
    Message,
  },
  data: () => ({
    drawer: true,
    //
  }),
    computed: {
    message() {
      return this.$store.getters.message;
    },
  },
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