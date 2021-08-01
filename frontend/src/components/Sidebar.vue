<template>
  <v-navigation-drawer
    v-model="$store.state.drawer"
    fixed
    temporary
    :right="$vuetify.breakpoint.lgAndUp"
    app
    v-if="$store.state.user.isLoggedIn"
  >
    <v-list>
      <v-list-item
        class="px-2"
        @click.stop="$store.state.drawer = !$store.state.drawer"
      >
        <v-avatar
          @click.stop="$store.state.drawer = !$store.state.drawer"
          color="indigo"
        >
          <span
            v-if="!$store.state.user.imageUrl"
            class="white--text headline"
            >{{ $store.state.user.initial }}</span
          >
          <v-img
            v-if="$store.state.user.imageUrl"
            :src="$store.state.user.imageUrl"
            :alt="$store.state.user.name"
          >
          </v-img>
          <!-- <span class="white--text text-h5">CJ</span> -->
        </v-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="text-h6">{{
            $store.state.user.name
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            $store.state.user.email
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-divider></v-divider>
    <v-list dense nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        @click.stop="item.action"
        :to="item.to"
        :v-if="item.vif"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: "Sidebar",
  dialog: false,

  data: (e) => ({
    mini: true,
    items: [
      {
        icon: "mdi-contacts",
        title: "Mon profil",
        action: () => {},
        to: "/user",
      },
      {
        icon: "mdi-chat",
        title: "Retour aux Posts",
        action: () => {},
        to: "/",
      },
      {
        icon: "mdi-logout",
        title: "Déconnexion",
        action: () => {
          e.logOut();
        },
        
      },
    ],
  }),
  methods: {
    logOut: function () {
    this.$store.dispatch("logOut");
    this.$router.push("/");
    },
  },
};
</script>