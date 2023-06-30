const async = require('async');
const express = require('express');
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");

const { db } = require("../Database/dbConfig");

const router = express.Router();

router.get('/get-allUser', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>get-allUser', req.myData)
  const urlNew = `CALL sp_all_user()`
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

router.get('/get-areaAssignUser', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>get-areaAssignUser', req.myData)
  const urlNew = `CALL sp_areaAssign_user()`
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

router.get('/edit-areaAssignUserById/:id/:category', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>edit-areaAssignUserById')
  const userId = req.params.id
  const category = req.params.category
  const urlNew = `CALL sp_areaAssign_userPerId(${userId},${category})`
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
// router.post('/add-assigneArea', tokenCheck, async (req, res) => {
//   console.log('>>>>>add-assigneArea');
//   try {
//     const AreaAdd = req.body;
//     let AreaResponse = ""
//     for (let index = 0; index < AreaAdd.length; index++) {
//       const url = `SELECT COUNT(*)
//        FROM area_assign_user
//        WHERE user_id = ${AreaAdd[index].id}
//          AND distribution_id =  ${AreaAdd[index].value}
//          AND distribution_type =  ${AreaAdd[index].distributionType}
//          AND category_id = ${AreaAdd[index].category}`

//       await db.query(url, async (err, result) => {
//         if (err) {
//           console.log({ isSuccess: false, err });
//           res.send({ isSuccess: false, result: 'error' });
//         } else if (result.length > 0) {
//           console.log({ isSuccess: 'success', result: url });
//           //res.send({ isSuccess: 'success', result: result[0] });
//         } else {
//           const url1 = ` INSERT INTO area_assign_user (user_id, distribution_id, distribution_type, category_id)
//           VALUES (${AreaAdd[index].id}, ${AreaAdd[index].value}, ${AreaAdd[index].distributionType}, ${AreaAdd[index].category})`
//           await db.query(url1, async (err, result) => {
//             if (err) {
//               console.log({ isSuccess: false, err });
//               res.send({ isSuccess: false, result: 'error' });
//             } 
//             else{
//               AreaResponse = result[0];
//             }
//           })

//         }

//       })

//     }
//     console.log({ isSuccess: 'success', result: AreaResponse });
//     res.send({ isSuccess: 'success', result: AreaResponse });
//     //       res.send({ isSuccess: 'success', result: result[0] });
//   //   const jsonDataAssignArea = JSON.stringify(req.body);
//   //   console.log(jsonDataAssignArea, '>>>>>req.bodyadd-assigneArea');

//   //   // const sqlQuery = `CALL sp_assigned_area_perUser('${jsonDataAssignArea}')`;
//   //   const sqlQuery = `CALL sp_insert_assigned_area1('${jsonDataAssignArea}')`;

//   //   await db.query(sqlQuery, async (err, result) => {
//   //     if (err) {
//   //       console.log({ isSuccess: false, err });
//   //       res.send({ isSuccess: false, result: 'error' });
//   //     } else {
//   //       console.log({ isSuccess: 'success', result: sqlQuery });
//   //       res.send({ isSuccess: 'success', result: result[0] });
//   //     }
//   //   });
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.post('/add-assigneArea', tokenCheck, async (req, res) => {
//   console.log('>>>>>add-assigneArea');
//   try {
//     const AreaAdd = req.body;
//     let AreaResponse = "";
//     for (let index = 0; index < AreaAdd.length; index++) {
//       const url = `SELECT COUNT(*) as count
//        FROM area_assign_user
//        WHERE user_id = ${AreaAdd[index].id}
//          AND distribution_id = ${AreaAdd[index].value}
//          AND distribution_type = ${AreaAdd[index].distributionType}
//          AND category_id = ${AreaAdd[index].category}`;

//       try {
//         const result = await executeQuery(url);
//         if (result[0].count == 0) {
         
//           console.log("inelse")
//           const url1 = ` INSERT INTO area_assign_user (user_id, distribution_id, distribution_type, category_id)
//           VALUES (${AreaAdd[index].id}, ${AreaAdd[index].value}, ${AreaAdd[index].distributionType}, ${AreaAdd[index].category})`;
//           try {
//             const insertResult = await executeQuery(url1);
//             //console.log(url1,"url1url1url1url1url1")
//             AreaResponse = insertResult[0];
//           } catch (error) {
//             console.log({ isSuccess: false, error });
//             res.send({ isSuccess: false, result: 'error' });
//           }
//         } else {
//           console.log("inifff")
//           console.log(result[0].count,"countttttt")
//           console.log({ isSuccess: 'success', result: result[0] });
//           // res.send({ isSuccess: 'success', result: result[0] });
//         }
//       } catch (error) {
//         console.log({ isSuccess: false, error });
//         res.send({ isSuccess: false, result: 'error' });
//       }
     
//     }
//     console.log({ isSuccess: 'success', result: AreaResponse });
   
//     res.send({ isSuccess: 'success', result: AreaResponse });
//   } catch (error) {
//     console.log(error);
//   }
// });

// function executeQuery(query) {
//   return new Promise((resolve, reject) => {
//     db.query(query, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }

router.post('/add-assigneArea', tokenCheck, async (req, res) => {
  console.log('>>>>>add-assigneArea');
  try {
    const AreaAdd = req.body;
    for (let index = 0; index < AreaAdd.length; index++) {
      const sqlQuery2 = `DELETE FROM area_assign_user WHERE user_id=${AreaAdd[index].id} and distribution_type=${AreaAdd[index].distributionType} and category_id=${AreaAdd[index].category}` 
      await db.query(sqlQuery2, async (err, result) => {

      })
    }
  
    const jsonDataAssignArea = JSON.stringify(req.body);
    console.log(jsonDataAssignArea, '>>>>>req.bodyadd-assigneArea');

     const sqlQuery = `CALL sp_assigned_area_perUser('${jsonDataAssignArea}')`;
  

    await db.query(sqlQuery, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, err });
        res.send({ isSuccess: false, result: 'error' });
      } else {
        console.log({ isSuccess: 'success', result: sqlQuery });
        res.send({ isSuccess: 'success', result: result[0] });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;