import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/master.scss'


export default function Master() {
    const navigate = useNavigate() 
    return (
        <div className='master bg-white myBorder rounded'>
            <main className='my-3'>
                <div className='mx-3 m-0'>
                    <h6 className='fw-bold m-0'>
                        Configuration
                    </h6>
                </div>
                <section>
                    <hr />
                    <div className='mx-3 m-0'>
                        <h6 className='fw-bold myH9 m-0'>
                            BASIC SETUP
                        </h6>
                    </div>
                    <hr />
                    <ul className='row m-0 px-2'>
                        <li className='col-12 col-sm-4 col-md-3  d-flex align-items-center p-2'>
                            <main onClick={() => {
                                navigate('/configuration/state')
                            }} className='d-flex align-items-center'>
                                <div className='myBtnRight'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                                <span className='ms-2'>State</span>
                            </main>
                        </li>
                        <li className='col-12 col-sm-4 col-md-3  d-flex align-items-center p-2'>
                            <main onClick={() => {
                                navigate('/configuration/district')
                            }}  className='d-flex align-items-center'>
                                <div className='myBtnRight'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                                <span className='ms-2'>District</span>
                            </main>
                        </li>
                        <li className='col-12 col-sm-4 col-md-3  d-flex align-items-center p-2'>
                            <main onClick={() => {
                                navigate('/configuration/taluka')
                            }}  className='d-flex align-items-center'>
                                <div className='myBtnRight'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                                <span className='ms-2'>Taluka</span>
                            </main>
                        </li>
                        <li className='col-12 col-sm-4 col-md-3  d-flex align-items-center p-2'>
                            <main onClick={() => {
                                navigate('/configuration/village')
                            }} className='d-flex align-items-center'>
                                <div className='myBtnRight'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                                <span className='ms-2'>Village</span>
                            </main>
                        </li>
                    </ul>
                </section>
                <section>
                    <hr />
                    <div className='mx-3 m-0'>
                        <h6 className='fw-bold myH9 m-0'>
                            AGENCY SETTING
                        </h6>
                    </div>
                    <hr />
                    <ul className='row m-0 px-2'>
                        <li className='col-12 col-sm-4 col-md-3  d-flex align-items-center p-2'>
                            <main className='d-flex align-items-center'>
                                <div className='myBtnRight'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                                <span className='ms-2'>Agency</span>
                            </main>
                        </li>
                    </ul>
                </section>
                <section>
                    <hr />
                    <div className='mx-3 m-0'>
                        <h6 className='fw-bold myH9 m-0'>
                            MASTER SETTING
                        </h6>
                    </div>
                    <hr />
                    <ul className='row m-0 px-2'>
                        <li className='col-12 col-sm-4 col-md-3  d-flex align-items-center p-2'>
                            <main className='d-flex align-items-center'>
                                <div className='myBtnRight'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                                <span className='ms-2'>Branch</span>
                            </main>
                        </li>
                        <li className='col-12 col-sm-4 col-md-3  d-flex align-items-center p-2'>
                            <main className='d-flex align-items-center'>
                                <div className='myBtnRight'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                                <span className='ms-2'>Department</span>
                            </main>
                        </li>
                    </ul>
                </section>
                <section>
                    <hr />
                    <div className='mx-3 m-0'>
                        <h6 className='fw-bold myH9 m-0'>
                            PART
                        </h6>
                    </div>
                    <hr />
                    <ul className='row m-0 px-2'>
                        <li className='col-12 col-sm-4 col-md-3  d-flex align-items-center p-2'>
                            <main onClick={() => {
                                navigate('/configuration/part-list')
                            }} className='d-flex align-items-center'>
                                <div className='myBtnRight'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                                <span className='ms-2'>Part</span>
                            </main>
                        </li>
                    </ul>
                </section>
                <section>
                    <hr />
                    <div className='mx-3 m-0'>
                        <h6 className='fw-bold myH9 m-0'>
                            MANUFACTURER
                        </h6>
                    </div>
                    <hr />
                    <ul className='row m-0 px-2'>
                        <li className='col-12 col-sm-4 col-md-3  d-flex align-items-center p-2'>
                            <main onClick={() => {
                                navigate('/home/manufacturer-list')
                            }} className='d-flex align-items-center'>
                                <div className='myBtnRight'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                                <span className='ms-2'>Manufacturer List</span>
                            </main>
                        </li>                        
                    </ul>
                </section>           


            </main>
        </div >
    )
}
