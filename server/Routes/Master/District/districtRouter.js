
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
// =====get District=====
router.get('/get-alldistrict', tokenCheck, async (req, res) => {
    console.log('>>>>>/get-all district'); 
    try{
      await db.query("SELECT * from district dt left join state st on st.state_id =dt.state_id where dt.is_active = 1", (err, allDistrict) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: allDistrict })
            res.status(200).send({ isSuccess: true, result: allDistrict })
        }
      })      
    }catch(e){
      console.log(e);
    }
  })
// router.post('/add-district', tokenCheck, async (req, res) => {
//     console.log('>>>>>/add-district');
//     const { districtName, stateName } = req.body
//     console.log(districtName, stateName);
    
//     const newUrl = `SELECT * FROM users where email = '${req.body.email}'; `
//   await db.query(newUrl, async (err, newResult) => {
//     if (err) {
//       console.log({ isSuccess: false, result: err })
//       res.send({ isSuccess: false, result: 'error' })
//     } else if (newResult.length === 0) {
//       const url = `INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES('${firstName}', '${lastName}', '${email}', '${hassPass}', '${phoneNumber}')`
//       await db.query(url, async (err, result) => {
//         if (err) {
//           console.log({ isSuccess: false, result: err })
//           res.send({ isSuccess: false, result: 'error' })
//         } else {
//           const userId = result.insertId

//           async.forEachOf(Object.keys(branchRole), (branchId, key, callback) => {
//             const rolesAr = branchRole[branchId]
//             rolesAr.forEach(async (roleId) => {
//               const sqlQuery = `INSERT INTO branch_department_user(branch_id, department_id,user_id,role_id) VALUES('${branchId}','${departmentId}','${userId}','${roleId}')`
//               await db.query(sqlQuery, (err, newResult) => {
//                 if (err) {
//                   console.log({ isSuccess: false, result: err })
//                   res.send({ isSuccess: false, result: 'error' })
//                 }
//               })
//             });
//             callback()
//           }, (err) => {
//             if (err) {
//               console.log({ isSuccess: false, result: err })
//               res.send({ isSuccess: false, result: 'error' })
//             } else {
//               console.log({ isSuccess: true, result: 'success' })
//               res.send({ isSuccess: true, result: 'success' })
//             }
//           })
//         }
//       })
//     } else {
//       console.log({ isSuccess: false, result: 'alreadyExist' })
//       res.send({ isSuccess: false, result: 'alreadyExist' })
//     }
//   })
// })
router.post('/add-district', tokenCheck, async (req, res) => {
    console.log('>>>>>/add-district');
    const { DistrictName, StateName  } = req.body
    console.log(DistrictName, StateName );
    var districtNamespace = DistrictName.trim(' ');
    const firstLetter = districtNamespace.charAt(0).toUpperCase();
    var capitalFirstLetter=firstLetter + districtNamespace.slice(1);
  console.log(capitalFirstLetter)
    const newUrl = "SELECT * FROM district where isActive = 1 and name ='"+ capitalFirstLetter + "'";
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 0) {
        const url = `INSERT INTO district(name,state_id,is_active) VALUES('${capitalFirstLetter}', '${StateName}', 1)`
        await db.query(url, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
          } else {
            console.log({ isSuccess: true, result: 'success' })
            res.send({ isSuccess: true, result: 'success' })
          }
        })
      } else {
        console.log(newResult)
        console.log({ isSuccess: false, result: 'alreadyExist' })
        res.send({ isSuccess: false, result: 'alreadyExist' })
      }
    })
  })

// ====get district By Id === //
router.get('/get-districtbyid/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>/get-districtbyid'); 
  try{
    const districtById = req.params.id
    console.log(districtById)
    await db.query("SELECT * FROM district where is_active = 1 and id=" + districtById, (err, DistrictsIdData) => {
      if (err) {
          console.log({ isSuccess: false, result: 'error' })
          res.send({ isSuccess: false, result: 'error' })
      } else {
          console.log({ isSuccess: true, result: DistrictsIdData })
          res.status(200).send({ isSuccess: true, result: DistrictsIdData })
      }
    })      
  }catch(e){
    console.log(e);
  }
})

// ==== edit state data By Id === //
router.post('/edit-districtbyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/edit-districtbyId'); 
  try{
    console.log(req.body,"req.body in edit-districtbyId")
    const { DistrictName, StateName,id } = req.body
   // console.log(districtName,"districtName in edit-districtbyId")

var   districtNameSpace = DistrictName.trim(' ');
    const firstLetter = districtNameSpace.charAt(0).toUpperCase();
    var capitalFirstLetter=firstLetter + districtNameSpace.slice(1);
    const newUrl = "SELECT * FROM district where is_active = 1 and id=" + id;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
       // console.log(stateName, stateDiscription, state_id,capitalFirstLetter)
        const editurl = "UPDATE vehical_crm_db.district SET name='"+ capitalFirstLetter +"', state_id='"+ StateName +"' WHERE id="+ id;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
          } else {
            console.log({ isSuccess: true, result: 'updatesuccess' })
            res.send({ isSuccess: true, result: 'updatesuccess' })
          }
        })
      } else {
        console.log(newResult)
        console.log({ isSuccess: false, result: 'notExist' })
        res.send({ isSuccess: false, result: 'notExist' })
      }
    })    
  }catch(e){
    console.log(e);
  }
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