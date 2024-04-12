const express = require("express");
const router = express.Router();
const User = require("../module/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  console.log(req.body);
  
  try {
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
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });

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

module.exports = router;
