import { useState, createContext } from "react";

export const PostsContext = createContext();

const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ id: null, title: "", body: "" });
  const [users, setUsers] = useState();
  const [layout, setLayout] = useState("blocks"); //list or blocks

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        newPost,
        setNewPost,
        users,
        setUsers,
        layout,
        setLayout,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export default PostsProvider;
