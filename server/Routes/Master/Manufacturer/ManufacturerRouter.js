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
router.post("/add-manufacturer", tokenCheck, uploadFile.single("file"), async (req, res) => {
  console.log(">>>>>/add-manufacturer");
  const { menufacturerName, menufacturerDiscription, insertedId, menufacturerLink } = req.body;
  const file = req.file;
  const documentid = req.body.documentId;
  var mfacturerNamespace = menufacturerName.trim(" ");
  const firstLetter = mfacturerNamespace.charAt(0).toUpperCase();
  var capitalFirstLetter = firstLetter + mfacturerNamespace.slice(1);
  const logoImage = `manufacturer_data`;

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
          const manufacturerId = result.insertId;
          const suburl = `INSERT INTO document_details (document_id, mapping_id, mapping_table) VALUES('${documentid}','${manufacturerId}','${logoImage}')`;
          await db.query(suburl, (suburlErr, suburlResult) => {
            if (suburlErr) {
              console.log({ isSuccess: false, result: suburlErr });
              res.send({ isSuccess: false, result: "error" });
            } else {
              console.log({ isSuccess: true, result: "success" });
              res.send({ isSuccess: true, result: "success" });
            }
          });
        }
      });
    } else {
      console.log(newResult);
      console.log({ isSuccess: false, result: "alreadyExist" });
      res.send({ isSuccess: false, result: "alreadyExist" });
    }
  });
});

router.post("/addmodal", tokenCheck, async (req, res) => {
  try {
    const { modal, manufacturerId, insertedId } = req.body;
    const logoImage = `manufacturerModal_data`;
    const url = `INSERT INTO modal (modalName, manufacturerId) VALUES ('${modal}', '${manufacturerId}')`;
    await db.query(url, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        const manufacturerModelId = result.insertId;

        const suburl = `INSERT INTO document_details (document_id, mapping_id, mapping_table) VALUES('${insertedId}','${manufacturerModelId}','${logoImage}')`;

        await db.query(suburl, (suburlErr, suburlResult) => {
          if (suburlErr) {
            console.log({ isSuccess: false, result: suburlErr });
            res.send({ isSuccess: false, result: "error" });
          } else {
            console.log({ isSuccess: true, result: "success" });
            res.send({ isSuccess: true, result: "success" });
          }
        });
      }
    });

  } catch (error) {
    console.error("Error in addmodal:", error);
    res.status(500).send({ isSuccess: false, result: "internalServerError" });
  }
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
// router.post("/addmodal", tokenCheck, async (req, res) => {
//   try {
//     const { modal, manufacturerId } = req.body;

//     const modalQuery =
//       "INSERT INTO modal (modalName, manufacturerId) VALUES (?, ?)";

//     await db.query(
//       modalQuery,
//       [modal, manufacturerId],
//       async (err, results) => {
//         if (err) {
//           console.log({ isSuccess: false, result: err });
//           res.send({ isSuccess: false, result: "error" });
//         } else {
//           console.log({ isSuccess: true, result: results });
//           res.send({ isSuccess: true, result: results });
//         }
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// });

//==================addVariant===================
router.post(
  "/addvariant",
  tokenCheck,
  uploadFile.array("variantFiles", 20),
  async (req, res) => {
    try {
      const { variants, modalid, manufacturerId, variantFiles } = req.body;
      const variantArray = JSON.parse(variants);
      const insertedIds = JSON.parse(variantFiles);
      console.log(variantArray, "variants");
      console.log(insertedIds, "insertedId");

      const logoImage = `variant_data`;
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
                if (resultNew.insertId) {
                  insertIdArray.push({
                    insertId: resultNew.insertId,
                    documentId: insertedIds[key],
                  });
                }
                callback();
              }
            }
          );
        },
        async (err) => {
          if (err) {
            console.log({ isSuccess: true, result: err });
            res.send({ isSuccess: true, result: "error" });
          } else {
            // Insert document IDs outside the loop
            const documentSql = `INSERT INTO document_details (document_id, mapping_id, mapping_table) VALUES (?,?,?)`;

            for (let i = 0; i < insertIdArray.length; i++) {
              const { insertId, documentId } = insertIdArray[i];
              console.log(documentId, insertId, "jjjjjjjjjddddddddddddddddd");
              // Insert document ID here
              db.query(
                documentSql,
                [documentId, insertId, logoImage],
                (documentErr, documentResult) => {
                  if (documentErr) {
                    console.log({ isSuccess: true, result: documentErr });
                    res.send({ isSuccess: true, result: "error" });
                  }
                }
              );
            }

            console.log({ isSuccess: true, result: "success" });
            res.send({ isSuccess: true, result: "success" });
          }
        }
      );
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

//==========get All Modalist=============
router.get("/getallmodallist", tokenCheck, async (req, res) => {
  try {
    await db.query(`Select * FROM modal WHERE isActive = 1`, (err, results) => {
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

//========================get First Manufacurer============================//
router.get("/get-first-maker", tokenCheck, async (req, res) => {
  try {
    const query = `SELECT * FROM manufacturers WHERE id = 1`;
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

module.exports = router;
