<template>
  <v-container fluid align-content-xs-start align-content-lg-center class="mt-8"
    ><NewPost
      v-if="update"
      :postId="post.id"
      :update="true"
      :up-content="post.content"
      :up-image-url="post.imageUrl"
      @updatePost="updatePost(false)"
    >
    </NewPost>
    <v-row v-if="!update" justify="center">
      <v-col cols="11" md="6">
        <v-card class="elevation-6">
          <v-row>
            <v-col cols="2" md="1" class="text-center px-0">
              <v-avatar color="indigo">
                <span class="white--text" v-if="!post.User.imageUrl">
                  {{ postUserInitial }}
                </span>
                <v-img
                  v-if="post.User.imageUrl"
                  :src="post.User.imageUrl"
                  :alt="post.User.name"
                >
                </v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10" md="11" class="grey lighten-4 px-lg-6 px-3">
              <v-row>
                <v-col cols="10">
                  <v-card-title class="pt-0">{{ post.User.name }}</v-card-title>
                  <v-card-subtitle class="font-weight-light">
                    {{ post.User.email }}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="2">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        v-if="isOwner"
                        @click="updatePost"
                        :aria-label="ariaEdit"
                      >
                        <v-icon>mdi-pen</v-icon>
                      </v-btn>
                    </template>
                    <span>Editer</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-divider class="mb-3 text-body-1"></v-divider>
              <div>
                {{ post.content }}
              </div>
              <v-img
                v-if="post.imageUrl"
                :src="post.imageUrl"
                :alt="post.imageUrl"
                max-height="300"
                contain
                class="rounded-lg"
              >
              </v-img>
              <v-row class="my-1">
                <v-col cols="3" sm="3">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click.prevent="toggleComment"
                        :aria-label="ariaComment"
                      >
                        <v-icon>mdi-message-reply-text</v-icon>
                      </v-btn>
                    </template>
                    <span>Commenter</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="3" sm="3">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-badge
                        :content="likesCount"
                        :value="likesCount"
                        :v-show="likesCount"
                        label="Nombre de Likes"
                        color="green"
                        overlap
                      >
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="likePost"
                          :aria-label="ariaLike"
                        >
                          <v-icon v-show="!liked">mdi-thumb-up-outline</v-icon>
                          <v-icon v-show="liked">mdi-thumb-up</v-icon>
                        </v-btn>
                      </v-badge>
                    </template>
                    <span>Liker</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="3" sm="3">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-badge
                        :content="reportsCount"
                        :value="reportsCount"
                        :v-show="reportsCount"
                        label="Nombre de signalements"
                        color="orange"
                        overlap
                        
                      >
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          :disabled="isOwner"
                          :aria-disabled="isOwner"
                          @click="reportPost"
                          :aria-label="ariaReport"
                        >
                          <v-icon v-show="!reported"
                            >mdi-alert-circle-outline</v-icon
                          >
                          <v-icon v-show="reported">mdi-alert-circle</v-icon>
                        </v-btn>
                      </v-badge>
                    </template>
                    <span>Signaler</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="3" sm="3">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        v-if="isOwner || isAdmin"
                        @click="deletePost"
                        :aria-label="ariaDelete"
                      >
                        <v-icon>mdi-close-octagon-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </v-col>
                <span class="date ml-5 text-left text-caption font-italic">{{
                  localDate
                }}</span>
              </v-row>
              <v-expand-transition>
                <v-container v-show="setComment">
                  <v-divider class="mb-3"></v-divider>
                  <v-form ref="txtComment" v-model="valid">
                    <v-row>
                      <v-col
                        cols="2"
                        md="1"
                        class="text-center px-0"
                        v-if="$vuetify.breakpoint.lgAndUp"
                      >
                        <v-avatar color="white">
                          <span
                            class="white--black"
                            v-if="!$store.state.user.imageUrl"
                          >
                            {{ postUserInitial }}
                          </span>
                          <v-img
                            :src="$store.state.user.imageUrl"
                            alt="post.User.name"
                            v-if="$store.state.user.imageUrl"
                            height="42"
                            max-width="42"
                            contain
                          >
                          </v-img>
                        </v-avatar>
                      </v-col>

                      <v-col>
                        <v-textarea
                          label="Votre commentaire"
                          auto-grow
                          outlined
                          rows="1"
                          row-height="15"
                          :rules="[rules.required]"
                          v-model="txtComment"
                          required
                          ref="refComment"
                        >
                        </v-textarea>
                      </v-col>
                      <v-col cols="4" md="2">
                        <v-btn
                          :disabled="!valid"
                          color="info"
                          @click.prevent="createComment"
                        >
                          Ok !
                          <template v-slot:loader>
                            <span class="custom-loader">
                              <v-icon light>mdi-cached</v-icon>
                            </span>
                          </template>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>

                  <Comment
                    v-for="comment of post.Comments"
                    :key="comment.id"
                    :comment="comment"
                  >
                  </Comment>
                </v-container>
              </v-expand-transition>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import NewPost from "@/components/NewPost.vue";
import Comment from "@/components/Comment.vue";
import moment from "moment";

export default {
  name: "Posts",
  components: {
    NewPost,
    Comment,
  },
  data: () => ({
    update: false,
    txtComment: null,
    valid: false,
    setComment: false,
    rules: {
      required: (value) =>
        !!value || "Il faut quand même écrire quelque chose.",
    },
    message: null
  }),
  props: {
    post: {
      type: Object,
    },
  },
  computed: {
    postUserInitial() {
      return this.post.User.name.substring(0, 1).toUpperCase();
    },
    isOwner() {
      return this.post.User.id === this.$store.state.user.id;
    },
    isAdmin() {
      return this.$store.state.user.admin;
    },
    reportsCount() {
      return this.post.reportsCount;
    },
    likesCount() {
      return this.post.likesCount;
    },
    liked() {
      return !(
        this.post.Likes.find((x) => x.UserId === this.$store.state.user.id) === undefined
      );
    },
    reported() {
      return !(
        this.post.Reports.find((x) => x.UserId === this.$store.state.user.id) === undefined
      );
    },
    localDate() {
      return moment
        .utc(this.post.createdAt)
        .local()
        .format("dddd Do MMM YYYY à HH:mm:ss");
    },
    ariaComment() {
      return "Commenter ce post numéro " + this.post.id;
    },
    ariaLike() {
      return "Aimrer ce post numéro " + this.post.id;
    },
    ariaReport() {
      return "Signaler ce post numéro " + this.post.id;
    },
    ariaDelete() {
      return "Effacer ce post numéro " + this.post.id;
    },
    ariaEdit() {
      return "Editer ce post numéro " + this.post.id;
    },
  },
  methods: {
    deletePost() {
      this.$emit("deletePost", this.post.id);
    },
    updatePost(update = true) {
      this.update = update;
    },
    likePost() {
      this.$store.dispatch("likePost", this.post.id);
    },
    reportPost() {
      this.$store.dispatch("reportPost", this.post.id);
    },
    toggleComment() {
      this.setComment = !this.setComment;

      if (this.setComment) {
        this.getComments();
        this.$refs.refComment.focus();
      } else {
        this.$refs.txtComment.reset();
      }
    },
    createComment() {
      const formData = new FormData();
      formData.append("message", this.txtComment);
      this.$store.dispatch("createComment", {
        postId: this.post.id,
        formData: formData,
      });
      this.$refs.txtComment.reset();
    },
    getComments() {
      this.$store.dispatch("getComments", {
        postId: this.post.id,
      });
    },
    deleteComment() {
      this.$store.dispatch("deleteComment", {
        id: this.comment.id
      });
    },
  },
};
</script>
