import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import {
  addDepartmentToDb,
  clearaddDepartment,
} from "../redux/slices/Master/Department/addDepartmentSlice";
import {
  clearEditdepartmentData,
  clearEditdepartmentState,
  editdepartmentUpdateToDb,
} from "../redux/slices/Master/Department/editDepartmentSlice";
import Axios from "axios";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddDepartment({ workFor }) {
  // const [editID, setEditID] = useState(0);
  const [dpData, setDpData] = useState({
    name: "",
    description: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addDepartment = useSelector(
    (state) => state.addDepartment.addDepartment
  );

  const { editdepartmentSliceState } = useSelector(
    (state) => state.editDepartmentDataState
  );
  const editdepartmentData = useSelector(
    (state) => state.editDepartmentDataState.editdepartmentData
  );

  function clearInpHook() {
    setDpData({
      name: "",
      description: "",
    });
  }

  useEffect(() => {
    if (editdepartmentSliceState.isSuccess) {
      console.log(editdepartmentSliceState, "editdepartmentSliceState");
      if (editdepartmentSliceState.message.result === "success") {
        dispatch(setShowMessage("Data is Updated"));
        clearInpHook();
        dispatch(clearEditdepartmentState());
        navigate("/administration/configuration/department");
      } else {
        dispatch(setShowMessage("Something is wrong!"));
      }
    }
  }, [editdepartmentSliceState]);

  useEffect(() => {
    if (workFor === "forEdit") {
      if (editdepartmentData.data === null) {
        setTimeout(() => {
          navigate("/administration/configuration/department");
          dispatch(setShowMessage("Please select a department"));
        }, 1000);
      } else {
        setDpData({
          name: editdepartmentData.data.name,
          description: editdepartmentData.data.description,
        });
      }
    }
    return () => {
      if (workFor === "forEdit") {
        dispatch(clearEditdepartmentData());
      }
    };
  }, [workFor, editdepartmentData]);

  async function getdepartmentid(id) {
    console.log(id, "asdfghjkl;fdghjk");
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-departmentbyid/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    try {
      const response = await Axios.get(url, config);
      if (response.data?.isSuccess) {
        setDpData(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (
      workFor === "forEdit" &&
      editdepartmentData &&
      editdepartmentData.data
    ) {
      const id = editdepartmentData.data.id;
      console.log(id, "IDDATA");
      getdepartmentid(id);
    }
  }, []);

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
      if (workFor === "forEdit") {
        dpData["id"] = editdepartmentData.data.id;
        dispatch(editdepartmentUpdateToDb(dpData));
      } else {
        dispatch(addDepartmentToDb(dpData));
      }
    } else {
      dispatch(setShowMessage("All field must be field"));
    }
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
  const redirectModal = () => {
    navigate(-1);
  };


  return (
    <div className="addUser myBorder bg-white rounded p-3">
      <main>
        <div className=" row m-0">
          <div className="col-6">
            <h5 className="m-0">
              {workFor === "forAdd" ? "Create Department" : "Edit Department"}
            </h5>
          </div>
          <div className="col-6 d-flex align-items-end justify-content-end">
            <Button
              variant="btn btn-warning mx-1"
              style={{
                width: '70px',
                height: '35px',
                fontSize: '14px',
                borderRadius: '20px',
              }}
              onClick={() => {
                redirectModal();
              }}
            >
              BACK
            </Button>
          </div>
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Department name
            </label>
            <input
              value={dpData.name}
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
              value={dpData.description}
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
              {workFor === "forAdd" ? "Create Department" : "Edit Department"}
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
