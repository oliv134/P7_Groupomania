import Vue from "vue";
import Vuex from "vuex";
//import user from "./user"
import createPersistedState from "vuex-persistedstate";
import PostService from "../services/PostService";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    isLogged: false,
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
          state.token = token;
          state.id = "";
        },
        SET_USER(state, user) {
          
    
          state.isLogged = true;
          state.user = user;
          //Object.assign(state, user);
        },
        LOG_OUT(state) {
          sessionStorage.clear();
          state.isLogged = false;
          localStorage.removeItem("userToken");
          localStorage.removeItem("userData");
        },
  
    // **** posts

    GET_POSTS(state, posts) {
      (state.posts = posts);
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
        // **** users
        setToken({ commit }, token) {
          commit("SET_TOKEN", token);
          localStorage.setItem("userToken", token);
        },
        setUser({ commit }, user) {
          // ajout de l'id du user dans le store pour la vérification token + userId dans le backend (injection de l'id dans le header de la requete)
          console.log(user);
          user.initial = user.name.substring(0, 1).toUpperCase();
    
          commit("SET_USER", user);
    
          // ensuite mise à jour de user dans le store avec toutes les informations
          /*Auth.getUserById(user.id).then((response) => {
            const user = response.data.user;
            
          });*/
    
          localStorage.setItem("userData", JSON.stringify(user));
          //user.password = undefined;
          //commit("SET_USER", user);
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
    getPosts({ commit }, content = null) {
      PostService.getPosts(content).then((response) => {
        const posts = response.data;
        commit("GET_POSTS", posts);
      });
    },
    findPosts({ commit }, content) {
      PostService.findPosts(content).then((response) => {
        const posts = response.data;
        console.log(posts)
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
    //user
  },
});
