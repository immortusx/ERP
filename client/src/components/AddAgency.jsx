import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addAgencyToDb,
  clearaddaddAgency,
} from "../redux/slices/addagencySlice";
// import {
//   clearEditagencyData,
//   clearEditagencyState,
//   editagencyUpdateToDb,
// } from "../redux/slices/editAgencySlice";
export default function AddAgency({ workFor }) {
  // const [agencyCreated, setAgencyCreated] = useState(false);
  const [agencyData, setAgencyData] = useState({
    name: "",
    contact: "",
    email: "",
    logo: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();


   const fileInputRef = useRef(null);

  function clearInpHook() {
    setAgencyData({
      name: "",
      contact: "",
      email: "",
      logo: null,
    });
     fileInputRef.current.value = "";
  }

  const addAgency = useSelector((state) => state.addAgency.addAgency);

  // const { editagencySliceState } = useSelector(
  //   (state) => state.editAgencyDataState
  // );
  // const editagencyData = useSelector(
  //   (state) => state.editAgencyDataState.editagencyData
  // );

  useEffect(() => {
    if (addAgency.isSuccess) {
      if (addAgency.message.isSuccess) {
        console.log(addAgency, "addAgency");
        dispatch(setShowMessage("Agency is created"));
        dispatch(clearaddaddAgency());
        navigate("/administration/configuration");
        clearInpHook();
        clearaddaddAgency();
      } else {
        dispatch(setShowMessage("Something is wrong"));
      }
    }
  }, [addAgency]);


  const onChangeHandler = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setAgencyData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setAgencyData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  

  const handleSubmit = async (e) => {                               
    e.preventDefault();
    console.log("agencyData", agencyData);
    const aname = agencyData.name;
    const acontact = agencyData.contact;
    const aemail = agencyData.email;
    const alogo = agencyData.logo;
    const formData = new FormData();
    formData.append("name", aname);
    formData.append("contact", acontact);
    formData.append("email", aemail);
    formData.append("logo", alogo);
    if ( aname.length > 0 && acontact !== "" && aemail !== "" && alogo !== null) {
      console.log("result save");
      
        dispatch(addAgencyToDb(formData));
    
    } else {
      dispatch(setShowMessage("All field must be field"));
    }
  };
  function handlCancel() {
    navigate("/administration/configuration");
    clearInpHook();
  }

  

  return (
    <div className="addUser myBorder bg-white rounded p-3">
      <main>
        <div className=" row mt-3 m-0">
          <h5 className="m-0">Create Agency</h5>

          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              name
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
              person
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
            <label className="myLabel" htmlFor="logo">
              Logo
            </label>
            <input
              ref={fileInputRef}
              onChange={(e) => {
                onChangeHandler(e);
              }}
              autoComplete="false"
              type="file"
              name="logo"
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
