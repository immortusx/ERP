
const express = require('express');
const async = require('async');

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

router.get('/get-features', tokenCheck, checkUserPermission('roles'), async (req, res) => {
    console.log('>>>>>get-features');
    const urlNew = `SELECT * FROM features; `
    await db.query(urlNew, (err, result) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: result })
            res.send({ isSuccess: true, result: result })
        }
    })

})
router.post('/add-district', tokenCheck, async (req, res) => {
    console.log('>>>>>/add-district');
    const { districtName, districtDiscription } = req.body
    console.log(districtName, districtDiscription);
    
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
router.post('/add-role', tokenCheck, checkUserPermission('add-role'), async (req, res) => {
    console.log('>>>>>add-role');
    const { roleName, roleDescription, checkedFeatures } = req.body
    const urlNew = `INSERT INTO roles(role, active, description) VALUES('${roleName}', 1, '${roleDescription}'); `
    await db.query(urlNew, async (err, result) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            if (result.insertId) {
                async.forEachOf(checkedFeatures, (item, key, callback) => {
                    const sqlQuery = `INSERT INTO role_features(role_id, feature_id) VALUES('${result.insertId}', '${item}')`;
                    db.query(sqlQuery, (err, resultNew) => {
                        if (err) {
                            console.log({ isSuccess: true, result: err })
                            res.send({ isSuccess: true, result: 'error' })
                        }
                    })
                    callback();
                }, (err) => {
                    if (err) {
                        console.log({ isSuccess: true, result: err })
                        res.send({ isSuccess: true, result: 'error' })
                    } else {
                        console.log({ isSuccess: true, result: 'success' })
                        res.send({ isSuccess: true, result: 'success' })
                    }
                })

            }
        }
    })
})
router.post('/get-roles-features', tokenCheck, async (req, res) => {
    console.log('>>>>>get-roles-features', req.body.roleId);


    const url = `select t.* from roles as f inner join role_features as s on s.role_id = f.id inner join features as t on t.id = s.feature_id where f.id = ${req.body.roleId} `
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})
router.get('/get-roles-to-edit', tokenCheck, async (req, res) => {
    console.log('>>>>>get-roles');

    const url = `SELECT * from roles where id != 1`
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})

module.exports = router;