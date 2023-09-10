import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { setEnquiryDb, clearEnquiryState } from "../redux/slices/enquirySlice";
import {
  setNewEnquiryDataDb,
  clearNewEnquiryState,
} from "../redux/slices/setNewEnquiryDataSlice";
import { setShowMessage } from "../redux/slices/notificationSlice";

import { useMemo } from "react";
import { it } from "date-fns/locale";
import State from "./singleComponents/villageCom/state";
import District from "./singleComponents/villageCom/District";
import Taluka from "./singleComponents/villageCom/Taluka";
import Village from "./singleComponents/villageCom/village";
export default function Enquiry({ workFor, villageId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state;
  const enquiryState = useSelector((state) => state.enquiryState.enquiryState);
  const setNewEnquiryDataState = useSelector(
    (state) => state.setNewEnquiryDataState.newEnquiryState
  );

  const [categoriesList, setCategoriesList] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editEnquiryDate, setEditEnquiryDate] = useState(null);
  const [editdeliveryDate, setEditDeliveryDate] = useState(null);
  const [editEnquiryData, setEditEnquiryData] = useState({});
  const [currentCategoryData, setCurrentCategoryData] = useState({
    id: "",
    fields: [],
  });
  const [enquiryData, setEnquiryData] = useState({
    category: "",
    firstName: "",
    lastName: "",
    emailId: "",
    state: "",
    city: "",
    district: "",
    tehsil: "",
    village: "",
    mobileNumber: "",
    brand: "",
    whatsappNumber: "",
    visitReason: "",
    // sourceOfEnquiry: "",
    modelYear: "",
  });
  const [newEnquiryData, setNewEnquiryData] = useState({
    branchId: "",
    dsp: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    state: "",
    district: "",
    tehsil: "",
    block: "",
    village: "",
    ssp: "",
    make: "",
    model: "",
    enquiryPrimarySource: "",
    sourceOfEnquiry: "",
    enquiryDate: new Date(),
    deliveryDate: new Date(),
    cuustomerCategory: "",
    modeOfFinance: "",
    bank: "",
    oldTractorOwned: "0",
  });

  const [newEnquiryList, setNewEnquiryList] = useState({
    listBranch: [],
    listDsp: [],
    listDistrict: [],
    listTehsil: [],
    listBlock: [{ id: "11" }, { id: "22" }, { id: "33" }],
    listVillage: [],
    listSsp: [],
    listMake: [],
    listModel: [],
    listPrimarySource: [],
    listSourceOfEnquiry: [],
    listCustomerCategory: [],
    listModeOfFinance: [
      { id: 1, name: "Cash" },
      { id: 2, name: "Credit Card" },
      { id: 3, name: "Debit Card" },
    ],
    listBank: [
      { id: 1, name: "State Bank Of India" },
      { id: 2, name: "Bank Of Baroda" },
    ],
  });
  function clearStateAndInp() {
    setNewEnquiryData({
      branchId: "",
      dsp: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      mobileNumber: "",
      email: "",
      whatsappNumber: "",
      state: "",
      district: "",
      tehsil: "",
      block: "",
      village: "",
      ssp: "",
      make: "",
      model: "",
      enquiryPrimarySource: "",
      sourceOfEnquiry: "",
      enquiryDate: new Date(),
      deliveryDate: new Date(),
      cuustomerCategory: "",
      modeOfFinance: "",
      bank: "",
      oldTractorOwned: "0",
    });

    const inpClr = document.getElementsByClassName("inpClr");
    Array.from(inpClr).forEach((i) => {
      console.log("inpClr ", i, i.value, i.type);
      if (i.type === "select-one") {
        i.value = 0;
      } else if (i.type === "text") {
        i.value = "";
      }
    });
  }
  function saveBtnCalled() {
    console.log("newEnquiryList", newEnquiryList);
    console.log("newEnquiryData", newEnquiryData);
    if (
      newEnquiryData.branchId &&
      newEnquiryData.dsp &&
      newEnquiryData.firstName &&
      newEnquiryData.lastName &&
      newEnquiryData.fatherName &&
      newEnquiryData.mobileNumber &&
      newEnquiryData.district &&
      newEnquiryData.state &&
      newEnquiryData.tehsil &&
      newEnquiryData.block &&
      newEnquiryData.village &&
      newEnquiryData.make &&
      newEnquiryData.model &&
      newEnquiryData.enquiryPrimarySource &&
      newEnquiryData.sourceOfEnquiry &&
      newEnquiryData.enquiryDate
    ) {
      // dispatch(setNewEnquiryDataDb(newEnquiryData));
    } else {
      dispatch(setShowMessage("Please fill mandatory fields"));
    }
  }
  function clearState() {
    setCurrentCategoryData({
      id: "",
      fields: [],
    });
    setEnquiryData({
      category: "",
      firstName: "",
      lastName: "",
      state: "",
      city: "",
      district: "",
      tehsil: "",
      village: "",
      mobileNumber: "",
      brand: "",
      whatsappNumber: "",
      visitReason: "",
      sourceOfEnquiry: "",
      modelYear: "",
    });
  }

  useEffect(() => {
    if (editEnquiryData && Object.keys(editEnquiryData).length > 0) {
      console.log(editEnquiryData.date, "branchs");
      setNewEnquiryData({
        branchId: editEnquiryData.branch_id,
        firstName: editEnquiryData.first_name,
        lastName: editEnquiryData.last_name,
        fatherName: editEnquiryData.middle_name,
        email: editEnquiryData.email,
        mobileNumber: editEnquiryData.phone_number,
        whatsappNumber: editEnquiryData.whatsapp_number,
        state: Number(editEnquiryData.state),
        district: Number(editEnquiryData.district),
        tehsil: Number(editEnquiryData.taluka),
        village: Number(editEnquiryData.village),
        dsp: editEnquiryData.salesperson_id,
        model: editEnquiryData.product_id,
      });
      setEnquiryData({
        state: Number(editEnquiryData.state),
        district: Number(editEnquiryData.district),
        tehsil: Number(editEnquiryData.taluka),
        village: Number(editEnquiryData.village),
      });
      getModelList(1);
      getSourceOfEnquiryList(2);
      const enquiryDate = new Date(editEnquiryData.date);
      setEditEnquiryDate(enquiryDate);
      const deliveryDate = new Date(editEnquiryData.delivery_date);
      setEditDeliveryDate(deliveryDate);
    }
  }, [editEnquiryData]);
  useEffect(() => {
    if (setNewEnquiryDataState.isSuccess) {
      if (setNewEnquiryDataState.data.isSuccess) {
        dispatch(clearNewEnquiryState());
        clearStateAndInp();
        dispatch(setShowMessage("Enquiry is registered"));
        navigate("/sale/enquiries");
      }
    }
  }, [setNewEnquiryDataState]);

  async function getEnquiryCategories() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-enquiry-categories`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        // setRoles(response.data.result)
        if (response.data.isSuccess) {
          setCategoriesList(response.data.result);
        }
      }
    });
  }
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

          const { branches, manufacturers, primary_source, district } =
            response.data.result;
          setNewEnquiryList((newEnquiryList) => ({
            ...newEnquiryList,
            ["listBranch"]: branches,
          }));
          setNewEnquiryList((newEnquiryList) => ({
            ...newEnquiryList,
            ["listMake"]: manufacturers,
          }));
          setNewEnquiryList((newEnquiryList) => ({
            ...newEnquiryList,
            ["listPrimarySource"]: primary_source,
          }));
          setNewEnquiryList((newEnquiryList) => ({
            ...newEnquiryList,
            ["listDistrict"]: district,
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
        if (response.data.isSuccess) {
          console.log("response.data", response.data);
          // setCategoriesList(response.data.result)
          setNewEnquiryList((newEnquiryList) => ({
            ...newEnquiryList,
            ["listModel"]: response.data.result,
          }));
        }
      }
    });
  }
  async function getSourceOfEnquiryList(id) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-source-enquiry/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          setNewEnquiryList((newEnquiryList) => ({
            ...newEnquiryList,
            ["listSourceOfEnquiry"]: response.data.result,
          }));
        }
      }
    });
  }
  async function getTehsilList(id) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-tehsil/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          setNewEnquiryList((newEnquiryList) => ({
            ...newEnquiryList,
            ["listTehsil"]: response.data.result,
          }));
        }
      }
    });
  }
  async function getVillageList(id) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-village/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          setNewEnquiryList((newEnquiryList) => ({
            ...newEnquiryList,
            ["listVillage"]: response.data.result,
          }));
        }
      }
    });
  }
  useEffect(() => {
    if (workFor === "editEnquiry" && customerId) {
      const getEditEnquiryData = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-edit-enquiry-data/${customerId}`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        await axios.get(url, config).then((response) => {
          if (response.data) {
            console.log(response.data.result, "edtiEnquiry dara");
            setEditEnquiryData(response.data.result);
          }
        });
      };
      getEditEnquiryData();
    }
  }, [workFor]);
  useEffect(() => {
    // if (workFor === "newEnquiry") {
    getBranchs();
    // }
    // return;
  }, []);

  useEffect(() => {
    getEnquiryCategories();
  }, []);
  function cancelHandler() {
    navigate("/sale/enquiries");
  }
  useEffect(() => {
    if (enquiryData.village) {
      const getDsplist = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-dsp-by-village/${enquiryData.village}/${categoryId}`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        await axios.get(url, config).then((response) => {
          if (response.data.isSuccess) {
            console.log(response.data.result, "response.data.result");
            setNewEnquiryList((newEnquiryList) => ({
              ...newEnquiryList,
              ["listDsp"]: response.data.result,
            }));
          }
        });
      };
      getDsplist();
    }
  }, [enquiryData.village]);

  async function getFieldCurrentCategories(id) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-current-fields/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          setCurrentCategoryData((currentCategoryData) => ({
            ...currentCategoryData,
            fields: response.data.result,
          }));
        }
      }
    });
  }

  useEffect(
    (e) => {
      if (categoriesList.length > 0) {
        const firstCategoryId = categoriesList[0].id.toString();
        setSelectedCategory(firstCategoryId);
        setEnquiryData((enquiryData) => ({
          ...enquiryData,
          category: firstCategoryId,
        }));
      }
    },
    [categoriesList]
  );

  useEffect(() => {
    console.log("enquiryData", enquiryData);
    console.log("enquiryData", workFor);
    const idIs = enquiryData.category;
    console.log(idIs, "idddddddddddd");

    if (enquiryData.category != 0) {
      setCurrentCategoryData((currentCategoryData) => ({
        ...currentCategoryData,
        id: idIs,
      }));
      setCategoryId(idIs);
      getFieldCurrentCategories(idIs);
    }
  }, [enquiryData.category]);

  useEffect(() => {
    if (enquiryState && enquiryState.result.result === "success") {
      dispatch(setShowMessage("Enquiry Registered Successfully !"));
      dispatch(clearEnquiryState());
      navigate("/sale/enquiries");
    }
  }, [enquiryState]);
  async function handleSubmit() {
    if(workFor){
      console.log(workFor, 'woro')
    }
    console.log("currentCategoryData", currentCategoryData);
    const branchId = await localStorage.getItem("currentDealerId");
    const dsp = newEnquiryData.dsp;
    const model = newEnquiryData.model;
    const make = newEnquiryData.make;
    const enquiryPrimarySource = newEnquiryData.enquiryPrimarySource;
    const sourceOfEnquiry = newEnquiryData.sourceOfEnquiry;
    const modeOfFinance = newEnquiryData.modeOfFinance;
    const bank = newEnquiryData.bank;
    const oldTractorOwned = newEnquiryData.oldTractorOwned;
    enquiryData.branchId = branchId;
    enquiryData.dsp = dsp;
    enquiryData.model = model;
    enquiryData.make = make;
    enquiryData.enquiryPrimarySource = enquiryPrimarySource;
    enquiryData.sourceOfEnquiry = sourceOfEnquiry;
    enquiryData.modeOfFinance = modeOfFinance;
    enquiryData.bank = bank;
    enquiryData.oldTractorOwned = oldTractorOwned;

    dispatch(setEnquiryDb(enquiryData));
  }

  function getSelectedFields(data) {
    switch (data.field) {
      case "branchId":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select Branch *
            </label>
            <select
              onChange={changeHandlerNewEnquiry}
              className="myInput inpClr"
              name="branchId"
              defaultValue={newEnquiryData.branchId}
            >
              <option value="0" className="myLabel">
                select
              </option>
              {newEnquiryList.listBranch &&
                newEnquiryList.listBranch.length > 0 &&
                newEnquiryList.listBranch.map((i, index) => {
                  return (
                    <option
                      selected={i.id == newEnquiryData.branchId ? true : false}
                      key={index}
                      value={i.id}
                      className="myLabel"
                    >
                      {i.name}
                    </option>
                  );
                })}
            </select>
          </section>
        );
        break;
      case "dsp":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select DSP *
            </label>
            <select
              onChange={changeHandlerNewEnquiry}
              className="myInput inpClr"
              name="dsp"
              defaultValue={newEnquiryData.dsp}
            >
              <option value="0" className="myLabel">
                select
              </option>
              {newEnquiryList.listDsp &&
                newEnquiryList.listDsp.length > 0 &&
                newEnquiryList.listDsp.map((i, index) => {
                  return (
                    <option
                      selected={i.userId == newEnquiryData.dsp ? true : false}
                      key={index}
                      value={i.userId}
                      className="myLabel"
                    >{`${i.sale_person}`}</option>
                  );
                })}
            </select>
          </section>
        );
        break;
      case "firstName":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel">First name*</label>
            <input
              onChange={changeHandler}
              className="myInput inputElement"
              autoComplete="false"
              type="text"
              name="firstName"
              defaultValue={newEnquiryData.firstName}
            />
          </section>
        );
        break;
      case "lastName":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel">Last name*</label>
            <input
              onChange={changeHandler}
              className="myInput inputElement"
              autoComplete="false"
              type="text"
              name="lastName"
              defaultValue={newEnquiryData.lastName}
            />
          </section>
        );
        break;
      case "fatherName":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel">Father name*</label>
            <input
              onChange={changeHandler}
              className="myInput inputElement"
              autoComplete="false"
              type="text"
              name="fatherName"
              defaultValue={newEnquiryData.fatherName}
            />
          </section>
        );
        break;
      case "email":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel">Email*</label>
            <input
              onChange={changeHandler}
              className="myInput inputElement"
              autoComplete="false"
              type="text"
              name="emailId"
              defaultValue={newEnquiryData.email}
            />
          </section>
        );
        break;

      case "state":
        return (
          <State
            onSelectedState={onSelectedStatedata}
            stateId={enquiryData.state}
          />
        );
        break;
        {
          /* case "city":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select city*
            </label>
            <select onChange={changeHandler} className="myInput" name="city">
              <option value="ahemdabad" className="myLabel">
                Ahemdabad
              </option>
              <option value="vadodara" className="myLabel">
                Vadodara
              </option>
              <option value="surat" className="myLabel">
                Surat
              </option>
            </select>
          </section>
        );
        break;*/
        }
      case "district":
        return (
          <District
            onSelectedDistrict={onSelectedDistrictdata}
            stateId={enquiryData.state}
            districtId={enquiryData.district}
          />
        );
        break;

      case "taluko":
        return (
          <Taluka
            onSelectedTaluka={onSelectedTalukadata}
            districtId={enquiryData.district}
            talukaId={enquiryData.tehsil}
          />
        );
        break;
      case "village":
        return (
          <Village
            onSelectedVillage={onSelectedVillagedata}
            talukaId={enquiryData.tehsil}
            villageId={enquiryData.village}
          />
        );
        break;
      case "make":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select Make *
            </label>
            <select
              onChange={changeHandlerNewEnquiry}
              className="inpClr myInput"
              name="make"
              defaultValue={newEnquiryData.make}
            >
              <option value="0" className="myLabel">
                select
              </option>
              {newEnquiryList.listMake &&
                newEnquiryList.listMake.length > 0 &&
                newEnquiryList.listMake.map((i, index) => {
                  return (
                    <option
                      selected={i.id == 1 ? true : false}
                      key={index}
                      value={i.id}
                      className="myLabel"
                    >
                      {i.name}
                    </option>
                  );
                })}
            </select>
          </section>
        );
        break;
      case "primarySource":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Enquiry Primary Source *
            </label>
            <select
              onChange={changeHandlerNewEnquiry}
              className="inpClr myInput"
              name="enquiryPrimarySource"
              defaultValue={2}
            >
              <option value="0" className="myLabel">
                select
              </option>
              {newEnquiryList.listPrimarySource &&
                newEnquiryList.listPrimarySource.length > 0 &&
                newEnquiryList.listPrimarySource.map((i, index) => {
                  return (
                    <option
                      selected={i.id == 2 ? true : false}
                      key={index}
                      value={i.id}
                      className="myLabel"
                    >
                      {i.name}
                    </option>
                  );
                })}
            </select>
          </section>
        );
        break;
      case "sourceOfEnquiry":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select Source Of Enquiry *
            </label>
            <select
              onChange={changeHandlerNewEnquiry}
              className="inpClr myInput"
              name="sourceOfEnquiry"
              defaultValue={3}
            >
              <option value="0" className="myLabel">
                select
              </option>
              {newEnquiryList.listSourceOfEnquiry &&
                newEnquiryList.listSourceOfEnquiry.length > 0 &&
                newEnquiryList.listSourceOfEnquiry.map((i, index) => {
                  return (
                    <option key={index} value={i.id} className="myLabel">
                      {i.name}
                    </option>
                  );
                })}
            </select>
          </section>
        );
        break;

      case "mobileNumber":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Mobile number
            </label>
            <input
              onChange={changeHandler}
              className="myInput inputElement"
              autoComplete="false"
              type="text"
              name="mobileNumber"
              defaultValue={newEnquiryData.mobileNumber}
            />
          </section>
        );

        break;
      case "whatsappNumber":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Whatsapp number
            </label>
            <input
              onChange={changeHandler}
              className="myInput inputElement"
              autoComplete="false"
              type="text"
              name="whatsappNumber"
              defaultValue={newEnquiryData.whatsappNumber}
            />
          </section>
        );
        break;
      case "oldTractor":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="ms-1 myLabel" htmlFor="email">
              Old Tractor Owned{" "}
            </label>
            <div className="d-flex">
              <input
                value="0"
                onChange={changeHandler}
                type="radio"
                id="html"
                name="oldTractorOwned"
              />
              <label className="ms-1 myLabel" htmlFor="email">
                Yes
              </label>
              <input
                defaultChecked
                value="0"
                onChange={changeHandler}
                className="ms-3"
                type="radio"
                id="css"
                name="oldTractorOwned"
              />
              <label className="ms-1 myLabel" htmlFor="email">
                No
              </label>
            </div>
          </section>
        );

        {
          /* break;
      case "sourceOfEnquiry":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select source of enquiry
            </label>
            <select
              onChange={changeHandler}
              className="myInput"
              name="sourceOfEnquiry"
            >
              <option value="calling" className="myLabel">
                Calling
              </option>
              <option value="digital" className="myLabel">
                Digital
              </option>
              <option value="workShop" className="myLabel">
                Work shop
              </option>
            </select>
          </section>
        );
        break;
      case "brand":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select brand
            </label>
            <input
              onChange={changeHandler}
              className="myInput inputElement"
              autoComplete="false"
              type="text"
              name="brand"
            />
          </section>
        );*/
        }
        break;
      case "modal":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select Model *
            </label>
            <select
              onChange={changeHandlerNewEnquiry}
              className="inpClr myInput"
              name="model"
              defaultValue={newEnquiryData.model}
            >
              <option value="0" className="myLabel">
                select
              </option>
              {newEnquiryList.listModel &&
                newEnquiryList.listModel.length > 0 &&
                newEnquiryList.listModel.map((i, index) => {
                  return (
                    <option
                      selected={i.id === 1 ? true : false}
                      key={index}
                      value={i.id}
                      className="myLabel"
                    >
                      {i.name}
                    </option>
                  );
                })}
            </select>
          </section>
        );
        break;
      case "enquiryDate":
        return (
          <section className="datePicker d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              EnquiryDate *
            </label>
            <DatePicker
              selected={editEnquiryDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) =>
                setNewEnquiryData((newEnquiryData) => ({
                  ...newEnquiryData,
                  ["enquiryDate"]: date,
                }))
              }
            />
          </section>
        );
        break;
      case "deliveryDate":
        return (
          <section className="datePicker d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Expected Delivery Date
            </label>
            <DatePicker
              selected={editdeliveryDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) =>
                setNewEnquiryData((newEnquiryData) => ({
                  ...newEnquiryData,
                  ["deliveryDate"]: date,
                }))
              }
            />
          </section>
        );
        break;
      case "modeOfFinance":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select Mode Of Finance{" "}
            </label>
            <select
              onChange={changeHandlerNewEnquiry}
              className="inpClr myInput"
              name="modeOfFinance"
              defaultValue={'Cash'}
            >
              <option value="0" className="myLabel">
                select
              </option>
              {newEnquiryList.listModeOfFinance &&
                newEnquiryList.listModeOfFinance.length > 0 &&
                newEnquiryList.listModeOfFinance.map((i, index) => {
                  return (
                    <option key={index} value={i.name} className="myLabel">
                      {i.name}
                    </option>
                  );
                })}
            </select>
          </section>
        );
        break;
      case "bank":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Select Bank{" "}
            </label>
            <select
              onChange={changeHandlerNewEnquiry}
              className="inpClr myInput"
              name="bank"
              defaultValue={'State Bank Of India'}
            >
              <option value="0" className="myLabel">
                select
              </option>
              {newEnquiryList.listBank &&
                newEnquiryList.listBank.length > 0 &&
                newEnquiryList.listBank.map((i, index) => {
                  return (
                    <option selected={i.name == 'State Bank Of India' ? true : false} key={index} value={i.name} className="myLabel">
                      {i.name}
                    </option>
                  );
                })}
            </select>
          </section>
        );
        break;

        {
          /*case "modelYear":
        return (
          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Enter model year
            </label>
            <input
              onChange={changeHandler}
              className="myInput inputElement"
              autoComplete="false"
              type="text"
              name="modelYear"
            />
          </section>
        );
        break;*/
        }
    }
  }

  function changeHandlerNewEnquiry(e) {
    const name = e.target.name;
    const value = e.target.value;
    setNewEnquiryData((newEnquiryData) => ({
      ...newEnquiryData,
      [name]: value,
    }));
    if (value === "" || value === 0) {
    } else {
      // setNewEnquiryData(newEnquiryData => ({ ...newEnquiryData, [name]: value }))
      switch (name) {
        // case "village":
        //   getDsplist(value);
        //   break;
        // case "branchId":
        //   getDspList(value);
        //   break;
        case "make":
          getModelList(value);
          break;
        case "enquiryPrimarySource":
          getSourceOfEnquiryList(value);
          break;
        case "district":
          getTehsilList(value);
          break;
        case "tehsil":
          getVillageList(value);
          break;
      }
    }
  }
  function changeHandler(e) {
    const name = e.target.name;
    const value = e.target.value;
    if (value === "") {
      clearState();
    } else {
      setEnquiryData((enquiryData) => ({ ...enquiryData, [name]: value }));
    }
  }
  const onSelectedState = (val) => {
    setNewEnquiryData((pre) => {
      return { ...pre, state: val };
    });
  };

  const onSelectedDistrict = (val) => {
    setNewEnquiryData((pre) => {
      return { ...pre, district: val };
    });
  };

  const onSelectedTaluka = (val) => {
    setNewEnquiryData((pre) => {
      return { ...pre, tehsil: val };
    });
  };

  const onSelectedVillage = (val) => {
    setNewEnquiryData((pre) => {
      return { ...pre, village: val };
    });
  };

  const onSelectedStatedata = (val) => {
    setEnquiryData((pre) => {
      return { ...pre, state: val };
    });
  };
  const onSelectedDistrictdata = (val) => {
    setEnquiryData((pre) => {
      return { ...pre, district: val };
    });
  };
  const onSelectedTalukadata = (val) => {
    setEnquiryData((pre) => {
      return { ...pre, tehsil: val };
    });
  };
  const onSelectedVillagedata = (val) => {
    setEnquiryData((pre) => {
      return { ...pre, village: val };
    });
  };
  const redirectModal = () => {
    navigate(-1);
  };

  return (
    <main className="bg-white p-3 rounded">
      <div className=" row m-0">
        <div className="col-6">
          <h5 className="m-0">
            {workFor === "Enquiry" ? "Enquiry" : "Edit Enquiry"}
          </h5>
        </div>
        <div className="col-6 d-flex align-items-end justify-content-end">
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
            BACK
          </Button>
        </div>

        {workFor === "Enquiry" && (
          <>
            <div className="row mt-3 m-0">
              {/* <div className="d-flex align-items-end justify-content-end">
              <div
                onClick={() => {
                  navigate("/sale/enquiryies/newenquiry");
                }}
                className="d-flex align-items-center"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <h6 className="m-0 ps-1">New Enquiry</h6>
              </div>
              </div>*/}

              <section className="d-flex mt-3 flex-column col-12 col-lg-5">
                <label className="myLabel" htmlFor="email">
                  Select category *
                </label>
                <select
                  onChange={changeHandler}
                  className="myInput"
                  name="category"
                >
                  {/* <option value="" className="myLabel">
                  select category
              </option> */}
                  {categoriesList.length > 0 &&
                    categoriesList.map((item, index) => {
                      return (
                        <option value={item.id} key={index} className="myLabel">
                          {item.category_name}
                        </option>
                      );
                    })}
                </select>
              </section>
            </div>

            {enquiryData.category != "" && currentCategoryData.id != "" && (
              <>
                <div className="row mt-2 m-0">
                  {currentCategoryData.fields.length > 0 ? (
                    <>
                      {currentCategoryData.fields.map((i) => {
                        return getSelectedFields(i);
                      })}
                    </>
                  ) : (
                    <h6>There is no selected fields</h6>
                  )}
                  {currentCategoryData.fields.length > 0 && (
                    <section className="d-flex pt-3 flex-column flex-sm-row">
                      <button
                        className="col-12 col-sm-5 col-lg-2 myBtn py-2"
                        onClick={handleSubmit}
                        type="button"
                      >
                        Submit{" "}
                      </button>
                    </section>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {workFor === "editEnquiry" && (
          <>
            <div className="row mt-3 m-0">
              {/* <div className="d-flex align-items-end justify-content-end">
          <div
            onClick={() => {
              navigate("/sale/enquiryies/newenquiry");
            }}
            className="d-flex align-items-center"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            <h6 className="m-0 ps-1">New Enquiry</h6>
          </div>
          </div>*/}

              <section className="d-flex mt-3 flex-column col-12 col-lg-5">
                <label className="myLabel" htmlFor="email">
                  Select category *
                </label>
                <select
                  onChange={changeHandler}
                  className="myInput"
                  name="category"
                >
                  {/* <option value="" className="myLabel">
              select category
          </option> */}
                  {categoriesList.length > 0 &&
                    categoriesList.map((item, index) => {
                      return (
                        <option value={item.id} key={index} className="myLabel">
                          {item.category_name}
                        </option>
                      );
                    })}
                </select>
              </section>
            </div>

            {enquiryData.category != "" && currentCategoryData.id != "" && (
              <>
                <div className="row mt-2 m-0">
                  {currentCategoryData.fields.length > 0 ? (
                    <>
                      {currentCategoryData.fields.map((i) => {
                        return getSelectedFields(i);
                      })}
                    </>
                  ) : (
                    <h6>There is no selected fields</h6>
                  )}
                  {currentCategoryData.fields.length > 0 && (
                    <section className="d-flex pt-3 flex-column flex-sm-row">
                      <button
                        className="col-12 col-sm-5 col-lg-2 myBtn py-2"
                        onClick={handleSubmit}
                        type="button"
                      >
                        Submit{" "}
                      </button>
                    </section>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
