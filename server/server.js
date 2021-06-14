require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const finale = require("finale-rest");
const OktaJwtVerifier = require("@okta/jwt-verifier");
const okta = require("@okta/okta-sdk-nodejs");

const client = new okta.Client({
  orgUrl: "https://dev-41008785.okta.com/",
  token: process.env.TOKEN, // Obtained from Developer Dashboard
});

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

//get list of all users
app.get("/users", async (req, res) => {
  let allUsers = [];
  for await (let user of client.listUsers()) {
    allUsers.push(user);
  }
  res.json({ users: allUsers });
});

//create a new user
app.post("/users", (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const newUser = {
    profile: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      login: email,
    },
    credentials: {
      password: {
        value: password,
      },
    },
  };
  client
    .createUser(newUser)
    .then(user => res.json({ user: user }))
    .catch(err => res.json({ error: err.errorCauses }));
});

//delete existing user
app.delete("/users/:id", async (req, res) => {
  client.getUser(req.params.id).then(user => {
    user
      .deactivate()
      .then(() => user.delete())
      .then(() => res.json({ success: true }))
      .catch(err => {
        res.json({ success: false, error: err });
      });
  });
});

//update user's information
app.post("/users/:id", async (req, res) => {
  const { department, title, mobilePhone } = req.body;
  client
    .getUser(req.params.id)
    .then(user => {
      //console.log(user);
      user.profile.department = department || "";
      user.profile.title = title || "";
      user.profile.mobilePhone = mobilePhone || "";
      user.update().then(() => {
        res.json({ user: user });
      });
    })
    .catch(err => res.json({ error: err }));
});

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
let userResource = finale.resource({
  model: Post,
  endpoints: ["/posts", "/posts/:id"],
});

// Resets the database and launches the express app on :3001
database.sync({ force: true }).then(() => {
  app.listen(3001, () => {
    console.log("listening to port localhost:3001");
  });
});
