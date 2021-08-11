<template>
    <v-snackbar v-model="snackbar.active" :timeout="2000" :color="snackbar.color">
      {{ snackbar.message}}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.active = false">
          Ok
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Message",
  computed: {
    ...mapState(["snackbar"])
  }
};
</script>