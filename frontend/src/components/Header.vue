<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    app
    color="blue darken-3"
    dark
  >
    <v-avatar
      @click.stop="$store.state.drawer = !$store.state.drawer"
      v-if="!$vuetify.breakpoint.lgAndUp"
    >
      <v-img
        class=""
        src="@/assets/icon-left-font-monochrome-white_mini.svg"
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
          src="@/assets/icon-left-font-monochrome-white.svg"
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
      v-if="$store.state.isLoggedIn"
      placeholder="Recherche"
      prepend-inner-icon="mdi-magnify"
      hide-details
      filled
      rounded
      dense
    >
    </v-text-field>

    <v-avatar
      @click.stop="$store.state.drawer = !$store.state.drawer"
      color="indigo"
      v-if="$vuetify.breakpoint.lgAndUp && $store.state.isLoggedIn"
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
  },
  computed: {
    logoImg: function () {
      console.log(
        this.$vuetify.breakpoint.name == "xs"
          ? "@/assets/icon-left-font-monochrome-white-mini.svg"
          : "@/assets/icon-left-font-monochrome-white.svg"
      );
      return this.$vuetify.breakpoint.name == "xs"
        ? "../assets/icon-left-font-monochrome-white.svg"
        : "../assets/icon-left-font-monochrome-white.svg";
    },
  },
};
</script>


<style scoped lang="sass">
.recherche
  transition: max-width 0.3S
  &.closed
    max-width: 70px
</style>
