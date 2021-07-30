import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import Auth from "../services/Auth";
import PostService from "../services/PostService";

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
    // **** posts
    posts(state) {
      return state.posts;
    },
    post(state) {
      return state.post;
    },

    // **** Users
    users(state) {
      return state.users;
    },
    user(state) {
      return state.user;
    },
    isLogged(state) {
      return state.isLoggedIn;
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
  },
  actions: {
    // **** users
    setToken({ commit }, token) {
      commit("SET_TOKEN", token);
    },
    setUser({ commit }, user) {
      // ajout de l'id du user dans le store pour la vérification token + userId dans le backend (injection de l'id dans le header de la requete)
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
    }
  },
  modules: {},
});
