
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

  const newUrl = "SELECT * FROM state where where is_active = 1 and state_name ='"+ capitalFirstLetter + "'";
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
          
          res.status(200).send({ isSuccess: true, result: StatesIdData })
      }
    })      
  }catch(e){
    console.log(e);
  }
})

// ==== Edit state data By Id === //
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
        const editurl = "UPDATE state SET state_name='"+ capitalFirstLetter +"', description='"+ stateDiscription +"' WHERE state_id="+ state_id;
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

// ==== Delete state data By Id === //
router.post('/delete-satebyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/delete-satebyId'); 
  try{
    const { stateName, stateDiscription, state_id } = req.body
    
    const newUrl = "SELECT * FROM state where is_active = 1 and state_id=" + state_id;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
     
        const editurl = "UPDATE state SET is_active = 0 WHERE state_id="+ state_id;
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