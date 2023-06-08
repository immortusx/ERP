
const express = require('express');
const async = require('async');

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

// ====get All Manufacturer === //
router.get('/get-allmanufacturer', tokenCheck, async (req, res) => {
  console.log('>>>>>/get-allmanufacturer'); 
  try{
    await db.query("SELECT id as manufacturerId, name as manufacturerName, description as manufacturerDescription, isActive FROM manufacturers", (err, allStates) => {
      if (err) {
          console.log({ isSuccess: false, result: err })
          res.send({ isSuccess: false, result: 'error' })
      } else {
          res.status(200).send({ isSuccess: true, result: allStates })
      }
    })      
  }catch(e){
    console.log(e);
  }
})

// ===== Add Manufacturer === //
router.post('/add-manufacturer', tokenCheck, async (req, res) => {
  console.log('>>>>>/add-manufacturer');
  const { menufacturerName, menufacturerDiscription } = req.body
  console.log(menufacturerName, menufacturerDiscription);
  var mfacturerNamespace = menufacturerName.trim(' ');
  const firstLetter = mfacturerNamespace.charAt(0).toUpperCase();
  var capitalFirstLetter=firstLetter + mfacturerNamespace.slice(1);

  const newUrl = "SELECT * FROM manufacturers WHERE isActive = 1 and name ='"+ capitalFirstLetter + "'";
  await db.query(newUrl, async (err, newResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else if (newResult.length === 0) {
      const url = `INSERT INTO manufacturers(name, description, isActive) VALUES('${capitalFirstLetter}', '${menufacturerDiscription}', 1)`
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


// ====get Manufacturer By Id === //
router.get('/get-manufacturerbyid/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>/get-manufacturerbyid'); 
  try{
    const manucaturerById = req.params.id
    console.log(manucaturerById)
    await db.query("SELECT id as manufacturerId, name as manufacturerName, description as manufacturerDescription, isActive FROM manufacturers where isActive = 1 and id=" + manucaturerById, (err, MfacturerIdData) => {
      if (err) {
        console.log({ isSuccess: false, result: 'error' })
        res.send({ isSuccess: false, result: 'error' })
      } else {          
        res.status(200).send({ isSuccess: true, result: MfacturerIdData })
      }
    })      
  }catch(e){
    console.log(e);
  }
})

// ==== Edit Manufacturer data By Id === //
router.post('/edit-manufacturerbyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/edit-manufacturerbyId'); 
  try{
    const { menufacturerName, menufacturerDiscription,manufacturerId } = req.body
  console.log(menufacturerName, menufacturerDiscription);
  var mfacturerNamespace = menufacturerName.trim(' ');
  const firstLetter = mfacturerNamespace.charAt(0).toUpperCase();
  var capitalFirstLetter=firstLetter + mfacturerNamespace.slice(1);

    const newUrl = "SELECT * FROM manufacturers where isActive=1 and id=" + manufacturerId;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
        const editurl = "UPDATE manufacturers SET name='"+ capitalFirstLetter +"', description='"+ menufacturerDiscription +"' WHERE id="+ manufacturerId;
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

// ==== Delete Manufacturer data By Id === //
router.post('/delete-manufacturerbyId', tokenCheck, async (req, res) => {
  console.log('>>>>>/delete-manufacturerbyId'); 
  try{
    const { menufacturerName, menufacturerDiscription,manufacturerId } = req.body
    
    const newUrl = "SELECT * FROM manufacturers where isActive = 1 and id=" + manufacturerId;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err })
        res.send({ isSuccess: false, result: 'error' })
      } else if (newResult.length === 1) {
     
        const editurl = "UPDATE manufacturers SET isActive = 0 WHERE id="+ manufacturerId;
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

//=========Add Manufacturer_modal and variant========== 
// router.post('/addmodal-variant', tokenCheck, async (req, res)=> {
//   console.log('/addmodalvariatn???????????')
//   try{
//     const { manufacturerModalVarData, manufacturerId } = req.body;
//     for (const modalVarData of manufacturerModalVarData) {
//       const { modalName, variants } = modalVarData;
//       console.log(modalName)

//       const modalQuery = 'INSERT INTO modal (modalName, manufacturerId) VALUES (?, ?)';
      
//       await db.query(modalQuery, [modalName, manufacturerId], async(err, results)=> {
//         if(err){
//           console.log({isSuccess: false, result: err})
//           // res.send({isSuccess: false, result: 'error'})
//         }else{
//           console.log({isSuccess: true, result: results})
//           // res.send({isSuccess: true, result: results})
//           const modalId = results.insertId;

//           for (const variantData of variants) {
//             const { variantName } = variantData;
//             console.log(variantName)
            
//             const variantQuery = 'INSERT INTO variant (variantName, modalId, manufacturerId) VALUES (?, ?, ?)';
//             await db.query(variantQuery, [variantName, modalId, manufacturerId], (err, results)=> {
//               if(err){
//                 console.log({isSuccess: false, result: err})
//                 // res.send({isSuccess: false, result: 'error'})
//               }else{
//                 console.log({isSuccess: true, result: results})
//                 // res.send({isSuccess: true, result: results})
//               }
//             })
//             // const variantValues = [variantName, modalId];
//           }

//         }
//       })

//     }

//   }catch(err){
//     console.log(err)
//     res.send({isSuccess: true, result: results})
//   }
// })


// router.post('/addmodal-variant', tokenCheck, async (req, res) => {
//   console.log('/addmodalvariatn???????????');
//   try {
//     const { manufacturerModalVarData, manufacturerId } = req.body;
//     const responses = [];

//     for (const modalVarData of manufacturerModalVarData) {
//       const { modalName, variants } = modalVarData;
//       console.log(modalName);

//       const modalQuery = 'INSERT INTO modal (modalName, manufacturerId) VALUES (?, ?)';

//       const modalResults = await new Promise((resolve, reject) => {
//         db.query(modalQuery, [modalName, manufacturerId], async(err, results) => {
//           if (err) { 
//             console.log({ isSuccess: false, result: err });
//             reject('error');
//           } else {
//             console.log({ isSuccess: true, result: results });
//             const modalId = results.insertId;
//             responses.push(results);

//             for (const variantData of variants) {
//               const { variantName } = variantData;
//               console.log(variantName);

//               const variantQuery =
//                 'INSERT INTO variant (variantName, modalId, manufacturerId) VALUES (?, ?, ?)';

//               const variantResults = await new Promise((resolve, reject) => {
//                 db.query(variantQuery, [variantName, modalId, manufacturerId], (err, results) => {
//                   if (err) {
//                     console.log({ isSuccess: false, result: err });
//                     reject('error');
//                   } else {
//                     console.log({ isSuccess: true, result: results });
//                     resolve(results);
//                   }
//                 });
//               });

//               responses.push(variantResults);
//             }

//             resolve(results);
//           }
//         });
//       });

//       responses.push(modalResults);
//     }

//     res.send({ isSuccess: true, result: responses });
//   } catch (err) {
//     console.log(err);
//     res.send({ isSuccess: false, result: 'error' });
//   }
// });


//=========addModal==========
router.post('/addmodal', tokenCheck, async(req, res) => {
  try {
    const { modal, manufacturerId } = req.body;

      const modalQuery = 'INSERT INTO modal (modalName, manufacturerId) VALUES (?, ?)';

      await db.query(modalQuery, [modal, manufacturerId], async (err, results) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({isSuccess: false, result: 'error'})
        } else {
          console.log({ isSuccess: true, result: results });
          res.send({isSuccess: true, result: results})
        }
      });
  } catch (err) {
    console.log(err);
  }
});

//==================addVariant===================
router.post('/addvariant', tokenCheck, async (req, res) => {
  try {
    const { manufacturerModalVarData, modalid, manufacturerId } = req.body;

    for (const data of manufacturerModalVarData) {
      const variants = data.variants;
      for (const variant of variants) {
        const variantName = variant.variantName;

        const variantQuery = 'INSERT INTO variant (variantName, modalid, manufacturerId) VALUES (?, ?, ?)';

        await db.query(variantQuery, [variantName, modalid, manufacturerId]);
      }
    }

    console.log({ isSuccess: true, result: 'Variants added successfully.' });
    res.send({ isSuccess: true, result: 'Variants added successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ isSuccess: false, result: 'Error adding variants.' });
  }
});



//==========getModalist=============
router.get('/getmodal/:id', tokenCheck, async(req, res)=> {
  try{
    const manufacturerId = req.params.id
    await db.query(`Select * FROM modal WHERE manufacturerId = ${manufacturerId}`, (err, results)=> {
      if(err){
        console.log({isSuccess: false, result: err});
        res.send({isSuccess: false, result: 'error'});
      }else {
        console.log({isSuccess: true, result: results})
        res.send({isSuccess: true, result: results})
      }
    })

  }catch(err){
    console.log(err);
  }
  
})

//===========getVariantList===========
router.get('/getvariant/:id', tokenCheck, async (req, res) => {
  try {
    const modalid = req.params.id;
    const query = `SELECT * FROM variant WHERE modalid = ${modalid}`;

    await db.query(query, (err, results) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: 'error' });
      } else {
        console.log({ isSuccess: true, result: results });
        res.send({ isSuccess: true, result: results });
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ isSuccess: false, result: 'error' });
  }
});




//==========deletemodal=============
// router.po('/deletemodal', tokenCheck, async (req, res) => {
//   try {
//     const { modalid, manufacturerId } = req.body;
//     console.log(modalid);
//     console.log(manufacturerId);
//     const modalDeleteSql = `DELETE FROM variant JOIN modal ON variant.modalid = m.id WHERE variant.modalid = ${modalid} AND modalyy.manufacturerId = ${manufacturerId}`;
//     await db.query(modalDeleteSql, (err, result) => {
//       if (err) {
//         console.log({ isSuccess: false, result: err });
//         res.send({ isSuccess: false, result: err });
//       } else {
//         console.log({ isSuccess: true, result: result });
//         res.send({ isSuccess: true, result: result });
//       }
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

router.post('/deletemodal', tokenCheck, async (req, res) => {
  try {
    const { modalid, manufacturerId } = req.body;
    console.log(modalid);
    console.log(manufacturerId);
    
    // Delete records from the variant table
    const variantDeleteSql = `DELETE FROM variant WHERE modalid = ${modalid}`;
    await db.query(variantDeleteSql, (err, variantResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: err });
      } else {
        console.log("Variant records deleted");
        
        // Delete records from the modal table
        const modalDeleteSql = `DELETE FROM modal WHERE manufacturerId = ${manufacturerId}`;
        db.query(modalDeleteSql, (modalErr, modalResult) => {
          if (modalErr) {
            console.log({ isSuccess: false, result: modalErr });
            res.send({ isSuccess: false, result: modalErr });
          } else {
            console.log({ isSuccess: true, result: modalResult });
            res.send({ isSuccess: true, result: modalResult });
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});



//========deletemanufacturer=============
router.post('/deletemanufacturer', tokenCheck, async(req, res)=> {
  try{
    const {manufacturerId} =req.body;
    const deleteManufacturerSql = `DELETE FROM manufacturers WHERE id = ${manufacturerId}`;
    await db.query(deleteManufacturerSql, [manufacturerId], (err, results)=> {
      if(err){
        console.log({isSuccess: false, result: err});
        res.send({isSuccess: false, result: 'error'});
      }else {
        console.log({isSuccess: true, result: results})
        res.send({isSuccess: true, result: results})
      }
    })
  }catch(err){
    console.log(err);
  }
})



module.exports = router;