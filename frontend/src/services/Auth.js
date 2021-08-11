import Api from "../services/Api";

export default {
  signup(data) {
    return Api().post("users/signup", data);
  },
  login(data) {
  
    return Api().post("users/login", data);
  },
  deleteUser(id = null) {
    id = id == null ? this.$store.state.user.id : id
    return Api().delete("users/account/" + id);
  },
  updateUser(id, data) {
    return Api().put("users/accounts/" + id, data);
  },
  getUsers() {
    return Api().get("users/accounts");
  },
  getUserById(id) {
    return Api().get("users/accounts/" + id,);
  },
};
