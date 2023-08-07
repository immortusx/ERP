const async = require("async");
const express = require("express");
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");

const { db } = require("../Database/dbConfig");

const router = express.Router();

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
  const urlNew = `SELECT * FROM products WHERE manufacturer_id = (${req.params.id})`;
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

router.post("/set-new-enquiry-data", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>set-new-enquiry-data", req.body);

  const fristName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.fatherName;
  const phoneNumber = req.body.mobileNumber;
  const email = req.body.emailId;
  const isActive = 1;
  const state = req.body.state;
  const district = req.body.district;
  const taluka = req.body.tehsil;
  const block = req.body.block;
  const village = req.body.village;

  const maker = req.body.maker;
  const modalName = req.body.modalName;
  const variantName = req.body.variantName;
  const year = req.body.year;
  const condition_of = req.body.condition_of;

  const enquiryTypeId = "1";
  const visitReason = "1";
  const branchId = req.body.branchId;
  const dsp = req.body.dsp;
  const model = req.body.model;
  const enquiryDate = req.body.enquiryDate;
  const deliveryDate = req.body.deliveryDate;
  const sourceOfEnquiry = req.body.sourceOfEnquiry;

  const url = `INSERT INTO customers (first_name, middle_name, last_name, phone_number, email, is_active, state, district, taluka, block, village) VALUES ('${fristName}','${middleName}','${lastName}','${phoneNumber}','${email}','${isActive}','${state}','${district}','${taluka}','${block}','${village}')`;

  console.log("url", url);

  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else if (result && result.insertId) {
      const insertedId = result.insertId;

      const newEnquiryDate = await getDateInFormate(enquiryDate);
      const newDeliveryDate = await getDateInFormate(deliveryDate);

      const urlNew = `INSERT INTO enquiries (branch_id, enquiry_type_id, salesperson_id, customer_id, product_id, date, delivery_date, enquiry_source_id, visitReason) VALUES('${branchId}','${enquiryTypeId}','${dsp}','${insertedId}','${model}','${newEnquiryDate}','${newDeliveryDate}','${sourceOfEnquiry}','${visitReason}')`;
      await db.query(urlNew, async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else if (result && result.insertId) {
          console.log({ isSuccess: "success", result: urlNew });
          if (
            (maker &&
              modalName &&
              variantName &&
              year &&
              condition_of != null) ||
            undefined
          ) {
            const newYearOfManufactur = await getDateInFormate(year);
            const urlSql = `INSERT INTO manufactur_details (enquiry_id, maker, modalName, variantName, year_of_manufactur, condition_of) VALUES('${result.insertId}', '${maker}', '${modalName}', '${variantName}', '${newYearOfManufactur}', '${condition_of}')`;
            await db.query(urlSql, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send({ isSuccess: "success", result: "success" });
              }
            });
          } else {
            res.send({ isSuccess: "success", result: "success" });
          }
        }
      });
    }
  });
});
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

//===========Add Fast Enquiry through Application=============//
router.post("/set-new-fast-enquiry", tokenCheck, async (req, res) => {
  console.log(">>>>>/set-new-fast-enquiry", req.body);
  try {
    const first_name = req.body.first_name;
    const phone_number = req.body.phone_number;
    const whatsapp_number = req.body.whatsapp_number;
    const village = req.body.village;
    const taluka = req.body.taluka;

    const branch_id = req.body.branchId;
    const categoryId = 1;

    const salePersonSql = `CALL sp_get_user_sale_person(${village}, ${categoryId})`;
    await db.query(salePersonSql, async (err, salePersonDetails) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: salePersonSql });
        // res.send({ isSuccess: true, result: result });
        // console.log({ isSuccess: true, result: salePersonDetails });

        const userData = salePersonDetails[0][0];
        const salesperson_id = userData ? userData.userId : 20;
        console.log(salesperson_id, "userId");

        if (salesperson_id) {
          const fastSql = `INSERT INTO customers (first_name, phone_number, whatsapp_number, taluka, village) VALUES (?,?,?,?,?)`;
          await db.query(
            fastSql,
            [first_name, phone_number, whatsapp_number, taluka, village],
            async (err, fastEnquiry) => {
              if (err) {
                console.log({ isSuccess: false, result: err });
                res.send({ isSuccess: false, result: "error" });
              } else {
                console.log({ isSuccess: true, result: "success" });
                // res.send({ isSuccess: true, result: fastEnquiry });
                const customer_id = fastEnquiry.insertId;
                const enquiryDate = new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");
                console.log(enquiryDate);
                console.log(customer_id);
                const enquirySql = `INSERT INTO enquiries (branch_id, enquiry_type_id, salesperson_id, customer_id, date) VALUES (?,?,?,?)`;
                await db.query(
                  enquirySql,
                  [branch_id, categoryId, salesperson_id, customer_id, enquiryDate],
                  (err, enquiryResult) => {
                    if (err) {
                      console.log({ isSuccess: false, result: err });
                      res.send({ isSuccess: false, result: "error" });
                    } else {
                      console.log({ isSuccess: true, result: enquiryResult });
                      res.send({ isSuccess: true, result: "success" });
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  } catch (err) {
    console.log(err);
    console.log({ isSuccess: false, result: "error" });
    // res.send({ isSuccess: false, result: "error" });
  }
});

//===========Add Detail Enquiry through Application=============//
router.post("/set-new-detail-enquiry", tokenCheck, async (req, res) => {
  console.log(">>>>>/set-new-detail-enquiry", req.body);
  try {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const phone_number = req.body.phone_number;
    const whatsapp_number = req.body.whatsapp_number;

    const branch_id = req.body.branchId;

    const state = req.body.state;
    const district = req.body.district;
    const taluka = req.body.taluka;
    const village = req.body.village;

    const deliveryDate = req.body.deliveryDate;
    const manufacturer = req.body.manufacturer;
    const modal = req.body.modal;
    const variant = req.body.variant;

    const maker = req.body.maker;
    const modalName = req.body.modalName;
    const variantName = req.body.variantName;
    const year = req.body.year;
    const condition_of = req.body.condition_of;
    const sourceOfEnquiry = 26;
    const old_tractor = req.body.old_tractor;
    const categoryId = 1;

    const salePersonSql = `CALL sp_get_user_sale_person(${village}, ${categoryId})`;
    await db.query(salePersonSql, async (err, salePersonDetails) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: salePersonSql });
        // res.send({ isSuccess: true, result: result });
        // console.log({ isSuccess: true, result: salePersonDetails });

        const userData = salePersonDetails[0][0];
        const salesperson_id = userData ? userData.userId : 20;
        console.log(salesperson_id, "userId");

        if (salesperson_id) {
          const fastSql = `INSERT INTO customers (first_name, last_name, phone_number, whatsapp_number, state, district, taluka, village) VALUES (?,?,?,?,?,?,?,?)`;
          await db.query(
            fastSql,
            [
              first_name,
              last_name,
              phone_number,
              whatsapp_number,
              state,
              district,
              taluka,
              village,
            ],
            async (err, fastEnquiry) => {
              if (err) {
                console.log({ isSuccess: false, result: err });
                res.send({ isSuccess: false, result: "error" });
              } else {
                console.log({ isSuccess: true, result: "success" });
                // res.send({ isSuccess: true, result: fastEnquiry });
                const customer_id = fastEnquiry.insertId;
                const enquiryDate = new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");
                console.log(enquiryDate);
                console.log(customer_id);
                const enquirySql = `INSERT INTO enquiries (branch_id, enquiry_type_id, salesperson_id, customer_id, date, delivery_date, enquiry_source_id) VALUES (?,?,?,?,?,?,?)`;
                await db.query(
                  enquirySql,
                  [
                    branch_id,
                    categoryId,
                    salesperson_id,
                    customer_id,
                    new Date(),
                    deliveryDate,
                    sourceOfEnquiry,
                  ],
                  async (err, enquiryResult) => {
                    if (err) {
                      console.log({ isSuccess: false, result: err });
                      res.send({ isSuccess: false, result: "error" });
                    } else if (enquiryResult && enquiryResult.insertId) {
                      console.log({ isSuccess: "success", result: enquirySql });
                      const enquiryId = enquiryResult.insertId;
                      const enquiryProductSql = `INSERT INTO enquiry_products (enquiry_id, manufacturer, modal, variant) VALUES (?,?,?,?)`;
                      await db.query(
                        enquiryProductSql,
                        [enquiryId, manufacturer, modal, variant],
                        async (err, productResult) => {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log({
                              isSuccess: "success",
                              result: enquiryProductSql,
                            });
                            if (
                              maker &&
                              modalName &&
                              variantName &&
                              year &&
                              condition_of
                            ) {
                              const newYearOfManufactur =
                                await getDateInFormate(year);
                              const urlSql = `INSERT INTO manufactur_details (enquiry_id, maker, modalName, variantName, year_of_manufactur, condition_of, old_tractor) VALUES(?, ?, ?, ?, ?, ?, ?)`;
                              await db.query(
                                urlSql,
                                [
                                  enquiryId,
                                  maker,
                                  modalName,
                                  variantName,
                                  newYearOfManufactur,
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
        }
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
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const phone_number = req.body.phone_number;
    const whatsapp_number = req.body.whatsapp_number;

    const branch_id = req.body.branchId;
    const salesperson_id = 20;

    const state = req.body.state;
    const district = req.body.district;
    const taluka = req.body.taluka;
    const village = req.body.village;

    const deliveryDate = req.body.deliveryDate;
    const manufacturer = req.body.manufacturer;
    const modal = req.body.modal;
    const variant = req.body.variant;

    const maker = req.body.maker;
    const modalName = req.body.modalName;
    const variantName = req.body.variantName;
    const year = req.body.year;
    const condition_of = req.body.condition_of;
    const sourceOfEnquiry = req.body.sourceOfEnquiry;
    const customer_id = req.body.customer_id;
    const old_tractor = req.body.old_tractor;

    const fastSql = `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ?, whatsapp_number = ?, state = ?, district = ?, taluka = ?, village = ? WHERE id = ${customer_id}`;
    await db.query(
      fastSql,
      [
        first_name,
        last_name,
        phone_number,
        whatsapp_number,
        state,
        district,
        taluka,
        village,
      ],
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
                const enquirySql = `UPDATE enquiries SET branch_id = ?, salesperson_id = ?, customer_id = ?, date = ?, delivery_date = ?, enquiry_source_id = ? WHERE id = ${enquiry_id}`;
                await db.query(
                  enquirySql,
                  [
                    branch_id,
                    salesperson_id,
                    customer_id,
                    enquiryDate,
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
                        [manufacturer, modal, variant],
                        async (err, productResult) => {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log({
                              isSuccess: "success",
                              result: enquiryProductSql,
                            });
                            if (old_tractor === "Yes") {
                              const newYearOfManufactur =
                                await getDateInFormate(year);
                              const urlSql = `UPDATE manufactur_details SET maker = ?, modalName = ?, variantName = ?, year_of_manufactur = ?, condition_of = ?, old_tractor = ? WHERE enquiry_id = ${enquiry_id}`;
                              await db.query(
                                urlSql,
                                [
                                  maker,
                                  modalName,
                                  variantName,
                                  newYearOfManufactur,
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
                              const urlSql = `UPDATE manufactur_details SET maker = ?, modalName = ?, variantName = ?, year_of_manufactur = ?, condition_of = ?, old_tractor = ? WHERE enquiry_id = ${enquiry_id}`;
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
    const { last_discussion, next_followup_date, customer_id } = req.body;
    await db.query(
      `SELECT id FROM enquiries WHERE customer_id = ${customer_id}`,
      async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.status(500).send({ isSuccess: false, error: "Database error" });
        } else {
          console.log({ isSuccess: true, result: result });
          console.log(result[0].id);
          const enquiry_id = result[0].id;
          const followup_date = new Date().toISOString().split("T")[0];
          const followUpSql = `INSERT INTO follow_up_details (customer_id, enquiry_id, last_discussion, followup_date, next_followup_date) VALUES ('${customer_id}', '${enquiry_id}', '${last_discussion}', '${followup_date}', '${next_followup_date}')`;
          await db.query(followUpSql, async (err, followUpResult) => {
            if (err) {
              console.log({ isSuccess: false, result: err });
              res.status(500).send({ isSuccess: false, error: "error" });
            } else {
              console.log({ isSuccess: true, result: followUpResult });
              res.send({ isSuccess: true, result: "success" });
            }
          });
        }
      }
    );
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
              variant,
              commercialReason,
              nonCommercialReason,
              enquiryLostDate,
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
          const bookingEnquirySql = `INSERT INTO booking (customer_id, enquiry_id, phone_number, modal, variant, chassis_no, mode_of_finance, bank_name, delivery_date, retail_date) VALUES (?,?,?,?,?,?,?,?,?,?)`;
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
              deliveryDate,
              retailDate,
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
                          result: "Booking Succesfully",
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
  const urlNew = `CALL sp_get_enquiries_list_by_salesperson(${branchId},${isSuperAdmin}, ${userId})`;
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
      const urlNew = `SELECT * FROM enquiries where enquiry_type_id = ${categoryId}`;
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
    const {villageId, categoryId } = req.body;
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
    const urlNew = `CALL sp_get_todays_enquiry_list()`;
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
    const urlNew = `CALL sp_get_last_month_enquiry_list()`;
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
router.get("/get-new-enquiries-list", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>>>>>/get-new-enquiries-list", req.myData);
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    const urlNew = `CALL sp_get_new_enquiry_list()`;
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

module.exports = router;
