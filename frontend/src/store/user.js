//import Auth from "../services/Auth";
export default {
  state: {
    token: null,
    isLoggedIn: false,
  },
  getters: {
    // **** Users
    users(state) {
      return state.users;
    },
    user(state) {
      return state;
    },
    isLogged(state) {
      return state.isLoggedIn;
    },
  },

  mutations: {
    // **** users
    SET_TOKEN(state, token) {
      state.token = token;
      state.id = "";
    },
    SET_USER(state, user) {
      Object.assign(state, user);

      state.isLoggedIn = true;
    },
    LOG_OUT(state) {
      sessionStorage.clear();
      state.isLoggedIn = false;
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
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
  },
};
