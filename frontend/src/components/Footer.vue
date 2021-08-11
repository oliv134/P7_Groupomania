<template >
  <v-bottom-navigation
    app
    hide-on-scroll
    horizontal
    grow
    color="indigo darken-4"
    v-if="!$vuetify.breakpoint.lgAndUp && $store.state.isLogged"
    :value="$store.state.whatPosts"
    v-on:change="getPosts"
    v-model="$store.state.whatPosts"
  >
    <v-btn value="all" aria-label="Posts récents">
      <v-icon class="mx-0">mdi-history</v-icon>
    </v-btn>
    <v-btn value="liked" aria-label="Mes likes">
      <v-icon class="mx-0">mdi-heart</v-icon>
    </v-btn>
    <v-btn
      value="search"
      aria-label="Les resultats de ma recherche"
      v-if="$store.state.search"
    >
      <v-icon class="mx-0">mdi-magnify</v-icon>
    </v-btn>
    <v-btn value="reported" aria-label="Posts signalés" v-if="isAdmin">
      <v-icon class="mx-0">mdi-alert-circle</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
export default {
  name: "PageFooter",
  data: () => ({}),
  methods: {
    getPosts() {
      if (this.$route.path !="/posts") { this.$router.push("/posts");}
      if (this.$store.state.whatPosts !== "search") {
      
        this.searchReduced = true;
        this.searchContent = "";
        this.$store.dispatch("getPosts");
      } else {
      
        this.searchContent = this.$store.state.search;
        this.findPosts();
        this.searchReduced = false;
      }
    },
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.admin;
    },
  },
};
</script>
<style lang="scss" scoped></style>
