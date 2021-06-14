const router = require("express").Router();

const userController = require("../controllers/userController");

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.delete("/users/:id", userController.deleteUser);
router.post("/users/:id", userController.updateUser);

module.exports = router;
