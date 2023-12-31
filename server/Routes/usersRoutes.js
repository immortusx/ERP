
const express = require('express');
const async = require('async');

const { tokenCheck } = require("../Auth/TokenCheck");
const { checkUserPermission } = require("../Auth/userPermission");
const { hasThePass, compareTheHass } = require('../Auth/Bcrypt')


const { db } = require("../Database/dbConfig");

const router = express.Router();


router.get('/profile-data', tokenCheck, async (req, res) => {
  console.log('>>>>>profileData', req.myData);
  const url = `call sp_profile_data( ${req.myData.branchId},  ${req.myData.userId},  ${req.myData.isSuperAdmin});`
  await db.query(url, async (err, result) => {
    console.log('result ******* ', result[0])
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log('result[0]', result[0])
      let features = JSON.parse(result[0][0].features)
      let newObj = {
        email: result[0][0].email,
        first_name: result[0][0].first_name,
        last_name: result[0][0].last_name,
        phone_number: result[0][0].phone_number,
        last_login: result[0][0].last_login,
        document_path: result[0][0].document_path,
        features: features,
      };
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: newObj })
    }
  })
})
router.get('/get-user-list', tokenCheck, checkUserPermission('users'), async (req, res) => {
  console.log('>>>>>get-user-list');
  let url = `call sp_get_user_list(${req.myData.userId}, ${req.myData.branchId}, ${req.myData.isSuperAdmin});`
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
  const urlNew = `call sp_user_details_branches_roles( ${userId}) `
  db.query(urlNew, async (err, result) => {
    console.log(result, "result")
    console.log('result[0][0].branchesRole ***********', result[0][0].branchesRole)
    let data = JSON.parse(result[0][0].branchesRole)
    console.log('result[0]', data)
    if (err) {
      console.log({ isSuccess: false, result: 'emptyBranch' })
      res.send({ isSuccess: false, result: 'emptyBranch' })
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
router.get('/roles-lists', async (req, res) => {
  console.log('>>>>>role-list');
  const url = "select * from roles where role_emp = 1"
  await db.query(url, async (err, roles) => {
    if (err) {
      console.log({ isSuccess: true, result: err })
      res.send({ isSuccess: true, result: 'error' })
    } else {
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: roles })

    }
  })
})

router.get('/getRoleDesc/:id', async (req, res) => {
  console.log('>>>>>usersgetRoleDesc');
  const id = req.params.id
  const url = `select description ,role_emp from roles where id = ${id}`
  await db.query(url, async (err, roles) => {
    if (err) {
      console.log({ isSuccess: true, result: err })
      res.send({ isSuccess: true, result: 'error' })
    } else {
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: roles })

    }
  })
})
router.get('/branches-list', tokenCheck, async (req, res) => {
  console.log('>>>>>branches-list');
  const url = `call sp_get_branch_list(${req.myData.branchId}, ${req.myData.isSuperAdmin});`
  await db.query(url, async (err, branches) => {
    if (err) {
      console.log({ isSuccess: true, result: err })
      res.send({ isSuccess: true, result: 'error' })
    } else {
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: branches[0] })

    }
  })
})
router.post('/edit-user', tokenCheck, checkUserPermission('edit-user'), async (req, res) => {
  console.log('>>>>>edit-user');

  const branchRole = req.body.branchRole;
  const departmentId = 1;
  const userId = req.body.id;

  const newPassword = req.body.password;
  const defaultPassword = '..................'; 
  let updatePasswordQuery = "";

  if (newPassword && newPassword !== defaultPassword) {
    // Hash the new password
    const hashedNewPassword = await hasThePass(newPassword);
    updatePasswordQuery = `, password = '${hashedNewPassword}'`;
  }
  const url = `UPDATE users SET first_name = '${req.body.firstName}', last_name = '${req.body.lastName}', email = '${req.body.email}', phone_number = '${req.body.phoneNumber}'  ${updatePasswordQuery}  WHERE(id = '${req.body.id}'); `
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {

      const newSqlQuery = `delete FROM branch_department_user where user_id = '${req.body.id}'`
      db.query(newSqlQuery, (err, newSqlResult) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else {
          async.forEachOf(Object.keys(branchRole), (branchId, key, callback) => {
            const rolesAr = branchRole[branchId]
            rolesAr.forEach(async (roleId) => {
              const sqlQuery = `INSERT INTO branch_department_user(branch_id, department_id,user_id,role_id) VALUES('${branchId}','${departmentId}','${userId}','${roleId}')`
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
  const branchRole = req.body.branchRole
  const departmentId = 1
  const user_type_id = 1;



  const hassPass = await hasThePass(password)

  const newUrl = `SELECT * FROM users where email = '${req.body.email}'; `
  await db.query(newUrl, async (err, newResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else if (newResult.length === 0) {
      const url = `INSERT INTO users(first_name, last_name, email, password, phone_number, user_type_id) VALUES('${firstName}', '${lastName}', '${email}', '${hassPass}', '${phoneNumber}', '${user_type_id}')`;
      await db.query(url, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else {
          const userId = result.insertId

          async.forEachOf(Object.keys(branchRole), (branchId, key, callback) => {
            const rolesAr = branchRole[branchId]
            rolesAr.forEach(async (roleId) => {
              const sqlQuery = `INSERT INTO branch_department_user(branch_id, department_id,user_id,role_id) VALUES('${branchId}','${departmentId}','${userId}','${roleId}')`;
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

router.get("/delete-user/:id", tokenCheck, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId, "ggggggggggggggggggggggggggg");
    const newUrl =
      "SELECT * FROM users where is_delete = 0 and id=" + userId;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else if (newResult.length === 1) {
        console.log(newResult.length, "true");
        const editurl = "UPDATE users SET is_delete = 1 WHERE id=" + userId;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err });
            res.send({ isSuccess: false, result: "error" });
          } else {
            res.send({ isSuccess: true, result: "deletesuccess" });
          }
        });
      } else {
        console.log(newResult.length, "false");
        console.log({ isSuccess: false, result: "notExist" });
        res.send({ isSuccess: false, result: "notExist" });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/changepassword', tokenCheck, async (req, res) => {
  console.log('>>>>>addUser');

  console.log(req.body);

  const email = req.body.email
  const currentPassword = req.body.currentPassword
  const confirmPassword = req.body.confirmPassword

  const hassPass = await hasThePass(currentPassword)


  const newUrl = `SELECT * FROM users where email = '${req.body.email}'; `

  await db.query(newUrl, async (err, newResult) => {
    console.log(newResult)
    console.log(newResult[0].password, 'storedPassword');
    // console.log(hassPass, 'currentPaasowd')
    // compareTheHass(hassPass, newResult[0].password).
    const hassPass = await hasThePass(confirmPassword)
    const passwordsMatch = await compareTheHass(currentPassword, newResult[0].password);
    if (passwordsMatch) {
      console.log(passwordsMatch, 'pass')
      const updateQuery = `UPDATE users SET password = ? WHERE email = '${email}'`;
      await db.query(updateQuery, [hassPass], async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: 'error' });
        } else {
          console.log({ isSuccess: true, result: 'Paasword Changed Successfully' });
          res.send({ isSuccess: true, result: 'Password Changed Successfully' });
        }
      });
    } else {
      console.log(passwordsMatch, 'not match')
    }
  })
})




module.exports = router;