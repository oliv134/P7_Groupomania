<template>
  <v-container
    fluid
    align-content-xs-start
    align-content-mg-center
    class="mt-8"
  >
    <v-row justify="center">
      <v-col cols="11" md="6">
        <v-card class="elevation-6">
          <v-row>
            <v-text-field
              class="mr-3 recherche"
              placeholder="Recherche"
              prepend-inner-icon="mdi-magnify"
              hide-details
              filled
              rounded
              dense
              v-model="text"
            >
            </v-text-field>
            <v-btn
      
      class="mx-2"
      fab
      dark
      small
      color="cyan"
      @click.stop="getGif"
    >
      <v-icon dark> mdi-pencil </v-icon>
    </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Giphy from "@/services/Giphy.js";

export default {
  data: () => ({
    text: "",
    gif: {},
  }),
  props: {
    source: String,
  },
  methods: {
    async getGif() {
      try {
        Giphy(this.text, 10).then((res) => {
          this.gif=res
        })
      } catch (error) {
        this.errorMessage = error.response.data.error;
        // A voir ici un bottomSheet
        setTimeout(() => {
          this.errorMessage = "";
        }, 1500);
      }
    },
  },
};
</script>