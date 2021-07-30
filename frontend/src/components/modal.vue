<template>
  <v-row justify="center">
    <v-btn color="primary" dark @click.stop="dialog = true">
      Open Dialog
    </v-btn>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> {{ modalParam.tile }} </v-card-title>

        <v-card-text> {{ modalParam.message }} </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            {{ modalParam.noButton }}
          </v-btn>

          <v-btn color="green darken-1" text @click="dialog = false">
            {{ modalParam.yesButton }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  props: {
    modalParam: {
      type: Object,
    }
  },
};
</script>