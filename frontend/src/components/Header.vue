const newLocal=this.$store.state.whatPosts!="search";
<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    app
    color="red lighten-4"
  >
    <v-row align="center">
      <v-col cols="3">
        <v-avatar
          @click.stop="$store.state.drawer = !$store.state.drawer"
          v-if="!$vuetify.breakpoint.lgAndUp"
        >
          <v-img
            class=""
            src="@/assets/icon-left-font-monochrome-white_mini.svg"
            alt="logo groupomania"
            max-height="40"
            max-width="100"
            contain
          >
          </v-img>
        </v-avatar>

        <v-toolbar-title class="ml-3 text-uppercase">
          <router-link to="/">
            <v-img
              class=""
              src="@/assets/icon-left-font-monochrome-black.svg"
              alt="logo groupomania"
              max-height="60"
              max-width="140"
              contain
              v-if="$vuetify.breakpoint.lgAndUp"
            >
            </v-img>
          </router-link>
        </v-toolbar-title>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="8" md="6" align="right">
        <v-text-field
          class="mr-3 find"
          @focus="switchReducerOn()"
          @blur="switchReducerOff()"
          :class="{ closed: !$store.state.search.expand }"
          v-if="logged"
          placeholder="Recherche"
          prepend-inner-icon="mdi-magnify"
          hide-details
          filled
          rounded
          dense
          clearable
          @keydown.enter="findPosts"
          @click:clear="clearFind()"
          v-model="$store.state.search.text"
        >
        </v-text-field>
      </v-col>
      <v-col
        cols="2"
        align="right"
        v-if="$vuetify.breakpoint.lgAndUp && logged"
      >
        <v-btn-toggle
          v-model="$store.state.whatPosts"
          v-on:change="getPosts"
          rounded
          mandatory
          color="indigo darken-4"
        >
          <v-btn value="all" aria-label="Posts récents">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-history</v-icon></template
              >
              <span>Posts récents</span>
            </v-tooltip>
          </v-btn>
          <v-btn value="liked" aria-label="Mes likes">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-heart</v-icon></template
              >
              <span>Mes likes</span>
            </v-tooltip>
          </v-btn>
          <v-btn
            value="search"
            aria-label="Les resultats de ma recherche"
            v-if="$store.state.search.content"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-magnify</v-icon></template
              >
              <span>Les resultats de ma recherche</span>
            </v-tooltip>
          </v-btn>
          <v-btn value="reported" aria-label="Posts signalés" v-if="isAdmin">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-alert-circle</v-icon>
              </template>
              <span>Posts signalés</span>
            </v-tooltip>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="1">
        <v-avatar
          @click.stop="$store.state.drawer = !$store.state.drawer"
          color="indigo"
          v-if="$vuetify.breakpoint.lgAndUp && logged"
        >
          <span class="white--text headline" v-if="!$store.state.user.imageUrl">
            {{ $store.state.user.initial }}
          </span>
          <v-img
            v-if="$store.state.user.imageUrl"
            :src="$store.state.user.imageUrl"
            :alt="$store.state.user.name"
          >
          </v-img>
          <!-- <span class="white--text text-h5">CJ</span> -->
        </v-avatar>
      </v-col>
    </v-row>
  </v-app-bar>
</template>
<script>
export default {
  name: "Header",
  data: () => ({
    drawer: false,
    items: [
      { title: "Home", icon: "mdi-view-dashboard" },
      { title: "About", icon: "mdi-forum" },
    ],
    messages: 4,
    show: true,
  }),
  methods: {
    switchReducerOn() {
      if (
        this.$store.state.whatPosts !== "search" ||
        !this.$store.state.search.expand
      ) {
        this.$store.dispatch("setSearchExpand", true);
      }
    },
    switchReducerOff() {
      if (
        this.$store.state.whatPosts !== "search" ||
        !this.$store.state.search.expand
      ) {
        this.$store.dispatch("setSearchExpand", false);
      }
    },
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
      if (this.$store.state.search.content) {
        this.$store.dispatch("findPosts", this.$store.state.search.content);
      }
    },
    clearFind() {
      this.$store.dispatch("setSearchContent", "");
      this.$store.dispatch("setSearchText", "");
      this.$store.dispatch("setWhatPosts", "all");
      this.$store.dispatch("getPosts");
    },
  },
  computed: {
    logged() {
      return this.$store.state.isLogged;
    },
    isAdmin() {
      return this.$store.state.user.admin;
    },
  },
};
</script>
<style scoped lang="sass">
.find
  transition: max-width 0.3S
  &.closed
    max-width: 70px
</style>
