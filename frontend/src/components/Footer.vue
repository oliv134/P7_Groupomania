<template >
  <v-bottom-navigation
    scroll-target="#scroll-area-1"
    app
    hide-on-scroll
    horizontal
    v-if="!$vuetify.breakpoint.lgAndUp && $store.state.isLoggedIn"
  >
    <v-btn text color="deep-purple accent-4">
      <span>Recents</span>
      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-btn text color="deep-purple accent-4">
      <span>Favoris</span>
      <v-icon>mdi-heart</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
export default {
  name: "PageFooter",
  data: () => ({}),
  methods: {
    logOut: function () {
      this.$store.dispatch("logOut");
    },
  },
};
</script>
<style lang="scss" scoped></style>
