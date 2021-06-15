import { useState, useContext } from "react";
import { useOktaAuth } from "@okta/okta-react";
import Api from "../../services/Api";
import { PostsContext } from "../../context/PostsContext";
import {
  makeStyles,
  Fade,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  IconButton,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles(theme => ({
  createButton: {
    position: "fixed",
    bottom: theme.spacing(4),
    left: "-60px",
    marginLeft: "50%",
    width: "160px",
    padding: theme.spacing(2),
    zIndex: "2",
  },
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
  showPassword: {
    position: "absolute",
    top: theme.spacing(10.8),
    right: theme.spacing(3.4),
    zIndex: "1",
  },
  textInput: {
    marginBottom: theme.spacing(2),
  },
}));

function CreateUser(props) {
  const classes = useStyles();
  const { authState } = useOktaAuth();
  const { accessToken } = authState.accessToken;
  const { users, setUsers } = useContext(PostsContext);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const createNewUser = () => {
    if (error) setError();
    if (
      !newUser.email ||
      !newUser.password ||
      !newUser.firstName ||
      !newUser.lastName
    ) {
      return setError("All fields are required");
    }
    setLoading(true);
    (async () => {
      let response = await Api.createUser(accessToken, newUser);
      if (response.error) {
        return setError(response.error[0].errorSummary);
      } else {
        const updatedUsers = [...users, response.user];
        setUsers(updatedUsers);
        setShowModal(false);
      }
    })();
    setLoading(false);
  };

  const cancel = () => {
    setNewUser({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    });
    setShowModal(false);
    setLoading(false);
    setError();
  };

  return (
    <>
      {!showModal && (
        <Fade in={!showModal}>
          <Button
            color="primary"
            variant="contained"
            className={classes.createButton}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Create User
          </Button>
        </Fade>
      )}
      <Dialog open={showModal} onClose={cancel} fullWidth={true} maxWidth="sm">
        <DialogTitle>Create User</DialogTitle>
        <DialogContent className={classes.form}>
          {loading && (
            <Box className={classes.formLoading}>
              <CircularProgress />
            </Box>
          )}
          <IconButton
            className={classes.showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {newUser.password.length > 0 ? (
              showPassword ? (
                <VisibilityOffIcon />
              ) : (
                <VisibilityIcon />
              )
            ) : null}
          </IconButton>
          <TextField
            label="Email*"
            name="email"
            variant="outlined"
            className={classes.textInput}
            onChange={e => handleInputChange(e)}
          />
          <TextField
            label="Password*"
            name="password"
            variant="outlined"
            className={classes.textInput}
            onChange={e => handleInputChange(e)}
            type={showPassword ? "text" : "password"}
          />
          <TextField
            label="First Name*"
            name="firstName"
            variant="outlined"
            className={classes.textInput}
            onChange={e => handleInputChange(e)}
          />
          <TextField
            label="Last Name*"
            name="lastName"
            variant="outlined"
            className={classes.textInput}
            onChange={e => handleInputChange(e)}
          />
          {error ? (
            <Alert onClose={() => setError()} severity="error" variant="filled">
              {error}
            </Alert>
          ) : null}
        </DialogContent>

        <DialogActions className={classes.buttonBox}>
          <Button color="secondary" variant="outlined" onClick={cancel}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={createNewUser}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateUser;
