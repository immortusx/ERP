const express = require('express');
const { tokenCheck } = require("../Auth/TokenCheck");
const { db } = require("../Database/dbConfig");

const router = express.Router();


router.get('/get-branch-data', async (req, res) => {
  console.log('>>>>>get-branch-data');
  const url = `SELECT * FROM dealers; `
  await db.query(url, async (err, getDealers) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'err ' })
    } else {
      const newUrl = `SELECT * FROM users where id != 20  ; `
      await db.query(newUrl, async (err, getUsers) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'err ' })
        } else {
          const myObj = {
            users: getUsers,
            dealers: getDealers,
          }
          console.log({ isSuccess: true, result: url })
          res.send({ isSuccess: true, result: myObj })
        }

      })
    }
  })
})


module.exports = router;