import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../redux/authSlice";
import { deleteAccount } from "../../api/api";
import { RootState } from "../../redux/store";
import styles from "./profile.module.css";

const Profile = () => {
    const authenticatedUser = useSelector((state: RootState) => state.user);
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
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Profile</h1>
                <button onClick={handleDeleteProfile}>Delete Profile</button>

                <h1>Log out</h1>
                <button onClick={handleLogout}>Log out</button>
            </div>
        </div>
    );
};

export default Profile;
