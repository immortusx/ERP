import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/Users.css";

const UserProfile = () => {
    const profileDataState = useSelector((state) => state.profileData.profile);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    //    console.log('currentPasswor')
        if (newPassword !== confirmPassword) {
          console.log("New password and confirm password don't match.");
          return;
        }
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);
        console.log('Confirm Password:', confirmPassword);
    
        // Here you would make an API request to change the password
        // You can use a library like Axios for this
        // Example: axios.post('/api/change-password', { currentPassword, newPassword });
      };
  

    useEffect(() => {
        // console.log('userdetails');
        // console.log(profileDataState.currentUserData.result.email, 'state');
        setUserData({
            firstName: profileDataState.currentUserData.result.first_name,
            lastName: profileDataState.currentUserData.result.last_name,
            email: profileDataState.currentUserData.result.email,
            phoneNumber: profileDataState.currentUserData.result.phone_number,
        })
    }, [profileDataState])

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    })



    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
        }, 1000); // Reset the typing state after 1 second
    };

    return (
        <div className="editUser myBoeder bg-white rounded p-3 height-85">
            <main>
                <div className="row mt-3 m-0 col-6 ">
                    <h3>Edit Profile</h3>

                </div>
                <div className="container mt-3">
                    <form className="row">
                        <div className="userd1 col-md-6 d-flex align-item-center flex-column">
                            <div class="panel">
                                <h5>User Detail</h5>

                                <div className="userdet d-flex mt-3 flex-column col-12 col-sm-6 col-lg-auto">

                                    <p ><span className="sp" >First Name </span>: {userData.firstName}</p>

                                </div>
                                <div className="userdet d-flex mt-4 flex-column col-12 col-sm-6 col-lg-auto">
                                    <p ><span className="sp">Last Name </span>: {userData.lastName}</p>

                                </div>

                                <div className="userdet d-flex mt-4 flex-column col-12 col-sm-6 col-lg-auto">
                                    <p ><span className="sp">Email </span>: {userData.email}</p>

                                </div>
                                <div className="userdet d-flex mt-4 flex-column col-12 col-sm-6 col-lg-auto">
                                    <p><span className="sp">Mobile no. </span>: {userData.phoneNumber} </p>

                                </div>

                            </div>
                        </div>
                        <div className="userd col-md-6" >
                            <h5>Change Password</h5>

                            <form onSubmit={handleSubmit}>
                                <label className="lbu">Email</label>
                                <input
                                    value={userData.email}
                                    type="email"
                                    disabled={true}
                                    placeholder="Enter current password"
                                    className={`input-field ${isTyping ? 'hover-while-typing' : ''}`}
                                    onChange={handleInputChange}
                                />
                            </form>

                            <div>
                                <label className="lbu">Current Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter current password"
                                    className={`input-field ${isTyping ? 'hover-while-typing' : ''}`}

                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="lbu">New Password</label>
                                <input type="password"
                                    placeholder="Enter new password"
                                    className={`input-field ${isTyping ? 'hover-while-typing' : ''}`}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="lbu">Confirm New Password</label>
                                <input type="password"
                                    placeholder="Enter confirm password"
                                    className={`input-field ${isTyping ? 'hover-while-typing' : ''}`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                            </div>
                            <button type="submit" className="btnc" >Change Password</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
export default UserProfile;