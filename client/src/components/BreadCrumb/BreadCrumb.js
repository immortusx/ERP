import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import LanguageSelector from '../languageSelector';
import enTranslations from "../../assets/locals/en.json"
import gjTranslations from "../../assets/locals/gj.json"

const BreadCrumb = () => {
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
    const androidDownloadUrl = `${process.env.REACT_APP_NODE_URL}/api/download`;
    const androidDownloadLink = document.createElement('a');
    androidDownloadLink.href = androidDownloadUrl;
    androidDownloadLink.click();
  };
  const location = useLocation();
  const crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb !== '');
  console.log(crumbs, "crumbscrumbscrumbscrumbs");
  return (
    <div class="container">
      <div class="row">
        <div class="col-md-9">
          <div className='mb-3'>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">

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
                      {crumb.replace(/-/g, " ")}
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
        <div className='col-md-3' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="download-container">
            <div className="download-bar" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              {isHovered ? (
                <div className="download-menu-container">
                  <button className="download-button" onClick={handleDownloadIos}>iOS</button>
                  <button className="download-button" onClick={handleDownloadAndroid}>Android</button>
                </div>
              ) : (
                <p>Download</p>
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
