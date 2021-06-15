import React from "react";
import { Link } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { makeStyles, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  home: {
    height: "100vh",
    width: "100%",
    backgroundColor: theme.palette.background.main,
  },
  links: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
  text: {
    textAlign: "center",
  },
}));

const Home = () => {
  const classes = useStyles();
  const { authState } = useOktaAuth();

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.home}
    >
      {authState.isAuthenticated ? (
        <Grid item>
          <Typography variant="h4" className={classes.text}>
            Hello, {authState && authState.idToken.claims.name}!
          </Typography>
          <Typography variant="body1" className={classes.text}>
            See all{" "}
            <Link to="/posts" className={classes.links}>
              posts
            </Link>
          </Typography>
        </Grid>
      ) : (
        <Grid item>
          <Typography variant="h4" className={classes.text}>
            Please Login
          </Typography>
          <Typography variant="body1" className={classes.text}>
            to access posts
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
export default Home;
