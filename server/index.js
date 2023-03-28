const express = require('express')
const dotenv = require('dotenv')
const app = express()
const port = 1022
const cors = require("cors");
dotenv.config()
app.use(express.json());

const moment = require("moment");
const bcrypt = require('bcrypt');

const async = require('async');
app.use(express.json());
const path = require('path');


var jwt = require('jsonwebtoken');
const mysql = require('mysql')
const { hasThePass, compareTheHass } = require('./Auth/Bcrypt')
const { verifyToken, getTokenWithExp, getToken } = require('./Auth/Jwt')
// const SqlString = require('mysql/lib/protocol/SqlString');
app.use(cors());

const db = mysql.createConnection({
  host: process.env.ENV_HOST,
  user: process.env.ENV_USER,
  password: process.env.ENV_PASSWORD,
  database: process.env.ENV_DATABASE,
})

db.connect(err => {
  if (err) {
    console.log(err)
  } else {
    console.log('Database is connected to :', process.env.ENV_DATABASE)
  }
})

app.post('/api/add-role', tokenCheck, checkUserPermission('add-role'), async (req, res) => {
  console.log('>>>>>add-role');
  console.log('req.body', req.body);
  const { roleName, roleDescription, checkedFeatures } = req.body
  const urlNew = `INSERT INTO roles (role, active,description) VALUES ('${roleName}',1,'${roleDescription}');`
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: 'error' })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log('result', result.insertId)
      if (result.insertId) {
        async.forEachOf(checkedFeatures, (item, key, callback) => {
          const sqlQuery = `INSERT INTO role_features (role_id,feature_id) VALUES('${result.insertId}','${item}')`;
          console.log('sqlQuery', sqlQuery);
          db.query(sqlQuery, (err, resultNew) => {
            if (err) {
              console.log('err', err)
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
app.get('/api/get-features', tokenCheck, checkUserPermission('add-role'), async (req, res) => {
  console.log('>>>>>get-features');
  const urlNew = `SELECT * FROM features;`
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
function checkUserPermission(role) {
  return async (req, res, next) => {
    const url = `SELECT DISTINCT  t.page, t.index_no , t.feature  FROM rbac_db.user_role as f inner join rbac_db.role_features as s on s.role_id = f.role_id inner join rbac_db.features as t on s.feature_id = t.id  where user_id = ${req.myData.userId}`
    let tempAr = [];
    await db.query(url, (err, result) => {
      if (err) {
        console.log('err', err)
      }
      if (result && result.length > 0) {
        result.forEach((i) => {
          tempAr.push(i.feature)
        })
        if (tempAr.includes(role)) {
          next()
        } else {
          console.log({ isSuccess: false, result: 'user have not permissions to access' });
          return res.send({ isSuccess: false, result: 'user have not permissions to access' })
        }
      }
    })
  }
}
async function tokenCheck(req, res, next) {
  let currentToken = req.headers.token
  const isAuthId = await verifyToken(currentToken)
  if (isAuthId && isAuthId.id) {
    req.myData = {
      userId: isAuthId.id
    }
    console.log('User id in tokenCheck', isAuthId.id);
    return next()
  } else {
    console.log({ isSuccess: false, result: 'auth failed' })
    return res.send({ isSuccess: false, result: 'auth failed' })
  }
}
app.get('/api/profileData', async (req, res) => {
  console.log('>>>>>profileData');
  let currentToken = req.headers.token
  const isAuthId = await verifyToken(currentToken)
  if (isAuthId.id) {
    const url = `SELECT email,first_name,last_name,last_login from users where id = ${isAuthId.id}`
    await db.query(url, async (err, result) => {
      if (err) {

        console.log({ isSuccess: true, result: err })
        res.send({ isSuccess: true, result: 'error' })
      } else {
        tempArr = result
        // const urlNew = `select (select s.role from rbac_db.roles as s where id=f.role_id )as role from rbac_db.user_role as f where user_id = ${isAuthId.id}`
        const urlNew = `SELECT DISTINCT  t.page, t.index_no , t.feature  FROM rbac_db.user_role as f inner join rbac_db.role_features as s on s.role_id = f.role_id inner join rbac_db.features as t on s.feature_id = t.id  where user_id = ${isAuthId.id}`
        await db.query(urlNew, (err, resultNew) => {
          if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
          } else {
            result[0].role = resultNew
            console.log({ isSuccess: true, result: urlNew })
            res.send({ isSuccess: true, result: result[0] })
          }
        })
      }
    })
  } else {
    console.log({ isSuccess: true, result: 'noAuth' })
    res.send({ isSuccess: true, result: 'noAuth' })
  }
})

app.get('/api/get-user-list', tokenCheck, checkUserPermission('users'), async (req, res) => {
  console.log('>>>>>get-user-list');
  const url = `select f.id, f.first_name, f.last_name, f.email,f.is_active,f.phone_number from  rbac_db.users as f;`
  await db.query(url, async (err, result) => {
    let tempArr = [];
    tempArr = result
    async.forEachOf(result, (item, key, callback) => {
      result[key].role = [];
      const urlNew = `select  (select s.role from rbac_db.roles as s where id=f.role_id )as role from rbac_db.user_role as f where user_id =  ${item.id}`
      db.query(urlNew, (err, resultNew) => {
        resultNew.forEach((eachRole) => {
          result[key].role.push(eachRole.role)
        })
        callback()
      })
    }, (err) => {
      if (err) {
        console.log({ isSuccess: true, result: err })
        res.send({ isSuccess: true, result: 'error' })
      } else {
        console.log({ isSuccess: true, result: url })
        res.send({ isSuccess: true, result: result })
      }
    })
  })
})
app.get('/api/get-roles', tokenCheck, checkUserPermission('add-user'), async (req, res) => {
  console.log('>>>>>get-roles');

  const url = `SELECT * from roles where id != 1 and active=1`
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
app.get('/api/adminExist', async (req, res) => {
  console.log('>>>>>adminExist');

  const url = `SELECT * from user_role where role_id = 1`
  await db.query(url, async (err, result) => {
    console.log('result in adminExist', result.length)
    if (err) {
      console.log({ isSuccess: true, result: err })
      res.send({ isSuccess: true, result: 'error' })
    } else if (result.length > 0) {
      console.log({ isSuccess: true, result: true })
      res.send({ isSuccess: true, result: true })
    } else {
      console.log({ isSuccess: true, result: false })
      res.send({ isSuccess: true, result: false })
    }
  })
})


app.post('/api/edit-user', tokenCheck, checkUserPermission('edit-user'), async (req, res) => {
  console.log('>>>>>edit-user');

  const roleArr = req.body.role;
  const hassPass = await hasThePass(req.body.password)
  // const url = `INSERT INTO users (first_name, last_name, email, password,phone_number) VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.email}','${hassPass}','${req.body.phoneNumber}')`
  let addNewValue = '';
  if (req.body.password !== '') {
    addNewValue = `, password = '${hassPass}'`
  }
  const url = `UPDATE users SET first_name = '${req.body.firstName}', last_name = '${req.body.lastName}', email = '${req.body.email}', phone_number = '${req.body.phoneNumber}' ${addNewValue} WHERE (id = '${req.body.id}');  `
  console.log('url', url);
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {

      const newSqlQuery = `delete FROM user_role where user_id = '${req.body.id}'`
      db.query(newSqlQuery, (err, newSqlResult) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else {
          async.forEachOf(roleArr, (element, key, callback) => {
            const sqlQuery = `INSERT INTO user_role (user_id,role_id) VALUES ('${req.body.id}','${element}')`
            db.query(sqlQuery, (err, newResult) => {
              if (err) {
                console.log({ isSuccess: false, result: err })
                res.send({ isSuccess: false, result: 'error' })
              }
            })
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

app.post('/api/addUser', tokenCheck, checkUserPermission('add-user'), async (req, res) => {
  console.log('>>>>>addUser');

  console.log('in addUser', req.body)
  const roleArr = req.body.role;
  const hassPass = await hasThePass(req.body.password)

  const newUrl = `SELECT * FROM users where email ='${req.body.email}';`
  await db.query(newUrl, async (err, newResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else if (newResult.length === 0) {
      const url = `INSERT INTO users (first_name, last_name, email, password,phone_number) VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.email}','${hassPass}','${req.body.phoneNumber}')`
      await db.query(url, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else {
          async.forEachOf(roleArr, (element, key, callback) => {
            const sqlQuery = `INSERT INTO user_role (user_id,role_id) VALUES ('${result.insertId}','${element}')`
            db.query(sqlQuery, (err, newResult) => {
              if (err) {
                console.log({ isSuccess: false, result: err })
                res.send({ isSuccess: false, result: 'error' })
              }
            })
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

app.post('/api/adminRegister', async (req, res) => {
  console.log('>>>>>adminRegister');

  const hassPass = await hasThePass(req.body.password)
  const url = `INSERT INTO users (first_name, last_name, email, password,phone_number) VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.email}','${hassPass}','${req.body.phoneNumber}')`
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log('result in adminRegister', result.insertId);
      const sqlQuery = `INSERT INTO user_role (user_id,role_id) VALUES ('${result.insertId}',1)`
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
app.post('/api/login', async (req, res) => {
  console.log('>>>>>login');
  const url = `SELECT * FROM users WHERE email ='${req.body.email}'`
  db.query(url, async (err, result) => {
    if (err) {
      res.send({ isSuccess: true, message: 'error', result: [] })
      console.log({ isSuccess: true, message: 'error', result: err })
    }
    else if (result.length > 0) {
      const comparisionResult = await compareTheHass(req.body.password, result[0].password)
      console.log('comparisionResult', comparisionResult);
      if (comparisionResult) {
        if (result[0].is_active == 1) {
          const tokenData = { id: result[0].id };
          const tokenIs = await getToken(tokenData)

          var cdate = moment().format('YYYY-MM-DD H:m:s');
          // const newUrl = `SELECT * FROM users WHERE email ='${req.body.email}'`
          // const newUrl = `UPDATE users SET last_login = '${cdate}' WHERE (id ='${result[0].id}' )`
          const newUrl = `UPDATE rbac_db.users SET last_login = current_login, current_login = '${cdate}' WHERE id = '${result[0].id}';`

          db.query(newUrl, async (err, newResult) => {
            if (err) {
              console.log('err', err)
            }
          })

          res.send({ isSuccess: true, message: 'success', result: tokenIs })
          console.log({ isSuccess: true, message: 'success', result: tokenIs })
        } else {
          res.send({ isSuccess: true, message: 'deactivate', result: [] })
          console.log({ isSuccess: true, message: 'deactivate', result: [] })
        }
      } else {
        res.send({ isSuccess: true, message: 'wrong', result: [] })
        console.log({ isSuccess: true, message: 'wrong', result: [] })
      }

    } else {
      console.log(url)
      res.send({ isSuccess: true, message: 'empty', result: [] })
      console.log({ isSuccess: true, message: 'empty', result: [] })
    }
  })
})


app.get('/api', (req, res) => {
  console.log('welcome to port' + port)
  res.send('welcome to port ' + port)
})

// app.use("/api/auth",);
app.listen(port, (req, res) => {
  console.log('server started in port :', port);
})
