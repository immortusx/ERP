import React from 'react'
import '../styles/NotificationBox.css'
export default function NotificationBox({ notificationState }) {
  return (


    <div className='notificationBox'>
      <h6>
        {notificationState}
      </h6>
    </div>
  )
}
