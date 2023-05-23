
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
// =====get Taluka=====
router.get('/get-allTaluka', tokenCheck, async (req, res) => {
    console.log('>>>>>/get-all Taluka'); 
    try{
      await db.query(`select tt.*,dt.name as DistrictName,st.state_name from taluka tt 
      left join  (select id,name from district) dt on dt.id = tt.district_id
      left join (select state_id,state_name from state) st on st.state_id = tt.state_id where tt.is_active = 1`, (err, allTaluka) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: allTaluka })
            res.status(200).send({ isSuccess: true, result: allTaluka })
        }
      })      
    }catch(e){
      console.log(e);
    }
  })

router.post('/add-Taluka', tokenCheck, async (req, res) => {
    console.log('>>>>>/add-Taluka');
    const { TalukaName, StateName,DistrictName  } = req.body
    console.log(TalukaName, StateName,DistrictName);
    var TalukaNamespace = TalukaName.trim(' ');
    const firstLetter = TalukaNamespace.charAt(0).toUpperCase();
    var capitalFirstLetter=firstLetter + TalukaNamespace.slice(1);
  console.log(capitalFirstLetter)
    const newUrl = "SELECT * FROM taluka where is_active = 1 and name ='"+ capitalFirstLetter + "'";
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 0) {
        const url = `INSERT INTO taluka(name,district_id,state_id,is_active) VALUES('${capitalFirstLetter}','${DistrictName}', '${StateName}', 1)`
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

// ====get Taluka By Id === //
router.get('/get-Talukabyid/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>/get-Talukabyid'); 
  try{
    const TalukaById = req.params.id
    console.log(TalukaById)
    // await db.query("SELECT * FROM taluka where is_active = 1 and id=" + TalukaById, (err, TalukasIdData) => {
    await db.query(`SELECT tt.*,dt.name as DistrictName from taluka tt 
    left join (select id,name from district )  dt on 
    tt.district_id = dt.id where tt.is_active = 1 and tt.id=` + TalukaById, (err, TalukasIdData) => {
      if (err) {
          console.log({ isSuccess: false, result: 'error' })
          res.send({ isSuccess: false, result: 'error' })
      } else {
          console.log({ isSuccess: true, result: TalukasIdData })
          res.status(200).send({ isSuccess: true, result: TalukasIdData })
      }
    })      
  }catch(e){
    console.log(e);
  }
})

// ==== edit state data By Id === //
router.post('/edit-TalukabyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/edit-TalukabyId'); 
  try{   
    const { TalukaName, StateName,DistrictName,id } = req.body
    

var   TalukaNameSpace = TalukaName.trim(' ');
    const firstLetter = TalukaNameSpace.charAt(0).toUpperCase();
    var capitalFirstLetter=firstLetter + TalukaNameSpace.slice(1);
    const newUrl = "SELECT * FROM taluka where is_active = 1 and id=" + id;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
       // console.log(stateName, stateDiscription, state_id,capitalFirstLetter)
        const editurl = "UPDATE taluka SET name='"+ capitalFirstLetter +"', state_id='"+ StateName +"',district_id ='"+DistrictName+"' WHERE id="+ id;
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

  
// ==== Delete Taluka data By Id === //
router.post('/delete-TalukabyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/delete-TalukabyId'); 
  try{
    const { TalukaName, StateName,DistrictName,id } = req.body
    
    const newUrl = "SELECT * FROM taluka where is_active = 1 and id=" + id;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
     
        const editurl = "UPDATE taluka SET is_active = 0 WHERE id="+ id;
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