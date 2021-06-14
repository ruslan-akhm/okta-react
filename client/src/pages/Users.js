import UsersList from "../components/users/UsersList";
import CreateUser from "../components/users/CreateUser";
import { makeStyles, Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  users: {
    paddingTop: theme.spacing(8),
    padingBotton: theme.spacing(8),
    minHeight: "100vh",
    width: "100%",
    backgroundColor: theme.palette.background.main,
  },
}));

function Users(props) {
  const classes = useStyles();

  return (
    <Grid
      container
      className={classes.users}
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      <UsersList />
      <CreateUser />
    </Grid>
  );
}

export default Users;
