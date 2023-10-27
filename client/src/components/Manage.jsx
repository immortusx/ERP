import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import translations from '../assets/locals/translations';
import MyLeave from "./MyLeave";

export default function Master() {
  const navigate = useNavigate();
  const [showMyLeave, setShowMyLeave] = useState(false);
  const handleMyLeaveClick = () => {
    setShowMyLeave(!showMyLeave);
     navigate("/management/manage/myleave");
  };
  const currentLanguage = useSelector((state) => state.language.language);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const [language, setLanguage] = useState('en');
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div className="master bg-white myBorder rounded">
      <main className="my-3">
        <div className="mx-3 m-0">
          <h6 className="fw-bold m-0">
                <p>{translations[currentLanguage].manage}</p></h6>
          
        </div>
        <section>
          <hr />
          <div className="mx-3 m-0">
            <h6 className="fw-bold myH9 m-0"> <p>{translations[currentLanguage].myleave}</p></h6>
          </div>
          <hr />
          <ul className="row m-0 px-2">
            <li className="col-12 col-sm-4 col-md-3  d-flex align-items-center p-2">
              <main onClick={handleMyLeaveClick} className="d-flex align-items-center">
                <div className="myBtnRight">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                    <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
                <span className="ms-2"> <p>{translations[currentLanguage].myleave}</p></span>
              </main>
            </li>
          </ul>
        </section>
      </main>
      {showMyLeave && < MyLeave/>}
    </div>
  );
}