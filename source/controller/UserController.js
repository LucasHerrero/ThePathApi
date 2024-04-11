const express = require('express');
const router = express.Router();
const User = require('../module/user.js');

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving users');
  }
});

module.exports = router;