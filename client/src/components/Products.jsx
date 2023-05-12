import React from 'react'

export default function Products() {
  return (
    <div>
      <ul className="nav nav-pills mb-3 justify-content-center justify-content-md-start " id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">User Management</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Roles Management</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Site Settings</button>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
          Products
        </div>
        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">..2.</div>
        <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">...33</div>
      </div>
    </div>
  )
}
