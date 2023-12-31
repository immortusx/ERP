import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import LanguageSelector from '../languageSelector';
import translations from '../../assets/locals/translations';
import RouterLink from 'react'
import { red } from '@mui/material/colors';

const BreadCrumb = () => {
  const currentLanguage = useSelector((state) => state.language.language);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const [language, setLanguage] = useState('en');
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleDownloadIos = () => {
    window.alert("App Not Found")
  };

  const handleDownloadAndroid = () => {

    console.log("Downloading Android.....")
    const androidApkUrl = `${process.env.REACT_APP_NODE_URL}/api/download`;
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = androidApkUrl;
    anchor.download = 'android-app.apk';
    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
  };
  const location = useLocation();
  const crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb !== '');
  console.log(crumbs, "crumbscrumbscrumbscrumbs");
  return (
    <div class="container">
      <div class="row  shadow mb-3 bg-white rounded">
        <div class="col-md-9 mt-2">
          <div className='mb-2 '>
            <div className='headerListUi'>
              {/* <ul id="breadcrumb">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/profile/agency">Agency</Link></li>
              </ul>   */}
              {/* 
              <Breadcrumbs aria-label="breadcrumb" separator="">
                {crumbs.map((crumb, index, array) => {
                  const currentLink = `/${array.slice(0, index + 1).join('')}`;
                  const isLastCrumb = index === array.length - 1;
                  const isCrumb = array.filter((crumb) => crumb !== 'home');
                  return (
                    <Typography key={index} color="textPrimary">
                      <Link
                        className="crumb-link"
                        to={currentLink}
                        color={isLastCrumb ? "textPrimary" : "inherit"}
                      >
                        {translations[currentLanguage][crumb.replace(/-/g, " ")] || crumb.replace(/-/g, " ")}
                      </Link>
                      {index === array.length - 1 && !isLastCrumb && (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </Typography>
                  );
                })}
              </Breadcrumbs> */}
              {/* <ul id="breadcrumb">
                <li><a href="">Home</a></li>
                <li><a href="">Profile</a></li>
                <li><a href="">Agency</a></li>
            
              </ul> */}
              <Breadcrumbs  aria-label="breadcrumb">
                {crumbs.map((crumb, index, array) => {
                  const currentLink = `/${array.slice(0, index + 1).join('/')}`;
                  const isLastCrumb = index === array.length - 1;
                  const isCrumb = array.filter((crumb) => crumb !== 'home');
                  return (
                    <Typography key={index} color="textPrimary">
                      <Link
                        className="crumb-link"
                        to={currentLink}
                        color={isLastCrumb ? "textPrimary" : "inherit"}
                      >
                        {translations[currentLanguage][crumb.replace(/--/g, " ")] || crumb.replace(/--/g, " ")}
                      </Link>
                      {index === array.length - 1 && !isLastCrumb && (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </Typography>
                  );
                })}
              </Breadcrumbs>
            </div>
          </div>
        </div>
        <div className='col-md-3 mt-2' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="download-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '-2px' }}>
            <div className="download-bar" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              {isHovered ? (
                <div className="download-menu-container">
                  <button className="download-button" onClick={handleDownloadIos}>{translations[currentLanguage].ios}</button>
                  <button className="download-button" onClick={handleDownloadAndroid}>{translations[currentLanguage].android}</button>
                </div>
              ) : (
                <p>{translations[currentLanguage].download}</p>
              )}
            </div>
          </div>
          <div>
            <LanguageSelector onChangeLanguage={(e) => setLanguage(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;
