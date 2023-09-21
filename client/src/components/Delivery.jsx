import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { setShowMessage } from "../redux/slices/notificationSlice";
import axios from "axios";

const Delivery = () => {
  const [seletedOwned, setSelectedOwned] = useState("Exchange No");
  const [customerId, setCustomerId] = useState(null);
  const [Id, setId] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const editEnquiryData = location.state;

  const [deliverdata, setDeliveryData] = useState({
    phone_number: "",
    modal: "",
    variant: "",
    chassis_no: "",
    mode_of_finance: "",
    bank_name: "",
    deliveryDate: new Date(),
    retailDate: new Date(),
    selectedOption: "Exchange No",

    maker: "",
    modalName: "",
    variantName: "",
    manuYearDate: "",
    tractorCondtion: "",
    purchasePrice: "",
    marketPrice: "",
    oldChassisNo: "",
  });

  useEffect(() => {
    if (editEnquiryData) {
      setCustomerId(editEnquiryData.id);
    }
  });
  const generateYears = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push({ id: years.length + 1, year: year.toString() });
    }
    return years;
  };
  const [datalist, setDataList] = useState({
    makerlist: [],
    modallist: [],
    varientlist: [],
    modeoffinancelist: [
      { id: 1, name: "Cash" },
      { id: 2, name: "Credit Card" },
      { id: 3, name: "Debit Card" },
    ],
    banklist: [
      { id: 1, name: "State Bank Of India" },
      { id: 2, name: "Bank Of Baroda" },
    ],
    modalNamelist: [],
    variantNamelist: [],
    manuYearDatelist: generateYears(1980, 2023),
    tractorCondtionlist: [
      { id: 1, name: "very Good" },
      { id: 2, name: "Average" },
      { id: 3, name: "Below Average" },
      { id: 4, name: "Good" },
    ],
  });
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
          setId(response.data.result.manufacturers[0].id);

          setDataList((datalist) => ({
            ...datalist,
            ["makerlist"]: manufacturers,
          }));
        }
      }
    });
  }
  async function getModelList(Id) {
    console.log(Id,"rtoiuuighguo")
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-model/${Id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        console.log(response.data.result, "result");
        if (response.data.isSuccess) {
          setDataList((datalist) => ({
            ...datalist,
            ["modallist"]: response.data.result,
          }));
        }
      }
    });
  }
  async function getoldModelList(id) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-model/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        console.log(response.data.result, "result");
        if (response.data.isSuccess) {
          setDataList((datalist) => ({
            ...datalist,
            ["modalNamelist"]: response.data.result,
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
          setDataList((datalist) => ({
            ...datalist,
            ["varientlist"]: response.data.result,
          }));
        }
      }
    });
  };
  const getoldVariant = async (id) => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-variant/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          setDataList((datalist) => ({
            ...datalist,
            ["variantNamelist"]: response.data.result,
          }));
        }
      }
    });
  };
  useEffect(() => {
    getBranchs();
    getModelList(Id)
  }, [Id]);

  function changeHandlerNewEnquiry(e) {
    const name = e.target.name;
    const value = e.target.value;
    setDeliveryData((deliverdata) => ({
      ...deliverdata,
      [name]: value,
    }));
    if (name === "selectedOption") {
      setDeliveryData((prevState) => ({
        ...prevState,
        selectedOption: value,
      }));
      setSelectedOwned(value);
    }
    if (value === "" || value === 0) {
    } else {
      switch (name) {
        // case "Id":
        //   getModelList(value);
        //   break;
        case "maker":
          getoldModelList(value);
          break;
        case "modal":
          getVariant(value);
          break;
        case "modalName":
          getoldVariant(value);
          break;
      }
    }
  }

  const clearstate =()=>{
    setDeliveryData({
      phone_number: "",
      modal: "",
      variant: "",
      chassis_no: "",
      mode_of_finance: "",
      bank_name: "",
      deliveryDate: new Date(),
      retailDate: new Date(),
      selectedOption: "Exchange No",

      maker: "",
      modalName: "",
      variantName: "",
      manuYearDate: "",
      tractorCondtion: "",
      purchasePrice: "",
      marketPrice: "",
      oldChassisNo: "",
    });
  }
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

  const handleSaveDelivery = async () => {
    const id = customerId;
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/set-new-booking/${id}`;
    console.log(id, "*********");
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.post(url, deliverdata, config).then((response) => {
      console.log(response.data, "closing");
      if (response.data) {
        // dispatch(getEnquiryData());
      }
    });
    
clearstate();
dispatch(setShowMessage("Delivery Enquiry saved"));
    console.log(deliverdata, "deliverdata");
  };
  return (
    <>
      <div className=" row mt-4">
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="info" className="fw-bold">
            Delivery :-{editEnquiryData.first_name} {editEnquiryData.last_name}{" "}
            ,Enquiry. {formatDate(editEnquiryData.date)}
          </Alert>
        </Stack>
        <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
          <label className="myLabel" htmlFor="email">
            Enter Mobile Number
          </label>
          <input
            onChange={changeHandlerNewEnquiry}
            className="myInput inputElement"
            autoComplete="false"
            type="number"
            name="phone_number"
            value={deliverdata.phone_number}
            placeholder=" Enter Mobile Number"
          />
        </section>
        <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
          <label className="myLabel" htmlFor="email">
            Select Modal
          </label>
          <select
            onChange={changeHandlerNewEnquiry}
            className="inpClr myInput"
            name="modal"
            value={deliverdata.modal}
          >
            <option value="0" className="myLabel">
              select Modal
            </option>
            {datalist.modallist &&
              datalist.modallist.length > 0 &&
              datalist.modallist.map((i, index) => {
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
            Select Varient
          </label>
          <select
            onChange={changeHandlerNewEnquiry}
            className="inpClr myInput"
            name="variant"
            value={deliverdata.variant}
          >
            <option value="0" className="myLabel">
              select Varient
            </option>
            {datalist.varientlist &&
              datalist.varientlist.length > 0 &&
              datalist.varientlist.map((i, index) => {
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
            Enter Chassis No
          </label>
          <input
            onChange={changeHandlerNewEnquiry}
            className="myInput inputElement"
            autoComplete="false"
            type="number"
            name="chassis_no"
            value={deliverdata.chassis_no}
            placeholder="Enter Chassis No"
          />
        </section>
        <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
          <label className="myLabel" htmlFor="email">
            Mode Of Finance
          </label>
          <select
            onChange={changeHandlerNewEnquiry}
            className="inpClr myInput"
            name="mode_of_finance"
            value={deliverdata.mode_of_finance}
          >
            <option value="0" className="myLabel">
              select Mode Of Finance
            </option>
            {datalist.modeoffinancelist &&
              datalist.modeoffinancelist.length > 0 &&
              datalist.modeoffinancelist.map((i, index) => {
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
            select Bank
          </label>
          <select
            onChange={changeHandlerNewEnquiry}
            className="inpClr myInput"
            name="bank_name"
            value={deliverdata.bank_name}
          >
            <option value="0" className="myLabel">
              select Bank
            </option>
            {datalist.banklist &&
              datalist.banklist.length > 0 &&
              datalist.banklist.map((i, index) => {
                return (
                  <option key={index} value={i.id} className="myLabel">
                    {i.name}
                  </option>
                );
              })}
          </select>
        </section>
        <section className="datePicker d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
          <label className="myLabel" htmlFor="email">
            select Delivery Date
          </label>
          <DatePicker
            selected={deliverdata.deliveryDate}
            dateFormat="dd/MM/yyyy"
            onChange={(date) =>
              setDeliveryData((deliverdata) => ({
                ...deliverdata,
                ["deliveryDate"]: date,
              }))
            }
          />
        </section>
        <section className="datePicker d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
          <label className="myLabel" htmlFor="email">
            Target Retail Price
          </label>
          <DatePicker
            selected={deliverdata.retailDate}
            dateFormat="dd/MM/yyyy"
            onChange={(date) =>
              setDeliveryData((deliverdata) => ({
                ...deliverdata,
                ["retailDate"]: date,
              }))
            }
          />
        </section>
        <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
          <div className="d-flex mt-4">
            <input
              defaultChecked={seletedOwned === "Exchange Yes" ? true : false}
              value="Exchange Yes"
              onChange={changeHandlerNewEnquiry}
              type="radio"
              id="html"
              name="selectedOption"
            />
            <label className="ms-1 myLabel" htmlFor="html">
              Exchange Yes
            </label>

            <input
              defaultChecked={seletedOwned === "NO" ? true : false}
              onChange={changeHandlerNewEnquiry}
              value="Exchange No"
              className="ms-3"
              type="radio"
              id="css"
              name="selectedOption"
            />
            <label className="ms-1 myLabel" htmlFor="css">
              Exchange No
            </label>
          </div>
          {seletedOwned === "Exchange Yes" && (
            <>
              <p className="mt-3">Select Details*</p>
              <section className="d-flex mt-3 flex-column col-12">
                <select
                  onChange={changeHandlerNewEnquiry}
                  className="inpClr myInput"
                  name="maker"
                  value={deliverdata.maker}
                >
                  <option value="0" className="myLabel">
                    select maker
                  </option>
                  {datalist.makerlist &&
                    datalist.makerlist.length > 0 &&
                    datalist.makerlist.map((i, index) => {
                      return (
                        <option key={index} value={i.id} className="myLabel">
                          {i.name}
                        </option>
                      );
                    })}
                </select>
              </section>
              <section className="d-flex mt-3 flex-column col-12">
                <select
                  onChange={changeHandlerNewEnquiry}
                  className="inpClr myInput"
                  name="modalName"
                  value={deliverdata.modalName}
                >
                  <option value="0" className="myLabel">
                    select modal
                  </option>
                  {datalist.modalNamelist &&
                    datalist.modalNamelist.length > 0 &&
                    datalist.modalNamelist.map((i, index) => {
                      return (
                        <option key={index} value={i.id} className="myLabel">
                          {i.modalName}
                        </option>
                      );
                    })}
                </select>
              </section>
              <section className="d-flex mt-3 flex-column col-12">
                <select
                  onChange={changeHandlerNewEnquiry}
                  className="inpClr myInput"
                  name="variantName"
                  value={deliverdata.variantName}
                >
                  <option value="0" className="myLabel">
                    select Varient
                  </option>
                  {datalist.variantNamelist &&
                    datalist.variantNamelist.length > 0 &&
                    datalist.variantNamelist.map((i, index) => {
                      return (
                        <option key={index} value={i.id} className="myLabel">
                          {i.variantName}
                        </option>
                      );
                    })}
                </select>
              </section>
              <section className="d-flex mt-3 flex-column col-12">
                <select
                  onChange={changeHandlerNewEnquiry}
                  className="inpClr myInput"
                  name="manuYearDate"
                  value={deliverdata.manuYearDate}
                >
                  <option value="0" className="myLabel">
                    Manufactur Year :-
                  </option>
                  {datalist.manuYearDatelist &&
                    datalist.manuYearDatelist.length > 0 &&
                    datalist.manuYearDatelist.map((i, index) => {
                      return (
                        <option key={index} value={i.year} className="myLabel">
                          {i.year}
                        </option>
                      );
                    })}
                </select>
              </section>
              <section className="d-flex mt-3 flex-column col-12">
                <select
                  onChange={changeHandlerNewEnquiry}
                  className="inpClr myInput"
                  name="tractorCondtion"
                  value={deliverdata.tractorCondtion}
                >
                  <option value="0" className="myLabel">
                    select Condition
                  </option>
                  {datalist.tractorCondtionlist &&
                    datalist.tractorCondtionlist.length > 0 &&
                    datalist.tractorCondtionlist.map((i, index) => {
                      return (
                        <option key={index} value={i.id} className="myLabel">
                          {i.name}
                        </option>
                      );
                    })}
                </select>
              </section>
              <section className="d-flex mt-3 flex-column col-12">
                <input
                  onChange={changeHandlerNewEnquiry}
                  className="myInput inputElement"
                  autoComplete="false"
                  type="text"
                  name="purchasePrice"
                  value={deliverdata.purchasePrice}
                  placeholder="Dealer Purches Price"
                />
              </section>{" "}
              <section className="d-flex mt-3 flex-column col-12">
                <input
                  onChange={changeHandlerNewEnquiry}
                  className="myInput inputElement"
                  autoComplete="false"
                  type="text"
                  name="marketPrice"
                  value={deliverdata.marketPrice}
                  placeholder="Market Price(Rs.)"
                />
              </section>{" "}
              <section className="d-flex mt-3 flex-column col-12">
                <input
                  onChange={changeHandlerNewEnquiry}
                  className="myInput inputElement"
                  autoComplete="false"
                  type="number"
                  name="oldChassisNo"
                  value={deliverdata.oldChassisNo}
                  placeholder="Old Tractor Chassis No"
                />
              </section>
              {/* Add more conditional sections here */}
            </>
          )}
        </section>
      </div>
      <button
        onClick={handleSaveDelivery}
        className="col-12 col-sm-5 col-lg-2 myBtn py-2 my-3"
        type="button"
      >
        Save Delivery
      </button>
    </>
  );
};

export default Delivery;
