const express = require('express');
const router = express.Router();

const userDb = require('../models/generic-dao');

router.get('/api/check-username', async function (req, res) {
  const username = req.query.username
  const matchedUser = await userDb.getUserDataByUsername(username);
  if (matchedUser) {
    res.send('username exists');
  } else res.send('username does not exist');
});

router.post('/api/check-passwords-match', async function (req, res) {
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  if (password === confirmPassword || confirmPassword === '') {
    res.status(200).send('passwords match');
  } else res.status(400).send('passwords different');
});

router.post('/api/validate-password-format',  async function (req, res) {
  const password = req.body.password;
  const passwordRegex = /^(?=.*[\W_]).{5,}$/;
  if (passwordRegex.test(password)) {
    res.status(200).send('valid');
  } else res.status(400).send('invalid');
});

module.exports = router;