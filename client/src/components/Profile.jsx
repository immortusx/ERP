import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import downloadgif from "../assets/images/download.gif"
import DownloadIcon from "@mui/icons-material/Download";
import translations from "../assets/locals/translations";
import axios from "axios";
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

   const currentLanguage = useSelector((state) => state.language.language);
  // const editagencyData = useSelector(
  //   (state) => state.editAgencyDataState.editagencyData
  // );

  useEffect(() => {
    if (editagencySliceState.isSuccess) {
      const result = editagencySliceState.message.result;
      console.log(result, "result");
      if (result === "success") {
        dispatch(setShowMessage("Data is Updated"));
        clearInpHook();
        dispatch(clearEditagencyState());
        navigate("/administration/configuration");
        window.location.reload();
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

  useEffect(() => {
    if (agencyData) {
      const logo = `${process.env.REACT_APP_NODE_URL}/api${agencyData.logo}`;
      console.log(logo, 'logo')
    }
  }, [agencyData])
  async function getagencyid() {
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
        setAgencyData(parsedJson);
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
    console.log(agencyData.logo);
    const aname = agencyData.name;
    const acontact = agencyData.contact;
    const aemail = agencyData.email;
    const alogo = agencyData.logo;
    const formData = new FormData();
    formData.append("name", aname);
    formData.append("contact", acontact);
    formData.append("email", aemail);
    formData.append("logo", alogo);

    if (
      aname.length > 0 &&
      acontact !== "" &&
      aemail !== "" &&
      alogo !== null
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

  const redirectModal = () => {
    navigate(-1);
  };
  const handleDownload = async () => {
    try {
      const url = `${process.env.REACT_APP_NODE_URL}/api/employees/download-document`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
        responseType: 'blob',
      };

      const data = {
        downloadFilePath: agencyData.logo,
      };

      const response = await axios.post(url, data, config);

      if (response.status === 200) {
        // Create a blob URL for the downloaded file
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);

        // Create a link element and trigger a click to download the file
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = agencyData.logo; // Set the desired file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('File download failed:', response.statusText);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="addUser myBorder bg-white rounded p-3">
      <main>
        <div className=" row m-0">
          <div className="col-md-6">
            <h5 className="myLabel">{translations[currentLanguage].agency}</h5>
          </div>
          <div className="col-md-6 d-flex justify-content-end align-items-end">
            <Button
              variant="btn btn-warning mx-1"
              style={{
                width: "70px",
                height: "35px",
                fontSize: "14px",
                borderRadius: "20px",
              }}
              onClick={() => {
                redirectModal();
              }}
            >
              {translations[currentLanguage].back}
            </Button>
          </div>

          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              {translations[currentLanguage].name}
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
              {translations[currentLanguage].person}
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
              {translations[currentLanguage].email}
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
                {translations[currentLanguage].logo}
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
            <div style={{ display: "flex", alignItems: "center" }}>
              {agencyData.logo && (
                <div>
                  <img
                    src={`${process.env.REACT_APP_NODE_URL}/api${agencyData.logo}`}
                    alt="logo"
                    className="logo-image"
                    height={50}
                    width={50}
                  />
                </div>
              )}

              {agencyData.logo && (
                <div style={{ marginLeft: "10px" }}>
                  <button
                    className="border-0 rounded-pill p-1"
                    onClick={handleDownload}
                  >
                    <DownloadIcon />
                    {translations[currentLanguage].download}
                  </button>
                  {/*<img
                    src={downloadgif}
                    className="logo-image rounded-circle"
                    height={35}
                    width={35}
                    onClick={handleDownload}
                    alt="download"
              />*/}
                </div>
              )}
            </div>
          </section>

          <section className="d-flex mt-3 flex-column flex-sm-row">
            <button
              className="col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handleSubmit}
              type="button"
            >
              {workFor === "forEdit"
                ? translations[currentLanguage].save
                : translations[currentLanguage].create}
            </button>

            <button
              className="ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handlCancel}
              type="button"
            >
              {translations[currentLanguage].cancel}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
