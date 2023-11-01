import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import LanguageSelector from '../languageSelector';
import translations from '../../assets/locals/translations';

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

  useEffect(() => {
    
    function updateBreadcrumbs() {
      const breadcrumbContainer = document.getElementById('breadcrumb');
      breadcrumbContainer.innerHTML = ''; 

      crumbs.forEach((crumb, index, array) => {
        const currentLink = `/${array.slice(0, index + 1).join('')}`;
        const isLastCrumb = index === array.length - 1;

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

              
              <Breadcrumbs aria-label="breadcrumb" separator="">
                {crumbs.map((crumb, index, array) => {
                  const currentLink = `/${array.slice(0, index + 1).join('/')}`;
                  const isLastCrumb = index === array.length - 1;

                  return (
                    <Typography key={index} color="textPrimary">
                      <Link
                        component={RouterLink}
                        to={currentLink}
                        color={isLastCrumb ? 'textPrimary' : 'inherit'}
                      >
                        {crumb}
                      </Link>
                    </Typography>
                  );
                })}
              </Breadcrumbs>

    // Initial update when the page loads
    updateBreadcrumbs();
  }, [crumbs, currentLanguage]);

  return (
    <div class="container">
      <div class="row">
        <div class="col-md-9">
          <div className='mb-3'>
            <div>
              <ul id="breadcrumb">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/profile/agency">Agency</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className='col-md-3' style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
