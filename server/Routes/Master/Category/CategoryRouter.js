const express = require("express");
const async = require("async");

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

//=====Add-category======
router.post("/add-category", tokenCheck, async (req, res) => {
  const { category_name, category_description, department, chehkedFeature } =
    req.body;
  const addPartSql =
    "INSERT INTO `enquiry_category` (category_name, category_description, department) VALUES (?,?,?)";
  console.log(addPartSql, "addPartSql");

  await db.query(
    addPartSql,
    [category_name, category_description, department],
    async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        if (result.insertId) {
          async.forEachOf(
            chehkedFeature,
            (item, key, callback) => {
              const sqlQuery = `INSERT INTO enquiry_category_field(category_id, field_id,type) VALUES('${result.insertId}', '${item}' ,"enquiry")`;
              db.query(sqlQuery, (err, result) => {
                if (err) {
                  console.log({ isSuccess: true, result: err });
                  res.send({ isSuccess: true, result: "error" });
                }
              });
              callback();
            },
            (err) => {
              if (err) {
                console.log({ isSuccess: true, result: err });
                res.send({ isSuccess: true, result: "error" });
              } else {
                console.log({ isSuccess: true, result: "success" });
                res.send({ isSuccess: true, result: "success" });
              }
            }
          );
        }
      }
    }
  );
});

// router.post("/add-category", tokenCheck, async (req, res) => {
//   const { category_name, category_description, department, chehkedFeature } =
//     req.body;
//   const addPartSql =
//     "INSERT INTO `enquiry_category` (category_name, category_description, department) VALUES (?,?,?)";
//   console.log(addPartSql, "addPartSql");

//   await db.query(
//     addPartSql,
//     [category_name, category_description, department],
//     async (err, result) => {
//       if (err) {
//         console.log({ isSuccess: false, result: err });
//         res.send({ isSuccess: false, result: "error" });
//       } else {
//         if (result.insertId) {
//           const category_id = result.insertId;
//           const serializedFeatures = JSON.stringify(chehkedFeature);

//           const sqlQuery = `INSERT INTO category_features(category_id, feature_id) VALUES('${category_id}', '${serializedFeatures}')`;
//           console.log(sqlQuery, "sqlQuery");
//           db.query(sqlQuery, (err, result) => {
//             if (err) {
//               console.log({ isSuccess: true, result: err });
//               res.send({ isSuccess: true, result: "error" });
//             } else {
//               console.log({ isSuccess: true, result: "success" });
//               res.send({ isSuccess: true, result: "success" });
//             }
//           });
//         }
//       }
//     }
//   );
// });

//=====Get-category======
router.get("/get-category-list", tokenCheck, async (req, res) => {
  try {
    await db.query(
      "SELECT * FROM enquiry_category where is_active = 1",
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
router.get("/get-selected-category-field", tokenCheck, async (req, res) => {
  try {
    await db.query(
      "SELECT * FROM enquiry_fields WHERE field = 'firstName' OR field = 'mobileNumber' OR field = 'state' OR field = 'district' OR field = 'taluko' OR field = 'village' OR field = 'dsp'",
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

// ==== Delete category data By Id === //
router.post("/delete-category", tokenCheck, async (req, res) => {
  try {
    const { id } = req.body;

    const newUrl = "SELECT * FROM enquiry_category where  id=" + id;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else if (newResult.length === 1) {
        const editurl =
          "UPDATE enquiry_category SET is_active = 0 WHERE  id=" + id;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err });
            res.send({ isSuccess: false, result: "error" });
          } else {
            res.send({ isSuccess: true, result: "deletesuccess" });
          }
        });
      } else {
        console.log({ isSuccess: false, result: "notExist" });
        res.send({ isSuccess: false, result: "notExist" });
      }
    });
  } catch (e) {
    console.log(e);
  }
});
router.get("/get-category-fields/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>get-category-fields", req.body.roleId);

  const url = `select t.* from enquiry_category as f inner join enquiry_category_field as s on s.category_id = f.id inner join enquiry_fields as t on t.id = s.field_id where f.id = ${req.params.id} `;
  console.log("url", url);
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result: "error" });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});

router.post("/get-category-edit/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>get-roles");
 const { category_name, category_description, department, chehkedFeature } = req.body
  const id = req.params.id;

  try {
    const result = `UPDATE enquiry_category SET category_name = '${category_name}', category_description = '${category_description}',  department = '${department}' WHERE is_active = 1 and id = ${id}`;
    console.log(result,"result")
    await db.query(
      result,
      [category_name, category_description, department ,id],
      async (err, newResult) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.status(500).json({ isSuccess: false, result: "error" });
        } else {
            async.forEachOf(
              chehkedFeature,
              (item, key, callback) => {
                const sqlQuery = `UPDATE enquiry_category_field SET  field_id = '${item}' WHERE category_id ='${id}' `;
                console.log(sqlQuery, "sqlQuery");
                db.query(sqlQuery, (err, result) => {
                  if (err) {
                    console.log({ isSuccess: true, result: err });
                    res.send({ isSuccess: true, result: "error" });
                  }
                });
                callback();
              },
              (err) => {
                if (err) {
                  console.log({ isSuccess: true, result: err });
                  res.send({ isSuccess: true, result: "error" });
                } else {
                  console.log({ isSuccess: true, result: "success" });
                  res.send({ isSuccess: true, result: "success" });
                }
              }
            );
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

router.get("/get-categorybyid/:id", tokenCheck, async (req, res) => {
  try {
    const categorybyId = req.params.id;
    await db.query(
      "SELECT * FROM enquiry_category where is_active = 1 and id=" +
        categorybyId,
      (err, categorybyIdData) => {
        if (err) {
          console.log({ isSuccess: false, result: "error" });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: categorybyIdData });
          res.status(200).send({ isSuccess: true, result: categorybyIdData });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

//=======================Get-category with Total Enquiry===================//
router.get(
  "/get-category-list-with-total-enquiry/:id",
  tokenCheck,
  async (req, res) => {
    try {
      const villageId = req.params.id;
      await db.query(
        `CALL sp_get_category_with_total_enquiry(${villageId})`,
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
  }
);

module.exports = router;
