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
    if (!this.$store.state.user.isLoggedIn) {
      this.$router.push({ name: "home" });
    } else {
      this.$store.dispatch("getPosts");
    }
    console.log(this.$store.state.user.isLoggedIn)
  },
  methods: {
    deletePost(id) {
      this.$store.dispatch("deletePost", id);
    },
  },
  beforeCreate() {},
};
</script>