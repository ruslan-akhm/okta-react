const okta = require("@okta/okta-sdk-nodejs");

const client = new okta.Client({
  orgUrl: "https://dev-41008785.okta.com/",
  token: process.env.TOKEN,
});

//get all users
exports.getUsers = async (req, res) => {
  let allUsers = [];
  for await (let user of client.listUsers()) {
    allUsers.push(user);
  }
  res.json({ users: allUsers });
};

//create a new user
exports.createUser = (req, res) => {
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
};

//delete existing user
exports.deleteUser = async (req, res) => {
  client.getUser(req.params.id).then(user => {
    user
      .deactivate()
      .then(() => user.delete())
      .then(() => res.json({ success: true }))
      .catch(err => {
        res.json({ success: false, error: err });
      });
  });
};

//update user's information
exports.updateUser = async (req, res) => {
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
};
