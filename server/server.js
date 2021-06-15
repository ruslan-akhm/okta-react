require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const finale = require("finale-rest");
const OktaJwtVerifier = require("@okta/jwt-verifier");
const userRouter = require("./routes/userRouter");

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.CLIENT_ID,
  issuer: process.env.ISSUER,
});

const { json, urlencoded } = express;

let app = express();
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error("Authorization header is required"));
  }
  let parts = req.headers.authorization.trim().split(" ");
  let accessToken = parts.pop();
  oktaJwtVerifier
    .verifyAccessToken(accessToken, "api://default")
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub,
      };
      next();
    })
    .catch(next); // jwt did not verify!
});

app.use("/", userRouter);

// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database = new Sequelize({
  dialect: "sqlite",
  storage: "./test.sqlite",
});

// Define our Post model
// id, createdAt, and updatedAt are added by sequelize automatically
let Post = database.define("posts", {
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
});

// Initialize finale
finale.initialize({
  app: app,
  sequelize: database,
});

// Create the dynamic REST resource for our Post model
finale.resource({
  model: Post,
  endpoints: ["/posts", "/posts/:id"],
});

// Resets the database and launches the express app on :3001
database.sync({ force: true }).then(() => {
  app.listen(3001, () => {
    console.log("listening to port localhost:3001");
  });
});
