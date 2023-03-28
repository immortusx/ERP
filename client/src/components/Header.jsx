import React from 'react'
import '../styles/Header.css'
import { Link } from 'react-router-dom'
export default function Header() {
    return (
        <header>
            <nav className="navbarDiv navbar navbar-expand-sm navbar-light">
                <div className="container-fluid">
                    <Link className="p-0 navbar-brand" to="/">
                        {/* <img className='mx-2' style={{ height: '24px', width: '24px' }} src={logo} alt="Logo" /> */}
                        <h4 className='p-0 m-0'>
                            <strong>RBAC</strong>
                        </h4>
                    </Link>
                    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul id='ulOfList' className="navbar-nav">
              <li className="nav-item">
                <Link to="/conversation" className=" nav-link ">
                  Conversations
                </Link>
              </li>
            </ul>

          </div> */}
                </div>
            </nav>
        </header>
    )
}
