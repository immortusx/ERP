
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

//           async.forEachOf(Object.keys(dealerRole), (dealerId, key, callback) => {
//             const rolesAr = dealerRole[dealerId]
//             rolesAr.forEach(async (roleId) => {
//               const sqlQuery = `INSERT INTO dealer_department_user(dealer_id, department_id,user_id,role_id) VALUES('${dealerId}','${departmentId}','${userId}','${roleId}')`
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
    const newUrl = "SELECT * FROM district where is_active = 1 and name ='"+ capitalFirstLetter + "'";
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

// ========getDistrictbyStateIs======
router.get('/get-districtbyStateid/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>/get-districtbyStateid'); 
  try{
    const districtByStateId = req.params.id
    console.log(districtByStateId)
    await db.query("SELECT * FROM district where is_active = 1 and state_id=" + districtByStateId, (err, districtByStateIdData) => {
      if (err) {
          console.log({ isSuccess: false, result: 'error' })
          res.send({ isSuccess: false, result: 'error' })
      } else {
          console.log({ isSuccess: true, result: districtByStateIdData })
          res.status(200).send({ isSuccess: true, result: districtByStateIdData })
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
    const { DistrictName, StateName,id } = req.body

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
        const editurl = "UPDATE district SET name='"+ capitalFirstLetter +"', state_id='"+ StateName +"' WHERE id="+ id;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
          } else {
          
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

  
// ==== Delete district data By Id === //
router.post('/delete-districtbyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/delete-districtbyId'); 
  try{
    const { DistrictName, StateName,id } = req.body
    
    const newUrl = "SELECT * FROM district where is_active = 1 and id=" + id;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
     
        const editurl = "UPDATE district SET is_active = 0 WHERE id="+ id;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
          } else {
           
            res.send({ isSuccess: true, result: 'deletesuccess' })
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

module.exports = router;