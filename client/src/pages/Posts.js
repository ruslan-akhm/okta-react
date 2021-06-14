import { useEffect, useContext } from "react";
import Api from "../services/Api";
import AddPost from "../components/posts/AddPost";
import { PostsContext } from "../context/PostsContext";
import { useOktaAuth } from "@okta/okta-react";
import { makeStyles, Grid } from "@material-ui/core";
import PostCard from "../components/posts/PostCard";

const useStyles = makeStyles(theme => ({
  post: {
    width: "100%",
  },
  postsBox: {
    backgroundColor: theme.palette.background.main,
    minHeight: "100vh",
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  columns: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
}));

const Protected = () => {
  const classes = useStyles();
  const { authState } = useOktaAuth();
  const { accessToken } = authState.accessToken;
  const { posts, setPosts } = useContext(PostsContext);

  useEffect(() => {
    (async () => {
      let response = await Api.getPosts(accessToken);
      setPosts(response);
    })();
  }, []);

  return (
    <Grid container className={classes.postsBox}>
      <Grid
        container
        item
        justify="flex-start"
        direction="column"
        xl={8}
        lg={8}
        md={8}
        sm={8}
        className={classes.columns}
      >
        {posts &&
          posts.map(post => {
            return <PostCard post={post} key={post.id} />;
          })}
      </Grid>
      <Grid
        item
        container
        xl={4}
        lg={4}
        md={4}
        sm={4}
        className={classes.columns}
      >
        <AddPost />
      </Grid>
    </Grid>
  );
};
export default Protected;
