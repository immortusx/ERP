const express = require('express')
const dotenv = require('dotenv')
const app = express()
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
const { verifyToken, getTokenWithExp, getToken } = require('./Auth/Jwt');

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
async function getDateInFormate(getDate) {
  const date = new Date(getDate);
  const mysqlDatetime = await date.toISOString().slice(0, 19).replace('T', ' ');
  return mysqlDatetime

}

app.get('/api/get-new-inquiry-data', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>get-inquiry-data')

  const getDealers = () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM dealers', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    })
  }

  const getPrimarySource = () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM enquiry_primary_sources', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    })
  }

  const getManufacturers = () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM manufacturers', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    })
  }


  Promise.all([getDealers(), getPrimarySource(), getManufacturers()])
    .then(([getDealers, getPrimarySource, getManufacturers]) => {
      let mainObj = {
        'dealers': getDealers,
        'primary_source': getPrimarySource,
        'manufacturers': getManufacturers,
      }
      console.log({ isSuccess: 'success', result: 'success' })
      res.send({ isSuccess: 'success', result: mainObj })
    })
    .catch((error) => {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    });
})
app.get('/api/get-model/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>get-model', req.params)
  const urlNew = `SELECT * FROM products WHERE manufacturer_id = (${req.params.id})`
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log({ isSuccess: 'success', result: urlNew })
      res.send({ isSuccess: 'success', result: result })
    }
  })
})
app.get('/api/get-dsp/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>get-dsp', req.params)
  const urlNew = `CALL get_dsp_list(${req.params.id})`
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log({ isSuccess: 'success', result: urlNew })
      res.send({ isSuccess: 'success', result: result[0] })
    }
  })
})
app.get('/api/get-source-inquiry/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>get-source-inquiry', req.params)
  const urlNew = `select * from  enquiry_sources where primary_source_id = ${req.params.id}`
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log({ isSuccess: 'success', result: urlNew })
      res.send({ isSuccess: 'success', result: result })
    }
  })
})
app.post('/api/set-new-inquiry-data', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>set-new-inquiry-data', req.body)

  const fristName = req.body.customerName
  const middleName = req.body.fatherName
  const lastName = ''
  const phoneNumber = req.body.mobileNumber
  const email = ''
  const isActive = 1
  const district = req.body.district
  const taluka = req.body.tehsil
  const block = req.body.block
  const village = req.body.village

  const dealerId = req.body.dealerId
  const dsp = req.body.dsp
  const model = req.body.model
  const inquiryDate = req.body.inquiryDate
  const deliveryDate = req.body.deliveryDate
  const sourceOfInquiry = req.body.sourceOfInquiry

  const url = `INSERT INTO customers (first_name, middle_name, last_name, phone_number, email, is_active, district, taluka, block, village) VALUES ('${fristName}','${middleName}','${lastName}','${phoneNumber}','${email}','${isActive}','${district}','${taluka}','${block}','${village}')`;

  console.log('url', url)


  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else if (result && result.insertId) {
      console.log('result', result)
      const insertedId = result.insertId

      const newInquiryDate = await getDateInFormate(inquiryDate)
      const newDeliveryDate = await getDateInFormate(deliveryDate)

      const urlNew = `INSERT INTO enquiries (dealer_id, enquiry_type_id, salesperson_id, customer_id, product_id, date, delivery_date, enquiry_source_id, visitReason) VALUES('${dealerId}','1','${dsp}','${insertedId}','${model}','${newInquiryDate}','${newDeliveryDate}','${sourceOfInquiry}','1')`
      console.log('urlNew', urlNew)
      await db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else if (result && result.insertId) {
          console.log({ isSuccess: 'success', result: urlNew })
          res.send({ isSuccess: 'success', result: 'success' })
        }
      })

    }
  })
})
app.post('/api/edit-role', tokenCheck, async (req, res) => {
  console.log('>>>>>edit-role');
  console.log('req.body', req.body);
  const { description, features, id } = req.body
  console.log('description, features, id', description, features, id);
  const urlNew = `UPDATE roles SET description = '${description}' where id = '${id}'`

  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      const newSqlQuery = `delete FROM role_features where role_id = '${id}'`
      db.query(newSqlQuery, (err, newSqlResult) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else {
          async.forEachOf(features, (item, key, callback) => {
            console.log('item', item)
            const sqlQuery = `INSERT INTO role_features(role_id, feature_id) VALUES('${id}', '${item}')`;
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
      })

    }
  })
})

app.post('/api/addInquiryCategory', tokenCheck, async (req, res) => {
  console.log('>>>>>>>addInquiryCategory');
  const categoriesValue = Object.values(req.body)
  let str = ''
  categoriesValue.forEach((i, index) => {
    if (index == 0) {
      str += `'${i}'`
    } else {
      str += `, '${i}'`
    }
  })

  const newSqlQuery = `SELECT * FROM inquiry_category where category_name in (${str})`;
  db.query(newSqlQuery, (err, newSqlResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else if (newSqlResult.length > 0) {
      console.log({ isSuccess: true, result: newSqlQuery })
      res.send({ isSuccess: true, result: 'categoryExisted' })
    } else {
      async.forEachOf(categoriesValue, (item, key, callback) => {
        const sqlQuery = `INSERT INTO inquiry_category(category_name) VALUES('${item}')`;
        db.query(sqlQuery, (err, resultNew) => {
          if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
          }
        })
        console.log('item', item)
        callback();
      }, (err) => {
        console.log('callback called')
        if (err) {
          console.log({ isSuccess: true, result: err })
          res.send({ isSuccess: true, result: 'error' })
        } else {
          console.log({ isSuccess: true, result: 'success' })
          res.send({ isSuccess: true, result: 'success' })
        }
      })
    }
  })
})

app.get('/api/get-current-fields/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>>get-current-fields/:id', req.params.id)
  const newSqlQuery = `SELECT s.* FROM inquiry_category_field as f inner join inquiry_fields as s on f.field_id = s.id WHERE category_id = '${req.params.id}'`
  db.query(newSqlQuery, (err, newSqlResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log({ isSuccess: true, result: newSqlQuery })
      res.send({ isSuccess: true, result: newSqlResult })
    }
  })
})
app.post('/api/categoryInsertFields', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>categoryInsertFields called')
  const catID = req.body.id;
  const fieldsAr = req.body.fields;
  // const urlNew = `INSERT INTO inquiry_category_field(category_id, field_id) VALUES('${}', '')`
  // await db.query(urlNew, async (err, result) 

  const newSqlQuery = `delete FROM inquiry_category_field  where category_id = '${catID}'`
  db.query(newSqlQuery, (err, newSqlResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      async.forEachOf(fieldsAr, (item, key, callback) => {
        console.log('item', item)
        const sqlQuery = `INSERT INTO inquiry_category_field(category_id, field_id) VALUES('${catID}', '${item}')`;
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
  })

})
app.get('/api/get-categories-fields', tokenCheck, async (req, res) => {
  console.log('>>>>>>>get-categories-fields');
  const urlNew = `SELECT * FROM inquiry_fields`
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {

      console.log({ isSuccess: true, result: urlNew })
      res.send({ isSuccess: true, result: result })
    }
  })
})
app.get('/api/get-inquiry-categories', tokenCheck, async (req, res) => {
  console.log('>>>>>>>get-inquiry-categories');
  const urlNew = `SELECT * FROM inquiry_category`
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {

      console.log({ isSuccess: true, result: urlNew })
      res.send({ isSuccess: true, result: result })
    }
  })
})
app.post('/api/add-role', tokenCheck, checkUserPermission('add-role'), async (req, res) => {
  console.log('>>>>>add-role');
  console.log('req.body', req.body);
  const { roleName, roleDescription, checkedFeatures } = req.body
  const urlNew = `INSERT INTO roles(role, active, description) VALUES('${roleName}', 1, '${roleDescription}'); `
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: 'error' })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log('result', result.insertId)
      if (result.insertId) {
        async.forEachOf(checkedFeatures, (item, key, callback) => {
          const sqlQuery = `INSERT INTO role_features(role_id, feature_id) VALUES('${result.insertId}', '${item}')`;
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
function checkUserPermission(role) {
  return async (req, res, next) => {
    const url = `SELECT DISTINCT  t.page, t.index_no, t.feature  FROM user_role as f inner join role_features as s on s.role_id = f.role_id inner join features as t on s.feature_id = t.id  where user_id = ${req.myData.userId} `
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
    const url = `SELECT email, first_name, last_name, last_login from users where id = ${isAuthId.id} `
    await db.query(url, async (err, result) => {
      if (err) {

        console.log({ isSuccess: true, result: err })
        res.send({ isSuccess: true, result: 'error' })
      } else {
        tempArr = result
        // const urlNew = `select(select s.role from roles as s where id = f.role_id) as role from user_role as f where user_id = ${ isAuthId.id } `
        const urlNew = `SELECT DISTINCT  t.page, t.index_no, t.feature  FROM user_role as f inner join role_features as s on s.role_id = f.role_id inner join features as t on s.feature_id = t.id  where user_id = ${isAuthId.id} `
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
  const url = `select f.id, f.first_name, f.last_name, f.email, f.is_active, f.phone_number from  users as f; `
  await db.query(url, async (err, result) => {
    let tempArr = [];
    tempArr = result
    async.forEachOf(result, (item, key, callback) => {
      result[key].role = [];
      const urlNew = `select(select s.role from roles as s where id = f.role_id) as role from user_role as f where user_id = ${item.id} `
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
app.post('/api/get-roles-features', tokenCheck, async (req, res) => {
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
app.get('/api/get-roles-to-edit', tokenCheck, async (req, res) => {
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
app.get('/api/get-roles', tokenCheck, checkUserPermission('add-user'), async (req, res) => {
  console.log('>>>>>get-roles');

  const url = `SELECT * from roles where id != 1 and active = 1`
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
  // const url = `INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES('${req.body.firstName}', '${req.body.lastName}', '${req.body.email}', '${hassPass}', '${req.body.phoneNumber}')`
  let addNewValue = '';
  if (req.body.password !== '') {
    addNewValue = `, password = '${hassPass}'`
  }
  const url = `UPDATE users SET first_name = '${req.body.firstName}', last_name = '${req.body.lastName}', email = '${req.body.email}', phone_number = '${req.body.phoneNumber}' ${addNewValue} WHERE(id = '${req.body.id}'); `
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
            const sqlQuery = `INSERT INTO user_role(user_id, role_id) VALUES('${req.body.id}', '${element}')`
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

  const newUrl = `SELECT * FROM users where email = '${req.body.email}'; `
  await db.query(newUrl, async (err, newResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else if (newResult.length === 0) {
      const url = `INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES('${req.body.firstName}', '${req.body.lastName}', '${req.body.email}', '${hassPass}', '${req.body.phoneNumber}')`
      await db.query(url, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
        } else {
          async.forEachOf(roleArr, (element, key, callback) => {
            const sqlQuery = `INSERT INTO user_role(user_id, role_id) VALUES('${result.insertId}', '${element}')`
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
  const url = `INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES('${req.body.firstName}', '${req.body.lastName}', '${req.body.email}', '${hassPass}', '${req.body.phoneNumber}')`
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log('result in adminRegister', result.insertId);
      const sqlQuery = `INSERT INTO user_role(user_id, role_id) VALUES('${result.insertId}', 1)`
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
  const url = `SELECT * FROM users WHERE email = '${req.body.email}'`
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
          // const newUrl = `SELECT * FROM users WHERE email = '${req.body.email}'`
          // const newUrl = `UPDATE users SET last_login = '${cdate}' WHERE(id = '${result[0].id}')`
          const newUrl = `UPDATE users SET last_login = current_login, current_login = '${cdate}' WHERE id = '${result[0].id}'; `

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
  console.log({
    'status': 'success',
    'PORT': process.env.ENV_PORT,
    'DATABASE': process.env.ENV_DATABASE,
    'HOST': process.env.ENV_HOST,
  });
  res.send({
    'status': 'success',
    'PORT': process.env.ENV_PORT,
    'DATABASE': process.env.ENV_DATABASE,
    'HOST': process.env.ENV_HOST,
  });
})

app.listen(process.env.ENV_PORT, (req, res) => {
  console.log({
    'status': 'success',
    'PORT': process.env.ENV_PORT,
    'DATABASE': process.env.ENV_DATABASE,
    'HOST': process.env.ENV_HOST,
  });
})
