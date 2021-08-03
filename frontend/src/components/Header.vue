<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    app
    color="red lighten-4"
    
  >
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

    <v-spacer></v-spacer>
    <v-text-field
      class="mr-3 recherche"
      @focus="switchReducer()"
      @blur="switchReducer()"
      :class="{ closed: searchReduced }"
      v-if="logged"
      placeholder="Recherche"
      prepend-inner-icon="mdi-magnify"
      hide-details
      filled
      rounded
      dense
      @keydown.enter="findPosts"
      v-model="searchContent"
    >
    </v-text-field>

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
  </v-app-bar>
</template>
<script>
export default {
  name: "Header",
  data: () => ({
    searchReduced: true,
    searchContent : null,
    drawer: false,
    items: [
      { title: "Home", icon: "mdi-view-dashboard" },
      { title: "About", icon: "mdi-forum" },
    ],
    messages: 4,
    show: true,
  }),
  methods: {
    switchReducer() {
      this.searchReduced = !this.searchReduced;
    },
    findPosts() {
      this.$store.dispatch("findPosts", this.searchContent);
      this.searchContent = "";
      this.switchReducer;

    }
  },
  computed: {
    logged() {
      return this.$store.state.isLogged
    }
  }

};
</script>


<style scoped lang="sass">
.recherche
  transition: max-width 0.3S
  &.closed
    max-width: 70px
</style>
