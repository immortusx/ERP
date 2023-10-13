import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import "../styles/HomeScreen.css";

import Header from "./Header";
import Users from "./Users";
import AddUser from "./AddUser";
import AddEmployee from "./AddEmployee";
import AddRole from "./AddRole";
import NoAuth from "./NoAuth";
import EnquiryList from "./EnquiryList";
import AddDepartment from "./AddDepartment";
import AddCategory from "./AddCategory";
import AddAgency from "./AddAgency";
import Sales from "./Sales";
import Manage from "./Manage";
import Profile from "./Profile";
import Enquiry from "./Enquiry";
import FollowUp from "./FollowUp";
import Products from "./Products";
import Master from "./Master";
import Employees from "./Employees";
import MyTask from "./MyTask";
import Login from "./Login";
import AreaAssignListList from "./AreaAssignListList";
import AddAssignArea from "./AddAssignArea";
import Total_Enquiry from "./Master/Work Assign/Total_Enquiry";
import Work_Assign_Area from "./Master/Work Assign/Work_Assign_Area";
import { useSelector, useDispatch } from "react-redux";
import {
  getProfileData,
  clearCurrentUserData,
  clearProfileDataSliceState,
} from "../redux/slices/profileSlice";

import { clearUserListState } from "../redux/slices/getUserListSlice";
import { setShowMessage } from "../redux/slices/notificationSlice";
import {
  tokenBranchChangeDb,
  clearTokenBranchState,
} from "../redux/slices/tokenBranchChangeSlice";

import {
  useLocation,
  NavLink,
  Link,
  useNavigate,
  Navigate,
  BrowserRouter,
  Route,
  Routes,
  json,
} from "react-router-dom";
import EnquiryCategories from "./EnquiryCategories";
import logo from "../assets/svg/logo.svg";
import logoT from "../assets/svg/logofinal.svg";
import Branch from "./Branch";
import State_list from "./Master/State/State_list";
import District_list from "./Master/District/District_list";
import Village_list from "./Master/Village/Village_list";
import Taluka_list from "./Master/Taluka/Taluka_list";
import Plan_List from "./Master/Plan/Part_List";
import Part_List from "./Master/Plan/Part_List";
import BreadCrumb from "./BreadCrumb/BreadCrumb";
import Manufacturer_list from "./Master/Manufacturer/Manufacturer_list";
import Manufacturer_modal from "./Master/Manufacturer/Manufacturer_modal";
import Department_list from "./Master/Department/Department_list";
import Category_list from "./Master/Category/Category_list";
import Profile_list from "./Profile";
import Roles from "./Roles";
import Tax from "./Master/Tax/Tax";
import Sub_Modal from "./Master/Manufacturer/Sub_modal";
import Variants from "./Master/Manufacturer/Sub_modal";
import Dashboard from "./Dashboard";
import UserProfile from "./UserProfile";
import Report from "./Report";
import Task from "./Task";
import AssignTask from "./AddTask";
import UserTaskDetails from "./UserTaskDetails";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import EnquirySources from "./Master/EnquirySources/EnquirySources";
import EnquirySources_model from "./Master/EnquirySources/EnquirySources_modal";
import WorkReport from "./WorkReport";
import WorkReportDetails from "./WorkReportDetails";
import translations from '../assets/locals/translations'
const CheckPermission = ({ children, path }) => {
  // return checkList.includes(path) ? children : <Navigate to="../no-access" />
  // return checkList.includes(path) ? children : <h3>No access</h3>
  const rolesArray = localStorage.getItem("rolesArray");
  const checkList = rolesArray.split(",");
  // console.log('path', path)
  // console.log('children', window.location.pathname)
  // console.log('checkList.includes(path)', checkList.includes(path));
  return checkList.includes(path) ? children : <NoAuth></NoAuth>;
};

export default function HomeScreen() {
  const currentLanguage = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const bottomDiv = useRef();
  const adminAsideRef = useRef();
  const toggleBtnRef = useRef();
  const [bottomDivState, setBottomDivState] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBranch, setCurrentBranch] = useState([]);
  const profileDataState = useSelector((state) => state.profileData.profile);
  const allState = useSelector((state) => state);
  const tokenBranchState = useSelector(
    (state) => state.tokenBranchChangeState.tokenBranchState
  );
  const [agencyData, setAgencyData] = useState({
    agencyName: "",
    angencyLogo: null,
  });
  const agencyLogo = `${process.env.REACT_APP_NODE_URL}/api${agencyData.logo}`;
  useEffect(() => {
    const retrieveAgencyProfile = async () => {
      const url = `${process.env.REACT_APP_NODE_URL}/api/agency/get-agencybyid`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      setLoading(true);
      await axios.get(url, config).then((response) => {
        if (response && response.data) {
          console.log(response.data.result[3].value);
          setAgencyData({
            agencyName: response.data.result[0].value,
            angencyLogo: response.data.result[3].value,
          });
        }
      });
      setLoading(false);
    };
    retrieveAgencyProfile();
  }, []);
  useEffect(() => {
    if (tokenBranchState.isSuccess) {
      if (tokenBranchState.data.isSuccess) {
        localStorage.setItem("rbacToken", tokenBranchState.data.result);

        console.log("tokenBranchState &&&&&&&&&&&&&&", tokenBranchState);
        // dispatch(getProfileData(tokenBranchState.data.result))
        dispatch(clearTokenBranchState());
        console.log("please redirect to home");
        navigate("/home");

        window.location.reload();
      }
    }
  }, [tokenBranchState]);

  useEffect(() => {
    const collapse = document.getElementsByClassName("activeLink");
    if (collapse.length > 0) {
      collapse[0].parentElement.parentElement.parentElement.classList.add(
        "show"
      );
    }
  }, []);

  useEffect(() => {
    console.log(
      "profileDataState",
      profileDataState.currentUserData,
      "profile.........."
    );
    if (
      profileDataState.isSuccess &&
      profileDataState.currentUserData.isSuccess
    ) {
      const rolesArray = [];
      Array.from(profileDataState.currentUserData.result.features).filter(
        (i) => {
          rolesArray.push(i.feature);
        }
      );
      localStorage.setItem("rolesArray", rolesArray);
      localStorage.setItem(
        "userData",
        JSON.stringify(profileDataState.currentUserData.result)
      );
      dispatch(clearProfileDataSliceState());
      // navigate('/home')
    } else if (profileDataState.isError) {
      dispatch(setShowMessage("Server is temporarily unavailable"));
    }
  }, [profileDataState]);

  useEffect(() => {
    if (bottomDivState) {
      let handler = (event) => {
        if (!bottomDiv.current.contains(event.target)) {
          setBottomDivState(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }
  }, [bottomDivState]);

  useEffect(() => {
    document.getElementsByTagName("body")[0].style.backgroundColor = "#edf1f4";
  }, []);
  const checkTabGrant = useCallback((pathAr) => {
    let success = false;
    const rolesArray = localStorage.getItem("rolesArray");
    const checkList = rolesArray.split(",");
    pathAr.forEach((element) => {
      if (checkList.includes(element)) {
        success = true;
      }
    });
    return success;
  }, []);
  function logOutHandler() {
    localStorage.clear();
    dispatch(clearUserListState());
    dispatch(clearProfileDataSliceState());
    dispatch(clearCurrentUserData());
    dispatch(clearCurrentUserData());
    dispatch(clearProfileDataSliceState());

    navigate("/login");
    <NavLink
      className={({ isActive }) =>
        isActive ? "activeLink" : ""
      }
      to="login"
    >
      {translations[currentLanguage].products}
    </NavLink>
  }
  function getDateTime(time) {
    const data = new Date(time);
    const newDate = data.toDateString("DD-MM-YYYY");
    const newTime = data.toLocaleTimeString();
    return `${newDate} ${newTime}`;
  }

  function branchListChange(e) {
    let selectedBranchId = e.target.value;
    localStorage.setItem("currentBranchId", selectedBranchId);
    dispatch(tokenBranchChangeDb(selectedBranchId));
  }
  function toggleHandler() {
    if (document.getElementById("root").classList.contains("toggleSideBar")) {
      document.getElementById("root").classList.remove("toggleSideBar");
    } else {
      document.getElementById("root").classList.add("toggleSideBar");
    }
  }
  const handleLogoClick = () => {
    navigate('/home/dashboard');
  };

  const openDashboard = () => {
    navigate("/home/dashboard");
  };
  useEffect(() => {
    let jsonData = localStorage.getItem("dealersList");
    let branchesList = JSON.parse(jsonData);
    // set here branchesList
    setCurrentBranch(branchesList);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      <aside ref={adminAsideRef} className="asideNav">
        <button
          onClick={toggleHandler}
          ref={toggleBtnRef}
          className="toggleBtn"
        >
          <main className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="headSvg bi bi-chevron-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          </main>
        </button>
        <main className="asideMain">
          <section className="outerSection">
            <div className="logoDiv" onClick={handleLogoClick}>
              {loading ? (
                <Spinner className="spinner-white" size={10} />
              ) : agencyData.angencyLogo ? (
                <img
                  className="rounded logoB"
                  src={`${process.env.REACT_APP_NODE_URL}/api${agencyData.angencyLogo}`}
                  alt="Agency"
                  height={100}
                  width={100}
                />
              ) : (
                <div className="alert alert-danger text-center" role="alert">
                  <p
                    style={{
                      color: "red",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    <strong>*Please,</strong> First Create Agency.
                  </p>
                </div>
              )}
              <h6 className="agency-style">{agencyData.agencyName}</h6>

              <img
                className="logoT d-none rounded"
                src={`${process.env.REACT_APP_NODE_URL}/api${agencyData.angencyLogo}`}
                alt="Logo"
                height={70}
                width={70}
              />
            </div>

            <ul id="accordionExample" className="outUl">
              {checkTabGrant(["profile"]) && (
                <li className="outLi">
                  <button
                    className="headBtn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#home-collapseOne"
                    aria-expanded="false"
                    aria-controls="home-collapseOne"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="headSvg bi bi-house"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                    </svg>
                    <span onClick={openDashboard}>{translations[currentLanguage].home}</span>
                  </button>
                  <div
                    id="home-collapseOne"
                    data-bs-parent="#accordionExample"
                    className="accordion-collapse collapse"
                  >
                    <ul className="inUl">
                      {checkTabGrant(["profile"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="home/profile/agency"
                          >
                            {translations[currentLanguage].agencyp}
                          </NavLink>
                        </li>
                      )}
                      {checkTabGrant(["dashboard"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="home/dashboard"
                          >
                            {translations[currentLanguage].dashboard}
                          </NavLink>
                        </li>
                      )}

                      {checkTabGrant(["user-profile"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="home/profiles"
                          >
                            {translations[currentLanguage].profile}
                          </NavLink>
                        </li>
                      )}
                      {/* {
                        checkTabGrant(['profile']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="enquiry" >
                            Enquiry
                          </NavLink>
                        </li>
                      } */}
                    </ul>
                  </div>
                </li>
              )}
              {checkTabGrant(["sales"]) && (
                <li className="outLi">
                  <button
                    className="headBtn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sale-collapse"
                    aria-expanded="false"
                    aria-controls="sale-collapse"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-graph-up-arrow"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"
                      />
                    </svg>
                    <span>{translations[currentLanguage].sale}</span>
                  </button>
                  <div
                    id="sale-collapse"
                    data-bs-parent="#accordionExample"
                    className="accordion-collapse collapse"
                  >
                    <ul className="inUl">
                      {checkTabGrant(["sales"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="sale/enquiries"
                          >
                            {translations[currentLanguage].enquiry}
                          </NavLink>
                        </li>
                      )}
                    </ul>
                  </div>
                </li>
              )}
              {checkTabGrant(["service"]) && (
                <li className="outLi">
                  <button
                    className="headBtn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#service-collapseOne"
                    aria-expanded="false"
                    aria-controls="service-collapseOne"
                  >
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="headSvg bi bi-house" viewBox="0 0 16 16">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                  </svg> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-grid"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                    </svg>
                    <span>{translations[currentLanguage].service}</span>
                  </button>
                  <div
                    id="service-collapseOne"
                    data-bs-parent="#accordionExample"
                    className="accordion-collapse collapse"
                  >
                    <ul className="inUl">
                      {checkTabGrant(["products"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="service/products"
                          >
                            {translations[currentLanguage].products}
                          </NavLink>
                        </li>
                      )}
                      {checkTabGrant(["sales"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="service/sales"
                          >
                            {translations[currentLanguage].sales}
                          </NavLink>
                        </li>
                      )}
                    </ul>
                  </div>
                </li>
              )}
              {checkTabGrant(["manage"]) && (
                <li className="outLi">
                  <button
                    className="headBtn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#manage-collapseOne"
                    aria-expanded="false"
                    aria-controls="manage-collapseOne"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-diagram-3-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z"
                      />
                    </svg>
                    <span>  {translations[currentLanguage].management}</span>
                  </button>
                  <div
                    id="manage-collapseOne"
                    data-bs-parent="#accordionExample"
                    className="accordion-collapse collapse"
                  >
                    <ul className="inUl">
                      {checkTabGrant(["manage"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="management/manage"
                          >
                            {translations[currentLanguage].manage}
                          </NavLink>
                        </li>
                      )}
                      {checkTabGrant(["manage"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="management/my-task"
                          >
                            {translations[currentLanguage].mytask}
                          </NavLink>
                        </li>
                      )}
                    </ul>
                  </div>
                </li>
              )}
              {checkTabGrant([
                "roles",
                "add-role",
                "add-user",
                "edit-user",
                "users",
                "configuration",
                "branch",
                "employee",
                "add-employee",
              ]) && (
                  <li className="outLi">
                    <button
                      className="headBtn"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#admin-collapseOne"
                      aria-expanded="false"
                      aria-controls="admin-collapseOne"
                    >
                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="headSvg bi bi-house" viewBox="0 0 16 16">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                  </svg> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="bi bi-person-gear"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                      </svg>
                      <span>{translations[currentLanguage].administration}</span>
                    </button>
                    <div
                      id="admin-collapseOne"
                      data-bs-parent="#accordionExample"
                      className="accordion-collapse collapse"
                    >
                      <ul className="inUl">
                        {checkTabGrant(["roles"]) && (
                          <li className="inLi">
                            <NavLink
                              className={({ isActive }) =>
                                isActive ? "activeLink" : ""
                              }
                              to="administration/roles"
                            >
                              {translations[currentLanguage].roles}
                            </NavLink>
                          </li>
                        )}
                        {checkTabGrant(["users"]) && (
                          <li className="inLi">
                            <NavLink
                              className={({ isActive }) =>
                                isActive ? "activeLink" : ""
                              }
                              to="administration/users"
                            >
                              {translations[currentLanguage].users}
                            </NavLink>
                          </li>
                        )}
                        {checkTabGrant(["employee"]) && (
                          <li className="inLi">
                            <NavLink
                              className={({ isActive }) =>
                                isActive ? "activeLink" : ""
                              }
                              to="administration/employees"
                            >
                              {translations[currentLanguage].employee}
                            </NavLink>
                          </li>
                        )}
                        {checkTabGrant(["configuration"]) && (
                          <li className="inLi">
                            <NavLink
                              className={({ isActive }) =>
                                isActive ? "activeLink" : ""
                              }
                              to="administration/configuration"
                            >
                              {translations[currentLanguage].configuration}
                            </NavLink>
                          </li>
                        )}
                        {checkTabGrant(["report"]) && (
                          <li className="inLi">
                            <NavLink
                              className={({ isActive }) =>
                                isActive ? "activeLink" : ""
                              }
                              to="administration/report"
                            >
                              {translations[currentLanguage].report}
                            </NavLink>
                          </li>
                        )}

                        {/*need to remove this */}
                        {/* {
                        checkTabGrant(['users']) && <li className='inLi'>
                          <NavLink className={({ isActive }) => isActive ? 'activeLink' : ''} to="administration/enquirycategories" >
                            Enquiry categories
                          </NavLink>
                        </li>
                      } */}
                        {/* {checkTabGrant(["branch"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="administration/branch"
                          >
                            Branch
                          </NavLink>
                        </li>
                      )} */}
                      </ul>
                    </div>
                  </li>
                )}

              {/* {checkTabGrant(["profile"]) && (
                <li className="outLi">
                  <button
                    className="headBtn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#master-collapse"
                    aria-expanded="false"
                    aria-controls="master-collapse"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                    <span>Configuration</span>
                  </button>
                  <div
                    id="master-collapse"
                    data-bs-parent="#accordionExample"
                    className="accordion-collapse collapse"
                  >
                    <ul className="inUl">
                      {checkTabGrant(["profile"]) && (
                        <li className="inLi">
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? "activeLink" : ""
                            }
                            to="configuration"
                          >
                            Configuration
                          </NavLink>
                        </li>
                      )}
                    </ul>
                  </div>
                </li>
              )} */}
            </ul>
          </section>
          <div className="mb-3">
            <section className="profileSection outerSection">
              <div
                onClick={() => {
                  bottomDivState
                    ? setBottomDivState(false)
                    : setBottomDivState(true);
                }}
                id="asideProfilTab"
                type="button"
                className="d-flex flex-row"
              >
                <div className="myTextContainer">
                  <span className="text-uppercase">
                    {Object.keys(profileDataState.currentUserData).length
                      ? `${profileDataState?.currentUserData?.result?.first_name.slice(
                        0,
                        1
                      )}`
                      : "A"}
                  </span>
                </div>
                <div className="userNameDis ps-2 d-flex align-items-center ">
                  <h6 className="m-0 text-uppercase text-white">
                    {Object.keys(profileDataState.currentUserData).length
                      ? `${profileDataState?.currentUserData.result.first_name} ${profileDataState?.currentUserData.result.last_name}`
                      : "User"}
                  </h6>
                </div>
              </div>
              {bottomDivState && (
                <div ref={bottomDiv} className="logoutSideBar">
                  <div className="d-flex justify-content-between">
                    <h6 className="text-white">
                      Email :{" "}
                      {Object.keys(profileDataState.currentUserData).length >
                        0 &&
                        `${profileDataState?.currentUserData.result.email}`}
                    </h6>
                    <button
                      onClick={() => {
                        setBottomDivState(false);
                      }}
                      className="svgBtn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-x-lg"
                        viewBox="0 0 16 16"
                      >
                        gg
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                      </svg>
                    </button>
                  </div>
                  <h6 className="text-white mt-2">
                    Current branch :
                    <select
                      defaultValue={localStorage.getItem("currentBranchId")}
                      onChange={branchListChange}
                      className="mt-2 mySelectBox"
                      name=""
                      id=""
                    >
                      {currentBranch &&
                        currentBranch.length > 0 &&
                        currentBranch.map((branch, index) => {
                          return (
                            <option
                              className="branch-text-list"
                              key={index}
                              value={branch.id}
                            >
                              {branch.name}
                            </option>
                          );
                        })}
                    </select>
                  </h6>
                  <div className="mt-3 d-flex flex-column">
                    <div className="d-flex flex-wrap align-items-center border-bottom pb-2">
                      <div className="myTextContainer">
                        <span className="text-uppercase">
                          {Object.keys(profileDataState.currentUserData)
                            .length > 0
                            ? `${profileDataState?.currentUserData?.result?.first_name.slice(
                              0,
                              1
                            )}`
                            : "A"}
                        </span>
                      </div>
                      <span className="pt-2 ps-2 text-white myH7">
                        Last login :{" "}
                        {Object.keys(profileDataState.currentUserData).length >
                          0 &&
                          profileDataState?.currentUserData.result.last_login !=
                          null
                          ? getDateTime(
                            profileDataState?.currentUserData.result
                              .last_login
                          )
                          : "first time logged in"}
                      </span>
                    </div>
                    <div className="mt-3 d-flex justify-content-end">
                      <button
                        className="myBtn py-1 px-3"
                        onClick={logOutHandler}
                        href=""
                      >
                        {translations[currentLanguage].logout}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </aside>

      <main id="mainContainer" className="">
        <div className="container position-relative p-4">
          <BreadCrumb />
          <Routes>
            <Route path="no-access" element={<NoAuth />} exact />

            <Route
              path="profile"
              element={
                <CheckPermission path="profile">
                  <Profile />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="enquiry"
              element={
                <CheckPermission path="profile">
                  <Enquiry />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="sale/enquiries/enquiry"
              element={
                <CheckPermission path="profile">
                  <Enquiry workFor="Enquiry" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="sale/enquiries/editenquiry"
              element={
                <CheckPermission path="profile">
                  <Enquiry workFor="editEnquiry" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="sale/enquiries/followup"
              element={
                <CheckPermission path="profile">
                  <FollowUp />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="sale/enquiries/newenquiry"
              element={
                <CheckPermission path="profile">
                  <Enquiry workFor="newEnquiry" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="sale/enquiries"
              element={
                <CheckPermission path="profile">
                  <EnquiryList />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="sale/area-Assign"
              element={<AreaAssignListList />}
              exact
            />
            <Route
              path="sale/area-Assign/add-AsignArea"
              element={
                <CheckPermission path="profile">
                  <AddAssignArea />
                </CheckPermission>
              }
              exact
            />

            <Route
              path="administration/configuration"
              element={
                <CheckPermission path="profile">
                  <Master />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/state"
              element={
                <CheckPermission path="profile">
                  <State_list />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/district"
              element={
                <CheckPermission path="profile">
                  <District_list />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/village"
              element={
                <CheckPermission path="profile">
                  <Village_list />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/taluka"
              element={
                <CheckPermission path="profile">
                  <Taluka_list />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/part-list"
              element={
                <CheckPermission path="profile">
                  <Part_List />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/department"
              element={
                <CheckPermission path="profile">
                  <Department_list workFor="department" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/department/add"
              element={
                <CheckPermission path="profile">
                  <AddDepartment workFor="forAdd" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/department/edit"
              element={
                <CheckPermission path="profile">
                  <AddDepartment workFor="forEdit" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/manufacturer"
              element={
                <CheckPermission path="profile">
                  <Manufacturer_list />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/manufacturer-modal"
              element={
                <CheckPermission path="profile">
                  <Manufacturer_modal />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/manufacturer-modal/variants"
              element={
                <CheckPermission path="profile">
                  <Variants />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/enquirysources"
              element={
                <CheckPermission path="profile">
                  <EnquirySources workFor="forAddd" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/enquirysources-model"
              element={
                <CheckPermission path="profile">
                  <EnquirySources_model />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/tax"
              element={
                <CheckPermission path="profile">
                  <Tax />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/report"
              element={
                <CheckPermission path="users">
                  <Report />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/report/TotalEnquiry"
              element={
                <CheckPermission path="profile">
                  <Total_Enquiry />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/report/WorkAssignArea"
              element={
                <CheckPermission path="profile">
                  <Work_Assign_Area />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/report/workreport"
              element={
                <CheckPermission path="profile">
                  <WorkReport />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/report/workreport/details"
              element={
                <CheckPermission path="profile">
                  <WorkReportDetails />
                </CheckPermission>
              }
              exact
            />

            <Route
              path="service/sales"
              element={
                <CheckPermission path="sales">
                  <Sales />
                </CheckPermission>
              }
              exact
            />

            <Route
              path="management/manage"
              element={
                <CheckPermission path="manage">
                  <Manage />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="management/my-task"
              element={
                <CheckPermission path="manage">
                  <MyTask />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="login"
              element={
                <CheckPermission path="login">
                  <Login />
                </CheckPermission>
              }
              exact
            />

            <Route
              path="management/my-task/task-detail"
              element={
                <CheckPermission path="manage">
                  <UserTaskDetails />
                </CheckPermission>
              }
              exact
            />

            <Route
              path="administration/*"
              element={<Navigate to="/administration/roles" />}
              exact
            />
            <Route
              path="administration/roles"
              element={
                <CheckPermission path="roles">
                  <Roles workFor="roles" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/roles/add"
              element={
                <CheckPermission path="add-role">
                  <AddRole workFor="addRole" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/roles/edit"
              element={
                <CheckPermission path="add-role">
                  <AddRole workFor="forEdit" />
                </CheckPermission>
              }
              exact
            />

            <Route
              path="administration/users"
              element={
                <CheckPermission path="users">
                  <Users />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/employees"
              element={
                // <CheckPermission path="employees">
                <Employees />
                // </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/users/add"
              element={
                <CheckPermission path="add-user">
                  <AddUser workFor="forAdd" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/employees/add"
              element={
                // <CheckPermission path="add-employee">
                <AddEmployee workFor="forAdd" />
                // </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/employees/edit"
              element={
                // <CheckPermission path="add-role">
                <AddEmployee workFor="forEdit" />
                // </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/users/edit"
              element={
                <CheckPermission path="edit-user">
                  <AddUser workFor="forEdit" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/employees/editemployee"
              element={
                <CheckPermission path="edit-employee">
                  <AddEmployee workFor="forEdit" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/enquirycategories"
              element={
                <CheckPermission path="users">
                  <EnquiryCategories />
                </CheckPermission>
              }
              exact
            />

            <Route
              path="administration/configuration/category"
              element={
                <CheckPermission path="profile">
                  <Category_list workFor="category" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/category/add"
              element={
                <CheckPermission path="profile">
                  <AddCategory workFor="forAdd" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/category/edit"
              element={
                <CheckPermission path="profile">
                  <AddCategory workFor="forEdit" />
                </CheckPermission>
              }
              exact
            />

            <Route
              path="administration/configuration/branch"
              element={
                <CheckPermission path="branch">
                  <Branch workFor="branch" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/branch/add"
              element={
                <CheckPermission path="branch">
                  <Branch workFor="addBranch" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/branch/edit"
              element={
                <CheckPermission path="branch">
                  <Branch workFor="editBranch" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/Task"
              element={
                <CheckPermission path="profile">
                  <Task workFor="Task" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/Task/AssignTask"
              element={
                <CheckPermission path="profile">
                  <AssignTask workFor="addTask" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/Task/edit"
              element={
                <CheckPermission path="profile">
                  <AssignTask workFor="editTask" />
                </CheckPermission>
              }
              exact
            />

            <Route
              path="home/profile/agency"
              element={
                <CheckPermission path="profile">
                  <Profile_list workFor="forEdit" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="home/dashboard"
              element={
                <CheckPermission path="profile">
                  <Dashboard />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="home/profiles"
              element={
                <CheckPermission path="profile">
                  <UserProfile />
                </CheckPermission>
              }
              exact
            />
            {/*<Route
              path="administration/configuration/agency"
              element={
                <CheckPermission path="agency">
                  <Agency_list workFor="agency" />
                </CheckPermission>
              }
              exact
            /> */}

            <Route
              path="administration/configuration/addagency"
              element={
                <CheckPermission path="profile">
                  <AddAgency workFor="forAdd" />
                </CheckPermission>
              }
              exact
            />
            <Route
              path="administration/configuration/agency"
              element={
                <CheckPermission path="profile">
                  <Profile_list workFor="forEdit" />
                </CheckPermission>
              }
              exact
            />

            {/* <Route path='admin'>
          </Route> */}
            <Route
              path="service/products"
              element={
                <CheckPermission path="products">
                  <Products />
                </CheckPermission>
              }
              exact
            />

            <Route path="login" element={<Login />} exact />

            <Route path="*" element={<Navigate to="/home/dashboard" />} />
          </Routes>
        </div>
      </main>
    </>
  );
}
