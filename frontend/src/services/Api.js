import axios from "axios";
import store from "../store/index";

export default () => {
  //const id = !(typeof store.state.user.id === undefined) ? "" : store.state.user.id
  //if (!(typeof store.state.user === undefined) OR !(store.state.user === {})) {
    console.log("islogged in api")  
  console.log(store.state.token)
  if (store.state.isLogged) {
    return axios.create({
      baseURL: `http://localhost:3000/api/`,
      headers: {
        Authorization: `${store.state.token}`,
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
