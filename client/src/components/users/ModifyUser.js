import { useState, useContext } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { PostsContext } from "../../context/PostsContext";
import Api from "../../services/Api";
import {
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  buttonBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: theme.spacing(2),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  formLoading: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    zIndex: "2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    marginBottom: theme.spacing(2),
  },
}));

function ModifyUser(props) {
  const classes = useStyles();
  const { authState } = useOktaAuth();
  const { accessToken } = authState.accessToken;
  const { users, setUsers } = useContext(PostsContext);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    department: "",
    title: "",
    mobilePhone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const openUpdate = () => {
    //open modal window and fill user's info if any
    setUserInfo({
      department: props.user.profile.department || "",
      title: props.user.profile.title || "",
      mobilePhone: props.user.profile.mobilePhone || "",
    });
    setShowModal(true);
  };

  const updateUser = async () => {
    setLoading(true);
    const response = await Api.updateUser(accessToken, props.user.id, userInfo);
    let updatedUsers = [...users];
    //replacing user with an updated version of the same user
    const index = users.findIndex(user => user.id === response.user.id);
    if (index !== -1) {
      updatedUsers[index] = response.user;
    } else {
      updatedUsers.push(response.user);
    }
    setUsers(updatedUsers);
    setUserInfo({
      department: "",
      title: "",
      mobilePhone: "",
    });
    setLoading(false);
    setShowModal(false);
  };

  const cancelUpdate = () => {
    setUserInfo({
      department: "",
      title: "",
      mobilePhone: "",
    });
    setLoading(false);
    setShowModal(false);
  };

  const deleteUser = async () => {
    const response = await Api.deleteUser(accessToken, props.user.id);
    if (response.success) {
      const updatedUsers = [...users].filter(user => user.id !== props.user.id);
      setUsers(updatedUsers);
    }
  };

  return (
    <>
      <Button onClick={openUpdate} color="primary">
        Update
      </Button>
      <Button onClick={deleteUser} color="secondary">
        Delete
      </Button>
      <Dialog
        open={showModal}
        onClose={cancelUpdate}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>
          Update Profile:{" "}
          {props.user.profile.firstName + " " + props.user.profile.lastName}
        </DialogTitle>
        <DialogContent className={classes.form}>
          {loading && (
            <Box className={classes.formLoading}>
              <CircularProgress />
            </Box>
          )}
          <TextField
            placeholder="Department"
            name="department"
            variant="outlined"
            className={classes.textInput}
            value={userInfo.department}
            onChange={e => handleInputChange(e)}
          />
          <TextField
            placeholder="Title"
            name="title"
            variant="outlined"
            className={classes.textInput}
            value={userInfo.title}
            onChange={e => handleInputChange(e)}
          />
          <TextField
            placeholder="Mob. Phone #"
            name="mobilePhone"
            variant="outlined"
            className={classes.textInput}
            value={userInfo.mobilePhone}
            onChange={e => handleInputChange(e)}
          />
        </DialogContent>
        <DialogActions className={classes.buttonBox}>
          <Button color="secondary" variant="outlined" onClick={cancelUpdate}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={updateUser}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ModifyUser;
