import Vue from "vue";
import Vuex from "vuex";
import user from "./user"
import createPersistedState from "vuex-persistedstate";
import PostService from "../services/PostService";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {

    isLoading: false,
    drawer: false,
    message: "",
    error: "",
    posts: [],

    post: {},
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  getters: {
    // **** posts
    posts(state) {
      return state.posts;
    },
    post(state) {
      return state.post;
    },

    // **** message
    messageRetour(state) {
      return state.message;
    },
    errorMessage(state) {
      return state.error;
    },
  },

  mutations: {
  
    // **** posts

    GET_POSTS(state, posts) {
      (state.posts = posts), (state.user.isLoading = false);
      // tri par id
      state.posts.sort(function compare(a, b) {
        if (a.id < b.id)
           return 1;
        if (a.id > b.id )
           return -1;
        return 0;
      });
    },
    ADD_POST(state, post) {
      state.posts = [post, ...state.posts];
      state.message = "post créé";
      // tri par id
      state.posts.sort(function compare(a, b) {
        if (a.id < b.id)
           return 1;
        if (a.id > b.id )
           return -1;
        return 0;
      });
 
    },
    DEL_POST(state, id) {

      state.posts = state.posts.filter((item) => item.id != id);
   
      state.message = "post supprimé";
   
    },
    CLEAR_STATE(state) {
      state.user = {};
      state.posts = {};
    }
  },
  actions: {
    // **** Posts
    createPost({ commit }, post) {
      PostService.createPost(post).then((response) => {
        const post = response.data.post;
        commit("ADD_POST", post);
      });

      /*.then(() => {
          PostService.getPosts().then((response) => {
           const posts = response.data;
           commit("GET_POSTS", posts);
          });
        });*/
    },
    getPosts({ commit }) {
      PostService.getPosts().then((response) => {
        const posts = response.data;
        commit("GET_POSTS", posts);
      });
    },
    updatePost({ commit }, payload) {
      PostService.updatePost(payload.postId, payload.formData).then(
        (response) => {
          const post = response.data.post;
          commit("DEL_POST", post.id);
          commit("ADD_POST", post);
        }
      );
    },

    deletePost({ commit }, id) {
      PostService.deletePost(id).then((response) => {
        const id = response.data.id;
        commit("DEL_POST", id);
      });
    },
    likePost({ commit }, id) {
      PostService.likePost(id).then(() => {
        PostService.getPosts().then((response) => {
          const posts = response.data;
          commit("GET_POSTS", posts);
        });
      });
    },
    reportPost({ commit }, id) {
      PostService.reportPost(id).then(() => {
        PostService.getPosts().then((response) => {
          const posts = response.data;
          commit("GET_POSTS", posts);
        });
      });
    },
    createComment({ commit }, payload) {

      PostService.createComment(payload.postId, payload.formData)
      .then((response) => {
          const post = response.data.post;
          commit("DEL_POST", post.id);
          commit("ADD_POST", post);
        }
      );
    },
    getComments({ commit }, payload) {

      PostService.getComments(payload.postId, payload.formData)
      .then((response) => {
          const post = response.data.post;
          commit("DEL_POST", post.id);
          commit("ADD_POST", post);
        }
      );
    },
    deleteComment({ commit }, payload) {

      PostService.deleteComment(payload.id)
      .then((response) => {
          const post = response.data.post;
          commit("DEL_POST", post.id);
          commit("ADD_POST", post);
        }
      );
    },
    clearState({ commit }) {
      commit("CLEAR_STATE");
    }
  },
  modules: {
    user
  },
});
