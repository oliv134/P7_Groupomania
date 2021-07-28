<template>
  <v-app-bar
    absolute
    color="grey"
    elevate-on-scroll
    scroll-target="#scrolling-techniques-7"
    align="center"
  >
    <v-avatar @click.stop="drawer = !drawer">
      <img src="https://randomuser.me/api/portraits/men/78.jpg" alt="John" />
      <!-- <span class="white--text text-h5">CJ</span> -->
    </v-avatar>
    <v-toolbar-title>Title</v-toolbar-title>

    <v-spacer></v-spacer>
    <v-text-field
      class="recherche"
      @focus="searchReduced = false"
      @blur="searchReduced = true"
      :class="{ closed: searchReduced }"
      placeholder="Recherche"
      prepend-inner-icon="mdi-magnify"
      hide-details
      filled
      rounded
      dense
    >
    </v-text-field>
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
  }),
};
</script>


<style scoped lang="sass">
.recherche
  transition: max-width 0.3S
  &.closed
    max-width: 70px
</style>
