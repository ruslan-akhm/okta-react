import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 16,
  },
  palette: {
    primary: { main: "#0076b7" },
    secondary: { main: "#b72500" },
    background: { main: "#f0efe9" },
    dark: { main: "#2b2d42" },
  },
});

// #f0efe9 - background
// - regular white for posts and text input div
// - #0076b7 - primary
// - #b72500 - secondary
// #1d3557 - navbar
