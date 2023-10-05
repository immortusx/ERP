import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector} from "react-redux";
import translations from '../assets/locals/translations';
const Report = () => {
  const navigate = useNavigate();
  const currentLanguage = useSelector((state) => state.language.language);
  return (
    <div className="master bg-white myBorder rounded">
      <main className="my-3">
        <div className="mx-3 m-0">
          <h6 className="fw-bold m-0">{translations[currentLanguage].workassign}</h6>
        </div>
        <section>
          <hr />

          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/report/TotalEnquiry");
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
                <span className="ms-2">{translations[currentLanguage].totalenq}</span>
              </main>
            </li>
          </ul>
          <hr />

          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/report/WorkAssignArea");
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
                <span className="ms-2">{translations[currentLanguage].workassinarea}</span>
              </main>
            </li>
          </ul>
        </section>
      </main>
      <hr />

      <main className="my-3">
        <div className="mx-3 m-0">
          <h6 className="fw-bold m-0">{translations[currentLanguage].workreport} </h6>
        </div>
        <section>
          <hr />

          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main
                onClick={() => {
                  navigate("/administration/report/workreport");
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
                <span className="ms-2">{translations[currentLanguage].workreport} </span>
              </main>
            </li>
          </ul>
          <hr />
        </section>
      </main>
    </div>
  );
};
export default Report;
