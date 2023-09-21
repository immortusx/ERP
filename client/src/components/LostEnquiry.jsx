import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { setShowMessage } from "../redux/slices/notificationSlice";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";


const LostEnquiry = () => {
  const location = useLocation();
 const dispatch = useDispatch();
  const editEnquiryData = location.state;
  const [customerId, setCustomerId] = useState(null);
  const [lostEnquiry, setLosEnquiry] = useState({
    listMake: [],
    listModel: [],
    listVariant: [],
    commerical:[],
    noncommerical:[]
  });
  const [lostdata, setLostData] = useState({
    manufacturer: "",
    modal: "",
    variant: "",
    commercialReason: "",
    nonCommercialReason: "",
    enquiryLostDate: new Date(),
  });
  useEffect(() => {
    if (editEnquiryData) {
      // setEnquiryData(editEnquiryData);
      setCustomerId(editEnquiryData.id);
    }
  }, [editEnquiryData]);

  async function getBranchs() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/enquiry-data`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          // setCategoriesList(response.data.result)

          const { manufacturers } = response.data.result;

          setLosEnquiry((lostEnquiry) => ({
            ...lostEnquiry,
            ["listMake"]: manufacturers,
          }));
        }
      }
    });
  }
   async function getModelList(id) {
     const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-model/${id}`;
     const config = {
       headers: {
         token: localStorage.getItem("rbacToken"),
       },
     };
     await axios.get(url, config).then((response) => {
       if (response.data) {
        console.log(response.data.result,"result");
         if (response.data.isSuccess) {
           setLosEnquiry((lostEnquiry) => ({
             ...lostEnquiry,
             ["listModel"]: response.data.result,
           }));
         }
       }
     });
   }

   const getVariant = async (id) => {
     const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-variant/${id}`;
     const config = {
       headers: {
         token: localStorage.getItem("rbacToken"),
       },
     };
     await axios.get(url, config).then((response) => {
       if (response.data) {
         if (response.data.isSuccess) {
           setLosEnquiry((lostEnquiry) => ({
             ...lostEnquiry,
             ["listVariant"]: response.data.result,
           }));
         }
       }
     });
   };

   useEffect(() => {
     const getCommercialList = async () => {
       const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-commercial-reasonsList`;
       console.log("commercial", url);
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
       await axios.get(url, config).then((response) => {
        if (response.data) {
          if (response.data.isSuccess) {
            setLosEnquiry((lostEnquiry) => ({
              ...lostEnquiry,
              ["commerical"]: response.data.result,
            }));
          }
        }
       });
     };
     getCommercialList();
   }, []);
   useEffect(() => {
     getBranchs();
   }, []);
    const formatDate = (inputDate) => {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const date = new Date(inputDate);
      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "long" });
      const year = date.getFullYear();

      const daySuffix = getDaySuffix(day);

      return `${day}${daySuffix} ${month} ${year}`;
    };

    const getDaySuffix = (day) => {
      if (day >= 11 && day <= 13) {
        return "th";
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

const handlelostEnquiry =async()=>{
  console.log(lostdata.lostdate,"date")
  if(customerId){
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/set-lost-enquiry/${customerId}`;
      console.log("closing enqury", url);
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
     
      await axios.post(url, lostdata, config).then((response) => {
        console.log(response.data, "closing");
        if (response.data) {
          // dispatch(getEnquiryData());
        }
      });
    }
clearstate();
dispatch(setShowMessage("Lost Enquiry"));
  }
  const clearstate =() =>{
    setLostData({
      manufacturer: "",
      modal: "",
      variant: "",
      commercialReason: "",
      nonCommercialReason: "",
      enquiryLostDate: new Date(),
    });
  }

  const changehandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLostData((lostdata) => ({
      ...lostdata,
      [name]: value,
    }));
    if(value=== " " || value=== 0){

    }else{
        switch (name) {
          case "manufacturer":
            getModelList(value);
            break;
          case "modal":
            getVariant(value);
            break;
        }
    }
  };

  return (
    <div className=" row mt-4">
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity="info" className="fw-bold">
          Lost Reason :-{editEnquiryData.first_name} {editEnquiryData.last_name} ,{" "}
          {formatDate(editEnquiryData.date)}
        </Alert>
      </Stack>
      <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
        <label className="myLabel" htmlFor="email">
          Enter Maker
        </label>
        <select
          className="inpClr myInput"
          onChange={changehandler}
          name="manufacturer"
          value={lostdata.manufacturer}
        >
          <option value="0" className="myLabel">
            select Maker
          </option>
          {lostEnquiry.listMake &&
            lostEnquiry.listMake.length > 0 &&
            lostEnquiry.listMake.map((i, index) => {
              return (
                <option key={index} value={i.id} className="myLabel">
                  {i.name}
                </option>
              );
            })}
        </select>
      </section>
      <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
        <label className="myLabel" htmlFor="email">
          Enter Modal
        </label>
        <select
          className="inpClr myInput"
          onChange={changehandler}
          name="modal"
          value={lostdata.modal}
        >
          <option value="0" className="myLabel">
            select Modal
          </option>
          {lostEnquiry.listModel &&
            lostEnquiry.listModel.length > 0 &&
            lostEnquiry.listModel.map((i, index) => {
              return (
                <option key={index} value={i.id} className="myLabel">
                  {i.modalName}
                </option>
              );
            })}
        </select>
      </section>
      <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
        <label className="myLabel" htmlFor="email">
          Enter Varient
        </label>
        <select
          className="inpClr myInput"
          name="variant"
          value={lostdata.variant}
          onChange={changehandler}
        >
          <option value="0" className="myLabel">
            select Varient
          </option>
          {lostEnquiry.listVariant &&
            lostEnquiry.listVariant.length > 0 &&
            lostEnquiry.listVariant.map((i, index) => {
              return (
                <option key={index} value={i.id} className="myLabel">
                  {i.variantName}
                </option>
              );
            })}
        </select>
      </section>

      <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
        <label className="myLabel" htmlFor="email">
          Select Commercial Reason 1
        </label>
        <select
          onChange={changehandler}
          className="inpClr myInput"
          name="commercialReason"
          value={lostdata.commercialReason}
        >
          <option value="0" className="myLabel">
            Select Commercial Reason 1
          </option>
          {lostEnquiry.commerical &&
            lostEnquiry.commerical.length > 0 &&
            lostEnquiry.commerical.map((i, index) => {
              return (
                <option key={index} value={i.id} className="myLabel">
                  {i.commercial_reasons}
                </option>
              );
            })}
        </select>
      </section>
      <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
        <label className="myLabel" htmlFor="email">
          Select Non-Commercial Reason 2
        </label>
        <select
          onChange={changehandler}
          className="inpClr myInput"
          name="nonCommercialReason"
          value={lostdata.nonCommercialReason}
        >
          <option value="0" className="myLabel">
            Select Non-Commercial Reason 2
          </option>
          {lostEnquiry.commerical &&
            lostEnquiry.commerical.length > 0 &&
            lostEnquiry.commerical.map((i, index) => {
              return (
                <option key={index} value={i.id} className="myLabel">
                  {i.non_commercial_reasons}
                </option>
              );
            })}
        </select>
      </section>
      <section className="datePicker d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
        <label className="myLabel" htmlFor="email">
          select Enquiry Lost Date
        </label>
        <DatePicker
          name="lostdate"
          selected={lostdata.enquiryLostDate}
          dateFormat="dd/MM/yyyy"
          onChange={(date) =>
            setLostData((lostdata) => ({
              ...lostdata,
              ["enquiryLostDate"]: date,
            }))
          }
        />
      </section>
      <button
        className="col-12 col-sm-5 col-lg-2 myBtn py-2 my-3"
        type="button"
        onClick={handlelostEnquiry}
      >
        Save Lost Enquiry
      </button>
    </div>
  );
};

export default LostEnquiry;
