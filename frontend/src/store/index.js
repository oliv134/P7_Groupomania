import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import PostService from "../services/PostService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    user: {},
    isLogged: false,
    drawer: false,
    error: "",
    whatPosts: "all",
    posts: [],
    post: {},
    search: { content: "", expand: false },
    snackbar: { active: false, color: "", message: "" },
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  getters: {
    // **** Users
    users(state) {
      return state.users;
    },
    user(state) {
      return state.user;
    },
    // **** posts
    posts(state) {
      return state.posts;
    },
    post(state) {
      return state.post;
    },

    // **** message
    message(state) {
      return state.message;
    },

    search(state) {
      return state.search;
    },
  },

  mutations: {
    // **** users
    SET_TOKEN(state, token) {
      state.token = token;
      state.user.id = "";
    },
    SET_USER(state, user) {
      state.isLogged = true;
      state.user = user;
      //Object.assign(state, user);
    },
    LOG_OUT(state) {
      sessionStorage.clear();
      state.isLogged = false;
      state.token = null;
      state.user = {};
      state.posts = {};
      state.search.content = null;
      state.search.expand = false;
      state.whatPosts = "all";
      state.snackbar = { active: false, color: "", message: "" };
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
    },

    // **** posts

    GET_POSTS(state, posts) {
      state.posts = posts;
      // tri par id
      state.posts.sort(function compare(a, b) {
        if (a.id < b.id) return 1;
        if (a.id > b.id) return -1;
        return 0;
      });
    },
    ADD_POST(state, post) {
      state.posts = [post, ...state.posts];
      state.message = "post créé";
      // tri par id
      state.posts.sort(function compare(a, b) {
        if (a.id < b.id) return 1;
        if (a.id > b.id) return -1;
        return 0;
      });
    },
    DEL_POST(state, id) {
      state.posts = state.posts.filter((item) => item.id != id);
      state.message = "post supprimé";
    },
    SET_SEARCH_CONTENT(state, content) {
      state.search.content = content;
    },
    SET_SEARCH_TEXT(state, text) {
      state.search.text = text;
    },
    SET_SEARCH_EXPAND(state, status) {
      state.search.expand = status;
    },
    WHAT_POSTS(state, status) {
      state.whatPosts = status;
    },
    SET_SNACKBAR(state, response) {
      if (response.data != undefined && response.data.message != undefined) {
       
          state.snackbar = {
            active: true,
            color: "success",
            message: response.data.message,
          };
       
      }
      if (response.response != undefined) {
        state.snackbar = {
          active: true,
          color: "success",
          message: response.response.data.error,
        };
      }
    },
  },
  actions: {
    // **** users
    setToken({ commit }, token) {
      commit("SET_TOKEN", token);
      localStorage.setItem("userToken", token);
    },
    setUser({ commit }, user) {
      // ajout de l'id du user dans le store pour la vérification token + userId dans le backend (injection de l'id dans le header de la requete)

      user.initial = user.name.substring(0, 1).toUpperCase();

      commit("SET_USER", user);

      // ensuite mise à jour de user dans le store avec toutes les informations
      /*Auth.getUserById(user.id).then((response) => {
            const user = response.data.user;
            
          });*/

      localStorage.setItem("userData", JSON.stringify(user));
    },
    logOut({ commit }) {
      commit("LOG_OUT");
    },
    // **** Posts
    async createPost({ commit }, post) {
      try {
        const response = await PostService.createPost(post);
        commit("ADD_POST", response.data.post);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },
    async getPosts({ commit }, content = null) {
      try {
        const response = await PostService.getPosts(content);
        commit("GET_POSTS", response.data);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },
    async findPosts({ commit }, content) {
      commit("SET_SEARCH_EXPAND", content);
      try {
        const response = await PostService.findPosts(content);
        commit("GET_POSTS", response.data);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },
    async updatePost({ commit }, payload) {
      try {
        const response = await PostService.updatePost(
          payload.postId,
          payload.formData
        );
        commit("SET_SNACKBAR", response);
        const post = response.data.post;
        commit("DEL_POST", post.id);
        commit("ADD_POST", post);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },

    async deletePost({ commit }, id) {
      try {
        const response = await PostService.deletePost(id);
        commit("SET_SNACKBAR", response);
        commit("DEL_POST", response.data.id);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },

    async likePost({ commit }, id) {
      try {
        let response = await PostService.likePost(id);
        commit("SET_SNACKBAR", response);
        response = await PostService.getPosts();
        commit("GET_POSTS", response.data);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },

    async reportPost({ commit }, id) {
      try {
        let response = await PostService.reportPost(id);
        commit("SET_SNACKBAR", response);
        response = await PostService.getPosts();
        commit("GET_POSTS", response.data);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },
    async createComment({ commit }, payload) {
      try {
        let response = await PostService.createComment(
          payload.postId,
          payload.formData
        );
        const post = response.data.post;
        commit("DEL_POST", post.id);
        commit("ADD_POST", post);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },
    async getComments({ commit }, payload) {
      try {
        let response = await PostService.getComments(
          payload.postId,
          payload.formData
        );
        const post = response.data.post;
        commit("DEL_POST", post.id);
        commit("ADD_POST", post);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },
    async deleteComment({ commit }, payload) {
      try {
        let response = await PostService.deleteComment(payload.id);
        commit("SET_SNACKBAR", response);
        const post = response.data.post;
        commit("DEL_POST", post.id);
        commit("ADD_POST", post);
      } catch (error) {
        commit("SET_SNACKBAR", error);
      }
    },
    setWhatPosts({ commit }, status) {
      commit("WHAT_POSTS", status);
    },
    setSearchContent({ commit }, content) {
      commit("SET_SEARCH_CONTENT", content);
    },
    setSearchText({ commit }, text) {
      commit("SET_SEARCH_TEXT", text);
    },
    setSearchExpand({ commit }, status) {
      commit("SET_SEARCH_EXPAND", status);
    },
    setSnackBar({ commit }, response) {
      commit("SET_SNACKBAR", response);
    },
  },
});
