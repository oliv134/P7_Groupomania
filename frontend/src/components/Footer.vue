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
      v-if="$store.state.search.content"
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
      if (this.$route.path != "/posts") {
        this.$router.push("/posts");
      }
      if (this.$store.state.whatPosts !== "search") {
        this.$store.dispatch("setSearchExpand", false);
        this.$store.dispatch("setSearchText", "");
        this.$store.dispatch("getPosts");
      } else {
        this.$store.dispatch("setSearchText", this.$store.state.search.content);
        this.findPosts();
        this.$store.dispatch("setSearchExpand", true);
      }
    },
    findPosts() {
      if (this.$route.path != "/posts") {
        this.$router.push("/posts");
      }
      this.$store.dispatch("setSearchContent", this.$store.state.search.text);
      this.$store.dispatch("setWhatPosts", "search");
      if (this.$store.state.search.content ) {this.$store.dispatch("findPosts", this.$store.state.search.content)}
    },
    clearFind() {
      this.$store.dispatch("setSearchContent", "");
      this.$store.dispatch("setSearchText", "");
      this.$store.dispatch("setWhatPosts", "all");
      this.$store.dispatch("getPosts");
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.admin;
    },
  },
};
</script>
<style lang="scss" scoped></style>
