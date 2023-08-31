const express = require("express");
const async = require("async");

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

//=====Add-Department======
router.post("/add-department", tokenCheck, async (req, res) => {
  const { name, description} = req.body;
  const addPartSql =
    "INSERT INTO `departments` (name, description) VALUES (?,?)";

  await db.query(
    addPartSql,
    [name,description],
    async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: "success" });
        res.send({ isSuccess: true, result: "success" });
      }
    }
  );
});

//=====Get-department======
router.get("/get-department-list", tokenCheck, async (req, res) => {
  try {
    await db.query(
      "SELECT * FROM departments where is_active = 1",
      (err, results) => {
        if (err) {
          console.log({ isSuccess: false, result: "error" });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: results });
          res.status(200).send({ isSuccess: true, result: results });
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
});


// ==== Delete department data By Id === //
// router.post("/delete-department", tokenCheck, async (req, res) => {
//   console.log(">>>>>/delete-department");
//   try {
//     const { id } = req.body;

//     const newUrl = "SELECT * FROM departments where  id=" + id;
//     console.log('ghvgcgcfcf',id);
//     await db.query(newUrl, async (err, newResult) => {
//       if (err) {
//         console.log({ isSuccess: false, result: err });
//         res.send({ isSuccess: false, result: "error" });
//       }
//        else if (newResult.length === 1) {

//         const editurl = "UPDATE departments SET is_active = 0 WHERE  id=" + id;
//         await db.query(editurl, async (err, result) => {
//           if (err) {
//             console.log({ isSuccess: false, result: err })
//             res.send({ isSuccess: false, result: 'error' })
//           } else {

//             res.send({ isSuccess: true, result: 'deletesuccess' })
//           }
//         })
//       }
//       else {
//         console.log(newResult);
//         console.log({ isSuccess: false, result: "notExist" });
//         res.send({ isSuccess: false, result: "notExist" });
//       }
//     });
//   } catch (e) {
//     console.log(e);
//   }
// });

router.get('/delete-department/:id', async (req, res) => {
  console.log('>>>>>delete-department');
  console.log('req.params', req.params.id)
  const url = `UPDATE departments SET is_active = '0' WHERE id = '${req.params.id}'`;
  // console.log('url', url)

  await db.query(url, async (err, updateData) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'err' })
    } else {
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: 'success' })
    }
  })
})


router.post("/get-department-edit/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>get-roles");
  const { name, description } = req.body;
  const id = req.params.id;

  try {
    const result = `UPDATE departments SET name = '${name}', description = '${description}' WHERE is_active = 1 and id = ${id}`;
    await db.query(result, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: "success" });
        res.status(200).json({ isSuccess: true, result: "success" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});


router.get("/get-departmentbyid/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-departmentbyid");
   try {
     const departmentbyId = req.params.id;
     console.log(departmentbyId);
     await db.query(
       "SELECT * FROM departments where is_active = 1 and id=" + departmentbyId,
       (err, departmentbyIdData) => {
         if (err) {
           console.log({ isSuccess: false, result: "error" });
           res.send({ isSuccess: false, result: "error" });
         } else {
           console.log({ isSuccess: true, result: departmentbyIdData });
           res
             .status(200)
             .send({ isSuccess: true, result: departmentbyIdData });
         }
       }
     );
   } catch (e) {
     console.log(e);
     res.status(500).json({ isSuccess: false, result: "error" });
   }
});





module.exports = router;
