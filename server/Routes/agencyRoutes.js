const express = require("express");
const async = require("async");

const { tokenCheck } = require("../Auth/TokenCheck");
const { checkUserPermission } = require("../Auth/userPermission");

const { db } = require("../Database/dbConfig");

const uploadFile = require("../Utils/multerMiddaeware");
const router = express.Router();

//=====Add-Department======
router.post(
  "/add-agency",
  tokenCheck,
  uploadFile.single("logo"),
  async (req, res) => {
    console.log("req.body *********", req.body);
    const { name, contact, email, logo } = req.body;
    console.log("file *********", req.file);
    // console.log("file *********", file);
    

    const addnameSql = `INSERT INTO configuration (setting, key_name, value) VALUES ('agency','name','${name}')`;
    const addpersonSql = `INSERT INTO configuration (setting, key_name, value) VALUES ('agency','contact','${contact}')`;
    const addemailSql = `INSERT INTO configuration (setting, key_name, value) VALUES ('agency','email','${email}')`;
    const addlogoSql = `INSERT INTO configuration (setting, key_name, value) VALUES ('agency','logo','${logo}')`;

    try {
    await db.query(addnameSql);
    await db.query(addpersonSql);
    await db.query(addemailSql);
    await db.query(addlogoSql);

      console.log({ isSuccess: true, result: "success" });
      res.send({ isSuccess: true, result: "success" });
    } catch (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    }
  }
);



router.post(
  "/get-agency-edit",
  tokenCheck,
  uploadFile.single("logo"),
  async (req, res) => {
    console.log(">>>>>get-roles");
    const { name, contact, email, logo } = req.body;
console.log(req.body, "req.body");
    try {
      const updateNameSql = `UPDATE configuration SET value = '${name}' WHERE setting = 'agency' AND key_name = 'name'`;
      const updateContactSql = `UPDATE configuration SET value = '${contact}' WHERE setting = 'agency' AND key_name = 'contact'`;
      const updateEmailSql = `UPDATE configuration SET value = '${email}' WHERE setting = 'agency' AND key_name = 'email'`;
      const updateLogoSql = `UPDATE configuration SET value = '${logo}' WHERE setting = 'agency' AND key_name = 'logo'`;

      await db.query(updateNameSql);
      await db.query(updateContactSql);
      await db.query(updateEmailSql);
      await db.query(updateLogoSql);

      console.log({ isSuccess: true, result: "success" });
      res.status(200).json({ isSuccess: true, result: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ isSuccess: false, result: "error" });
    }
  }
);



// router.get("/get-agency-list", tokenCheck, async (req, res) => {
//   try {
//     await db.query(
//       "SELECT * FROM configuration where setting = agency",
//       (err, results) => {
//         if (err) {
//           console.log({ isSuccess: false, result: "error" });
//           res.send({ isSuccess: false, result: "error" });
//         } else {
//           console.log({ isSuccess: true, result: results });
//           res.status(200).send({ isSuccess: true, result: results });
//         }
//       }
//     );
//   } catch (e) {
//     console.log(e);
//   }
// });

router.get("/get-agencybyid", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-agencybyid");
  try {
   
    await db.query(
      "SELECT * FROM configuration where  setting = 'agency'",
      (err, agencyIdData) => {
        if (err) {
          console.log({ isSuccess: false, result: "error" });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: agencyIdData });
          res.status(200).send({ isSuccess: true, result: agencyIdData });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

module.exports = router;
