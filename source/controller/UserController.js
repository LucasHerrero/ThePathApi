const express = require("express");
const router = express.Router();
const User = require("../module/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

router.get("/userById/:userid", async (req, res) => {
  try {
    const userid = req.params;

    const user = await User.findOne({
      where: { user_id: userid.userid },
    });
    if (user === null) {
      res.status(404).send("Usuario no encontrado");
    }else{
      res.json(user);
    }

    
  } catch (error) {
    res.status(500).send("Error retrieving user");
  }
});

router.post("/register", async (req, res) => {
  console.log(req.body);

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res.status(400).send("Ya existe un usuario con ese email");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      birthday: req.body.birthday,
      height: req.body.height,
      kg: req.body.kg,
      registration_date: new Date(),
    });

    // Create a JWT token
    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      secret,
      { expiresIn: "1h" }
    );

    // Send the token to the client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
});

router.post("/login", async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email: req.body.email } });

    // If the user was not found, send an error
    if (!user) {
      return res.status(400).send("The email does not exist");
    }

    // Check if the provided password matches the hashed password in the database
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // If the password is not valid, send an error
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }

    // If the email and password are valid, create a JWT token
    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      secret,
      { expiresIn: "1h" }
    );

    // Send the token to the client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

module.exports = router;
