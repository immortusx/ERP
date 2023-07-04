
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
// =====get Village=====
router.get('/get-allVillage', tokenCheck, async (req, res) => {
    console.log('>>>>>/get-all Village'); 
    try{
      await db.query(`select vt.*,dt.name as DistrictName,st.state_name as stateName,tt.name as TalukaName from village vt 
      left join (select id,name from taluka) tt on tt.id = vt.taluka_id
      left join  (select id,name from district) dt on dt.id = vt.district_id
      left join (select state_id,state_name from state) st on st.state_id = vt.state_id where vt.is_active = 1`, (err, allVillage) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: allVillage })
            res.status(200).send({ isSuccess: true, result: allVillage })
        }
      })      
    }catch(e){
      console.log(e);
    }
  })

router.post('/add-Village', tokenCheck, async (req, res) => {
    console.log('>>>>>/add-Village');
    const { villageName,TalukaName, StateName,DistrictName  } = req.body
    console.log( villageName,TalukaName, StateName,DistrictName   );
    var VillageNamespace = villageName.trim(' ');
    const firstLetter = VillageNamespace.charAt(0).toUpperCase();
    var capitalFirstLetter=firstLetter + VillageNamespace.slice(1);
  console.log(capitalFirstLetter)
    const newUrl = "SELECT * FROM village where is_active = 1 and name ='"+ capitalFirstLetter + "'";
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 0) {
        const url = `INSERT INTO village(name,taluka_id,district_id,state_id,is_active) VALUES('${capitalFirstLetter}','${TalukaName}','${DistrictName}','${StateName}', 1)`
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

// ====get Village By Id === //
router.get('/get-Villagebyid/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>/get-Villagebyid'); 
  try{
    const VillageById = req.params.id
    console.log(VillageById)
    // await db.query("SELECT * FROM Village where is_active = 1 and id=" + VillageById, (err, VillagesIdData) => {
    await db.query(`select vt.*,dt.name as DistrictName,st.state_name as stateName,tt.name as TalukaName from village vt 
    left join (select id,name from taluka) tt on tt.id = vt.taluka_id
    left join  (select id,name from district) dt on dt.id = vt.district_id
    left join (select state_id,state_name from state) st on st.state_id = vt.state_id where vt.is_active = 1 and vt.id=` + VillageById, (err, VillagesIdData) => {
      
      if (err) {
          console.log({ isSuccess: false, result: 'error' })
          res.send({ isSuccess: false, result: 'error' })
      } else {
          console.log({ isSuccess: true, result: VillagesIdData })
          res.status(200).send({ isSuccess: true, result: VillagesIdData })
      }
    })      
  }catch(e){
    console.log(e);
  }
})

// ==== edit state data By Id === //
router.post('/edit-VillagebyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/edit-VillagebyId'); 
  try{   
    const { villageName, StateName,DistrictName,id ,TalukaName} = req.body
    

var   VillageNameSpace = villageName.trim(' ');
    const firstLetter = VillageNameSpace.charAt(0).toUpperCase();
    var capitalFirstLetter=firstLetter + VillageNameSpace.slice(1);
    const newUrl = "SELECT * FROM village where is_active = 1 and id=" + id;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
       // console.log(stateName, stateDiscription, state_id,capitalFirstLetter)
        const editurl = "UPDATE village SET name='"+ capitalFirstLetter +"', state_id='"+ StateName +"',district_id ='"+DistrictName+"',taluka_id = '"+TalukaName+"' WHERE id="+ id;
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

  
// ==== Delete Village data By Id === //
router.post('/delete-VillagebyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/delete-VillagebyId'); 
  try{
    const { VillageName, StateName,DistrictName,id } = req.body
    
    const newUrl = "SELECT * FROM village where is_active = 1 and id=" + id;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
     
        const editurl = "UPDATE village SET is_active = 0 WHERE id="+ id;
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
// ========getVillagebyDistrictId======
router.get('/get-Villagebydistrictid/:id', tokenCheck, async (req, res) => {
    console.log('>>>>>/get-Villagebydistrictid'); 
    try{
      const VillageByDistrictid = req.params.id
      console.log(VillageByDistrictid)
      await db.query("SELECT * FROM Village where is_active = 1 and district_id=" + VillageByDistrictid, (err, VillageByDistrictidData) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: VillageByDistrictidData })
            res.status(200).send({ isSuccess: true, result: VillageByDistrictidData })
        }
      })      
    }catch(e){
      console.log(e);
    }
  })

  router.get('/get-Village-by-branchId/:id', tokenCheck, async (req, res) => {
    console.log('>>>>>/get-Village-by-branchId');

    try{
      const branchId = req.params.id
      await db.query("SELECT * FROM branches where id =" + branchId, (err, villageByBranchId) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: villageByBranchId })
            res.status(200).send({ isSuccess: true, result: villageByBranchId })
        }
      })      
    }catch(e){
      console.log(e);
    }
  })
module.exports = router;