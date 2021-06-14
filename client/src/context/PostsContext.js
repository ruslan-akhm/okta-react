import { useState, createContext } from "react";

export const PostsContext = createContext();

const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ id: null, title: "", body: "" });
  const [users, setUsers] = useState();

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        newPost,
        setNewPost,
        users,
        setUsers,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export default PostsProvider;
