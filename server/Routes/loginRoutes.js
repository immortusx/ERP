
const express = require('express');
const async = require('async');

const moment = require("moment");

const { tokenCheck } = require("../Auth/TokenCheck");
const { checkUserPermission } = require("../Auth/userPermission");
const { hasThePass, compareTheHass } = require('../Auth/Bcrypt')
const { verifyToken, getToken } = require('../Auth/Jwt');



const { db } = require("../Database/dbConfig");

const router = express.Router();
router.post('/admin-registration', async (req, res) => {
  console.log('>>>>>adminRegister');

  const hassPass = await hasThePass(req.body.password)
  const url = `INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES('${req.body.firstName}', '${req.body.lastName}', '${req.body.email}', '${hassPass}', '${req.body.phoneNumber}')`
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      const sqlQuery = `INSERT INTO branch_department_user(branch_id,department_id,user_id, role_id) VALUES(1,1,'${result.insertId}', 1)`
      await db.query(sqlQuery, (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else {
          console.log({ isSuccess: true, result: url })
          res.send({ isSuccess: true, result: 'success' })
        }
      })
    }
  })
})
router.get('/is-admin-exist', async (req, res) => {
  console.log('>>>>>adminExist');

  const url = `SELECT * from branch_department_user where role_id = 1`
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else if (result.length > 0) {
      console.log({ isSuccess: true, result: true })
      res.send({ isSuccess: true, result: true })
    } else {
      console.log({ isSuccess: true, result: false })
      res.send({ isSuccess: true, result: false })
    }
  })
})
router.post('/branch-token-change', tokenCheck, async (req, res) => {
  console.log('>>>>>>>branch-token-change')
  console.log('req.myData', req.myData, req.body.id)
  const tokenData = {
    id: req.myData.userId,
    branchId: req.body.id
  };
  const tokenIs = await getToken(tokenData)
  res.send({ isSuccess: true, message: 'success', result: tokenIs })
  console.log({ isSuccess: true, message: 'success', result: tokenIs })
})


router.post('/', async (req, res) => {
  console.log('>>>>>login');

  const { username, password } = req.body; // Assuming 'username' is used for both email and phone number

  const url = `SELECT * FROM users WHERE email = ? OR phone_number = ?`; // Use OR condition to check both email and phone number

  db.query(url, [username, username], async (err, result) => {
    if (err) {
      res.send({ isSuccess: true, message: 'error', result: [] });
      console.log({ isSuccess: true, message: 'error', result: err });
    } else if (result.length > 0) {
      const comparisionResult = await compareTheHass(password, result[0].password);
      if (comparisionResult) {
        if (result[0].is_active == 1) {
          var cdate = moment().format('YYYY-MM-DD H:m:s');
          const newUrl = `UPDATE users SET last_login = current_login, current_login = ? WHERE id = ?`;
          db.query(newUrl, [cdate, result[0].id], async (err, newResult) => {
            if (err) {
              res.send({ isSuccess: true, message: 'error', result: [] });
              console.log({ isSuccess: true, message: 'error', result: err });
            } else {
              const branchUrl = `SELECT DISTINCT s.id, s.name FROM branch_department_user AS f INNER JOIN branches AS s ON s.id = f.branch_id WHERE f.user_id = ?`;
              db.query(branchUrl, [result[0].id], async (err, branchResult) => {
                if (err) {
                  res.send({ isSuccess: true, message: 'error', result: [] });
                  console.log({ isSuccess: true, message: 'error', result: err });
                } else if (branchResult.length > 0) {
                  console.log('branchResult ************', branchResult);
                  let currentBranch = branchResult[0].id;
                  const tokenData = {
                    id: result[0].id,
                    branchId: currentBranch,
                  };
                  const tokenIs = await getToken(tokenData);
                  res.send({ isSuccess: true, message: 'success', result: { branchResult, tokenIs, currentBranch } });
                  console.log({ isSuccess: true, message: 'success', result: { branchResult, tokenIs, currentBranch } });
                } else {
                  let currentBranch = '1';
                  const tokenData = {
                    id: result[0].id,
                    branchId: currentBranch,
                  };
                  const tokenIs = await getToken(tokenData);
                  res.send({ isSuccess: true, message: 'success', result: { branchResult, tokenIs, currentBranch } });
                  console.log({ isSuccess: true, message: 'success', result: { branchResult, tokenIs, currentBranch } });
                }
              });
            }
          });
        } else {
          res.send({ isSuccess: true, message: 'deactivate', result: [] });
          console.log({ isSuccess: true, message: 'deactivate', result: [] });
        }
      } else {
        res.send({ isSuccess: true, message: 'wrong', result: [] });
        console.log({ isSuccess: true, message: 'wrong', result: [] });
      }
    } else {
      console.log(url);
      res.send({ isSuccess: true, message: 'empty', result: [] });
      console.log({ isSuccess: true, message: 'empty', result: [] });
    }
  });
});

module.exports = router;