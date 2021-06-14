import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { makeStyles, Grid, Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(1),
  },
  links: {
    textDecoration: "none",
  },
  loginButton: {
    backgroundColor: theme.palette.background.main,
  },
  navbar: {
    position: "fixed",
    top: "0",
    left: "0",
    height: theme.spacing(8),
    backgroundColor: theme.palette.dark.main,
    padding: theme.spacing(1),
    zIndex: "3",
  },
  navButtons: {
    color: "#fff",
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  if (authState.isPending) return null;

  const login = async () => history.push("/login");

  const logout = async () => oktaAuth.signOut();

  const button = authState.isAuthenticated ? (
    <Button
      onClick={logout}
      variant="contained"
      color="secondary"
      className={classes.button}
    >
      Logout
    </Button>
  ) : (
    <Button
      onClick={login}
      variant="contained"
      className={classes.button + " " + classes.loginButton}
    >
      Login
    </Button>
  );

  return (
    <Grid
      container
      justify="flex-end"
      alignItems="center"
      className={classes.navbar}
    >
      <Link to="/" className={classes.links}>
        <Button className={classes.navButtons}>Home</Button>
      </Link>
      <Link to="/users" className={classes.links}>
        <Button className={classes.navButtons}>Users</Button>
      </Link>
      <Link to="/posts" className={classes.links}>
        <Button className={classes.navButtons}>Posts</Button>
      </Link>
      {button}
    </Grid>
  );
};
export default Navbar;
