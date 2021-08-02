import axios from "axios";
import store from "../store/index";

export default () => {
  //const id = !(typeof store.state.user.id === undefined) ? "" : store.state.user.id
  //if (!(typeof store.state.user === undefined) OR !(store.state.user === {})) {
    console.log(store.state.user.isLoggedIn)
  if (store.state.user.isLoggedIn) {
    return axios.create({
      baseURL: `http://localhost:3000/api/`,
      headers: {
        Authorization: `${store.state.user.token}`,
        userId: `${store.state.user.id}`,
      },
    });
  } else {
    console.log("ici")
    return axios.create({
      baseURL: `http://localhost:3000/api/`,
      headers: {},
    });
  }
};
