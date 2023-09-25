import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';

const BreadCrumb = () => {
    const location = useLocation();
    const crumbs = location.pathname
        .split('/')
        .filter((crumb) => crumb !== '');
      console.log(crumbs, "crumbscrumbscrumbscrumbs");
    return (
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
                          {crumb.replace(/-/g, "  ")}
                        </Link>
                        {index === array.length - 1 && !isLastCrumb && (
                          <ExpandMoreIcon fontSize="small" />
                        )}
                      </Typography>
                    );
                })}
            </Breadcrumbs>
        </div>
    );
};

export default BreadCrumb;
