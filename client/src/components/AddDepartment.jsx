import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFeatureFromDb } from "../redux/slices/getFeatureSlice";
import axios from "axios";
import {
  addDepartmentToDb,
  clearaddDepartment,
} from "../redux/slices/Master/Department/addDepartmentSlice";
// import { getToPathname } from "@remix-run/router";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import CheckIcon from "@mui/icons-material/Check";
// import ClearIcon from "@mui/icons-material/Clear";

export default function AddDepartment({ workFor }) {
  const [editID, setEditID] = useState(0);
  const [dpData, setDpData] = useState({
    name: "",
    description: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const addDepartment = useSelector(
     (state) => state.addDepartment.addDepartment
   );


  function clearInpHook() {
    setDpData({
      name: "",
      description: "",
    });

  }

  useEffect(() => {
    if (addDepartment.isSuccess) {
      if (addDepartment.message.isSuccess) {
        dispatch(setShowMessage("Department is created"));
        dispatch(clearaddDepartment());
        navigate("/administration/configuration/department");
        clearInpHook();
        clearaddDepartment();
      } else {
        dispatch(setShowMessage("Something is wrong"));
      }
    }
  }, [addDepartment]);

const onChangeHandler = (e) => {
  const { name, value } = e.target;
  setDpData((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("dpData", dpData);
      const dname = dpData.name;
  const ddescription = dpData.description;
 if (dname.length > 0 && ddescription !== "") {
      dispatch(addDepartmentToDb(dpData));
 }
    dispatch(setShowMessage('All field must be field'))
    setDpData({
      name: "",
      description: "",
    });
      console.log(dpData, "dpdata");
  };

  function handlCancel() {
    navigate("/administration/configuration/department");
    clearInpHook();
  }

;

  return (
    <div className="addUser myBorder bg-white rounded p-3">
      <main>
        <div className=" row mt-3 m-0">
          <h5 className="m-0">
            {
              (workFor = "adddepartment"
                ? "Create Department"
                : "Edit Department")
            }
          </h5>

          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Department name
            </label>
            <input
              className="myInput inputElement"
              autoComplete="false"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              type="text"
              name="name"
            />
          </section>
        </div>
        <div className=" row m-0">
          <section className="d-flex mt-3 flex-column col-12">
            <label className="myLabel" htmlFor="email">
              Department description
            </label>
            <textarea
              rows="5"
              className="myInput inputElement"
              autoComplete="false"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              type="text"
              name="description"
            />
          </section>

          <section className="d-flex mt-3 flex-column flex-sm-row">
            <button
              className="col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handleSubmit}
              type="button"
            >
              {
                (workFor = "adddepartment"
                  ? "Create Department"
                  : "Edit Department")
              }
            </button>
            <button
              className="ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handlCancel}
              type="button"
            >
              Cancel
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
