import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../redux/authSlice";
import { deleteAccount } from "../../api/api";

const Profile = () => {
    const authenticatedUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleDeleteProfile = async () => {
        deleteAccount(authenticatedUser.id);
        setTimeout(() => {
            dispatch(clearToken());
        }, 1000);
    };
    const handleLogout = () => {
        dispatch(clearToken());
    };
    return (
        <div className="container">
            <header className="header">
                <h1>Profile</h1>
                <button onClick={handleDeleteProfile}>Delete Profile</button>

                <h1>Log out</h1>
                <button onClick={handleLogout}>Log out</button>
            </header>
        </div>
    );
};

export default Profile;
