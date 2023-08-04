const express = require("express");
const async = require("async");

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");
const uploadFile = require("../../../Utils/multerMiddaeware");

const router = express.Router();

// ====get All Manufacturer === //
router.get("/get-allmanufacturer", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-allmanufacturer");
  try {
    await db.query(
      "SELECT id as manufacturerId, name as manufacturerName, description as manufacturerDescription, isActive FROM manufacturers",
      (err, allStates) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          res.status(200).send({ isSuccess: true, result: allStates });
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
});

// ===== Add Manufacturer === //
router.post("/add-manufacturer", tokenCheck, async (req, res) => {
  console.log(">>>>>/add-manufacturer");
  const { menufacturerName, menufacturerDiscription } = req.body;
  console.log(menufacturerName, menufacturerDiscription);
  var mfacturerNamespace = menufacturerName.trim(" ");
  const firstLetter = mfacturerNamespace.charAt(0).toUpperCase();
  var capitalFirstLetter = firstLetter + mfacturerNamespace.slice(1);

  const newUrl =
    "SELECT * FROM manufacturers WHERE isActive = 1 and name ='" +
    capitalFirstLetter +
    "'";
  await db.query(newUrl, async (err, newResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else if (newResult.length === 0) {
      const url = `INSERT INTO manufacturers(name, description, isActive) VALUES('${capitalFirstLetter}', '${menufacturerDiscription}', 1)`;
      await db.query(url, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: "success" });
          res.send({ isSuccess: true, result: "success" });
        }
      });
    } else {
      console.log(newResult);
      console.log({ isSuccess: false, result: "alreadyExist" });
      res.send({ isSuccess: false, result: "alreadyExist" });
    }
  });
});

// ====get Manufacturer By Id === //
router.get("/get-manufacturerbyid/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-manufacturerbyid");
  try {
    const manucaturerById = req.params.id;
    console.log(manucaturerById);
    await db.query(
      "SELECT id as manufacturerId, name as manufacturerName, description as manufacturerDescription, isActive FROM manufacturers where isActive = 1 and id=" +
        manucaturerById,
      (err, MfacturerIdData) => {
        if (err) {
          console.log({ isSuccess: false, result: "error" });
          res.send({ isSuccess: false, result: "error" });
        } else {
          res.status(200).send({ isSuccess: true, result: MfacturerIdData });
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
});

// ==== Edit Manufacturer data By Id === //
router.post("/edit-manufacturerbyId", tokenCheck, async (req, res) => {
  console.log(">>>>>/edit-manufacturerbyId");
  try {
    const { menufacturerName, menufacturerDiscription, manufacturerId } =
      req.body;
    console.log(menufacturerName, menufacturerDiscription);
    var mfacturerNamespace = menufacturerName.trim(" ");
    const firstLetter = mfacturerNamespace.charAt(0).toUpperCase();
    var capitalFirstLetter = firstLetter + mfacturerNamespace.slice(1);

    const newUrl =
      "SELECT * FROM manufacturers where isActive=1 and id=" + manufacturerId;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else if (newResult.length === 1) {
        const editurl =
          "UPDATE manufacturers SET name='" +
          capitalFirstLetter +
          "', description='" +
          menufacturerDiscription +
          "' WHERE id=" +
          manufacturerId;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err });
            res.send({ isSuccess: false, result: "error" });
          } else {
            res.send({ isSuccess: true, result: "updatesuccess" });
          }
        });
      } else {
        console.log(newResult);
        console.log({ isSuccess: false, result: "notExist" });
        res.send({ isSuccess: false, result: "notExist" });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

// ==== Delete Manufacturer data By Id === //
router.post("/delete-manufacturerbyId", tokenCheck, async (req, res) => {
  console.log(">>>>>/delete-manufacturerbyId");
  try {
    const { menufacturerName, menufacturerDiscription, manufacturerId } =
      req.body;

    const newUrl =
      "SELECT * FROM manufacturers where isActive = 1 and id=" + manufacturerId;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else if (newResult.length === 1) {
        const editurl =
          "UPDATE manufacturers SET isActive = 0 WHERE id=" + manufacturerId;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err });
            res.send({ isSuccess: false, result: "error" });
          } else {
            res.send({ isSuccess: true, result: "deletesuccess" });
          }
        });
      } else {
        console.log(newResult);
        console.log({ isSuccess: false, result: "notExist" });
        res.send({ isSuccess: false, result: "notExist" });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

//=========addModal==========
router.post("/addmodal", tokenCheck, async (req, res) => {
  try {
    const { modal, manufacturerId } = req.body;

    const modalQuery =
      "INSERT INTO modal (modalName, manufacturerId) VALUES (?, ?)";

    await db.query(
      modalQuery,
      [modal, manufacturerId],
      async (err, results) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: results });
          res.send({ isSuccess: true, result: results });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//==================addVariant===================
// router.post(
//   "/addvariant",
//   tokenCheck,
//   uploadFile.single("variantFile"),
//   async (req, res) => {
//     console.log(req.body, req.file, "v>>>>>>>>>>>>>>>>>");
//     try {
//       const { manufacturerModalVarData, modalid, manufacturerId } = req.body;
//       const parsedManufacturerModalVarData = JSON.parse(
//         manufacturerModalVarData
//       );
//       const variantsArray = parsedManufacturerModalVarData[0].variants;
//       const variantFile = req.file ? `/upload/${req.file.filename}` : "";
//       if (!variantFile) {
//         throw new Error("Variant file not uploaded.");
//       }
//       const insertedID = [];
//       for (const variant of variantsArray) {
//         const variantName = variant.variantName;

//         const variantQuery =
//           "INSERT INTO variant (variantName, modalid, manufacturerId) VALUES (?, ?, ?)";

//         await db.query(
//           variantQuery,
//           [variantName, modalid, manufacturerId],
//           async (err, variantResult) => {
//             if (err) {
//               console.log("Error inserting", err);
//             } else {
//               // console.log({ isSuccess: true, result: variantResult.insertId });
//               insertedID.push(variantResult.insertId);
//               console.log(insertedID, "IDDDDDDDDDD");
//               const table = 'variant';
//               const documentsSql = `INSERT INTO documents (table_name, table_entity_id, document_value, created_at) VALUES(?,?,?,?)`;
//               // await db.query(documentsSql, [table, insertedID])
//               async.forEach(insertedID)
//             }
//           }
//         );
//       }
//       console.log(insertedID, "IEEEEEEE");
//       console.log({ isSuccess: true, result: "Variants added successfully." });
//       res.send({ isSuccess: true, result: "Variants added successfully." });
//     } catch (err) {
//       console.log("Error inserting variant", err);
//       res
//         .status(500)
//         .send({ isSuccess: false, result: "Error adding variants." });
//     }
//   }
// );

router.post(
  "/addvariant",
  tokenCheck,
  uploadFile.array("variantFiles", 10),
  async (req, res) => {
    // console.log(req.body, "v>>>>>>>>>>>>>>>>>");
    try {
      const { variants, modalid, manufacturerId } = req.body;
      const variantFiles = req.files;
      const variantArray = JSON.parse(variants);
      console.log(variantArray, "variants");
      console.log(variantFiles, "variantFiles");
      // async.forEachOf(
      //   variantArray,
      //   (item, key, callback) => {
      //     console.log(item, "KJJJ");
      //     const sqlQuery = `INSERT INTO variant (variantName, modalid, manufacturerId) VALUES (?, ?, ?)`;
      //     db.query(
      //       sqlQuery,
      //       [item, modalid, manufacturerId],
      //       async (err, resultNew) => {
      //         if (err) {
      //           console.log({ isSuccess: true, result: err });
      //           res.send({ isSuccess: true, result: "error" });
      //         } else {
      //           console.log({ isSuccess: true, result: resultNew.insertId });
      //           if (resultNew.insertId) {
      //             const documentSql = `INSERT INTO documents (table_name, table_entity_id, document_value, created_at) VALUES (?, ?, ?, ?)`;
      //             for (let i = 0; i < variantFiles.length; i++) {
      //               const file = variantFiles[i];
      //               await db.query(documentSql, [
      //                 "variant",
      //                 resultNew.insertId,
      //                 file.filename,
      //                 new Date(),
      //               ]);
      //             }
      //           }
      //         }
      //       }
      //     );
      //     callback();
      //   },
      //   (err) => {
      //     if (err) {
      //       console.log({ isSuccess: true, result: err });
      //       res.send({ isSuccess: true, result: "error" });
      //     } else {
      //       console.log({ isSuccess: true, result: "success" });
      //       res.send({ isSuccess: true, result: "success" });
      //     }
      //   }
      // );


      const insertIdArray = [];

async.forEachOf(
  variantArray,
  (item, key, callback) => {
    console.log(item, "KJJJ");
    const sqlQuery = `INSERT INTO variant (variantName, modalid, manufacturerId) VALUES (?, ?, ?)`;
    db.query(
      sqlQuery,
      [item, modalid, manufacturerId],
      async (err, resultNew) => {
        if (err) {
          console.log({ isSuccess: true, result: err });
          res.send({ isSuccess: true, result: "error" });
        } else {
          console.log({ isSuccess: true, result: resultNew.insertId });
          if (resultNew.insertId) {
            // Push the insertId to the insertIdArray instead of inserting documents here
            insertIdArray.push(resultNew.insertId);
          }
        }
        callback();
      }
    );
  },
  (err) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result: "error" });
    } else {
      console.log(insertIdArray, 'Array')
      const documentSql = `INSERT INTO documents (table_entity_id, document_value, created_at) VALUES (?, ?, ?)`;
      for (let i = 0; i < insertIdArray.length; i++) {
        const insertId = insertIdArray[i];
        for (let j = 0; j < variantFiles.length; j++) {
          const file = variantFiles[j];
          db.query(documentSql, [
            insertId,
            file.filename,
            new Date(),
          ]);
        }
      }

      console.log({ isSuccess: true, result: "success" });
      res.send({ isSuccess: true, result: "success" });
    }
  }
);


      // const insertedVariantIds = [];
      // for (const variant of variants) {
      //   const insertVariantQuery =
      //     "INSERT INTO variant (variantName, modalid, manufacturerId) VALUES (?, ?, ?)";
      //   const result = await db.query(insertVariantQuery, [
      //     variant,
      //     modalid,
      //     manufacturerId,
      //   ]);
      //   insertedVariantIds.push(result.insertId);
      //   console.log(result,'HHHHHHHHh')
      // }

      // for (let i = 0; i < variantFiles.length; i++) {
      //   const file = variantFiles[i];
      //   const documentSql = `INSERT INTO documents (table_name, table_entity_id, document_value, created_at) VALUES (?, ?, ?, ?)`;
      //   await db.query(documentSql, [
      //     "variant",
      //     insertedVariantIds[i],
      //     file.filename,
      //     new Date(),
      //   ]);
      // }

      // console.log(variantFiles, "Uploaded Files");
      // for (const file of variantFiles){
      //   console.log(file,'FILLLLLLLLllll')
      // }
      // const variantsArray = parsedManufacturerModalVarData[0].variants;
      // const variantFile = req.file ? `/upload/${req.file.filename}` : "";
      // if (!variantFile) {
      //   throw new Error("Variant file not uploaded.");
      // }
      // const insertedID = [];
      // for (const variant of variantsArray) {
      //   const variantName = variant.variantName;

      //   const variantQuery =
      //     "INSERT INTO variant (variantName, modalid, manufacturerId) VALUES (?, ?, ?)";

      //   const variantResult = await db.query(variantQuery, [
      //     variantName,
      //     modalid,
      //     manufacturerId,
      //   ]);

      //   insertedID.push(variantResult.insertId);
      //   console.log(insertedID, "IDDDDDDDDDD");
      // }

      // const table = "variant";
      // const documentsSql = `INSERT INTO documents (table_name, table_entity_id, document_value, created_at) VALUES (?, ?, ?, ?)`;

      // for (const id of insertedID) {
      //   const currentDate = new Date();
      //   const documentValue = variantFile;
      //   await db.query(documentsSql, [table, id, documentValue, currentDate]);
      // }
      // console.log({ isSuccess: true, result: "Variants added successfully." });

      // res.send({ isSuccess: true, result: "Variants added successfully." });
    } catch (err) {
      console.log("Error inserting variant", err);
      res
        .status(500)
        .send({ isSuccess: false, result: "Error adding variants." });
    }
  }
);

//==========getModalist=============
router.get("/getmodal/:id", tokenCheck, async (req, res) => {
  try {
    const manufacturerId = req.params.id;
    await db.query(
      `Select * FROM modal WHERE manufacturerId = ${manufacturerId}`,
      (err, results) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: results });
          res.send({ isSuccess: true, result: results });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//===========getVariantList===========
router.get("/getvariant/:id", tokenCheck, async (req, res) => {
  try {
    const modalid = req.params.id;
    const query = `SELECT * FROM variant WHERE modalid = ${modalid}`;

    await db.query(query, (err, results) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: results });
        res.send({ isSuccess: true, result: results });
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ isSuccess: false, result: "error" });
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

router.post("/deletemodal", tokenCheck, async (req, res) => {
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
router.post("/deletemanufacturer", tokenCheck, async (req, res) => {
  try {
    const { manufacturerId } = req.body;
    const deleteManufacturerSql = `DELETE FROM manufacturers WHERE id = ${manufacturerId}`;
    await db.query(deleteManufacturerSql, [manufacturerId], (err, results) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: results });
        res.send({ isSuccess: true, result: results });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
