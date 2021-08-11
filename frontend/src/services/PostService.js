import Api from "../services/Api";
import store from "../store/index";
export default {
  getPosts() {
    switch (store.state.whatPosts) {
      case "all":
        return Api().get("posts");

      case "liked":
        return Api().get("posts/liked/" + store.state.user.id);

      case "reported":
        return Api().get("posts/reported");
    }
  },
  findPosts(content) {
    return Api().get("posts/find/" + content);
  },
  getPostById(id) {
    return Api().get("posts/" + id);
  },
  createPost(data) {
    return Api().post("posts/add", data);
  },
  updatePost(id, data) {
    return Api().put("posts/" + id, data);
  },
  deletePost(id) {
    return Api().delete("posts/" + id);
  },
  likePost(id) {
    return Api().post("posts/" + id + "/like");
  },
  reportPost(id) {
    return Api().post("posts/" + id + "/report");
  },
  createComment(id, data) {
    return Api().post("posts/" + id + "/comments", data);
  },
  deleteComment(id) {
    return Api().delete("posts/comments/" + id);
  },
  getComments(id, data) {
    return Api().get("posts/" + id + "/comments/", data);
  },
};
