import { useContext } from "react";
import Api from "../../services/Api";
import { useOktaAuth } from "@okta/okta-react";
import { PostsContext } from "../../context/PostsContext";
import { makeStyles, Grid, Button, Typography, Grow } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const useStyles = makeStyles(theme => ({
  icons: {
    fontSize: "18px",
    marginLeft: "3px",
  },
  post: {
    width: "100%",
    height: "fit-content",
    border: "1px solid gray",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: "#fff",
    marginBottom: theme.spacing(2),
  },
}));

function PostCard(props) {
  const classes = useStyles();
  const { post } = props;
  const { authState } = useOktaAuth();
  const { accessToken } = authState.accessToken;
  const { posts, setPosts, newPost, setNewPost } = useContext(PostsContext);

  const editPost = e => {
    setNewPost({ id: e.id, title: e.title, body: e.body });
  };

  const deletePost = e => {
    //deleting post that is being edited at the same moment
    if (newPost.id === e.id) {
      setNewPost({ id: null, title: "", body: "" });
    }
    (async () => {
      let response = await Api.deletePost(accessToken, e.id);
      if (response) {
        const updatedPosts = [...posts].filter(post => post.id !== e.id);
        setPosts(updatedPosts);
      }
    })();
  };

  return (
    <Grow in={posts !== null}>
      <Grid item container className={classes.post} direction="row">
        <Grid item container direction="column" lg={10} md={10}>
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body1">{post.body}</Typography>
        </Grid>
        <Grid item container direction="column" lg={2} md={2}>
          <Button onClick={e => editPost(post)} color="primary">
            Edit <EditIcon className={classes.icons} />
          </Button>
          <Button onClick={e => deletePost(post)} color="secondary">
            Delete <DeleteForeverIcon className={classes.icons} />
          </Button>
        </Grid>
      </Grid>
    </Grow>
  );
}

export default PostCard;
