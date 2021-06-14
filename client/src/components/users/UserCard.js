import { useState } from "react";
import ModifyUser from "./ModifyUser";
import {
  makeStyles,
  Grid,
  Typography,
  Grow,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Popover,
  Box,
} from "@material-ui/core";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles(theme => ({
  cardButtons: {
    marginLeft: "auto",
  },
  cardsBox: {
    padding: theme.spacing(2),
  },
  cardsBlocks: {
    height: "fit-content",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardsListed: {
    height: "fit-content",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  popoverText: {
    //border: "2px solid red",
    backgroundColor: theme.palette.dark.main,
    padding: theme.spacing(1),
    color: "#fff",
  },
  showMore: {
    padding: "2px",
  },
  subText: {
    color: "gray",
  },
}));

function UserCard(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = anchorEl !== null;
  const id = open ? "simple-popover" : undefined;

  return (
    <Grow in={props.user !== null} key={props.user.id}>
      <Grid
        item
        className={classes.cardsBox}
        md={props.layout === "list" ? 12 : 3}
        lg={props.layout === "list" ? 12 : 3}
      >
        <Card
          className={
            props.layout === "list" ? classes.cardsListed : classes.cardsBlocks
          }
        >
          <CardContent>
            <Typography variant="h6">
              {props.user.profile.firstName} {props.user.profile.lastName}
            </Typography>
            <Typography variant="subtitle1" className={classes.subText}>
              {props.user.profile.email}
            </Typography>
          </CardContent>
          <CardActions className={classes.cardButtons}>
            {(props.user.profile.department ||
              props.user.profile.title ||
              props.user.profile.mobilePhone) && (
              <>
                <IconButton
                  aria-describedby={id}
                  className={classes.showMore}
                  onClick={handleClick}
                >
                  <MoreHorizIcon />
                </IconButton>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Box className={classes.popoverText}>
                    <Typography>
                      Department: {props.user.profile.department || "N/A"}
                    </Typography>
                    <Typography>
                      Title: {props.user.profile.title || "N/A"}
                    </Typography>
                    <Typography>
                      Phone: {props.user.profile.mobilePhone || "N/A"}
                    </Typography>
                  </Box>
                </Popover>
              </>
            )}
            <ModifyUser user={props.user} />
          </CardActions>
        </Card>
      </Grid>
    </Grow>
  );
}

export default UserCard;
