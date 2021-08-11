<template>
  <v-container
    class="fill-height"
    fluid
    align-content-xs-start
    align-content-mg-center
  >
    <NewPost />

    <Post
      v-for="post of posts"
      :key="post.id"
      :post="post"
      @deletePost="deletePost(post.id)"
    >
    </Post>
    
  </v-container>
</template>

<script>
import NewPost from "@/components/NewPost.vue";
import Post from "@/components/Post.vue";

export default {
  name: "Feed",
  components: {
    NewPost,
    Post,
  },
  computed: {
    posts() {
      return this.$store.getters.posts;
    },
  },
  beforeMount() {
    this.$store.dispatch("setSearch", "");
    this.$store.dispatch("setWhatPosts", "all");
    this.$store.dispatch("getPosts");
  },
  methods: {
    deletePost(id) {
      this.$store.dispatch("deletePost", id);
    },
  },
  beforeCreate() {
    if (!this.$store.state.isLogged) {
      this.$router.push("/");
    }
  },
};
</script>