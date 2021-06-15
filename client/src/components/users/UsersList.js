import { useEffect, useState, useContext } from "react";
import { useOktaAuth } from "@okta/okta-react";
import Api from "../../services/Api";
import UserCard from "./UserCard";
import { PostsContext } from "../../context/PostsContext";
import {
  makeStyles,
  Grid,
  Button,
  Box,
  CircularProgress,
} from "@material-ui/core";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ListIcon from "@material-ui/icons/List";

const useStyles = makeStyles(theme => ({
  buttonLayout: {
    marginLeft: "auto",
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  loadingBox: {
    width: "100%",
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function UsersList(props) {
  const classes = useStyles();
  const { authState } = useOktaAuth();
  const { accessToken } = authState.accessToken;
  const { users, setUsers, layout, setLayout } = useContext(PostsContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      let response = await Api.getUsers(accessToken);
      setUsers(response.users);
    })();
    setLoading(false);
  }, []);

  const changeLayout = () => {
    if (layout === "list") {
      return setLayout("blocks");
    }
    return setLayout("list");
  };

  return (
    <>
      <Button className={classes.buttonLayout} onClick={changeLayout}>
        {layout === "list" ? <ViewModuleIcon /> : <ListIcon />}
      </Button>
      {loading ? (
        <Box className={classes.loadingBox}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item>
          {users &&
            users.map(user => {
              return <UserCard layout={layout} user={user} key={user.id} />;
            })}
        </Grid>
      )}
    </>
  );
}

export default UsersList;
