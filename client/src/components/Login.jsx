import React, { useState, useEffect } from "react";
import logo from "../assets/images/suits.png";
import agencyCover from "../assets/images/crmcover.jpg";
import handshake from "../assets/images/handshake.png";
import "../styles/login.css";
import "../styles/Registration.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLoginUser, clearLoginState } from "../redux/slices/getLoginSlice";
import {
  getProfileData,
  clearProfileDataSliceState,
} from "../redux/slices/profileSlice";
import { setShowMessage } from "../redux/slices/notificationSlice";
import lg from "../assets/images/lg.png";
import eyeIcon from "../assets/images/view.png";
import eyeIconClose from "../assets/images/hide.png";
import axios from "axios";
import LanguageSelector from "./languageSelector";
import downloadIcon from "../assets/images/apps.png";
import translations from "../assets/locals/translations";
import { Spinner } from "react-bootstrap";

const Login = () => {
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.getLoginSlice.loginState);
  const profileDataState = useSelector((state) => state.profileData.profile);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState("en");
  const currentLanguage = useSelector((state) => state.language.language);
  const navigate = useNavigate();
  const [agencyData, setAgencyData] = useState({
    agencyName: "",
    angencyLogo: null,
  });
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  useEffect(() => {
    const retrieveAgencyProfile = async () => {
      const url = `${process.env.REACT_APP_NODE_URL}/api/agency/get-agencylogo`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      setLoading(true);
      await axios.get(url, config).then((response) => {
        if (response && response.data && response.data.result && response.data.result.length > 0) {
          console.log(response.data, "agnecyc");
          if(response.data.result[0].value === undefined){
            console.log(response.data.result[0].value, "test");
          }
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
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const downloadAndroidApp = async () => {
    console.log("Downloading Android.....");
    const androidApkUrl = `${process.env.REACT_APP_NODE_URL}/api/download`;
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = androidApkUrl;
    anchor.download = "android-app.apk";
    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);

    // Listen for the download to finish or fail
    anchor.addEventListener("load", () => {
      // Download successful
      console.log("Download successful");
    });

    anchor.addEventListener("error", () => {
      // Download failed, show an alert
      console.error("Download failed");
      window.alert("Application not found");
    });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const downloadiOsApp = async () => {
    console.log("Downloading iOs.....");
    window.alert("App Not Found");
  };

  useEffect(() => {
    if (currentLanguage) {
      console.log(currentLanguage, translations, "gdkgg");
      console.log(translations[currentLanguage].login);
    }
  }, [currentLanguage]);

  const handleSubmit = () => {
    if (loginData.username.length > 0 && loginData.password.length > 0) {
      dispatch(getLoginUser(loginData));
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", loginData.username);
      }
    } else {
      dispatch(setShowMessage("Please fill all the fields"));
    }
  };

  useEffect(() => {
    // Check if there is a remembered username
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    if (rememberedUsername) {
      setLoginData({ ...loginData, username: rememberedUsername });
      setRememberMe(true); // Check the Remember Me checkbox
    }
  }, []);

  useEffect(() => {
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
      navigate("/home");
    }
  }, [profileDataState, navigate]);

  useEffect(() => {
    if (loginState.isSuccess === true) {
      if (loginState.result.message === "success") {
        localStorage.setItem(
          "dealersList",
          JSON.stringify(loginState.result.result.branchResult)
        );
        localStorage.setItem("rbacToken", loginState.result.result.tokenIs);
        localStorage.setItem(
          "currentDealerId",
          loginState.result.result.currentBranch
        );
        const token = localStorage.getItem("rbacToken");
        if (!token) {
          return;
        } else {
          dispatch(getProfileData(token));
          dispatch(setShowMessage("Welcome to Vehicle Management System"));
        }
      } else if (loginState.result.message !== "success") {
        dispatch(setShowMessage("Credentials are wrong"));
      } else {
        dispatch(setShowMessage("Something is wrong"));
      }
      dispatch(clearLoginState());
    } else if (loginState.isError === true) {
      dispatch(setShowMessage("Something is wrong"));
    }
  }, [loginState, dispatch]);
  const renderLogo = () => {
    if (loading) {
      return <Spinner className="spinner-white" size={10} />;
    } else if (agencyData.angencyLogo) {
      return (
        <img
          src={`${process.env.REACT_APP_NODE_URL}/api${agencyData.angencyLogo}`}
          alt="Logo"
          className="logo-centered crm-cover shadow p-1 rounded"
        />
      );
    } else {
      return (
        <img
          src={agencyCover}
          alt="Logo"
          className="logo-centered crm-cover shadow p-1"
        />
      );
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 d-flex align-items-center justify-content-center inner-cover cover-bg">
          <div className="">
            <div className="d-flex align-items-center justify-content-center inner-logo">
              <img src={handshake} alt="Logo" className="logo" />
            </div>
            <h2 className="inner-welcome">Welcome to {agencyData.agencyName ? agencyData.agencyName : 'Customer Relationship Management System'}</h2>
            <div className="horizontal-line"></div>
            <h5 className="tag-line"></h5>
            <div>
              <div className="d-flex align-items-center justify-content-center inner-logo">
               <div>{renderLogo()}</div>
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8 d-flex align-items-center justify-content-center inner-signin-cover signin-cover-bg">
          <div className="container mx-4">
            <div className="d-flex justify-content-end mb-4">
              <div className="image-container">
                <div className="download-container">
                  <div
                    className="download-bar"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {isHovered ? (
                      <div className="download-menu-container">
                        <button
                          className="download-button"
                          onClick={downloadiOsApp}
                        >
                          {/* {translations[currentLanguage].ios} */}
                          ios
                        </button>
                        <button
                          className="download-button"
                          onClick={downloadAndroidApp}
                        >
                          {/* {translations[currentLanguage].android} */}
                          android
                        </button>
                      </div>
                    ) : (
                      <img
                        src={downloadIcon}
                        alt="app"
                        height={20}
                        width={25}
                        style={{ marginRight: "2px", marginTop: "1px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <LanguageSelector
                onChangeLanguage={(e) => setLanguage(e.target.value)}
              />
            </div>
            <h2 className="sign-in-heading">Login</h2>
            <div className="line"></div>
            <p className="welcome-message">Welcome Back! Please Sign In.</p>
            <div className="">
              <div className=" mt-3 p-4">
                <section className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {translations[currentLanguage].username}{" "}
                  </label>
                  <input
                    className="form-control custom-input"
                    onChange={(e) => {
                      setLoginData({
                        ...loginData,
                        username: e.target.value,
                      });
                    }}
                    onKeyDown={handleKeyDown}
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter Email/Mobile Number"
                  />
                </section>
                <section className="mb-3">
                  <label htmlFor="password" className="form-label login-label">
                    {translations[currentLanguage].password}
                  </label>
                  <div className="input-group">
                    <input
                      className="form-control custom-input"
                      onChange={(e) => {
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        });
                      }}
                      onKeyDown={handleKeyDown}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter Password"
                    />
                    <span
                      className="input-group-text"
                      id="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <img
                        src={showPassword ? eyeIconClose : eyeIcon}
                        alt="Toggle Password"
                        height={20}
                        width={20}
                      />
                    </span>
                  </div>
                </section>
                <section className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      {translations[currentLanguage].rememberMe}
                    </label>
                  </div>
                </section>
                <section className="mb-3">
                  <button
                    className="btn btn-block custom-login-button"
                    style={{ fontSize: "18px" }}
                    onClick={handleSubmit}
                    type="submit"
                  >
                    {translations[currentLanguage].loginButton}
                  </button>
                </section>
                <section className="mb-3">
                  <button
                    className="btn btn-block custom-forgot-btn"
                    style={{ fontSize: "18px" }}
                    type="button"
                  >
                    {translations[currentLanguage].forgotPassword}
                  </button>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
