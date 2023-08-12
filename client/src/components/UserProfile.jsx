import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Users.css";
import axios from 'axios';
import { setShowMessage } from "../redux/slices/notificationSlice";
const UserProfile = () => {
    const dispatch = useDispatch();
    const profileDataState = useSelector((state) => state.profileData.profile);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setValidationMessage("New password and confirm password don't match.");
            return;
        } else {
            try {
                console.log("Helo");
                const url = `${process.env.REACT_APP_NODE_URL}/api/users/changepassword`;
                const config = {
                    headers: {
                        token: localStorage.getItem("rbacToken"),
                    },
                };
                const data = {
                    currentPassword: currentPassword,
                    confirmPassword: confirmPassword,
                    email: userData.email
                };

                const response = await axios.post(url, data, config).then((response) => {
                    if (response.data && response.data.isSuccess === true) {
                        dispatch(setShowMessage("Password Changed Successfully!"))                        

                    }
                })

                // console.log("Password change response:", response.data);

                // Handle any further actions or feedback based on the API response

            } catch (error) {
                console.error("Error changing password:", error);
                // Handle error, show error message, etc.
            }


        }


        // if (!validatePassword(newPassword)) {
        //     setValidationMessage("Password must meet the criteria (e.g., at least 8 characters, uppercase, lowercase, numbers, special characters).");
        //     return;
        // }
        setValidationMessage('');

        console.log("handleSubmit");
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);
        console.log('Confirm Password:', confirmPassword);

        // Here you would make an API request to change the password
        // You can use a library like Axios for this
        // Example: axios.post('/api/change-password', { currentPassword, newPassword });
    };
    const validatePassword = (password) => {
        // Implement your password validation criteria here
        return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password);
    };


    useEffect(() => {
        if (profileDataState.currentUserData && profileDataState.currentUserData.result) {
            setUserData({
                firstName: profileDataState.currentUserData.result.first_name,
                lastName: profileDataState.currentUserData.result.last_name,
                email: profileDataState.currentUserData.result.email,
                phoneNumber: profileDataState.currentUserData.result.phone_number,
            })
        }
        // console.log('userdetails');
        // console.log(profileDataState.currentUserData.result.email, 'state');

    }, [profileDataState])





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

                            <form>
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
                            {validationMessage && (
                                <p style={{ color: 'red' }}>{validationMessage}</p>
                            )}

                            <button onClick={handleSubmit} className="btnc" >Change Password</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
export default UserProfile;