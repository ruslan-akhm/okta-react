import { BrowserRouter as Router } from "react-router-dom";
import AppWithRouterAccess from "./AppWithRouterAccess";
import PostsProvider from "./context/PostsContext";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme";

const App = () => (
  <MuiThemeProvider theme={theme}>
    <PostsProvider>
      <Router>
        <AppWithRouterAccess />
      </Router>
    </PostsProvider>
  </MuiThemeProvider>
);
export default App;
