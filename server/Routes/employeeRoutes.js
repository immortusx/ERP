const express = require("express");
const async = require("async");
const fs = require('fs');
const moment = require("moment");
const { tokenCheck } = require("../Auth/TokenCheck");
const { checkUserPermission } = require("../Auth/userPermission");
const { hasThePass, compareTheHass } = require("../Auth/Bcrypt");
const { db } = require("../Database/dbConfig");
const uploadFile = require("../Utils/multerMiddaeware");
const path = require('path');

const router = express.Router();
let none = 1;
//================addEmployee===============//
router.post(
  "/add-employee",
  tokenCheck,
  uploadFile.single("logo"),
  async (req, res) => {
    console.log(">>>>>employee");
    console.log(req.body, "req.body ");

    const logoImage = `employee_profile` || null;
    const roleArr = req.body.role;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const documentid = req.body.documentId;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const bankname = req.body.bankname || null;
    const bankBranch = req.body.bankBranch || null;
    const accountNo = req.body.accountNo || 00;
    const accountType = req.body.accountType || null;
    const ifscCode = req.body.ifscCode || null;
    const bloodgroup = req.body.bloodgroup || null;
    const branchId = req.body.branchId;
    const role = req.body.selectedRole;
    const branch = req.body.branch;
    const selectedDate = moment(req.body.selectedDate).format("YYYY/MM/DD");
    const department = req.body.department;

    const user_type_id = 2;

    const hashedPassword = await hasThePass(password);

    try {
      const newResult = await queryDatabase(
        `SELECT * FROM users WHERE email = '${req.body.email}'`
      );

      if (newResult.length === 0) {
        const url = `INSERT INTO users(first_name, last_name, email, password, phone_number, bloodgroup, dob, user_type_id) VALUES('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${phoneNumber}', '${bloodgroup}', '${selectedDate}', '${user_type_id}')`;
        const result = await queryDatabase(url);

        const userId = result.insertId;
        console.log(url, "url");
        console.log("result *******", result);

        const currentDate = new Date();

        const formattedDate = currentDate
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        if (documentid) {
          const suburl = `INSERT INTO document_details (document_id, mapping_id,mapping_table) VALUES('${documentid}','${userId}','${logoImage}')`;
          await queryDatabase(suburl);
          console.log(suburl, "suburl");
        } else {
          const suburl = `INSERT INTO document_details (document_id, mapping_id,mapping_table) VALUES('${none}','${userId}','${logoImage}')`;
          await queryDatabase(suburl);
          console.log(suburl, "suburl");
        }
        await queryDatabase(
          `INSERT INTO employee_detail (branch_id, department_id, user_id,role_id) VALUES('${branch}','${department}','${userId}','${role}')`
        );

        await queryDatabase(
          `INSERT INTO bank_details (bank_name, bank_branch, account_number, account_type, ifsc_code, user_id) VALUES('${bankname}','${bankBranch}','${accountNo}','${accountType}','${ifscCode}','${userId}')`
        );

        console.log({ isSuccess: true, result: "success" });
        res.send({ isSuccess: true, result: "success" });
      } else {
        console.log({ isSuccess: false, result: "alreadyExist" });
        res.send({ isSuccess: false, result: "alreadyExist" });
      }
    } catch (error) {
      console.log({ isSuccess: false, result: error });
      res.send({ isSuccess: false, result: "error" });
    }
  }
);

async function queryDatabase(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

router.get("/get-employee-details/:id", tokenCheck, async (req, res) => {
  const userId = req.params.id;
  const urlNew = "SELECT * FROM employee_detail where id=" + userId;
  db.query(urlNew, async (err, result) => {
    console.log(result, "result");
    if (err) {
      console.log({ isSuccess: false, result: "emptyBranch" });
      res.send({ isSuccess: false, result: "emptyBranch" });
    } else {
      console.log({ isSuccess: true, result: urlNew });
      res.send({ isSuccess: true, result: result });
    }
  });
});

//===========get List of Employee================//
router.get("/get-employee-list", tokenCheck, async (req, res) => {
  try {
    await db.query(
      `SELECT
      f.*,
      s.user_id,
      s.bank_name,
      s.bank_branch,
      s.account_number,
      s.account_type,
      s.ifsc_code,
      ddu.branch_id,
      ddu.department_id,
      ddu.role_id,
      t.*
  FROM
      users AS f
  INNER JOIN
      bank_details AS s ON s.user_id = f.id
  INNER JOIN
      employee_detail AS ddu ON ddu.user_id = f.id
  LEFT JOIN
  document_details AS ed ON ed.mapping_id = f.id
  INNER JOIN
      documents AS t ON t.document_id = ed.document_id
  WHERE
      f.user_type_id = 2
      AND f.is_delete = 0
    
  `,
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

//============Edit Employee List==============//
router.post(
  "/edit-employee",
  tokenCheck,
  uploadFile.single("logo"),
  async (req, res) => {
    console.log(">>>>>editemployeee");
    console.log(req.body);
    let logoImage = req.body.logo;
    console.log('req.file', req.file)
    if (req.file) {
      logoImage = `/upload/${req.file.filename}`;
    }
    const roleArr = req.body.role;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const branchRole = req.body.branchRole;
    const bankname = req.body.bankname;
    const bankBranch = req.body.bankBranch;
    const accountNo = req.body.accountNo;
    const accountType = req.body.accountType;
    const ifscCode = req.body.ifscCode;
    const bloodgroup = req.body.bloodgroup;
    const branch = req.body.branch;
    const department = req.body.department;
    const role = req.body.selectedRole;
    const document_id = req.body.document_id;
    const selectedDate = moment(req.body.selectedDate).format("YYYY/MM/DD");
    // const departmentId = 1;
    const user_type_id = 2;
    const id = req.body.id;
    const hashedPassword = await hasThePass(password);

    try {
      console.log(id, "editid");
      console.log(document_id, "docemid");
      const result = `UPDATE users SET first_name = '${firstName}', last_name = '${lastName}', email = '${email}', password = '${hashedPassword}', phone_number = '${phoneNumber}', bloodgroup = '${bloodgroup}', dob = '${selectedDate}', user_type_id = '${user_type_id}' WHERE id = '${id}'`;
      await queryDatabase(result);
      console.log(result, "result");

      const userId = result.insertId;
      console.log("document_id:", document_id);
      const suburl = `UPDATE  documents SET document_path ='${logoImage}' WHERE  document_id =${document_id}`;
      await queryDatabase(suburl);
      console.log(suburl, "suburl");
      const employeeqry = `UPDATE employee_detail SET branch_id = '${branch}', department_id = '${department}', role_id = '${role}' WHERE user_id = '${id}'`;

      await queryDatabase(employeeqry);
      await queryDatabase(
        `UPDATE bank_details SET bank_name = '${bankname}', bank_branch = '${bankBranch}', account_number = '${accountNo}', account_type = '${accountType}', ifsc_code = '${ifscCode}' WHERE user_id = '${id}'`
      );

      console.log({ isSuccess: true, result: "success" });
      res.send({ isSuccess: true, result: "success" });
    } catch (error) {
      console.log({ isSuccess: false, result: error });
      res.send({ isSuccess: false, result: "error" });
    }
  }
);

//=============Delete Employee=============//
router.get("/delete-employee/:id", tokenCheck, async (req, res) => {
  try {
    const employeeId = req.params.id;
    console.log(employeeId);
    const newUrl =
      "SELECT * FROM users where is_delete = 0 and id=" + employeeId;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else if (newResult.length === 1) {
        console.log(newResult.length, "true");
        const editurl = "UPDATE users SET is_delete = 1 WHERE id=" + employeeId;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err });
            res.send({ isSuccess: false, result: "error" });
          } else {
            res.send({ isSuccess: true, result: "deletesuccess" });
          }
        });
      } else {
        console.log(newResult.length, "false");
        console.log({ isSuccess: false, result: "notExist" });
        res.send({ isSuccess: false, result: "notExist" });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

//=====================Upload Document========================
router.post("/upload-document",
  tokenCheck,
  uploadFile.single("document"),
  async (req, res) => {
    try {
      console.log(req.body, 'reo');
      console.log(req.file.filename, 'rer');
      // const logoImage = `/upload/${req.file.filename}`;
      // console.log(logoImage, "logoimg");
      let logoImage = req.body.logo;
      console.log('req.file', req.file)
      if (req.file) {
        logoImage = `/upload/${req.file.filename}`;
      }
      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const sql = "INSERT INTO documents (document_path, created_at) VALUES (?, ?)";
      const values = [logoImage, formattedDate];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ isSuccess: false, result: 'Error uploading document' });
        }
        console.log({ isSuccess: true, result: result });
        res.status(200).json({ isSuccess: true, result: result });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ isSuccess: false, result: 'Server error' });
    }
  });

//==================Download Document================
router.post('/download-document', tokenCheck, (req, res) => {
  try {
    const filename = req.body.downloadFilePath;

    const filePath = path.join(__dirname, "../", filename);
    console.log(filePath, "path");

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ isSuccess: false, result: 'File not found' });
    } else {
      // If the file exists, initiate the download
      res.download(filePath, (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(500).json({ isSuccess: false, result: 'Download failed' });
        } else {
          console.log('Download successful');
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ isSuccess: false, result: 'Server error' });
  }
});

module.exports = router;
