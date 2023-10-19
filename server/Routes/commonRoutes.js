const async = require("async");
const express = require("express");
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");

const { db } = require("../Database/dbConfig");

const router = express.Router();

router.get("/get-state-list", tokenCheck, async (req, res) => {
  console.log(">>>>>get-state-list");
  const url = `select * from state where is_active !='0'`;
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
router.get("/get-district-list/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>get-district-list");
  const id = req.params.id;
  const url = `SELECT * FROM district where state_id = ${id} and is_active= '1'`;
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
router.get("/get-taluka-list", tokenCheck, async (req, res) => {
  console.log(">>>>>get-taluka-list");
  const id = req.params.id;
  const url = `SELECT * FROM taluka where is_active= '1'`;
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
router.get("/get-taluka-list/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>get-taluka-list");
  const id = req.params.id;
  const url = `SELECT * FROM taluka where district_id = ${id} and is_active= '1'`;
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
router.get("/get-village-list/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>get-village-listbyid");
  const id = req.params.id;
  const url = `SELECT * FROM village where taluka_id = ${id} and is_active= '1'`;
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

//===========================For add Task======================================

router.get("/get-task_types-list", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-task_types-list");
  const id = req.params.id;
  const url = `SELECT * FROM task_types`;
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

router.get("/get-tasks-list/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-tasks-list");
  const id = req.params.id;
  console.log(id, "tasktypeid");
  const url = `SELECT * FROM tasks where tasktype_id=${id}`;
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

router.get("/get-tasktimeperiod-list", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-tasktimeperiod-list");
  const id = req.params.id;
  const url = `SELECT * FROM tasktime_period`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result, result: err });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});

router.get("/get-taskstatus-list", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-taskstatus-list");
  const id = req.params.id;
  const url = `SELECT * FROM task_status`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result, result: err });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});

router.post("/addholiday-data", tokenCheck, async (req, res) => {
  try {
    console.log("/addtask-data>>>>>>>>>>>>", req.body);
    const holidayname = req.body.holidayname;
    const description = req.body.description;

    const date = req.body.date.split("T")[0];

    const url = `INSERT INTO holiday_data (holidayname,holiday_date, description) VALUES (?,?,?)`;

    console.log("url", url);

    try {
      await db.query(url, [holidayname, date, description]);
      console.log({ isSuccess: true, result: "Task Add Successfully" });
    } catch (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
      return;
    }

    res.send({ isSuccess: true, result: "Task Add Successfully" });
  } catch (err) {
    console.log(err);
  }
});
router.post("/addtask-data", tokenCheck, async (req, res) => {
  try {
    console.log("/addtask-data>>>>>>>>>>>>", req.body);
    const employees = req.body.employees;
    const taskType = req.body.taskTypes;
    const tasks = req.body.tasks;
    const taskCount = req.body.taskCount;
    const tasktypePeriod = req.body.tasktimePeriod;
    const taskStatus = req.body.taskStatus;
    const taskCategory = req.body.taskCategory;
    const startDate = req.body.startDate.split("T")[0];
    const endDate = req.body.endDate.split("T")[0];

    const url = `INSERT INTO addtask_data (employee, tasktype, task, taskcount, startdate, enddate,tasktime_period,task_status,category_name) VALUES (?,?,?,?,?,?,?,?,?)`;

    console.log("url", url);

    for (const item of employees) {
      console.log(item, "item");

      try {
        await db.query(url, [
          item,
          taskType,
          tasks,
          taskCount,
          startDate,
          endDate,
          tasktypePeriod,
          taskStatus,
          taskCategory,
        ]);
        console.log({ isSuccess: true, result: "Task Add Successfully" });
      } catch (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
        return;
      }
    }

    res.send({ isSuccess: true, result: "Task Add Successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/get-task-list", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-task-list");
  const urlNew = `CALL sp_get_task_list()`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: result[0] });
      res.send({ isSuccess: "success", result: result[0] });
    }
  });
});

router.post("/set-task-edit/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>set-task-edit", req.body);
  try {
    const EmployeeId = req.params.id;
    const employees = req.body.employees;
    const taskType = req.body.taskTypes;
    const tasks = req.body.tasks;
    const taskCount = req.body.taskCount;
    const tasktypePeriod = req.body.tasktimePeriod;
    const taskStatus = req.body.taskStatus;
    const taskCategory = req.body.taskCategory;
    const startDate = req.body.startDate.split("T")[0];
    const endDate = req.body.endDate.split("T")[0];
    const newUrl = `UPDATE addtask_data SET employee = '${employees}', tasktype = '${taskType}', task = '${tasks}', taskcount = '${taskCount}', startdate = '${startDate}', enddate = '${endDate}', tasktime_period = ${tasktypePeriod}, task_status=${taskStatus}, category_name=${taskCategory} WHERE id = '${EmployeeId}'`;

    await db.query(newUrl, async (err, newResult) => {
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

router.get("/get-addtask/:id", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>get-addtask");
    const id = req.params.id;
    const query = "SELECT * FROM addtask_data WHERE id = ?";

    await db.query(query, [id], async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: "success" });
        res.status(200).json({ isSuccess: true, result: result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

router.get("/delete-taskassign/:id", async (req, res) => {
  try {
    console.log(">>>>> delete-taskassign");
    console.log("req.params", req.params.id);
    const id = req.params.id;
    await db.query(
      `DELETE FROM addtask_data WHERE id = ${id}`,
      async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: "Task Deleted" });
          res.send({ isSuccess: true, result: "success" });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    // res.status(500).send({ isSuccess: false, result: "Internal Server Error" });
  }
});
router.get("/update-taskstatus/:id/:newStatus", async (req, res) => {
  console.log(">>>>>update-taskstatus");
  const newStatus = req.params.newStatus;
  const id = req.params.id;
  sql = `UPDATE addtask_data SET task_status = ${newStatus} WHERE id = ${id};`;
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

//=====================Retrieve User Task List======================//
router.get("/get-user-task-list", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>/get-user-task-list", req.myData);
  const userId = req.myData.userId;
  let isAdmin = req.myData.isSuperAdmin;
  const urlNew = `CALL sp_get_user_task_list_by_user(${userId}, ${isAdmin})`;
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

//=====================Retrieve Assigned Sale Person===================//
router.get(
  "/retrieve-area-assigned-person/:category/:village",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>/retrieve-area-assigned-person");
    try {
      const CategoryId = req.params.category;
      const villageId = req.params.village;
      const url = `CALL sp_retrieve_sales_person(${villageId}, ${CategoryId})`;

      db.query(url, [villageId, CategoryId], async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: result });
          res.status(200).json({ isSuccess: true, result: result[0] });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ isSuccess: false, result: "error" });
    }
  }
);

//=======================Get Work Report (EmployeeList)============================//
router.get("/get-employee-work-report", tokenCheck, async (req, res) => {
  console.log(">>>>>get-employee-work-report");
  try {
    const url = `CALL sp_get_work_report()`;
    db.query(url, async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.status(200).json({ isSuccess: true, result: result[0] });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

//=======================Get Work Report Details============================//
router.get(
  "/get-work-report-details/:userId/:taskTypeId/:taskId",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>/get-work-report-details");
    try {
      let EmployeeId = req.params.userId;
      let taskTypeId = req.params.taskTypeId;
      let taskId = req.params.taskId;
      const userId = req.myData.userId;
      let isAdmin = req.myData.isSuperAdmin;
      const url = `CALL sp_get_work_report_by_employee(${userId}, ${isAdmin}, ${EmployeeId}, ${taskTypeId}, ${taskId})`;
      db.query(url, async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: result });
          res.status(200).json({ isSuccess: true, result: result[0] });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ isSuccess: false, result: "error" });
    }
  }
);

router.get("/get-employee-work-report-today", tokenCheck, async (req, res) => {
  console.log(">>>>>get-employee-work-report-today");
  try {
    const url = `CALL sp_get_work_report_today()`;
    db.query(url, async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.status(200).json({ isSuccess: true, result: result[0] });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

router.get("/get-employee-work-report-weekly", tokenCheck, async (req, res) => {
  console.log(">>>>>get-employee-work-report-weekly");
  try {
    const url = `CALL sp_get_work_report_weekly()`;
    db.query(url, async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.status(200).json({ isSuccess: true, result: result[0] });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

router.get(
  "/get-employee-work-report-monthly",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>get-employee-work-report-monthly");
    try {
      const url = `CALL sp_get_work_report_monthly()`;
      db.query(url, async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ isSuccess: true, result: result });
        } else {
          console.log({ isSuccess: true, result: result });
          res.status(200).json({ isSuccess: true, result: result[0] });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ isSuccess: false, result: "error" });
    }
  }
);

//==================get Enquiries by categoryId====================//
router.get(
  "/get-enquiries-by-category/:categoryId",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>/get-enquiries-by-category/:categoryId");
    try {
      const categoryId = req.params.categoryId;
      console.log(categoryId, "dfhbdhhdsbfdhbhd")
      const url = `CALL sp_get_enquiries_by_enquiry_category(${categoryId})`;
      const newUrl = `CALL sp_get_enquiries_by_enquiry_category(${categoryId})`;
      db.query(categoryId === 1 ? newUrl : url, async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ isSuccess: true, result: result });
        } else {
          console.log({ isSuccess: true, result: result });
          res.status(200).json({ isSuccess: true, result: result[0] });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ isSuccess: false, result: "error" });
    }
  }
);

//=================get Old Product Details=================//
router.get("/get-old-product/:enquiryId", tokenCheck, async (req, res) => {
  console.log(">>>>>>/get-old-product/:enquiryId", req.params.enquiryId);
  const enquiryId = req.params.enquiryId;
  const newSqlQuery = `CALL sp_get_old_products(${enquiryId})`;
  db.query(newSqlQuery, (err, newSqlResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: true, result: newSqlQuery });
      res.send({ isSuccess: true, result: newSqlResult[0] });
    }
  });
});

//=======================Get-User-Created-Enquiry============================//
router.get("/get-user-created-enquiry", tokenCheck, async (req, res) => {
  console.log(">>>>>//get-user-created-enquiry");
  try {
    const userId = req.myData.userId;
    const url = `CALL sp_get_user_created_enquiry(${userId})`;
    db.query(url, async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.status(200).json({ isSuccess: true, result: result[0] });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

//=======================Get-Hot-Enquiry============================//
router.get("/get-hot-enquiry", tokenCheck, async (req, res) => {
  console.log(">>>>>//get-hot-enquiry");
  try {
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    const url = `CALL sp_get_hot_enquiry(${branchId}, ${isSuperAdmin}, ${userId})`;
    db.query(url, async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.status(200).json({ isSuccess: true, result: result[0] });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

//=======================Get-Cold-Enquiry============================//
router.get("/get-Cold-enquiry", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-Cold-enquiry");
  try {
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    const url = `CALL sp_get_cold_enquiry(${branchId}, ${isSuperAdmin}, ${userId})`;
    db.query(url, async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.status(200).json({ isSuccess: true, result: result[0] });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

//=======================Get-Warm-Enquiry============================//
router.get("/get-Warm-enquiry", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-Warm-enquiry");
  try {
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    const url = `CALL sp_get_warm_enquiry(${branchId}, ${isSuperAdmin}, ${userId})`;
    db.query(url, async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: result });
        res.status(200).json({ isSuccess: true, result: result[0] });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});


//===========Get Enquiry By Mobile Number=============
router.get(
  "/get-enquiries-by-mobileno/:mobileno",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>/get-enquiries-by-mobileno/:mobileno");
    try {
      const mobileno = req.params.mobileno;
      const url = `CALL sp_get_enquiries_by_mobile_number(${mobileno})`;
      db.query(url, async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ isSuccess: true, result: result });
        } else {
          console.log({ isSuccess: true, result: result });
          res.status(200).json({ isSuccess: true, result: result[0] });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ isSuccess: false, result: "error" });
    }
  }
);

module.exports = router;
