import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { addAgencyToDb,clearaddaddAgency } from "../redux/slices/addagencySlice";
export default function AddDepartment({ workFor }) {
  const [agencyData, setAgencyData] = useState({
      name: "",
      contact: "",
      email: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  function clearInpHook() {
    setAgencyData({
      name: "",
      contact: "",
      email: "",
    });
  }

 const addAgency = useSelector((state) => 
  state.addAgency.addAgency
 );

 

  useEffect(() => {
    if (addAgency.isSuccess) {
      if (addAgency.message.isSuccess) {
        console.log(addAgency, "addAgency");
        dispatch(setShowMessage("Agency is created"));
        dispatch(clearaddaddAgency());
        // navigate("/administration/configuration/agency");
        clearInpHook();
        clearaddaddAgency();
      } else {
        dispatch(setShowMessage("Something is wrong"));
      }
    }
  }, [addAgency]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setAgencyData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("agencyData", agencyData);
    const aname = agencyData.name;
    const acontact = agencyData.contact;
    const aemail = agencyData.email;
    if (aname.length > 0 && acontact !== "" && aemail !== "") {
      console.log("result save")
      // if (workFor === "forEdit") {
      //   dpData["id"] = editdepartmentData.data.id;
      //   dispatch(editdepartmentUpdateToDb(dpData));
      dispatch(addAgencyToDb(agencyData));
      } else {
        dispatch(setShowMessage("All field must be field"));
      }
    
    //  setDpData({
    //    name: "",
    //    description: "",
    //  });
    //    console.log(dpData, "dpdata");
  };

  function handlCancel() {
    navigate("/administration/configuration");
    clearInpHook();
  }

  return (
    <div className="addUser myBorder bg-white rounded p-3">
      <main>
        <div className=" row mt-3 m-0">
          <h5 className="m-0">
            {workFor === "forAdd" ? "Create Agency" : "Edit Agency"}
          </h5>

          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Agency name
            </label>
            <input
              value={agencyData.name}
              className="myInput inputElement"
              autoComplete="false"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              type="text"
              name="name"
            />
          </section>

          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Contact person
            </label>
            <input
              value={agencyData.contact}
              className="myInput inputElement"
              autoComplete="false"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              type="text"
              name="contact"
            />
          </section>
        </div>
        <div className=" row m-0">
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Email
            </label>
            <input
              value={agencyData.email}
              onChange={(e) => {
                onChangeHandler(e);
              }}
              className="myInput inputElement"
              autoComplete="false"
              type="text"
              name="email"
            />
          </section>
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Logo
            </label>
            <input
              // value={agencyData.email}
              onChange={(e) => {
                onChangeHandler(e);
              }}
            
              autoComplete="false"
              type="file"
              name="email"
            />
          </section>

          <section className="d-flex mt-3 flex-column flex-sm-row">
            <button
              className="col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handleSubmit}
              type="button"
            >
              Create Agency
            </button>
            <button
              className=" ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2"
              //   onClick={handleSubmit}
              type="button"
            >
              Edit Agency
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
