import { breadcrumbsClasses } from '@mui/material'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const breadcrumb = {
    backgroundColor: 'white',
    border: '1px solid rgba(0, 0, 0.125)',
    borderRadius: '0.37rem'
}
const BreadCrumb = () => {
    const location = useLocation();
    let currentLink = '';
    const crumbs = location.pathname.split('/').filter(crumb => crumb !== '').map(crumb => {
        currentLink += `/${crumb}`
        return (
            <div className='crumb' key={crumb}>
                <Link to={currentLink}>{crumb}</Link>
            </div>
            
        )
    })
    console.log(crumbs, 'route');
    return (
            <div className="breadcrumbs" id="breadcrumbs">
                {crumbs}
            </div>
    )
}

export default BreadCrumb
