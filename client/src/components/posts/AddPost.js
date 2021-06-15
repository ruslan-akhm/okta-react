import React, { useContext, useState } from "react";
import Api from "../../services/Api";
import { useOktaAuth } from "@okta/okta-react";
import { PostsContext } from "../../context/PostsContext";
import { makeStyles, Grid, Button, TextField, Grow } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

const useStyles = makeStyles(theme => ({
  addPostBox: {
    borderRadius: theme.spacing(1),
    height: "fit-content",
    padding: theme.spacing(1),
    border: "1px solid gray",
    backgroundColor: "#fff",
  },
  alert: {
    marginBottom: theme.spacing(1),
  },
  icons: {
    fontSize: "18px",
    marginLeft: "3px",
  },
  inputs: {
    marginBottom: theme.spacing(1),
  },
}));

function AddPost() {
  const classes = useStyles();
  const { authState } = useOktaAuth();
  const { accessToken } = authState.accessToken;
  const { posts, setPosts, newPost, setNewPost } = useContext(PostsContext);
  const [alert, setAlert] = useState(false);

  const handleText = e => {
    alert === true && setAlert(false);
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const submitPost = () => {
    if (newPost.title.length < 1) {
      return setAlert(true);
    }
    //if there is id - edit the post, otherwise (id===null) - add new post
    if (newPost.id === null) {
      (async () => {
        let response = await Api.createPost(accessToken, newPost);
        setNewPost({ id: null, title: "", body: "" });
        setPosts([...posts, response]);
      })();
    } else {
      (async () => {
        let response = await Api.updatePost(accessToken, newPost.id, newPost);
        setNewPost({ id: null, title: "", body: "" });
        let updatedPosts = [...posts];
        //replacing old post with an updated version
        const index = posts.findIndex(post => post.id === response.id);
        if (index !== -1) {
          updatedPosts[index] = response;
        } else {
          updatedPosts.push(response);
        }
        setPosts(updatedPosts);
      })();
    }
  };

  const cancelEdit = () => {
    setAlert(false);
    setNewPost({ id: null, title: "", body: "" });
  };

  return (
    <Grid
      container
      justify="flex-start"
      direction="column"
      className={classes.addPostBox}
    >
      <TextField
        variant="outlined"
        label="title"
        onChange={e => handleText(e)}
        name="title"
        value={newPost.title}
        className={classes.inputs}
      />
      <TextField
        variant="outlined"
        label="body"
        onChange={e => handleText(e)}
        multiline
        rows={8}
        name="body"
        value={newPost.body}
        className={classes.inputs}
      />
      {!alert ? (
        <Button
          variant="contained"
          color="primary"
          onClick={submitPost}
          className={classes.inputs}
        >
          {newPost.id === null ? "Add" : "Update"}
          {newPost.id === null ? (
            <AddIcon className={classes.icons} />
          ) : (
            <ArrowUpwardIcon className={classes.icons} />
          )}
        </Button>
      ) : (
        <Grow in={alert}>
          <Alert
            onClose={() => setAlert(false)}
            severity="warning"
            variant="filled"
            className={classes.alert}
          >
            Post should at least have title!
          </Alert>
        </Grow>
      )}
      {newPost.id !== null && (
        <Button color="secondary" variant="outlined" onClick={cancelEdit}>
          Cancel edit
        </Button>
      )}
    </Grid>
  );
}

export default AddPost;
