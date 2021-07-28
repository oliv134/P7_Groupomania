<template>
  <v-container fluid align-content-xs-start align-content-mg-center class="mt-8"
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
                <span class="white--text headline" v-if="!post.User.imageUrl">
                  X
                </span>
                <v-img
                  v-if="post.User.imageUrl"
                  :src="post.User.imageUrl"
                  :alt="post.User.name"
                  height="30"
                  max-width="30"
                  contain
                >
                </v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10" md="11" class="grey lighten-4 px-md-6 px-3">
              <v-row>
                <v-col cols="10">
                  <v-card-title class="pt-0">{{ post.User.name }}</v-card-title>
                  <v-card-subtitle class="font-weight-light">
                    {{ post.User.email }}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="2">
                  <v-btn icon v-if="isOwner" @click="updatePost">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider class="mb-3"></v-divider>
              <div class="text-truncate" style="max-height: 130px">
                {{ post.content }}
              </div>
              <v-img
                v-if="post.imageUrl"
                :src="post.imageUrl"
                alt="J"
                max-height="300"
                class="rounded-lg"
              >
              </v-img>
              <v-row class="my-1">
                <v-col cols="3" sm="3">
                  <v-btn icon @click.prevent="toggleComment">
                    <v-icon>mdi-message-reply-text</v-icon>
                  </v-btn>
                </v-col>

                <v-col cols="3" sm="3">
                  <v-btn icon>
                    <v-icon>mdi-thumb-up-outline</v-icon>
                  </v-btn>
                </v-col>

                <v-col cols="3" sm="3">
                  <v-btn icon>
                    <v-icon>mdi-alert-circle-outline</v-icon>
                  </v-btn>
                </v-col>

                <v-col cols="3" sm="3">
                  <v-btn icon v-if="isOwner || isAdmin" @click="deletePost">
                    <v-icon>mdi-close-octagon-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-expand-transition>
              <v-container v-show="setComment">
                <v-divider class="mb-3"></v-divider>
                <v-row>
                  <v-col cols="2" md="1" class="text-center px-0">
                    <v-avatar>
                      <v-img
                        src="https://randomuser.me/api/portraits/men/78.jpg"
                        alt="John"
                        height="30"
                        max-width="30"
                        contain
                      >
                      </v-img>
                    </v-avatar>
                  </v-col>

                  <v-col>
                    <v-textarea
                      label="Votre commentaire"
                      ref="txtComment"
                      auto-grow
                      outlined
                      rows="1"
                      row-height="15"
                    >
                    </v-textarea>
                  </v-col>
                </v-row>
                <p class="text-lg-right">
                  <v-btn class="" color="info">
                    Ok !
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon light>mdi-cached</v-icon>
                      </span>
                    </template>
                  </v-btn>
                </p>
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
export default {
  name: "Posts",
  components: {
    NewPost,
  },
  data: () => ({
    update: false,
    setComment: false,
  }),
  props: {
    post: {
      type: Object,
    },
  },
  computed: {
    isOwner() {
      return this.post.User.id === this.$store.state.user.id;
    },
    isAdmin() {
      return this.$store.state.user.admin;
    },
  },
  methods: {
    deletePost() {
      this.$emit("deletePost", this.post.id);
    },
    updatePost(update = true) {
      this.update = update;
    },
    toggleComment() {
      this.setComment = !this.setComment
      if (this.setComment) {this.$refs.txtComment.focus()}
                         
    }
  },
};
</script>
