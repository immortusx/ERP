
const express = require('express');
const async = require('async');

const { tokenCheck } = require("../Auth/TokenCheck");
const { checkUserPermission } = require("../Auth/userPermission");
const { hasThePass, compareTheHass } = require('../Auth/Bcrypt')


const { db } = require("../Database/dbConfig");

const router = express.Router();


router.get('/profile-data', tokenCheck, async (req, res) => {
  console.log('>>>>>profileData', req.myData);
  const url = `call sp_profile_data( ${req.myData.dealerId},  ${req.myData.userId},  ${req.myData.isSuperAdmin});`
  await db.query(url, async (err, result) => {
    console.log('result ******* ', result[0])
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      let features = JSON.parse(result[0][0].features)
      let newObj = {
        email: result[0][0].email,
        first_name: result[0][0].first_name,
        last_name: result[0][0].last_name,
        last_login: result[0][0].last_login,
        features: features,
      }
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: newObj })
    }
  })
})
router.get('/get-user-list', tokenCheck, checkUserPermission('users'), async (req, res) => {
  console.log('>>>>>get-user-list');
  let url = `call sp_get_user_list(${req.myData.userId}, ${req.myData.dealerId}, ${req.myData.isSuperAdmin});`
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: result[0] })
    }
  })
})
router.get('/get-user-details/:id', tokenCheck, async (req, res) => {
  const userId = req.params.id
  const urlNew = `call sp_user_details_dealers_roles( ${userId}) `
  db.query(urlNew, async (err, result) => {
    console.log('result[0][0].dealersRole ***********',result[0][0].dealersRole)
    let data = JSON.parse(result[0][0].dealersRole)
    console.log('result[0]', data)
    if (err) {
      console.log({ isSuccess: false, result: 'emptyDealer' })
      res.send({ isSuccess: false, result: 'emptyDealer' })
    } else {
      console.log({ isSuccess: true, result: urlNew })
      res.send({ isSuccess: true, result: data })
    }
  })
})
router.get('/roles-list', async (req, res) => {
  console.log('>>>>>role-list');
  const url = `call sp_get_role_list()`
  await db.query(url, async (err, roles) => {
    if (err) {
      console.log({ isSuccess: true, result: err })
      res.send({ isSuccess: true, result: 'error' })
    } else {
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: roles[0] })

    }
  })
})
router.get('/dealers-list', tokenCheck, async (req, res) => {
  console.log('>>>>>dealers-list');
  const url = `call sp_get_dealer_list(${req.myData.dealerId}, ${req.myData.isSuperAdmin});`
  await db.query(url, async (err, dealers) => {
    if (err) {
      console.log({ isSuccess: true, result: err })
      res.send({ isSuccess: true, result: 'error' })
    } else {
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: dealers[0] })

    }
  })
})
router.post('/edit-user', tokenCheck, checkUserPermission('edit-user'), async (req, res) => {
  console.log('>>>>>edit-user');

  const dealerRole = req.body.dealerRole;
  const departmentId = 1;
  const userId = req.body.id;
  const hassPass = await hasThePass(req.body.password)
  // const url = `INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES('${req.body.firstName}', '${req.body.lastName}', '${req.body.email}', '${hassPass}', '${req.body.phoneNumber}')`
  let addNewValue = '';

  if (req.body.password !== '') {
    addNewValue = `, password = '${hassPass}'`
  }
  const url = `UPDATE users SET first_name = '${req.body.firstName}', last_name = '${req.body.lastName}', email = '${req.body.email}', phone_number = '${req.body.phoneNumber}' ${addNewValue} WHERE(id = '${req.body.id}'); `
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {

      const newSqlQuery = `delete FROM dealer_department_user where user_id = '${req.body.id}'`
      db.query(newSqlQuery, (err, newSqlResult) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else {
          async.forEachOf(Object.keys(dealerRole), (dealerId, key, callback) => {
            const rolesAr = dealerRole[dealerId]
            rolesAr.forEach(async (roleId) => {
              const sqlQuery = `INSERT INTO dealer_department_user(dealer_id, department_id,user_id,role_id) VALUES('${dealerId}','${departmentId}','${userId}','${roleId}')`
              await db.query(sqlQuery, (err, newResult) => {
                if (err) {
                  console.log({ isSuccess: false, result: err })
                  res.send({ isSuccess: false, result: 'error' })
                }
              })
            });
            callback()
          }, (err) => {
            if (err) {
              console.log({ isSuccess: false, result: err })
              res.send({ isSuccess: false, result: 'error' })
            } else {
              console.log({ isSuccess: true, result: 'success' })
              res.send({ isSuccess: true, result: 'success' })
            }
          })
        }
      })
    }
  })
})
router.post('/add-user', tokenCheck, checkUserPermission('add-user'), async (req, res) => {
  console.log('>>>>>addUser');


  const roleArr = req.body.role;
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = req.body.password
  const phoneNumber = req.body.phoneNumber
  const dealerRole = req.body.dealerRole
  const departmentId = 1

  const hassPass = await hasThePass(password)

  const newUrl = `SELECT * FROM users where email = '${req.body.email}'; `
  await db.query(newUrl, async (err, newResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else if (newResult.length === 0) {
      const url = `INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES('${firstName}', '${lastName}', '${email}', '${hassPass}', '${phoneNumber}')`
      await db.query(url, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else {
          const userId = result.insertId

          async.forEachOf(Object.keys(dealerRole), (dealerId, key, callback) => {
            const rolesAr = dealerRole[dealerId]
            rolesAr.forEach(async (roleId) => {
              const sqlQuery = `INSERT INTO dealer_department_user(dealer_id, department_id,user_id,role_id) VALUES('${dealerId}','${departmentId}','${userId}','${roleId}')`
              await db.query(sqlQuery, (err, newResult) => {
                if (err) {
                  console.log({ isSuccess: false, result: err })
                  res.send({ isSuccess: false, result: 'error' })
                }
              })
            });
            callback()
          }, (err) => {
            if (err) {
              console.log({ isSuccess: false, result: err })
              res.send({ isSuccess: false, result: 'error' })
            } else {
              console.log({ isSuccess: true, result: 'success' })
              res.send({ isSuccess: true, result: 'success' })
            }
          })
        }
      })
    } else {
      console.log({ isSuccess: false, result: 'alreadyExist' })
      res.send({ isSuccess: false, result: 'alreadyExist' })
    }
  })
})

module.exports = router;