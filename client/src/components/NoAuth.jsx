import React from 'react'
import { Link } from 'react-router-dom'
export default function NoAuth() {
    return (
        <div className='mt-5 h-100 w-100'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h2 className=''>
                    No authorization
                </h2>
                <h6 className='mt-3'>
                    back to <Link className='text-normal' to='profile'>
                        Profile
                    </Link>

                </h6>
            </div>
        </div>

    )
}
