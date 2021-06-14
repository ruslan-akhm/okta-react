import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3001/",
  json: true,
});

export default {
  async execute(accessToken, method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(res => {
      return res.data;
    });
  },
  getPosts(accessToken) {
    return this.execute(accessToken, "get", "/posts");
  },
  getPost(accessToken, id) {
    return this.execute(accessToken, "get", `/posts/${id}`);
  },
  createPost(accessToken, data) {
    return this.execute(accessToken, "post", "/posts", data);
  },
  updatePost(accessToken, id, data) {
    return this.execute(accessToken, "put", `/posts/${id}`, data);
  },
  deletePost(accessToken, id) {
    return this.execute(accessToken, "delete", `/posts/${id}`);
  },
  getUsers(accessToken) {
    return this.execute(accessToken, "get", "/users");
  },
  createUser(accessToken, data) {
    return this.execute(accessToken, "post", "/users", data);
  },
  deleteUser(accessToken, id) {
    return this.execute(accessToken, "delete", `/users/${id}`);
  },
  updateUser(accessToken, id, data) {
    return this.execute(accessToken, "post", `/users/${id}`, data);
  },
};
