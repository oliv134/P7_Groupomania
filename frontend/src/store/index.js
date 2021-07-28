import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import Auth from "../services/Auth";
import PostService from "../services/PostService";
//import axios from "axios";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    user: {},
    isLoggedIn: false,
    isLoading: false,
    drawer: false,
    message: "",
    error: "",
    posts: [],
    users: [],
    post: {},
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  getters: {
    posts(state) {
      return state.posts;
    },
    post(state) {
      return state.post;
    },
    users(state) {
      return state.users;
    },
    user(state) {
      return state.user;
    },
    messageRetour(state) {
      return state.message;
    },
    errorMessage(state) {
      return state.error;
    },
    isLogged(state) {
      return state.isLoggedIn;
    },
  },

  mutations: {
    // **** users
    SET_TOKEN(state, token) {
      if (token) {
        state.token = token;
        state.isLoggedIn = true;
      } else {
        state.token = null;
        state.isLoggedIn = false;
      }
    },
    DELETE_TOKEN(state) {
      state.token = null;
      state.user = "";
      state.isLoggedIn = false;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    LOG_OUT(state) {
      sessionStorage.clear();
      state.token = null;
      state.user = {};
      state.isLoggedIn = false;
      state.message = "";
      state.error = "";
    },
    // **** posts

    GET_POSTS(state, posts) {
      (state.posts = posts), (state.isLoading = false);
    },
    ADD_POST(state, post) {
      state.posts = [post, ...state.posts];
      state.message = "post créé";
      console.log(state.posts)
    },
    DEL_POST(state, id) {
      console.log('state.posts')
      state.posts = state.posts.filter((item) => item.id != id);
      console.log(state.posts)
      state.message = "post supprimé";
      console.log(state.posts)
    },
  },
  actions: {
    // **** users
    setToken({ commit }, token) {
      commit("SET_TOKEN", token);
    },
    setUser({ commit }, user) {
      // ajout de l'id du user dans le store pour la vérification token + userId dans le backend
      
      commit("SET_USER", user);

      // ensuite mise à jour de user dans le store avec toutes les informations
      Auth.getUserById(user.id).then((response) => {
        const user = response.data.user;
        if (user.name) {
          user.initial = user.name.substring(0, 1).toUpperCase();
        }
        
        //user.password = undefined;
        commit("SET_USER", user);
      });
    },
    logOut({ commit }) {
      commit("LOG_OUT");
    },
    // **** Posts
    createPost({ commit }, post) {
      PostService.createPost(post)
        .then((response) => {
          const post = response.data.post;
          commit("ADD_POST", post);
        })
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

      PostService.updatePost(payload.postId, payload.formData)
        .then((response) => {
          const post = response.data.post;
          console.log('postUpdate')
          console.log(post)
          commit("DEL_POST", post.id);
          commit("ADD_POST", post);
        });
    },

    deletePost({ commit}, id) {
      PostService.deletePost(id)
        .then((response) => {
        const id = response.data.id;
        commit("DEL_POST", id);
      });
    }
  },
  modules: {},
});
