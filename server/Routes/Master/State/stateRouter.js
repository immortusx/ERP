
const express = require('express');
const async = require('async');

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

// ====get All state === //
router.get('/get-allsate', tokenCheck, async (req, res) => {
  console.log('>>>>>/get-allsate'); 
  try{
    await db.query("SELECT * FROM state where is_active = 1", (err, allStates) => {
      if (err) {
          console.log({ isSuccess: false, result: 'error' })
          res.send({ isSuccess: false, result: 'error' })
      } else {
          res.status(200).send({ isSuccess: true, result: allStates })
      }
    })      
  }catch(e){
    console.log(e);
  }
})

// ===== Add State === //
router.post('/add-state', tokenCheck, async (req, res) => {
  console.log('>>>>>/add-state');
  const { stateName, stateDiscription } = req.body
  console.log(stateName, stateDiscription);
  var stateNamespace = stateName.trim(' ');
  const firstLetter = stateNamespace.charAt(0).toUpperCase();
  var capitalFirstLetter=firstLetter + stateNamespace.slice(1);

  const newUrl = "SELECT * FROM state  where is_active = 1 and state_name ='"+ capitalFirstLetter + "'";
  await db.query(newUrl, async (err, newResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else if (newResult.length === 0) {
      const url = `INSERT INTO state(state_name, description,is_active) VALUES('${capitalFirstLetter}', '${stateDiscription}', 1)`
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


// ====get state By Id === //
router.get('/get-statebyid/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>/get-sateById'); 
  try{
    const stateById = req.params.id
    console.log(stateById)
    await db.query("SELECT * FROM state where is_active = 1 and state_id=" + stateById, (err, StatesIdData) => {
      if (err) {
          console.log({ isSuccess: false, result: 'error' })
          res.send({ isSuccess: false, result: 'error' })
      } else {
          console.log({ isSuccess: true, result: StatesIdData })
          res.status(200).send({ isSuccess: true, result: StatesIdData })
      }
    })      
  }catch(e){
    console.log(e);
  }
})

// ==== edit state data By Id === //
router.post('/edit-satebyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/edit-sateById'); 
  try{
    const { stateName, stateDiscription, state_id } = req.body
    

    var stateNamespace = stateName.trim(' ');
    const firstLetter = stateNamespace.charAt(0).toUpperCase();
    var capitalFirstLetter=firstLetter + stateNamespace.slice(1);
    const newUrl = "SELECT * FROM state where is_active = 1 and state_id=" + state_id;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
        console.log(stateName, stateDiscription, state_id,capitalFirstLetter)
        const editurl = "UPDATE vehical_crm_db.state SET state_name='"+ capitalFirstLetter +"', description='"+ stateDiscription +"' WHERE state_id="+ state_id;
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