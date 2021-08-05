import Api from "../services/Api";

export default {
  getPosts() {
    return Api().get("posts");
  },
  findPosts(content)
  {
    return Api().get("posts/" + content);
  },
  getLikedPosts() {
    return Api().get("posts/liked");
  },
  getReportedPosts() {
    return Api().get("posts/reported");
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
  }
};
