import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addemployeeToDb,
  clearAddemployeeState,
} from "../redux/slices/addemployeeSlice";
import {
  clearEditemployeeState,
  clearEditemployeeData,
  editemployeeUpdateToDb,
} from "../redux/slices/editemployeeDataSlice";
import "../styles/AddUser.css";
import Axios from "axios";
import { getToPathname } from "@remix-run/router";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import noAccess from "../assets/svg/noAccess.png";
import Checkbox from "@mui/material/Checkbox";

import SwapSection from "./SwapSection";

export default function Addemployee({ workFor }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addemployeeState = useSelector(
    (state) => state.addemployeeSlice.addemployeeState
  );
  const { editemployeeSliceState } = useSelector(
    (state) => state.editemployeeDataState
  );
  const editemployeeData = useSelector(
    (state) => state.editemployeeDataState.editemployeeData.data
  );

  const [roles, setRoles] = useState([]);
  const [empRoles, setEmpRoles] = useState([]);
  const [branches, setBranchs] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeData, setemployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    bloodgroup: "",
  });
  const [employeeprofilelogo, setEmployeeProfilelogo] = useState({
    logo: null,
    document_id: null,
  });
  const [BankDetais, setBankDetais] = useState({
    bankname: "",
    bankBranch: "",
    accountNo: "",
    accountType: "",
    ifscCode: "",
  });
  const [jobdetails, setJobDetails] = useState({
    branch: "",
    department: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [bloodgroup, setBloodGroup] = useState("");
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const bankName = [
    "AXIS Bank",
    "State Bank of India (SBI)",
    "HDFC Bank",
    "ICICI Bank",
    "Bank of Baroda (BOB)",
    "IDBI Bank",
    "Union Bank of India",
    "Canara Bank",
  ];
  const [popUpScreen, setPopUpScreen] = useState(false);
  const [branchRoles, setBranchRoles] = useState({});
  const [branchId, setBranchId] = useState();
  const [empRoleDesc, setEmpRolesDesc] = useState("");
  const [roleSelect, setRoleSelect] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("");

  const selectInp = useRef();
  const selectedInp = useRef();
  const leftArrowBtn = useRef();
  const rightArrowBtn = useRef();
  useEffect(() => {
    if (editemployeeSliceState.isSuccess) {
      if (editemployeeSliceState.message.result === "success") {
        dispatch(setShowMessage("Data is Updated"));
        clearInpHook();
        dispatch(clearEditemployeeState());
        navigate("/administration/employees");
      } else {
        dispatch(setShowMessage("Something is wrong!"));
      }
    }
  }, [editemployeeSliceState]);

  function handleSubmit() {
    // console.log("employeeData", employeeData);
    // console.log("selectedDate", selectedDate);
    // console.log("bloodgroup", bloodgroup);
    // console.log("branchRoles", branchRoles);
    // console.log("BankDetais", BankDetais);
    // console.log("jobdetails", jobdetails);
    const fN = employeeData.firstName;
    const lN = employeeData.lastName;
    const email = employeeData.email;
    const pass = employeeData.password;
    const pN = employeeData.phoneNumber;
    const alogo = employeeprofilelogo.logo;
    // const id = employeeData.user_id;
    // const id = editemployeeData.user_id;
    const document_id = employeeprofilelogo.document_id;
    const bN = BankDetais.bankname;
    const bb = BankDetais.bankBranch;
    const an = BankDetais.accountNo;
    const at = BankDetais.accountType;
    const ic = BankDetais.ifscCode;
    const brd = jobdetails.branch;
    const dp = jobdetails.department;
    const bg = bloodgroup;
    const ro = selectedRole;
    const bd = selectedDate;
    const formData = new FormData();
    formData.append("firstName", fN);
    formData.append("lastName", lN);
    formData.append("email", email);
    formData.append("password", pass);
    formData.append("phoneNumber", pN);
    formData.append("bankname", bN);
    formData.append("bankBranch", bb);
    formData.append("accountNo", an);
    formData.append("accountType", at);
    formData.append("ifscCode", ic);
    formData.append("branch", brd);
    formData.append("department", dp);
    formData.append("bloodgroup", bg);
    formData.append("selectedRole", ro);
    formData.append("logo", alogo);
    // formData.append("id", id);

    console.log(formData, "formData");
    console.log("fN", fN);
    console.log("lN", lN);
    console.log("email", email);
    console.log("pN", pN);
    console.log("bN", bN);
    console.log("bb", bb);
    console.log("an", an);
    console.log("at", at);
    console.log("ic", ic);
    console.log("bg", bg);
    console.log("brd", brd);
    console.log("dp", dp);
    console.log("ro", ro);
    console.log("alogo", alogo);
    // console.log("id", id);
    if (
      fN.length > 0 &&
      lN.length > 0 &&
      email.length > 0 &&
      pN.length > 0 &&
      bN.length > 0 &&
      bb.length > 0 &&
      an.length > 0 &&
      at.length > 0 &&
      ic.length > 0 &&
      bg.length > 0 &&
      brd.length > 0 &&
      dp.length > 0 &&
      ro.length > 0 &&
      alogo !== null &&
      // id !== null &&
      // bd.length > 0 &&
      (workFor === "forAdd" ? pass.length > 0 : true)
      //  &&
      // Object.keys(branchRoles).length > 0
    ) {
      // employeeData["branchRole"] = branchRoles;
      // console.log(workFor, "true");
      employeeData["bankname"] = BankDetais.bankname;

      employeeData["bankBranch"] = BankDetais.bankBranch;

      employeeData["accountNo"] = BankDetais.accountNo;

      employeeData["accountType"] = BankDetais.accountType;

      employeeData["ifscCode"] = BankDetais.ifscCode;

      employeeData["branch"] = jobdetails.branch;

      employeeData["department"] = jobdetails.department;

      employeeData["bloodgroup"] = bloodgroup;

      employeeData["selectedDate"] = selectedDate;
      employeeData["selectedRole"] = selectedRole;
      employeeData["logo"] = employeeprofilelogo.logo;
      // employeeData["id"] = employeeData.user_id;
      // employeeData["id"] = editemployeeData.user_id;

      if (workFor === "forEdit") {
        formData.append("document_id", editemployeeData.document_id);
        formData.append("id", editemployeeData.user_id);
        dispatch(editemployeeUpdateToDb(formData));
        // navigate("/administration/employees");
      } else {
        // console.log("employeeData.user_id", employeeData);
        dispatch(addemployeeToDb(formData));
        //  navigate("/administration/employees");
      }
    } else {
      dispatch(setShowMessage("All field must be field"));
    }
  }
  async function getemployeeBranchRole(id) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/employees/get-employee-details/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data?.isSuccess) {
        console.log(response.data.result, "response.data.result");
        setBranchRoles(response.data.result);
      }
    });
  }
  useEffect(() => {
    if (branches.length > 0 && workFor === "forEdit" && editemployeeData) {
      const id = editemployeeData.id;
      getemployeeBranchRole(id);
    }
  }, [branches]);
  useEffect(() => {
    if (workFor === "forEdit") {
      if (editemployeeData === null) {
        setTimeout(() => {
          dispatch(setShowMessage("Please select a employee"));
          navigate("/administration/employees");
        }, 1000);
      } else {
        console.log(
          "editemployeeData2222222222222222222222222",
          editemployeeData
        );
        setemployeeData({
          firstName: editemployeeData.first_name,
          lastName: editemployeeData.last_name,
          email: editemployeeData.email,
          password: "",
          phoneNumber: editemployeeData.phone_number,
          bloodgroup: editemployeeData.bloodgroup,
        });
        setBankDetais({
          bankname: editemployeeData.bank_name,
          bankBranch: editemployeeData.bank_branch,
          accountNo: editemployeeData.account_number,
          accountType: editemployeeData.account_type,
          ifscCode: editemployeeData.ifsc_code,
        });
        setJobDetails({
          branch: editemployeeData.branch_id,
          department: editemployeeData.department_id,
        });
        setEmployeeProfilelogo({
          logo: editemployeeData.document_value,
          document_id: editemployeeData.document_id,
        });
      }
    }
    return () => {
      if (workFor === "forEdit") {
        dispatch(clearEditemployeeData());
      }
    };
  }, [workFor, editemployeeData]);

  const fileInputRef = useRef(null);

  function clearInpHook() {
    setemployeeData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      bloodgroup: "",
    });
    setBranchRoles({});
    setSelectedDate("");
    setBloodGroup("");
    setBankDetais({
      bankname: "",
      bankBranch: "",
      accountNo: "",
      accountType: "",
      ifscCode: "",
    });
    setJobDetails({
      branch: "",
      department: "",
    });
    setEmployeeProfilelogo({
      logo: null,
      document_id: null,
    });
    // fileInputRef.current.value = "";
    const allInp = document.getElementsByClassName("inputElement");
    Array.from(allInp).forEach((item) => {
      item.value = "";
    });
  }
  async function getRolesFromDb() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/users/roles-list`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data?.isSuccess) {
        setRoles(response.data.result);
      }
    });
  }
  async function getRolesFromDbEmp() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/users/roles-lists`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data?.isSuccess) {
        setEmpRoles(response.data.result);
        //console.log(response.data.result, "empRolesempRolesempRolesempRolesempRoles")
      }
    });
  }
  async function getBranchsFromDb() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/users/branches-list`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data?.isSuccess) {
        const branchdata = response.data.result;
        setBranchs(branchdata);
        // console.log(branchdata, "branchdata");
      }
    });
  }

  const getDepartmentList = async () => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-department-list`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data.isSuccess) {
        setDepartmentList(response.data.result);
      }
    });
  };

  useEffect(() => {
    if (addemployeeState.isSuccess) {
      if (addemployeeState.message.result === "success") {
        dispatch(setShowMessage("Employee Succesfully Created"));
        clearInpHook();
        dispatch(clearAddemployeeState());
        navigate("/administration/employees");
      } else if (addemployeeState.message.result === "alreadyExist") {
        dispatch(setShowMessage("Please use a different email to continue!"));
        dispatch(clearAddemployeeState());
      } else {
        dispatch(setShowMessage("Something is wrong!"));
      }
    }
  }, [addemployeeState]);
  useEffect(() => {
    getBranchsFromDb();
    getRolesFromDb();
    getRolesFromDbEmp();
    getDepartmentList();
  }, []);

  function makeSelected(e, side, item) {
    if (side === "rightSide") {
      rightArrowBtn.current.classList.remove("disabledBtn");
      Array.from(selectInp.current.childNodes).forEach((i) => {
        i.classList.remove("checked");
      });
    } else {
      Array.from(selectedInp.current.childNodes).forEach((i) => {
        i.classList.remove("checked");
      });
      leftArrowBtn.current.classList.remove("disabledBtn");
    }
    e.currentTarget.classList.add("checked");
  }

  function editBranchRole() {
    const itemList = selectedInp.current;
    const selectedItems = itemList.getElementsByClassName("checked");
    const checkId = selectedItems[0].value;
    setBranchId(checkId);
    setPopUpScreen(true);
  }
  function rightClick() {
    let tempAr = [];

    const itemList = selectInp.current;
    const selectedItems = itemList.getElementsByClassName("checked");
    const checkId = selectedItems[0].value;
    setBranchId(checkId);
    setPopUpScreen(true);

    Array.from(selectInp.current.childNodes).forEach((i) => {
      i.classList.remove("checked");
    });

    rightArrowBtn.current.classList.add("disabledBtn");
  }

  function leftClick() {
    const itemList = selectedInp.current;
    const selectedItems = itemList.getElementsByClassName("checked");
    const checkId = selectedItems[0].value;
    let newResult = Array.from(branchRoles).filter((item) => {
      return item != checkId;
    });
    let tempObj = { ...branchRoles };
    delete tempObj[checkId];
    setBranchRoles(tempObj);

    Array.from(selectedInp.current.childNodes).forEach((i) => {
      i.classList.remove("checked");
    });
    leftArrowBtn.current.classList.add("disabledBtn");
  }

  function handleCancel() {
    navigate("/administration/employees");
    console.log(employeeprofilelogo, "logoooooooooo");
  }
  function onChangeHandler(e) {
    const name = e.target.name;
    const value = e.target.value;
    // const files = e.target.files;
    // if (name === "logo") {
    //   setEmployeeProfilelogo({ ...employeeData, [name]: files[0] });
    //   console.log(employeeData, "employeeData");
    // } else {
    setemployeeData({ ...employeeData, [name]: value });
    console.log(employeeData, "employeeData");
    // }
  }
  function onChangeBankDetais(e) {
    const name = e.target.name;
    const value = e.target.value;
    setBankDetais({ ...BankDetais, [name]: value });
  }
  function onChangeProfile(e) {
    const name = e.target.name;
    const files = e.target.files;
    setEmployeeProfilelogo({ ...employeeData, [name]: files[0] });
    console.log(employeeData, "employeeData");
  }
  const onChangejobdetails = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setJobDetails({ ...jobdetails, [name]: value });
    //console.log(value);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  function callBackLeft(checkId) {
    const tempAr = branchRoles[branchId];
    const newAr = tempAr.filter((i) => {
      return i != checkId;
    });
    if (
      Object.keys(branchRoles).length == 1 &&
      Object.values(branchRoles)[0].length == 1
    ) {
      setBranchRoles({});
    } else {
      setBranchRoles((branchRoles) => ({ ...branchRoles, [branchId]: newAr }));
    }
  }
  function callBackFun(checkId) {
    const tempAr = [];
    if (branchRoles[branchId] != undefined) {
      if (branchRoles[branchId] && !branchRoles[branchId].includes(checkId)) {
        branchRoles[branchId].forEach((i) => {
          tempAr.push(i);
        });
        tempAr.push(checkId);
        setBranchRoles((branchRoles) => ({
          ...branchRoles,
          [branchId]: tempAr,
        }));
      }
    } else {
      tempAr.push(checkId);
      setBranchRoles((branchRoles) => ({ ...branchRoles, [branchId]: tempAr }));
    }
  }

  const connectedBranch = useMemo(() => {
    let tempCounter = 0;
    Object.keys(branchRoles).forEach((item, index) => {
      let findBranch = branches.find((i) => {
        return i.id == item;
      });
      //console.log("findBranch", findBranch);
      if (findBranch) {
        tempCounter++;
      }
    });
    return tempCounter;
  }, [branchRoles]);
  // const showSelectedData = useMemo(() => {
  //   let tempAr = [];
  //   if (Object.keys(branchRoles).length > 0) {
  //     Object.keys(branchRoles).forEach((item, index) => {
  //       let tempObj = {};
  //       let findBranch = branches.find((i) => {
  //         return i.id == item;
  //       });
  //       if (findBranch) {
  //         tempObj["branch"] = findBranch;
  //         let tempArNested = [];
  //         branchRoles[item].forEach((i) => {
  //           let result = roles.find((roleItem) => {
  //             return i == roleItem.id;
  //           });
  //           tempArNested.push(result);
  //         });
  //         tempObj["role"] = tempArNested;
  //         tempAr.push(tempObj);
  //       }
  //     });
  //   }
  //   return tempAr;
  // }, [branchRoles]);

  function confirmClicked() {
    setPopUpScreen(false);
  }
  const handleNoAccess = () => {};
  const onChangeAccess = async (e) => {
    const selectedValue = e.target.value;
    const [id, role] = selectedValue.split(",");
    const selectedId = id;
    const selectedRole = role;
    setSelectedRole(selectedId);
    setSelectedRoleName(selectedRole);
    // console.log(selectedRole,"roleSelectroleSelectroleSelectroleSelect")
    const url = `${process.env.REACT_APP_NODE_URL}/api/users/getRoleDesc/${selectedId}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data?.isSuccess) {
        setEmpRolesDesc(response.data.result[0].description);
        //console.log(response.data.result, "descriptionnnnnn")
      }
    });
  };

  return (
    <>
      <div className="addemployee  bg-white rounded p-3">
        <main>
          <h5 className="m-0">General Details</h5>

          <div className=" row mt-3 m-0">
            <main className="px-3 d-flex align-items-center ">
              <div className="col-12 col-sm- 6 col-lg-4">
                <input
                  type="checkbox"
                  className="myCheckBox inputElement"
                  onChange={(e) => {
                    onChangeHandler(e);
                  }}
                  name="enableemployee"
                />
                <label className="ms-2 myLabel" htmlFor="">
                  Enable employee{" "}
                </label>
              </div>
              <div className="d-flex  flex-column col-12 col-sm-6 col-lg-4">
                <label className="myLabel " htmlFor="logo">
                  Logo
                </label>
                <input
                  ref={fileInputRef}
                  onChange={(e) => {
                    onChangeProfile(e);
                  }}
                  autoComplete="false"
                  type="file"
                  name="logo"
                />
              </div>
              <div className="d-flex justify-content-end col-12 col-sm-6 col-lg-4">
                {employeeprofilelogo && (
                  <img
                    src={`${process.env.REACT_APP_NODE_URL}/api${employeeprofilelogo.logo}`}
                    alt="logo"
                    className="logo-image rounded-circle"
                    height={100}
                    width={100}
                  />
                )}
              </div>
            </main>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                First Name{" "}
              </label>
              <input
                value={employeeData.firstName}
                className="myInput inputElement"
                autoComplete="false"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                type="text"
                name="firstName"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Last Name
              </label>
              <input
                value={employeeData.lastName}
                className="myInput inputElement"
                autoComplete="false"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                type="text"
                name="lastName"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Work Email
              </label>
              <input
                value={employeeData.email}
                className="myInput inputElement"
                autoComplete="false"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                type="text"
                name="email"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Phone Number
              </label>
              <input
                value={employeeData.phoneNumber}
                className="myInput inputElement"
                autoComplete="false"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                type="number"
                name="phoneNumber"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="password">
                {workFor === "forAdd" ? "Password" : "New password"}
              </label>
              <input
                value={employeeData.password}
                className="myInput inputElement"
                autoComplete="false"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                type="password"
                name="password"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Date of Birth
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                className="myInput inputElement"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="bloodGroup">
                Blood Group
              </label>
              <select
                className="form-control"
                id="bloodGroup"
                name="bloodGroup"
                onChange={(e) => setBloodGroup(e.target.value)}
                value={
                  !editemployeeData ? bloodgroup : editemployeeData.bloodgroup
                }
              >
                <option value="">Select Blood group</option>
                {bloodGroups.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </section>
          </div>
        </main>
        <main className="mt-4">
          {/*<h5 className="m-0">
            {workFor === "forAdd" ? "Select branch" : "Edit branch"}
                </h5>*/}
          <h5 className="m-0">Job Information</h5>
          <div className="row mt-3 m-0">
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="branch">
                Select Branch
              </label>
              <select
                className="form-control"
                id="branch"
                name="branch"
                onChange={onChangejobdetails}
                value={jobdetails.value}
              >
                <option value="">Select Branch Name</option>
                {branches.map((branch, index) => (
                  <option key={index} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="department">
                Select Department
              </label>
              <select
                className="form-control"
                id="department"
                name="department"
                onChange={onChangejobdetails}
                value={jobdetails.department}
              >
                <option value="">Select Department Name</option>
                {departmentList.map((dept, index) => (
                  <option key={index} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </section>
          </div>
        </main>
        {/* ===========bankDetails========== */}
        {/* <main className="mt-4">*/}
        {/* <h5 className="m-0">Bank Details</h5> */}
        {/* <h5 className="m-0">Job Information</h5> */}
        {/*<div className="row  m-0"> */}
        {/* <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="bloodGroup">
                Select Branch
              </label>
              <select
                className="form-control"
                id="branch"
                name="branch"
                onChange={onChangejobdetails}
                value={jobdetails.value}
              >
                <option value="">Select Branch Name</option>
                {branches.map((branch, index) => (
                  <option key={index} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="bloodGroup">
                Select Department
              </label>
              <select
                className="form-control"
                id="department"
                name="department"
                onChange={onChangejobdetails}
                value={jobdetails.value}
              >
                <option value="">Select Department Name</option>
                {departmentList.map((dept, index) => (
                  <option key={index} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </section> */}
        {/* </main> */}
        {/*} </div> */}
        {/* ===========bankDetails========== */}
        <main className="mt-4">
          <h5 className="m-0">Bank Details</h5>
          <div className="row mt-3 m-0">
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="bloodGroup">
                Bank Name
              </label>
              <select
                className="form-control"
                id="bloodGroup"
                name="bankname"
                onChange={onChangeBankDetais}
                value={BankDetais.bankname}
              >
                <option value="">Select Bank Name</option>
                {bankName.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Bank Branch{" "}
              </label>
              <input
                value={BankDetais.bankBranch}
                className="myInput inputElement"
                autoComplete="false"
                onChange={(e) => {
                  onChangeBankDetais(e);
                }}
                type="text"
                name="bankBranch"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                Account Number
              </label>
              <input
                value={BankDetais.accountNo}
                className="myInput inputElement"
                autoComplete="false"
                onChange={(e) => {
                  onChangeBankDetais(e);
                }}
                type="text"
                name="accountNo"
              />
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="accountType">
                Account Type{" "}
              </label>
              <select
                className="form-control"
                id="accountType"
                name="accountType"
                onChange={onChangeBankDetais}
                value={BankDetais.accountType}
              >
                <option value="">Select Account Type</option>
                <option value="Savings">Savings</option>
                <option value="Salery">Salery</option>
                <option value="Current">Current</option>
              </select>
            </section>
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel" htmlFor="email">
                IFSC Code
              </label>
              <input
                value={BankDetais.ifscCode}
                className="myInput inputElement"
                autoComplete="false"
                onChange={(e) => {
                  onChangeBankDetais(e);
                }}
                type="text"
                name="ifscCode"
              />
            </section>
          </div>
        </main>
        {/* ===========bankDetails end========== */}
        {/* ===========Access Level start========== */}
        <main className="mt-4">
          <h5 className="m-0">Access Level</h5>
          <div className=" row mt-3 mb-3 m-0">
            <section className="d-flex mt-3 flex-column col-12 ">
              <div className="row">
                <div className="col-5">
                  <div className="noAccess">
                    <div className="d-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        className="bi bi-person-fill-check text-success"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
                      </svg>

                      <h6 className="fw-bold ms-4 mt-1">
                        {selectedRoleName && selectedRoleName.length > 0
                          ? selectedRoleName
                          : "Admin"}
                      </h6>
                      <div className="ms-5">
                        <select
                          className="form-control dropup"
                          id="access"
                          name="access"
                          onChange={onChangeAccess}
                          // value={selectedRoleName}
                        >
                          <option value="">Admin</option>
                          {empRoles &&
                            empRoles.map((acc, index) => (
                              <option
                                key={index}
                                value={`${acc.id},${acc.role}`}
                              >
                                {acc.role}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <p className="ms-4">
                        {" "}
                        {empRoleDesc.length > 0
                          ? empRoleDesc
                          : "Admin have all rights and able to do all things."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-5 noAccessDiv">
                  <div className="noAccess" onClick={handleNoAccess}>
                    <div className="d-flex">
                      <img className="" src="/noAccess.png" alt="Logo" />
                      <h6 className="fw-bold ms-2">No Access</h6>
                    </div>
                    <p className="ms-4">
                      They will be able to login using the Access level you
                      choose.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>{" "}
        </main>
        {/* ===========Access Level end========== */}
        <section className="d-flex mt-3  flex-column flex-sm-row">
          <button
            className="col-12 col-sm-5 col-lg-2 myBtn py-2"
            onClick={handleSubmit}
            type="button"
          >
            {workFor === "forAdd" ? "Add employee" : "Edit employee"}
          </button>
          <button
            className="ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
        </section>

        {popUpScreen && (
          <section className="popUpScreen">
            <main className="shadow col-10 col-md-8 col-lg-7  p-3">
              <h5 className="m-0">Select role</h5>
              <div className=" row m-0">
                <section className="d-flex mt-3 flex-column col-12">
                  <label className="myLabel">Select one or more roles</label>
                  <SwapSection
                    workFor="roles"
                    currentId={branchId}
                    selectedData={branchRoles}
                    setSelectedData={setBranchRoles}
                    callBackLeft={callBackLeft}
                    callBackFun={callBackFun}
                    selectionData={roles}
                  />
                </section>
                <section className="d-flex mt-3  flex-column flex-sm-row">
                  <button
                    onClick={confirmClicked}
                    className="col-12 col-sm-5 col-lg-2 myBtn py-2"
                    type="button"
                  >
                    Done
                  </button>
                  {/* <button onClick={cancelClicked} className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' type='button'>Cancel</button> */}
                </section>
              </div>
            </main>
          </section>
        )}
      </div>
    </>
  );
}

{
  /* <section className="d-flex mt-3 flex-column  col-12">
               <label className="myLabel">Select one or more branch</label>
               <div className="swapSelection d-flex flex-column flex-md-row mt-2">
                 <main>
                   <label className="pb-2">
                     Available branches (
                     {branches && branches.length > 0 ? branches.length : 0})
                   </label>
                   <ul
                    ref={selectInp}
                    name="selectRole"
                    className="inputElement"
                  >
                    {branches.length > 0 &&
                      branches.map((item, index) => {
                        return (
                          <li
                            onClick={(event) => {
                              makeSelected(event, "rightSide", item);
                            }}
                            className="text-uppercase"
                            key={index}
                            value={item.id}
                          >
                            <div className="d-flex align-items-center">
                              <input type='checkbox' className='m-2 myCheckBox inputElement' onChange={(e) => { onChangeHandler(e) }} name="enableemployee" />
                              <p className="ms-1">{item.name}</p>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </main>

                <div className="d-flex flex-row flex-md-column justify-content-around allBtnsMain m-3">
                  <div
                    ref={rightArrowBtn}
                    className="arrowBtn disabledBtn"
                    name="rightDiv"
                    onClick={rightClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </div>
                  <div
                    ref={leftArrowBtn}
                    className="arrowBtn disabledBtn"
                    onClick={leftClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-left"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                      />
                    </svg>
                  </div>
                </div>
                <main>
                  <label className="pb-2">
                    Selected (
                    {branchRoles && Object.keys(branchRoles).length
                      ? connectedBranch
                      : 0}
                    )
                  </label>

                  <ul
                    ref={selectedInp}
                    className="inputElement"
                    name="selectedRole"
                  >
                    {branchRoles &&
                      Object.keys(branchRoles).length > 0 &&
                      showSelectedData.map((item, index) => {
                        return (
                          <>
                            <li
                              value={item.branch.id}
                              onDoubleClick={editBranchRole}
                              onClick={(event) => {
                                makeSelected(event, "leftSide", item.branch.id);
                              }}
                              className="text-uppercase"
                              key={index}
                            >
                              <div className="d-flex flex-wrap align-items-center  justify-content-between">
                                {item.branch.name}

                                <div className="d-flex flex-wrap">
                                  {item.role.map((i, index) => {
                                    return (
                                      <span
                                        key={index}
                                        value={i.id}
                                        className="myTag myH7 m-1"
                                      >
                                        {i.role}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </li>
                          </>
                        );
                      })}
                  </ul>
                </main>
              </div>
            </section> */
}
