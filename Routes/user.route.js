const express = require("express");
const { userModel } = require("../Models/User.Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword, phone } = req.body;

  const user = await userModel.findOne({ email });

  if (user) {
    res.send({ message: "User already exist, please login" });
  } else if (password !== confirmPassword) {
    res.send({ message: "password doesn't match, please try again" });
  } else {
    bcrypt.hash(
      password,
      Number(process.env.ROUND),
      async function (err, hashedPassword) {
        if (err) {
          res.send({ message: "Something went wrong, please try later..." });
        }
        const new_user = new userModel({
          name,
          email,
          password: hashedPassword,
          confirmPassword: hashedPassword,
          phone,
        });
        await new_user.save();
        res.send({ message: "Signup successful..." });
      }
    );
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    res.send({ message: " Email doesn't exist, please signup" });
  }
  const hashed_password = user.password;
  const user_id = user._id;

  bcrypt.compare(password, hashed_password, async (err, result) => {
    if (result) {
      const token = jwt.sign({ user_id }, process.env.SECRET_KEY);
      const allUsers = await userModel.find();
      res.send({
        message: "Login successful",
        token: token,
        currentUser: user,
        allUsers,
      });
    } else {
      res.send({
        message:
          "Email or password doesn't match, please check email or password",
      });
    }
  });
});

userRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const update = await userModel.findOneAndUpdate({ _id: id }, req.body);

  if (update) {
    const currentUser = await userModel.findById({ _id: id });
    const allUsers = await userModel.find();

    res.send({
      message: "Update successful",
      currentUser,
      allUsers,
    });
  }
});

module.exports = {
  userRouter,
};
