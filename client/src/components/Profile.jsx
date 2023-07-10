
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";
// import {
//   addAgencyToDb,
//   clearaddaddAgency,
// } from "../redux/slices/addagencySlice";
import {
  clearEditagencyData,
  clearEditagencyState,
  editagencyUpdateToDb,
} from "../redux/slices/editAgencySlice";
export default function Profile_list({ workFor }) {
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


  const { editagencySliceState } = useSelector(
    (state) => state.editAgencyDataState
  );
  // const editagencyData = useSelector(
  //   (state) => state.editAgencyDataState.editagencyData
  // );

  useEffect(() => {
    if (editagencySliceState.isSuccess) {
      const result = editagencySliceState.message.result;
      console.log(result,"result")
      if (result === "success") {
        dispatch(setShowMessage("Data is Updated"));
        clearInpHook();
        dispatch(clearEditagencyState());
        navigate("/administration/configuration");
      } else {
        console.log("Something is wrong!");
        dispatch(setShowMessage("Something is wrong!"));
      }
  
    }
    
  }, [editagencySliceState]);

//    useEffect(() => {
//      if (workFor === "forEdit") {
//        if (editagencyData.data === null) {
//          dispatch(setShowMessage("Please select a employee"));
//          setTimeout(() => {
//             // navigate("/administration/configuration/agency");
//            console.log("asdfghjkdfghj");
//          }, 1000);
//        } else {
//          console.log("editagencyData2222222222222222222222222", editagencyData);
//          setAgencyData({
//            name: editagencyData.data.name,
//            contact: editagencyData.data.contact,
//            email: editagencyData.data.email,
//            logo: editagencyData.data.logo,
//          });
//        }
//      }
//      return () => {
//        if (workFor === "forEdit") {
//          dispatch(clearEditagencyData());
//        }
//      };
//    }, [workFor, clearEditagencyData]);

   async function getagencyid() {
     console.log( "asdfghjklfdghjk");
     const url = `${process.env.REACT_APP_NODE_URL}/api/agency/get-agencybyid`;
     const config = {
       headers: {
         token: localStorage.getItem("rbacToken"),
       },
     };
     try {
       const response = await Axios.get(url, config);
       if (response.data?.isSuccess) {
        console.log(response.data.result, "response.data");
const agencyaary = response.data.result;
const jsonObject = {};

agencyaary.forEach((item) => {
  jsonObject[item.key_name] = item.value;
});
const jsonOutput = JSON.stringify(jsonObject);
console.log(jsonOutput);

const parsedJson = JSON.parse(jsonOutput);
console.log(parsedJson, "parsedJson");
console.log(parsedJson.logo, "parsedJson.logo");
setAgencyData(parsedJson)
       }
     } catch (error) {
       console.log(error);
     }
   }

  useEffect(() => {
 
      getagencyid();
  }, []);



  const onChangeHandler = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" ) {
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

    if (  aname.length > 0 &&  acontact !== "" && aemail !== "" &&  alogo !== null
) {
      console.log("result save");
      console.log(workFor, "workfor");
      if (workFor === "forEdit") {
        dispatch(editagencyUpdateToDb(formData));
      }
    } else {
      dispatch(setShowMessage("All fields must be filled"));
    }
  };
  
  function handlCancel() {
     navigate("/administration/configuration");
  }

  return (
    <div className="addUser myBorder bg-white rounded p-3">
      <main>
        <div className=" row mt-3 m-0">
          <h5 className="m-0"> Agency</h5>

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
            <div class="mb-3">
              <label for="formFile" className="myLabel" htmlFor="logo">
                {" "}
                Logo
              </label>
              <input
                className="form-control"
                type="file"
                name="logo"
                ref={fileInputRef}
                onChange={(e) => {
                  onChangeHandler(e);
                }}
              />
            </div>
            {agencyData && (
              <img
                src={`${process.env.REACT_APP_NODE_URL}/api${agencyData.logo}`}
                alt="logo"
                className="logo-image"
                height={50}
                width={50}
                
              />
            )}
          </section>

          <section className="d-flex mt-3 flex-column flex-sm-row">
            <button
              className="col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handleSubmit}
              type="button"
            >
              Edit 
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






