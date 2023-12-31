const async = require("async");
const express = require("express");
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");
const moment = require("moment");
const { db } = require("../Database/dbConfig");
const { InstantMessagingUtils } = require("../Utils/MessagingHelpers");
const { instantEnquiryMessage } = require("../Utils/instantEnquiryCommunitor");

const router = express.Router();
const none = 1;
const adminId = 1;
let stateId = 2;
let districtId = 2;
router.get("/enquiry-data", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-enquiry-data");
  try {
    let url = "";
    if (req.myData.isSuperAdmin) {
      url = `SELECT * FROM branches `;
    } else {
      url = `SELECT * FROM branches where id = ${req.myData.branchId}`;
    }
    await db.query(url, async (err, getBranchs) => {
      if (getBranchs) {
        await db.query(
          "SELECT * FROM enquiry_primary_sources",
          async (err, getPrimarySource) => {
            if (getPrimarySource) {
              await db.query(
                "SELECT * FROM manufacturers",
                async (err, getManufacturers) => {
                  if (getManufacturers) {
                    await db.query(
                      "SELECT * FROM district",
                      async (err, getDistrict) => {
                        if (getManufacturers) {
                          let mainObj = {
                            branches: getBranchs,
                            primary_source: getPrimarySource,
                            manufacturers: getManufacturers,
                            district: getDistrict,
                          };
                          console.log({
                            isSuccess: "success",
                            result: "success",
                          });
                          res.send({ isSuccess: "success", result: mainObj });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  } catch (err) {
    console.log({ isSuccess: false, result: err });
    res.send({ isSuccess: false, result: "error" });
  }
});

router.get("/get-variant/:id", tokenCheck, async (req, res) => {
  console.log("variant>>>>>>");
  const url = `SELECT * FROM variant where modalid =(${req.params.id}) `;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: url });
      res.send({ isSuccess: "success", result: result });
    }
  });
});
router.get("/get-tehsil/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-tehsil", req.params);
  const urlNew = `SELECT * FROM taluka WHERE district_id = (${req.params.id})`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: urlNew });
      res.send({ isSuccess: "success", result: result });
    }
  });
});
router.get("/get-village/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-tehsil", req.params);
  const urlNew = `SELECT * FROM village WHERE taluka_id = (${req.params.id})`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: urlNew });
      res.send({ isSuccess: "success", result: result });
    }
  });
});
router.get("/get-model/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-model", req.params);
  const urlNew = `SELECT * FROM modal WHERE manufacturerId = (${req.params.id})`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: urlNew });
      res.send({ isSuccess: "success", result: result });
    }
  });
});
router.get("/get-enquiries", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-enquiries", req.myData);
  let branchId = req.myData.branchId;
  let isSuperAdmin = req.myData.isSuperAdmin;
  let userId = req.myData.userId;
  const urlNew = `CALL sp_get_enquiries_list(${branchId},${isSuperAdmin})`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: urlNew });
      res.send({ isSuccess: "success", result: result[0] });
    }
  });
});
// router.get("/get-enquiriesbyId/:id", tokenCheck, async (req, res) => {
//   console.log(">>>>>>>>>get-enquiries", req.myData);
//  const userId = req.params.id
//   const urlNew = "select * from enquiries where customer_id =" +userId ;
//   console.log(urlNew, "urlNew");
//   await db.query(urlNew, async (err, result) => {
//     console.log(result, "result");
//     if (err) {
//       console.log({ isSuccess: false, result: err });
//       res.send({ isSuccess: false, result: "error" });
//     } else {
//       console.log({ isSuccess: "success", result: result});
//       res.send({ isSuccess: "success", result: result });
//     }
//   });
// });
router.get("/get-multiple-enquiriesbyId/:ids", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-multiple-enquiriesbyId", req.myData);
  const userIds = req.params.ids.split(","); // Split the comma-separated IDs into an array
  const urlNew = `select * from enquiries where customer_id IN (${userIds.join(
    ","
  )})`;
  console.log(urlNew, "urlNew");
  await db.query(urlNew, async (err, result) => {
    console.log(result, "result");
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: result });
      res.send({ isSuccess: "success", result: result });
    }
  });
});

router.get("/get-dsp/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-dsp", req.params);
  let branchId = req.params.id;
  let userId = req.myData.userId;
  const urlNew = `CALL sp_get_dsp_list(${branchId},${userId})`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: urlNew });
      res.send({ isSuccess: "success", result: result[0] });
    }
  });
});

router.get(
  "/get-dsp-by-village/:distributionId/:categoryId",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>>>>>get-dsp", req.params);
    let distributionId = req.params.distributionId;
    let categoryId = req.params.categoryId;
    console.log(distributionId, "distributionId***");
    console.log(categoryId, "categoryId%%%%%%%%%%%%%***");
    const urlNew = `CALL sp_get_user_sale_person(${distributionId},${categoryId})`;
    console.log(urlNew, "urlNew");
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: urlNew });
        res.send({ isSuccess: "success", result: result[0] });
      }
    });
  }
);
router.get(
  "/get-work-assign-village-list/:id",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>>>>>get-dsp", req.params);
    let branchId = req.params.id;
    let userId = req.myData.userId;
    const urlNew = `CALL sp_get_work_assign_village_list(${branchId},${userId})`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: result[0] });
        res.send({ isSuccess: "success", result: result[0] });
      }
    });
  }
);
router.get("/get-dsp_enquerylist/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-dsp", req.params);
  let branchId = req.params.id;
  let userId = req.myData.userId;
  const urlNew = `CALL sp_get_dsp_enquerylist(${branchId},${userId})`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: urlNew });
      res.send({ isSuccess: "success", result: result[0] });
    }
  });
});
router.get("/get-source-enquiry/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-source-enquiry", req.params);
  const urlNew = `select * from  enquiry_sources where primary_source_id = ${req.params.id}`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: urlNew });
      res.send({ isSuccess: "success", result: result });
    }
  });
});

router.post("/edit-salesperson-enquiry-data", tokenCheck, async (req, res) => {
  console.log("/editNew,", req.body);
  const customerIds = req.body.customerId; // Array of customer IDs or a single customer ID
  const salesperson_id = req.body.salesperson_id;

  let urlNew = "";

  if (Array.isArray(customerIds)) {
    const customerIdList = customerIds.join("','");
    urlNew = `UPDATE enquiries SET salesperson_id = '${salesperson_id}' WHERE customer_id IN ('${customerIdList}')`;
  } else {
    urlNew = `UPDATE enquiries SET salesperson_id = '${salesperson_id}' WHERE customer_id = '${customerIds}'`;
  }

  console.log(urlNew, "urlNew");

  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: true, result: urlNew });
      res.send({ isSuccess: true, result: "Success" });
    }
  });
});

//===================Set New Enquiry Data=============================//
router.post("/set-new-enquiry-data", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>set-new-enquiry-data", req.body);

  const firstName = req.body.firstName || null;
  const lastName = req.body.lastName || null;
  const fatherName = req.body.fatherName || null;
  const mobileNumber = req.body.mobileNumber || null;
  const whatsappNumber = req.body.whatsappNumber || null;
  const email = req.body.emailId || null;
  const isActive = 1;
  const state = req.body.state || stateId;
  const district = req.body.district || null;
  const tehsil = req.body.tehsil || null;
  const block = req.body.block || null;
  const village = req.body.village || null;

  const enquiryCategoryId = req.body.category || none;
  const visitReason = req.body.visitReason;
  const branchId = req.body.branchId || null;
  const dsp = req.body.dsp || none;
  const model = req.body.model || none;
  const make = req.body.make || none;
  const oldMaker = req.body.oldMaker || null;
  const oldModal = req.body.oldModal || null;
  const variant = req.body.variant || null;
  const modelYear = req.body.modelYear || none;
  const condition = req.body.condition || null;
  const oldTractorOwned = req.body.oldTractorOwned || null;
  const sourceOfEnquiry = req.body.sourceOfEnquiry || null;
  const enquiryPrimarySource = req.body.enquiryPrimarySource || null;
  const cdate = req.body.enquiryDate;
  const newDeliveryDate = req.body.deliveryDate;
  const companyName = req.body.companyName;

  const getSSP = (callback) => {
    let userID = req.myData.userId;
    const sql = `SELECT CONCAT(u.first_name, ' ', u.last_name) AS full_name FROM users AS u WHERE u.id = ${userID}`;
    db.query(sql, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
      } else {
        const fullName = result[0].full_name;
        callback(fullName);
      }
    });
  };

  let taskStartTime = new Date();
  const url = `INSERT INTO customers (first_name, middle_name, last_name, phone_number, whatsapp_number, email, is_active, state, district, taluka, village) VALUES ('${firstName}', '${fatherName}', '${lastName}', '${mobileNumber}', '${whatsappNumber}', '${email}', '${isActive}', '${state}', '${district}', '${tehsil}', '${village}')`;
  console.log("url", url);
  db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else if (result && result.insertId) {
      const insertedId = result.insertId;

      const urlNew = `INSERT INTO enquiries (branch_id, enquiry_category_id, salesperson_id, customer_id, modal_id, date, delivery_date, primary_source_id, enquiry_source_id, visitReason, company_name) VALUES ('${branchId}', '${enquiryCategoryId}', '${dsp}', '${insertedId}', '${model}', '${cdate}', '${newDeliveryDate}', '${enquiryPrimarySource}', '${sourceOfEnquiry}', '${visitReason}', '${companyName}')`;
      db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else if (result && result.insertId) {
          const enquiryId = result.insertId;

          const enquiryProductSql = `INSERT INTO enquiry_products (enquiry_id, manufacturer, modal) VALUES ('${enquiryId}', '${make}', '${model}')`;
          db.query(enquiryProductSql, async (err, result) => {
            if (err) {
              console.log({ isSuccess: false, result: err });
              res.send({ isSuccess: false, result: "error" });
            } else {
              console.log({ isSuccess: "success", result: "success" });
              // res.send({ isSuccess: "success", result: "success" });

              if (oldTractorOwned === "Yes") {
                const urlSql = `INSERT INTO manufactur_details (enquiry_id, maker, modalName, year_of_manufactur, condition_of, old_tractor) VALUES ('${enquiryId}', '${oldMaker}', '${oldModal}', '${modelYear}', '${condition}', '${oldTractorOwned}')`;
                db.query(urlSql, async (err, result) => {
                  if (err) {
                    console.log({ isSuccess: false, result: err });
                    res.send({ isSuccess: false, result: "error" });
                  } else {
                    console.log({ isSuccess: "success", result: "success" });
                    // res.send({ isSuccess: "success", result: "success" });
                    const uploadEnquiryWorklog = () => {
                      getSSP((salesperson) => {
                        console.log(salesperson, "salesperson");
                        let workDescription = `For Enquiry ${firstName} which phone ${mobileNumber} by ${salesperson}`;
                        let tasktype = 1;
                        let task = 11;
                        let cdate = moment().format("YYYY-MM-DD H:m:s");
                        let taskEndTime = new Date();
                        let spendTime = taskEndTime - taskStartTime;
                        let spendTimeSeconds = Math.floor(spendTime / 1000);
                        let hours = Math.floor(spendTimeSeconds / 3600);
                        let minutes = Math.floor(
                          (spendTimeSeconds % 3600) / 60
                        );
                        let seconds = spendTimeSeconds % 60;
                        let theSpendTime = `${hours
                          .toString()
                          .padStart(2, "0")}:${minutes
                            .toString()
                            .padStart(2, "0")}:${seconds
                              .toString()
                              .padStart(2, "0")}`;
                        console.log(theSpendTime, "spendTime");

                        let userID = req.myData.userId;
                        const workLogSql = `INSERT INTO worklog (user_id, tasktype, task, work_description, datetime, spendtime) VALUES('${userID}','${tasktype}','${task}','${workDescription}','${cdate}','${theSpendTime}')`;
                        db.query(workLogSql, async (err, result) => {
                          if (err) {
                            console.log({ isSuccess: false, result: err });
                          } else {
                            console.log({
                              isSuccess: "success",
                              result: "success",
                            });
                            res.send({
                              isSuccess: "success",
                              result: "success",
                            });
                          }
                        });
                      });
                    };
                    uploadEnquiryWorklog();
                    if (enquiryId) {
                      const messagePayloads = {
                        enquiryId: enquiryId,
                      };
                      instantEnquiryMessage(messagePayloads);
                    }
                  }
                });
              } else if (oldTractorOwned === "No") {
                const urlSql = `INSERT INTO manufactur_details (enquiry_id, old_tractor) VALUES ('${enquiryId}', '${oldTractorOwned}')`;
                db.query(urlSql, (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log({
                      result: "success",
                      isSuccess: "success",
                    });
                    res.send({
                      isSuccess: "success",
                      result: "success",
                    });
                    const uploadEnquiryWorklog = () => {
                      getSSP((salesperson) => {
                        console.log(salesperson, "salesperson");
                        let workDescription = `For Enquiry ${firstName} which phone ${mobileNumber} by ${salesperson}`;
                        let tasktype = 1;
                        let task = 11;
                        let cdate = moment().format("YYYY-MM-DD H:m:s");
                        let taskEndTime = new Date();
                        let spendTime = taskEndTime - taskStartTime;
                        let spendTimeSeconds = Math.floor(spendTime / 1000);
                        let hours = Math.floor(spendTimeSeconds / 3600);
                        let minutes = Math.floor(
                          (spendTimeSeconds % 3600) / 60
                        );
                        let seconds = spendTimeSeconds % 60;
                        let theSpendTime = `${hours
                          .toString()
                          .padStart(2, "0")}:${minutes
                            .toString()
                            .padStart(2, "0")}:${seconds
                              .toString()
                              .padStart(2, "0")}`;
                        console.log(theSpendTime, "spendTime");

                        let userID = req.myData.userId;
                        const workLogSql = `INSERT INTO worklog (user_id, tasktype, task, work_description, datetime, spendtime) VALUES('${userID}','${tasktype}','${task}','${workDescription}','${cdate}','${theSpendTime}')`;
                        db.query(workLogSql, async (err, result) => {
                          if (err) {
                            console.log({ isSuccess: false, result: err });
                          } else {
                            console.log({
                              isSuccess: "success",
                              result: "success",
                            });
                          }
                        });
                      });
                    };
                    uploadEnquiryWorklog();
                    if (enquiryId) {
                      const messagePayloads = {
                        enquiryId: enquiryId,
                      };
                      instantEnquiryMessage(messagePayloads);
                    }
                  }
                });
              }
            }
          });
        }
      });
    }
  });
});

//=================edit Enquiry Data================//
router.post(
  "/set-edit-enquiry-data/:customerId",
  tokenCheck,
  async (req, res) => {
    try {
      console.log(">>>>>>>>>set-edit-enquiry-data", req.body);

      const customerId = req.params.customerId;
      const firstName = req.body.firstName || null;
      const lastName = req.body.lastName || null;
      const fatherName = req.body.fatherName || null;
      const mobileNumber = req.body.mobileNumber || null;
      const whatsappNumber = req.body.whatsappNumber || null;
      const email = req.body.emailId || null;
      const isActive = 1;
      const state = req.body.state || stateId;
      const district = req.body.district || null;
      const taluka = req.body.tehsil || null;
      const block = req.body.block || null;
      const village = req.body.village || null;
      const enquiryCategoryId = req.body.category || none;
      const visitReason = req.body.visitReason;
      const branchId = req.body.branchId || null;
      const dsp = req.body.dsp || none;
      const model = req.body.model || none;
      const make = req.body.make || none;
      const oldMaker = req.body.oldMaker || null;
      const oldModal = req.body.oldModal || null;
      const variant = req.body.variant || null;
      const modelYear = req.body.modelYear || none;
      const condition = req.body.condition || null;
      const oldTractorOwned = req.body.oldTractorOwned || null;
      const enquiryDate = req.body.enquiryDate || null;
      const deliveryDate = req.body.deliveryDate || null;
      const sourceOfEnquiry = req.body.sourceOfEnquiry || null;
      const enquiryPrimarySource = req.body.enquiryPrimarySource || null;
      const newDeliveryDate = req.body.deliveryDate;
      const newEnquiryDate = await getDateInFormate(enquiryDate);
      const companyName = req.body.companyName;

      const updateCustomerSql = `
      UPDATE customers
      SET
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        phone_number = ?,
        whatsapp_number = ?,
        email = ?,
        state = ?,
        district = ?,
        taluka = ?,
        village = ?
      WHERE id = ?`;

      console.log(updateCustomerSql, "customers");

      db.query(
        updateCustomerSql,
        [
          firstName,
          fatherName,
          lastName,
          mobileNumber,
          whatsappNumber,
          email,
          state,
          district,
          taluka,
          village,
          customerId,
        ],
        async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err });
            res.send({ isSuccess: false, result: "error" });
          } else {
            console.log({ isSuccess: "success", result: "success" });

            const updateEnquirySql = `
            UPDATE enquiries
            SET
              branch_id = ?,
              enquiry_category_id = ?,
              salesperson_id = ?,
              modal_id = ?,
              delivery_date = ?,
              primary_source_id = ?,
              enquiry_source_id = ?,
              visitReason = ?,
              company_name = ?
            WHERE customer_id = ?`;

            console.log(updateEnquirySql, "enquiries");

            db.query(
              updateEnquirySql,
              [
                branchId,
                enquiryCategoryId,
                dsp,
                model,
                newDeliveryDate,
                enquiryPrimarySource,
                sourceOfEnquiry,
                visitReason,
                companyName,
                customerId,
              ],
              async (err, result) => {
                if (err) {
                  console.log({ isSuccess: false, result: err });
                  res.send({ isSuccess: false, result: "error" });
                } else {
                  console.log({ isSuccess: "success", result: "success" });

                  const enquiryProductSql = `UPDATE enquiry_products SET manufacturer = ?, modal = ?, variant = ? WHERE enquiry_id = ${customerId}`;
                  await db.query(
                    enquiryProductSql,
                    [make, model, variant],
                    async (err, productResult) => {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log({
                          isSuccess: "success",
                          result: enquiryProductSql,
                        });

                        if (oldTractorOwned === "Yes") {
                          const urlSql = `UPDATE manufactur_details SET maker = ?, modalName = ?, variantName = ?, year_of_manufactur = ?, condition_of = ?, old_tractor = ? WHERE enquiry_id = ${customerId}`;
                          await db.query(
                            urlSql,
                            [
                              oldMaker,
                              oldModal,
                              variant,
                              modelYear,
                              condition,
                              oldTractorOwned,
                            ],
                            (err, result) => {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log({
                                  isSuccess: "success",
                                  result: urlSql,
                                });
                                res.send({
                                  isSuccess: "success",
                                  result: "success",
                                });
                              }
                            }
                          );
                        } else if (oldTractorOwned === "No") {
                          const urlSql = `UPDATE manufactur_details SET maker = ?, modalName = ?, variantName = ?, year_of_manufactur = ?, condition_of = ?, old_tractor = ? WHERE enquiry_id = ${customerId}`;
                          await db.query(
                            urlSql,
                            [null, null, null, null, null, oldTractorOwned],
                            (err, result) => {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log({
                                  isSuccess: "success",
                                  result: urlSql,
                                });
                                res.send({
                                  isSuccess: "success",
                                  result: "success",
                                });
                              }
                            }
                          );
                        } else {
                          res.send({
                            isSuccess: "success",
                            result: "success",
                          });
                        }
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ isSuccess: false, result: "Error" });
    }
  }
);

//===========add-enquiry-category"============//
router.post("/add-enquiry-category", tokenCheck, async (req, res) => {
  console.log(">>>>>>>addEnquiryCategory");
  const categoriesValue = Object.values(req.body);
  let str = "";
  categoriesValue.forEach((i, index) => {
    if (index == 0) {
      str += `'${i}'`;
    } else {
      str += `, '${i}'`;
    }
  });

  const newSqlQuery = `SELECT * FROM enquiry_category where category_name in (${str})`;
  db.query(newSqlQuery, (err, newSqlResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else if (newSqlResult.length > 0) {
      console.log({ isSuccess: true, result: newSqlQuery });
      res.send({ isSuccess: true, result: "categoryExisted" });
    } else {
      async.forEachOf(
        categoriesValue,
        (item, key, callback) => {
          const sqlQuery = `INSERT INTO enquiry_category(category_name) VALUES('${item}')`;
          db.query(sqlQuery, (err, resultNew) => {
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
  });
});
router.get("/get-current-fields/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>>get-current-fields/:id", req.params.id);
  const newSqlQuery = `SELECT s.* FROM enquiry_category_field as f inner join enquiry_fields as s on f.field_id = s.id WHERE category_id = '${req.params.id}'`;
  db.query(newSqlQuery, (err, newSqlResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: true, result: newSqlQuery });
      res.send({ isSuccess: true, result: newSqlResult });
    }
  });
});
router.post("/category-insert-fields", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>categoryInsertFields called");
  const catID = req.body.id;
  const fieldsAr = req.body.fields;
  // const urlNew = `INSERT INTO enquiry_category_field(category_id, field_id) VALUES('${}', '')`
  // await db.query(urlNew, async (err, result)

  const newSqlQuery = `delete FROM enquiry_category_field  where category_id = '${catID}'`;
  db.query(newSqlQuery, (err, newSqlResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      async.forEachOf(
        fieldsAr,
        (item, key, callback) => {
          const sqlQuery = `INSERT INTO enquiry_category_field(category_id, field_id) VALUES('${catID}', '${item}')`;
          db.query(sqlQuery, (err, resultNew) => {
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
  });
});
router.get("/get-categories-fields", tokenCheck, async (req, res) => {
  console.log(">>>>>>>get-categories-fields");
  const urlNew = `SELECT * FROM enquiry_fields`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: true, result: urlNew });
      res.send({ isSuccess: true, result: result });
    }
  });
});
router.get("/get-enquiry-categories", tokenCheck, async (req, res) => {
  console.log(">>>>>>>get-enquiry-categories");
  const urlNew = `SELECT * FROM enquiry_category`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: true, result: urlNew });
      res.send({ isSuccess: true, result: result });
    }
  });
});


router.get("/getenquiry_search_filed", tokenCheck,async(req,res)=>{
  console.log("/getenquiry_search_filed")
  const url = "SELECT * FROM enquiry_search_field";
  await db.query(url,async(err,result)=>{
    if(err){
      console.log({isSuccess:false,result:err});
      res.send({isSuccess:false,result:"error"});
    }else{
        console.log({ isSuccess: true, result: url });
        res.send({ isSuccess: true, result: result });
    }
  })
})
router.get(
  "/getenquiry_search_filed_list/:id",
  tokenCheck,
  async (req, res) => {
    const id = req.params.id; 
    const url = `call sp_get_search_enquiry_by_field(${id})`; 
    console.log("/getenquiry_search_filed_list",url);
    await db.query(url, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.send({ isSuccess: true, result: result });
      }
    });
  }
);


//===========Add Fast Enquiry through Application=============//
router.post("/set-new-fast-enquiry", tokenCheck, async (req, res) => {
  console.log(">>>>>/set-new-fast-enquiry", req.body);
  try {
    const {
      first_name,
      phone_number,
      whatsapp_number,
      village,
      taluka,
      branchId,
      category,
    } = req.body;

    const branch_id = branchId;
    const categoryId = category;

    const user_Id = req.myData.userId;

    const getSSP = (callback) => {
      const userID = req.myData.userId;
      const sql = `SELECT CONCAT(u.first_name, ' ', u.last_name) AS full_name FROM users AS u WHERE u.id = ${userID}`;
      db.query(sql, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
        } else {
          const fullName = result[0].full_name;
          callback(fullName);
        }
      });
    };

    const salePersonSql = `CALL sp_get_user_sale_person(${village}, ${categoryId})`;
    await db.query(salePersonSql, async (err, salePersonDetails) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        const userData = salePersonDetails[0][0];
        const salesperson_id = userData ? userData.userId : null;

        const fastSql = `INSERT INTO customers (first_name, phone_number, whatsapp_number, state, district, taluka, village) VALUES (?,?,?,?,?,?,?)`;
        await db.query(
          fastSql,
          [
            first_name,
            phone_number,
            whatsapp_number,
            stateId,
            districtId,
            taluka,
            village,
          ],
          async (err, fastEnquiry) => {
            if (err) {
              console.log({ isSuccess: false, result: err });
              res.send({ isSuccess: false, result: "error" });
            } else {
              const customer_id = fastEnquiry.insertId;

              const cdate = moment().format("YYYY-MM-DD H:m:s");
              const enquirySql = `INSERT INTO enquiries (branch_id, enquiry_category_id, salesperson_id, modal_id, customer_id, date, user_created) VALUES (?,?,?,?,?,?,?)`;
              await db.query(
                enquirySql,
                [
                  branch_id,
                  categoryId,
                  salesperson_id ? salesperson_id : null,
                  none,
                  customer_id,
                  cdate,
                  user_Id,
                ],
                async (err, enquiryResult) => {
                  if (err) {
                    console.log({ isSuccess: false, result: err });
                    res.send({ isSuccess: false, result: "error" });
                  } else if (enquiryResult && enquiryResult.insertId) {
                    const enquiryId = enquiryResult.insertId;

                    const enquiryProductSql = `INSERT INTO enquiry_products (enquiry_id, manufacturer, modal) VALUES (?,?,?)`;
                    await db.query(
                      enquiryProductSql,
                      [enquiryId, none, none],
                      async (err, productResult) => {
                        if (err) {
                          console.log(err);
                        } else {
                          const urlSql = `INSERT INTO manufactur_details (enquiry_id, old_tractor) VALUES(?,?)`;
                          await db.query(
                            urlSql,
                            [enquiryId, "No"],
                            async (err, result) => {
                              if (err) {
                                console.log(err);
                              } else {
                                const uploadEnquiryWorklog = () => {
                                  getSSP((salesperson) => {
                                    const workDescription = `For Enquiry ${first_name} which phone ${phone_number} by ${salesperson}`;
                                    const tasktype = 1;
                                    const task = 11;
                                    const taskStartTime = new Date();
                                    const workLogSql = `INSERT INTO worklog (user_id, tasktype, task, work_description, datetime) VALUES('${user_Id}','${tasktype}','${task}','${workDescription}','${cdate}')`;
                                    db.query(workLogSql, async (err, result) => {
                                      if (err) {
                                        console.log({ isSuccess: false, result: err });
                                      } else {
                                        const taskEndTime = new Date();
                                        const spendTime = taskEndTime - taskStartTime;
                                        const spendTimeSeconds = Math.floor(spendTime / 1000);
                                        const hours = Math.floor(spendTimeSeconds / 3600);
                                        const minutes = Math.floor((spendTimeSeconds % 3600) / 60);
                                        const seconds = spendTimeSeconds % 60;
                                        const theSpendTime = `${hours.toString().padStart(2, "0")}:${minutes
                                          .toString()
                                          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

                                        const updateWorkLogSql = `UPDATE worklog SET spendtime = '${theSpendTime}' WHERE id = ${result.insertId}`;
                                        db.query(updateWorkLogSql, (err, result) => {
                                          if (err) {
                                            console.log({ isSuccess: false, result: err });
                                          } else {
                                            console.log({
                                              isSuccess: "success",
                                              result: "success",
                                            });
                                            res.send({
                                              isSuccess: "success",
                                              result: "success",
                                            });
                                          }
                                        });
                                      }
                                    });
                                  });
                                };

                                uploadEnquiryWorklog();

                                if (enquiryId) {
                                  const messagePayloads = {
                                    enquiryId: enquiryId,
                                  };
                                  instantEnquiryMessage(messagePayloads);
                                }
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
    console.log({ isSuccess: false, result: "error" });
    res.send({ isSuccess: false, result: "error" });
  }
});



//===========Add Detail Enquiry through Application=============//
router.post("/set-new-detail-enquiry", tokenCheck, async (req, res) => {
  console.log(">>>>>/set-new-detail-enquiry", req.body);
  try {
    const {
      phone_number,
      first_name,
      last_name,
      whatsapp_number,
      visitReason,
      company_name,
      branchId,
      taluka,
      village,
      deliveryDate,
      make,
      modal,
      maker,
      modalName,
      variantName,
      year,
      condition_of,
      enquiryPrimarySource,
      sourceOfEnquiry,
      old_tractor,
      category,
    } = req.body;

    const user_Id = req.myData.userId;

    const getSSP = (callback) => {
      const userID = req.myData.userId;
      const sql = `SELECT CONCAT(u.first_name, ' ', u.last_name) AS full_name FROM users AS u WHERE u.id = ${userID}`;
      db.query(sql, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
        } else {
          const fullName = result[0].full_name;
          callback(fullName);
        }
      });
    };

    const salePersonSql = `CALL sp_get_user_sale_person(${village}, ${category})`;
    await db.query(salePersonSql, async (err, salePersonDetails) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        const userData = salePersonDetails[0][0];
        const salesperson_id = userData ? userData.userId : null;

        let taskStartTime = new Date();
        const fastSql = `INSERT INTO customers (first_name, last_name, phone_number, whatsapp_number, state, district, taluka, village) VALUES (?,?,?,?,?,?,?,?)`;
        await db.query(
          fastSql,
          [
            first_name,
            last_name,
            phone_number,
            whatsapp_number,
            stateId,
            districtId,
            taluka,
            village,
          ],
          async (err, fastEnquiry) => {
            if (err) {
              console.log({ isSuccess: false, result: err });
              res.send({ isSuccess: false, result: "error" });
            } else {
              console.log({ isSuccess: true, result: "success" });

              const customer_id = fastEnquiry.insertId;
              const enquiryDate = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

              let cdate = moment().format("YYYY-MM-DD H:m:s");
              const enquirySql = `INSERT INTO enquiries (branch_id, enquiry_category_id, salesperson_id, customer_id, primary_source_id, enquiry_source_id, visitReason, modal_id, date, delivery_date, user_created, company_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
              await db.query(
                enquirySql,
                [
                  branchId,
                  category,
                  salesperson_id ? salesperson_id : null,
                  customer_id,
                  enquiryPrimarySource,
                  sourceOfEnquiry,
                  visitReason,
                  modal,
                  cdate,
                  deliveryDate,
                  user_Id,
                  company_name,
                ],
                async (err, enquiryResult) => {
                  if (err) {
                    console.log({ isSuccess: false, result: err });
                    res.send({ isSuccess: false, result: "error" });
                  } else if (enquiryResult && enquiryResult.insertId) {
                    console.log({
                      isSuccess: "success",
                      result: enquirySql,
                    });
                    const enquiryId = enquiryResult.insertId;
                    const enquiryProductSql = `INSERT INTO enquiry_products (enquiry_id, manufacturer, modal) VALUES (?,?,?)`;
                    await db.query(
                      enquiryProductSql,
                      [enquiryId, make, modal],
                      async (err, productResult) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log({
                            isSuccess: "success",
                            result: enquiryProductSql,
                          });
                          const urlSql =
                            old_tractor === "Yes"
                              ? `INSERT INTO manufactur_details (enquiry_id, maker, modalName, variantName, year_of_manufactur, condition_of, old_tractor) VALUES(?, ?, ?, ?, ?, ?, ?)`
                              : `INSERT INTO manufactur_details (enquiry_id, old_tractor) VALUES(?,?)`;

                          const urlValues =
                            old_tractor === "Yes"
                              ? [
                                enquiryId,
                                maker,
                                modalName,
                                variantName,
                                year,
                                condition_of,
                                old_tractor,
                              ]
                              : [enquiryId, old_tractor];

                          await db.query(urlSql, urlValues, (err, result) => {
                            if (err) {
                              console.log(err);
                            } else {
                              console.log({
                                isSuccess: "success",
                                result: urlSql,
                              });
                              res.send({
                                isSuccess: "success",
                                result: "success",
                              });
                              const uploadEnquiryWorklog = () => {
                                getSSP((salesperson) => {
                                  console.log(salesperson, "salesperson");
                                  let workDescription = `For Enquiry ${first_name} which phone ${phone_number} by ${salesperson}`;
                                  let tasktype = 1;
                                  let task = 11;
                                  let cdate = moment().format("YYYY-MM-DD H:m:s");
                                  let taskEndTime = new Date();
                                  let spendTime = taskEndTime - taskStartTime;
                                  let spendTimeSeconds = Math.floor(spendTime / 1000);
                                  let hours = Math.floor(spendTimeSeconds / 3600);
                                  let minutes = Math.floor((spendTimeSeconds % 3600) / 60);
                                  let seconds = spendTimeSeconds % 60;
                                  let theSpendTime = `${hours.toString().padStart(2, "0")}:${minutes
                                    .toString()
                                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                                  console.log(theSpendTime, "spendTime");

                                  let userID = req.myData.userId;
                                  const workLogSql = `INSERT INTO worklog (user_id, tasktype, task, work_description, datetime, spendtime) VALUES('${userID}','${tasktype}','${task}','${workDescription}','${cdate}','${theSpendTime}')`;
                                  db.query(workLogSql, async (err, result) => {
                                    if (err) {
                                      console.log({ isSuccess: false, result: err });
                                    } else {
                                      console.log({
                                        isSuccess: "success",
                                        result: "success",
                                      });
                                    }
                                  });
                                });
                              };

                              uploadEnquiryWorklog();
                              if (enquiryId) {
                                const messagePayloads = {
                                  enquiryId: enquiryId,
                                };
                                instantEnquiryMessage(messagePayloads);
                              }
                            }
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
    console.log({ isSuccess: false, result: "error" });
    // res.send({ isSuccess: false, result: "error" });
  }
});


//===========Edit Detail Enquiry through Application=============//
router.post("/edit-new-detail-enquiry", tokenCheck, async (req, res) => {
  console.log(">>>>>/edit-new-detail-enquiry", req.body);
  try {
    const first_name = req.body.first_name || null;
    const last_name = req.body.last_name || null;
    const phone_number = req.body.phone_number || null;
    const whatsapp_number = req.body.whatsapp_number || null;

    const branch_id = req.body.branchId || null;
    const salesperson_id = req.body.sales_person;

    const taluka = req.body.taluka || null;
    const village = req.body.village || null;

    const deliveryDate = req.body.deliveryDate || null;
    const manufacturer = req.body.manufacturer || null;
    const make = req.body.make || null;
    const modal = req.body.modal || none;
    const variant = req.body.variant || null;

    const maker = req.body.maker || null;
    const modalName = req.body.modalName || null;
    const variantName = req.body.variantName || null;
    const year = req.body.year || null;
    const condition_of = req.body.condition_of || null;
    const sourceOfEnquiry = req.body.sourceOfEnquiry || null;
    const customer_id = req.body.customer_id || null;
    const old_tractor = req.body.old_tractor || null;

    const fastSql = `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ?, whatsapp_number = ?, taluka = ?, village = ? WHERE id = ${customer_id}`;
    await db.query(
      fastSql,
      [first_name, last_name, phone_number, whatsapp_number, taluka, village],
      async (err, fastEnquiry) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: "success" });
          // res.send({ isSuccess: true, result: fastEnquiry });
          // const customer_id = fastEnquiry.insertId;
          await db.query(
            `SELECT id FROM enquiries WHERE customer_id = ${customer_id}`,
            async (err, idResult) => {
              if (err) {
                console.log({ isSuccess: false, result: err });
                res.send({ isSuccess: false, result: err });
              } else {
                console.log({ isSuccess: false, result: idResult });
                const enquiry_id = idResult[0].id;
                const enquiryDate = new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");
                console.log(enquiryDate);
                const enquirySql = `UPDATE enquiries SET branch_id = ?, salesperson_id = ?, customer_id = ?, modal_id = ?, delivery_date = ?, enquiry_source_id = ? WHERE id = ${enquiry_id}`;
                await db.query(
                  enquirySql,
                  [
                    branch_id,
                    salesperson_id,
                    customer_id,
                    modal,
                    deliveryDate,
                    sourceOfEnquiry,
                  ],
                  async (err, enquiryResult) => {
                    if (err) {
                      console.log({ isSuccess: false, result: err });
                      res.send({ isSuccess: false, result: "error" });
                    } else if (enquiryResult) {
                      console.log({ isSuccess: "success", result: enquirySql });
                      const enquiryProductSql = `UPDATE enquiry_products SET manufacturer = ?, modal = ?, variant = ? WHERE enquiry_id = ${enquiry_id}`;
                      await db.query(
                        enquiryProductSql,
                        [make, modal, variant],
                        async (err, productResult) => {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log({
                              isSuccess: "success",
                              result: enquiryProductSql,
                            });
                            if (old_tractor === "Yes") {
                              const urlSql = `UPDATE manufactur_details SET maker = ?, modalName = ?, variantName = ?, year_of_manufactur = ?, condition_of = ?, old_tractor = ? WHERE enquiry_id = ${enquiry_id}`;
                              await db.query(
                                urlSql,
                                [
                                  maker,
                                  modalName,
                                  variantName,
                                  year,
                                  condition_of,
                                  old_tractor,
                                ],
                                (err, result) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    console.log({
                                      isSuccess: "success",
                                      result: urlSql,
                                    });
                                    res.send({
                                      isSuccess: "success",
                                      result: "Enquiry Updated",
                                    });
                                  }
                                }
                              );
                            } else if (old_tractor === "No") {
                              const urlSql = `UPDATE manufactur_details SET old_tractor = ? WHERE enquiry_id = ${enquiry_id}`;
                              await db.query(
                                urlSql,
                                [old_tractor],
                                (err, result) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    console.log({
                                      isSuccess: "success",
                                      result: urlSql,
                                    });
                                    res.send({
                                      isSuccess: "success",
                                      result: "Enquiry Updated",
                                    });
                                  }
                                }
                              );
                            } else {
                              res.send({
                                isSuccess: "success",
                                result: "Enquiry Updated",
                              });
                            }
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
    console.log({ isSuccess: false, result: "error" });
    // res.send({ isSuccess: false, result: "error" });
  }
});

//=======================Add Follow Up==================//
router.post("/set-follow-up", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>/set-follow-up", req.body);

  try {
    const { last_discussion, next_followup_date, customer_id, isRowIndex } =
      req.body;

    // First, fetch the enquiry ID
    const enquiryIdResult = await new Promise((resolve, reject) => {
      db.query(
        `SELECT id FROM enquiries WHERE customer_id = ${customer_id}`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (enquiryIdResult.length === 0) {
      console.log({ isSuccess: false, error: "Enquiry not found" });
      return res
        .status(400)
        .send({ isSuccess: false, error: "Enquiry not found" });
    }

    const enquiry_id = enquiryIdResult[0].id;
    const followup_date = new Date().toISOString().split("T")[0];
    const nextFollowupDate = new Date(next_followup_date)
      .toISOString()
      .split("T")[0];

    const followUpSql = `INSERT INTO follow_up_details (customer_id, enquiry_id, last_discussion, followup_date, next_followup_date) VALUES (?, ?, ?, ?, ?)`;
    const followUpValues = [
      customer_id,
      enquiry_id,
      last_discussion,
      followup_date,
      nextFollowupDate,
    ];

    // Insert follow-up details
    await new Promise((resolve, reject) => {
      db.query(followUpSql, followUpValues, (err, followUpResult) => {
        if (err) {
          reject(err);
        } else {
          resolve(followUpResult);
        }
      });
    });

    if (isRowIndex) {
      const { workDescription, spendTime, taskId, tasktype, task } = req.body;
      const userId = req.myData.userId;

      const workLogSql = `INSERT INTO worklog (user_id, tasktype, task, work_description, datetime, spendtime) VALUES (?, ?, ?, ?, ?, ?)`;
      const workLogValues = [
        userId,
        tasktype || 1,
        task || 1,
        workDescription,
        new Date(),
        spendTime,
      ];

      // Insert work log
      await new Promise((resolve, reject) => {
        db.query(workLogSql, workLogValues, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    console.log({ isSuccess: true, result: "success" });
    res.send({ isSuccess: true, result: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ isSuccess: false, error: "Internal server error" });
  }
});

//======================Get Follow Up===========//
router.get("/get-follow-up/:id", tokenCheck, async (req, res) => {
  try {
    const customer_id = req.params.id;
    console.log(">>>>>>>>>/get-follow-up", req.params);
    await db.query(
      `SELECT * FROM follow_up_details WHERE customer_id = ${customer_id}  ORDER BY followup_date DESC`,
      async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: result });
          res.send({ isSuccess: true, result: result });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//===================Invalidate Or Close Enquiry===================//
router.post("/close-enquiry/:id", tokenCheck, async (req, res) => {
  console.log("/close-enquiry/:id>>>>>>>>>>>", req.body);
  try {
    const customer_id = req.params.id;
    const { reason, enquiry_stage } = req.body;
    console.log(reason, enquiry_stage);
    const closeEnquirySql = `UPDATE enquiries SET enquiry_stage = ?, enquiry_remarks = ? WHERE customer_id = ${customer_id}`;
    await db.query(closeEnquirySql, [enquiry_stage, reason], (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.send({ isSuccess: true, result: result });
      }
    });
  } catch (err) {
    console.log({ isSuccess: false, result: err });
  }
});

//======================Get Commercial Reason=================//
router.get("/get-commercial-reasonsList", tokenCheck, async (req, res) => {
  try {
    const customer_id = req.params.id;
    console.log(">>>>>>>>>/get-commercial-reasonsList");
    await db.query(
      `SELECT * FROM enquiry_lost_reasons`,
      async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: result });
          res.send({ isSuccess: true, result: result });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//===================Set Lost Enquiry===================//
router.post("/set-lost-enquiry/:id", tokenCheck, async (req, res) => {
  console.log("/set-lost-enquiry/:id>>>>>>>>>>>", req.body);
  try {
    const {
      manufacturer,
      modal,
      variant,
      commercialReason,
      nonCommercialReason,
      enquiryLostDate,
    } = req.body;
    const customer_id = req.params.id;
    const setEnquiryStage = async () => {
      const enquiry_stage = "LOST";
      const stageSql = `UPDATE enquiries SET enquiry_stage = ? WHERE customer_id = ${customer_id}`;
      await db.query(stageSql, [enquiry_stage], (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: stageSql });
          console.log({ isSuccess: true, result: "Enquiry stage updated" });
          // res.send({ isSuccess: true, result: result });
        }
      });
    };
    await db.query(
      `SELECT id FROM enquiries WHERE customer_id = ${customer_id}`,
      async (err, enquiryResult) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: enquiryResult });
          // res.send({ isSuccess: true, result: result });
          const enquiry_id = enquiryResult[0].id;
          console.log(enquiry_id);
          const lostEnquirySql = `INSERT INTO lost_enquiries (customer_id, enquiry_id, maker, modal, variant, commercial_reason_1, non_commercial_reason_2, lost_date) VALUES (?,?,?,?,?,?,?,?)`;
          await db.query(
            lostEnquirySql,
            [
              customer_id,
              enquiry_id,
              manufacturer,
              modal,
              variant || none,
              commercialReason,
              nonCommercialReason,
              new Date(enquiryLostDate)
                .toISOString()
                .slice(0, 19)
                .replace("T", " "), // Format the date as "YYYY-MM-DD HH:MM:SS"
            ],
            (err, result) => {
              if (err) {
                console.log({ isSuccess: false, result: err });
                res.send({ isSuccess: false, result: "error" });
              } else {
                console.log({ isSuccess: true, result: result });
                setEnquiryStage();
                res.send({ isSuccess: true, result: result });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log({ isSuccess: false, result: err });
  }
});

//=================Get Old Tractor Data============//
router.get("/get-old-tractor-data/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>/get-old-tractor-data/");
  try {
    const customer_id = req.params.id;
    console.log(customer_id);
    const urlNew = `SELECT * FROM manufactur_details WHERE enquiry_id = (SELECT id FROM enquiries WHERE customer_id = ${customer_id})`;
    await db.query(urlNew, (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.send({ isSuccess: true, result: result });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//=================Get Enquiry Location List============//

//===================Set New Booking===================//
router.post("/set-new-booking/:id", tokenCheck, async (req, res) => {
  console.log("/set-new-booking>>>>>>>>>>>", req.body);
  try {
    const {
      phone_number,
      modal,
      variant,
      chassis_no,
      mode_of_finance,
      bank_name,
      deliveryDate,
      retailDate,
      selectedOption,
      maker,
      modalName,
      variantName,
      manuYearDate,
      tractorCondtion,
      purchasePrice,
      marketPrice,
      oldChassisNo,
    } = req.body;
    const customer_id = req.params.id;

    const setEnquiryStage = async () => {
      const enquiry_stage = "DELIVERY";
      const stageSql = `UPDATE enquiries SET enquiry_stage = ? WHERE customer_id = ?`;
      await db.query(stageSql, [enquiry_stage, customer_id], (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: stageSql });
          console.log({ isSuccess: true, result: "Enquiry stage updated" });
        }
      });
    };

    await db.query(
      `SELECT id FROM enquiries WHERE customer_id = ?`,
      [customer_id],
      async (err, enquiryResult) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: enquiryResult });
          const enquiry_id = enquiryResult[0].id;

          const formattedDeliveryDate = new Date(deliveryDate)
            .toISOString()
            .split("T")[0];
          const formattedRetailDate = new Date(retailDate)
            .toISOString()
            .split("T")[0];
          const currentDate = new Date().toISOString().split("T")[0];

          const bookingEnquirySql = `INSERT INTO booking (customer_id, enquiry_id, phone_number, modal, variant, chassis_no, mode_of_finance, bank_name, booking_date, delivery_date, retail_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

          await db.query(
            bookingEnquirySql,
            [
              customer_id,
              enquiry_id,
              phone_number,
              modal,
              variant,
              chassis_no,
              mode_of_finance,
              bank_name,
              currentDate, // Use the current date here
              formattedDeliveryDate,
              formattedRetailDate,
            ],
            async (err, result) => {
              if (err) {
                console.log({ isSuccess: false, result: err });
                res.send({ isSuccess: false, result: "error" });
              } else {
                console.log({ isSuccess: true, result: result });
                if (selectedOption === "Exchange Yes") {
                  const oldTractorSql = `INSERT INTO old_tractor_details (customer_id, enquiry_id, maker, modal, variant, manufactur_year, tractor_condition, dealer_purcahse_price, market_price, old_tractor_chassis_no) VALUES (?,?,?,?,?,?,?,?,?,?)`;
                  await db.query(
                    oldTractorSql,
                    [
                      customer_id,
                      enquiry_id,
                      maker,
                      modalName,
                      variantName,
                      manuYearDate,
                      tractorCondtion,
                      purchasePrice,
                      marketPrice,
                      oldChassisNo,
                    ],
                    (err, exchangeResult) => {
                      if (err) {
                        console.log({ isSuccess: false, result: err });
                        res.send({ isSuccess: false, result: "error" });
                      } else {
                        console.log({ isSuccess: true, result: oldTractorSql });
                        setEnquiryStage();
                        res.send({
                          isSuccess: true,
                          result: "Booking Successfully",
                        });
                      }
                    }
                  );
                } else {
                  console.log({ isSuccess: true, result: bookingEnquirySql });
                  setEnquiryStage();
                  res.send({ isSuccess: true, result: "Booking Successfully" });
                }
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log({ isSuccess: false, result: err });
    res.send({ isSuccess: false, result: "error" });
  }
});

//=============Get Area DSP================//
router.get("/get-area-sale-person/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>>>/get-area-sale-person/:id", req.params.id);
  try {
    const userId = req.params.id;
    const urlNew = `SELECT * FROM area_assign_user WHERE user_id = ${userId}`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: urlNew });
        res.send({ isSuccess: true, result: result });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//==============Get Delivery List===============//
router.get("/get-delivery-list", tokenCheck, async (req, res) => {
  console.log(">>>>>>>/get-delivery-list");
  try {
    // const userId = req.params.id;
    const urlNew = `CALL sp_get_delivery_list()`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: urlNew });
        res.send({ isSuccess: true, result: result });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//====================Get enquiries List By Sales Person==================//
router.get("/get-enquiries-by-salesperson", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>/get-enquiries-by-salesperson", req.myData);
  let branchId = req.myData.branchId;
  let isSuperAdmin = req.myData.isSuperAdmin;
  let userId = req.myData.userId;
  const urlNew = `CALL sp_get_followed_enquiry(${branchId},${isSuperAdmin}, ${userId})`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: urlNew });
      res.send({ isSuccess: "success", result: result[0] });
    }
  });
});

//====================Get enquiries by enquiry Type Or category==================//
router.get(
  "/get-enquiries-by-enquiry-category/:id",
  tokenCheck,
  async (req, res) => {
    try {
      const categoryId = req.params.id;
      const urlNew = `SELECT * FROM enquiries where enquiry_category_id = ${categoryId}`;
      await db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: "success", result: urlNew });
          res.send({ isSuccess: "success", result: result });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);

//====================Get enquiries by village==================//
router.post("/get-enquiry-by-village", tokenCheck, async (req, res) => {
  console.log("/get-enquiry-by-village?????????", req.body);
  try {
    const { villageId, categoryId } = req.body;
    const urlNew = `CALL sp_get_enquiry_list_by_village(${villageId}, ${categoryId})`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: urlNew });
        res.send({ isSuccess: "success", result: result });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//========================Get CurrentDate Enquiry List======================//
router.get("/get-current-date-enquiries", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>>>>>/get-current-date-enquiries", req.myData);
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    const urlNew = `CALL sp_get_todays_enquiry_list(${branchId}, ${isSuperAdmin}, ${userId})`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: urlNew });
        res.send({ isSuccess: "success", result: result[0] });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//========================Get Last Month Enquiry List======================//
router.get("/get-last-month-enquiries", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>>>>>/get-last-month-enquiries", req.myData);
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    const urlNew = `CALL sp_get_last_month_enquiry_list(${branchId}, ${isSuperAdmin}, ${userId})`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: urlNew });
        res.send({ isSuccess: "success", result: result[0] });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//========================Get New (Not Followed) Enquiry List======================//
router.get(
  "/get-new-enquiries-list/:categoryId",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>>>>>/get-new-enquiries-list", req.myData);
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    let categoryId = req.params.categoryId;
    const urlNew = `CALL sp_get_new_enquiry_list(${branchId}, ${isSuperAdmin}, ${userId}, ${categoryId})`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: urlNew });
        res.send({ isSuccess: "success", result: result[0] });
      }
    });
  }
);
//====================get total new enquiry count================
router.get(
  "/get-total-new-enquiry-count/:categoryId",
  tokenCheck,
  async (req, res) => {
    try {
      console.log(">>>>>>>>>/get-total-new-enquiry-count");
      let isSuperAdmin = req.myData.isSuperAdmin;
      let categoryId = req.params.categoryId;
      let userId = req.myData.userId;
      const urlNew = `CALL sp_get_new_enquiry_list_total_count(${isSuperAdmin}, ${userId},${categoryId})`;
      await db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: "success", result: urlNew });
          console.log({ isSuccess: "success", result: result[0] });
          res.send({ isSuccess: "success", result: result[0] });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);
//====================get hot enquiry-list-total=================
router.get(
  "/get-total-hot-enquiry-count/:categoryId",
  tokenCheck,
  async (req, res) => {
    try {
      console.log(">>>>>>>>>/get-total-hot-enquiry-count");
      let isSuperAdmin = req.myData.isSuperAdmin;
      let categoryId = req.params.categoryId;
      let userId = req.myData.userId;
      const urlNew = `CALL sp_get_hot_enquiry_list_total_count(${isSuperAdmin}, ${userId},${categoryId})`;
      await db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: "success", result: urlNew });
          console.log({ isSuccess: "success", result: result[0] });
          res.send({ isSuccess: "success", result: result[0] });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);
//====================get cold enquiry-list-total================
router.get(
  "/get-total-cold-enquiry-count/:categoryId",
  tokenCheck,
  async (req, res) => {
    try {
      console.log(">>>>>>>>>/get-total-cold-enquiry-count");
      let isSuperAdmin = req.myData.isSuperAdmin;
      let categoryId = req.params.categoryId;
      let userId = req.myData.userId;
      const urlNew = `CALL sp_get_cold_enquiry_list_total_count(${isSuperAdmin}, ${userId},${categoryId})`;
      await db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: "success", result: urlNew });
          console.log({ isSuccess: "success", result: result[0] });
          res.send({ isSuccess: "success", result: result[0] });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);

//====================get warm enquiry-list-total================
router.get(
  "/get-total-warm-enquiry-count/:categoryId",
  tokenCheck,
  async (req, res) => {
    try {
      console.log(">>>>>>>>>/get-total-warm-enquiry-count");
      let isSuperAdmin = req.myData.isSuperAdmin;
      let categoryId = req.params.categoryId;
      let userId = req.myData.userId;
      const urlNew = `CALL sp_get_warm_enquiry_list_total_count(${isSuperAdmin}, ${userId},${categoryId})`;
      await db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: "success", result: urlNew });
          console.log({ isSuccess: "success", result: result[0] });
          res.send({ isSuccess: "success", result: result[0] });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);
//====================get total user created enquiry list total==
router.get(
  "/get-total-user-created-enquiry-count/:categoryId",
  tokenCheck,
  async (req, res) => {
    try {
      console.log(">>>>>>>>>/get-total-warm-enquiry-count");
      let isSuperAdmin = req.myData.isSuperAdmin;
      let categoryId = req.params.categoryId;
      let userId = req.myData.userId;
      const urlNew = `CALL sp_get_user_created_enquiry_list_total_count(${userId},${categoryId})`;
      await db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: "success", result: urlNew });
          console.log({ isSuccess: "success", result: result[0] });
          res.send({ isSuccess: "success", result: result[0] });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);
//====================get total enquiry-booking==================
router.get("/get-total-enquiry-booking", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>>>>>/get-total-enquiry-booking");
    const urlNew = `CALL sp_get_total_enquiry_booking()`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: urlNew });
        res.send({ isSuccess: "success", result: result[0] });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
router.get("/get-todays-enquiry-booking", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>>>>>/get-total-enquiry-booking");
    const urlNew = `CALL sp_get_todays_enquiry_bookin_count()`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: urlNew });
        res.send({ isSuccess: "success", result: result[0] });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/delete-enquiry/:id", tokenCheck, async (req, res) => {
  try {
    const customerId = req.params.id;
    console.log(customerId, "Customer ID");

    // Check if the customer exists
    const checkCustomerQuery = `SELECT * FROM customers WHERE  id = ${customerId}`;
    db.query(checkCustomerQuery, async (err, customerResult) => {
      if (err) {
        console.error(err);
        res.status(500).json({ isSuccess: false, result: "error" });
      } else if (customerResult.length === 1) {
        // Customer exists, mark it as deleted
        const deleteCustomerQuery = `UPDATE customers SET is_active = 0 WHERE id = ${customerId}`;
        db.query(
          deleteCustomerQuery,
          [customerId],
          async (err, deleteResult) => {
            if (err) {
              console.error(err);
              res.status(500).json({ isSuccess: false, result: "error" });
            } else {
              console.log({ isSuccess: true, result: deleteCustomerQuery });
              res.send({ isSuccess: true, result: "Success" });
            }
          }
        );
      }
      // else {
      //   // Customer does not exist
      //   console.log("Customer not found");
      //   res.status(404).json({ isSuccess: false, result: "notExist" });
      // }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

//==================get edit Enquiry Data====================//
router.get(
  "/get-edit-enquiry-data/:customerId",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>/get-tasks-list");
    console.log(req.params, "req**************8");
    const customerId = req.params.customerId;
    const url = `SELECT c.*, e.*,m.*,p.*
                 FROM enquiries AS e
                 LEFT JOIN customers AS c ON c.id = e.customer_id
                 LEFT JOIN manufactur_details AS m ON  m.enquiry_id = e.id
                 LEFT JOIN enquiry_products AS p ON  p.enquiry_id = e.id
                 WHERE e.customer_id = ${customerId}
                 `;

    try {
      await db.query(url, async (err, result) => {
        if (err) {
          console.log({ isSuccess: true, result: err });
          res.send({ isSuccess: true, result: "error" });
        } else {
          console.log({ isSuccess: true, result: url });
          res.send({ isSuccess: true, result: result[0] });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);

//=================get Old Product Details=================//
router.get(
  "/get-old-product-details/:enquiryId",
  tokenCheck,
  async (req, res) => {
    console.log(
      ">>>>>>/get-old-product-details/:enquiryId",
      req.params.enquiryId
    );
    const enquiryId = req.params.enquiryId;
    const newSqlQuery = `SELECT * FROM manufactur_details WHERE enquiry_id = ${enquiryId}`;
    db.query(newSqlQuery, (err, newSqlResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: newSqlQuery });
        res.send({ isSuccess: true, result: newSqlResult });
      }
    });
  }
);

//==================For Enquiry Sources===================//

router.post("/add-primary-sources", tokenCheck, async (req, res) => {
  console.log(">>>>>/add-primary-sources");
  const enquirySourceName = req.body.enquirySourcesName;
  const enquirySourceDiscription = req.body.enquirySourcesDescription;
  console.log(enquirySourceName, enquirySourceDiscription);
  var esourceNamespace = enquirySourceName.trim(" ");
  const firstLetter = esourceNamespace.charAt(0).toUpperCase();
  var capitalFirstLetter = firstLetter + esourceNamespace.slice(1);
  const newUrl =
    "SELECT * FROM enquiry_primary_sources WHERE name ='" +
    capitalFirstLetter +
    "'";
  await db.query(newUrl, async (err, newResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else if (newResult.length === 0) {
      const url = `INSERT INTO enquiry_primary_sources (name, description) VALUES('${capitalFirstLetter}', '${enquirySourceDiscription}')`;
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
router.get("/get-primary-source", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-primary-source");
  try {
    await db.query("SELECT * FROM enquiry_primary_sources", (err, results) => {
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

router.post("/addenquirysources", tokenCheck, async (req, res) => {
  console.log(">>>>>addenquirysources");
  try {
    const { sourcesName, primarySourcesId } = req.body;

    const url =
      "INSERT INTO enquiry_sources (name, primary_source_id) VALUES (?, ?)";

    await db.query(
      url,
      [sourcesName, primarySourcesId],
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
router.post("/deletenquirysources", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>deletenquirysources");
    const { primarySourcesId } = req.body;
    const deleteEnquirysourcesSql = `DELETE FROM enquiry_sources WHERE primary_source_id = ${primarySourcesId}`;
    await db.query(
      deleteEnquirysourcesSql,
      [primarySourcesId],
      async (err, results) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: results });
          // res.send({ isSuccess: true, result: results });
          const deleteEnquirySql = `DELETE FROM enquiry_primary_sources WHERE id= ${primarySourcesId}`;
          await db.query(
            deleteEnquirySql,
            [primarySourcesId],
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
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//=================Upload The Work Log=================//
router.post("/upload-work-log", tokenCheck, async (req, res) => {
  console.log(">>>>>/upload-work-log", req.body);
  try {
    const { workDescription, spendTime, taskId } = req.body;
    const userId = req.myData.userId;
    const url = `SELECT * FROM addtask_data where employee = ${userId} and task = ${taskId}`;
    await db.query(url, async (err, results) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: results });
        // res.send({ isSuccess: true, result: results });
        if (results.length > 0) {
          const tasktype = results[0].tasktype;
          const task = results[0].task;
          const workLogSql = `INSERT INTO worklog (user_id, tasktype, task, work_description, datetime, spendtime) VALUES(?,?,?,?,?,?)`;
          await db.query(
            workLogSql,
            [
              userId,
              tasktype || 1,
              task || 1,
              workDescription,
              new Date(),
              spendTime,
            ],
            async (err, result) => {
              if (err) {
                console.log({ isSuccess: false, result: err });
                res.send({ isSuccess: false, result: "error" });
              } else {
                console.log({ isSuccess: true, result: workLogSql });
                res.send({ isSuccess: true, result: "success" });
              }
            }
          );
        } else {
          res.send({ isSuccess: true, result: "Task Not Assigned" });
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get(
  "/get-enquiry-mobile-number-exist/:mobileno/:categoryId",
  tokenCheck,
  async (req, res) => {
    console.log("/get-enquiry-mobile-number-exist?????????", req.params);
    try {
      const mobileno = req.params.mobileno;
      const categoryId = req.params.categoryId;

      const urlNew = `CALL sp_check_enquiry_mobile_number_exist(${mobileno}, ${categoryId})`;
      await db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          // console.log({ isSuccess: "success", result: result });
          // res.send({ isSuccess: "success", result: result });
          const isMobileNumberExist = (result) => {
            console.log(result, "kd");
            if (
              result &&
              result[0] &&
              result[0][0] &&
              result[0][0].phone_number
            ) {
              return true;
            } else {
              return false;
            }
          };
          const isPhoneNumber = isMobileNumberExist(result);
          if (isPhoneNumber) {
            console.log(isPhoneNumber, "dssss");
            // console.log({ isSuccess: "success", result: result });
            res.send({ isSuccess: "success", result: true });
          } else {
            console.log(isPhoneNumber, "else");
            // console.log({ isSuccess: "success", result: result });
            res.send({ isSuccess: "success", result: false });
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);

//================================get Works=================================//
router.get(
  "/getworks/:employeeId/:taskId/:indexNo",
  tokenCheck,
  async (req, res) => {
    try {
      console.log("/getworks/:employeeId/:taskId/:indexNo", req.params);
      const employeeId = req.params.employeeId || req.myData.userId;
      const taskId = req.params.taskId;
      const row_index = req.params.indexNo;
      let url = `CALL sp_get_works(${employeeId}, ${taskId}, ${row_index})`;
      await db.query(url, (err, results) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: results });
          res.send({ isSuccess: true, result: results[0] });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get("/update-enquiry-category/:id/:newCategory", async (req, res) => {
  console.log(">>>>>update-enquiry-category");
  const newCategory = req.params.newCategory;
  const id = req.params.id;
  sql = `UPDATE enquiries SET enquiry_category_id = ${newCategory} WHERE id = ${id};`;
  await db.query(sql, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result, result: err });
    } else {
      console.log({ isSuccess: true, result: sql });
      res.send({ isSuccess: true, result: "success" });
    }
  });
});
module.exports = router;
