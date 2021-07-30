<template>
  <v-container>
    <v-divider class="mb-2"></v-divider>
    <span class="date ml-5 text-left text-caption font-italic">
      {{ ownerName }} commenté le {{ localDate }}</span
    >
    <v-row>
      <v-col cols="10" md="11">
        <p class="font-weight-light mb-1">
          {{ comment.message }}
        </p>
      </v-col>
      <v-col cols="2" md="1">
        <v-btn icon v-if="isOwner" @click="deleteComment">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  name: "Comment",
  components: {},
  data: () => ({
    rules: {
      required: (value) =>
        !!value || "Il faut quand même écrire quelque chose.",
    },
  }),
  props: {
    comment: {
      type: Object,
    },
  },
  computed: {
    isOwner() {
      return this.comment.Userid === this.$store.state.user.id;
    },
    localDate() {
      return moment
        .utc(this.comment.createdAt)
        .local()
        .format("dddd Do MMM YYYY HH:mm:ss");
    },
    ownerName() {
      return this.isOwner ? "Vous avez" : this.comment.User.name + " a";
    },
  },
  methods: {
    deleteComment() {
      this.$store.dispatch("deleteComment", {
        id: this.comment.id,
      });
    },
  },
};
</script>
