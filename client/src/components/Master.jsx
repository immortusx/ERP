import React from "react";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/master.scss";
import Axios from "axios";
import translations from '../assets/locals/translations';
export default function Master() {
  const currentLanguage = useSelector((state) => state.language.language);
  async function checkagencyexist() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/agency/add-agency-exist`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    try {
      const response = await Axios.get(url, config);
      console.log(response.data, "response.data?.isSuccess");
      if (response.data?.isSuccess && response.data.result) {
        console.log("editagency");
        navigate("/administration/configuration/agency");
      } else {
        console.log("addagency");
        navigate("/administration/configuration/addagency");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const navigate = useNavigate();
  return (
    <div className="master bg-white myBorder rounded">
      <main className="my-3">
        <div className="mx-3 m-0">
          <h6 className="fw-bold m-0">{translations[currentLanguage].configuration}</h6>
        </div>
        <section>
          <hr />
          <div className="mx-3 m-0">
            <h6 className="fw-bold myH9 m-0">{translations[currentLanguage].basicsetup}</h6>
          </div>
          <hr />
          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/state");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].state}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/district");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].district}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/taluka");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].taluka}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/village");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].village}</span>
              </main>
            </li>
          </ul>
        </section>
        <section>
          <hr />
          <div className="mx-3 m-0">
            <h6 className="fw-bold myH9 m-0">{translations[currentLanguage].agencysetting}</h6>
          </div>
          <hr />
          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={checkagencyexist}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].agency}</span>
              </main>
            </li>
          </ul>
        </section>
        <section>
          <hr />
          <div className="mx-3 m-0">
            <h6 className="fw-bold myH9 m-0">{translations[currentLanguage].mastersetting}</h6>
          </div>
          <hr />
          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/branch");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].branch}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/category");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].category}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/department");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].department}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/manufacturer");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].manufacturer}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/Task");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].task}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/enquirysources");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].enqsources}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/holiday");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].holiday}</span>
              </main>
            </li>
            <li className="col-12 col-sm-4 col-md-4  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/message");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].message}</span>
              </main>
            </li>

          </ul>
        </section>
        <section>
          <hr />
          <div className="mx-3 m-0">
            <h6 className="fw-bold myH9 m-0">{translations[currentLanguage].part}</h6>
          </div>
          <hr />
          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/partlist");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].parts}</span>
              </main>
            </li>
          </ul>
        </section>

        <section>
          <hr />
          <div className="mx-3 m-0">
            <h6 className="fw-bold myH9 m-0">{translations[currentLanguage].tax}</h6>
          </div>
          <hr />
          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/configuration/tax");
                }}
                className="d-flex align-items-center"
              >
                <div className="myBtnRight">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-chevron-double-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
                <span className="ms-2">{translations[currentLanguage].taxs}</span>
              </main>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
