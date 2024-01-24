import axios from "axios";
import { store } from "./store/index";
import { clearToken, setToken } from "./reducers/authSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const api = axios.create({ baseURL: BASE_URL });
const apiAuth = axios.create({ baseURL: BASE_URL });

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && !originalRequest._retry) {
            originalRequest._retry = true;
            if (error.response.status === 401) {
                try {
                    const response = await apiAuth.post("/api/login/refresh", {
                        refresh: store.getState().refreshToken,
                    });

                    // Update the states in redux store
                    store.dispatch(
                        setToken({
                            token: response.data.access,
                            refreshToken: store.getState().refreshToken,
                            user: store.getState().user,
                        })
                    );

                    // Set the new access token in the request headers and retry the original request
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (err) {
                    // If the refresh token is invalid, log the user out
                    store.dispatch(clearToken());
                }
            }
        }
        await errorCleanUp(error);
        return Promise.reject(error);
    }
);
apiAuth.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        await errorCleanUp(error);
        return Promise.reject(error);
    }
);

api.interceptors.request.use((config) => {
    // refreshRetries = 0;
    const token = store.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication endpoints
export const authenticate = (data) => apiAuth.post("/api/login", data);
export const signUp = (data) => apiAuth.post("/api/register", data);
export const fetchUserProfile = () => api.get("/api/user");
export const updateUserProfile = (data) => api.put("/api/user", data);
export const otpVerify = (data) => api.post("/api/otp_verify", data);
export const otpResend = (data) => api.post("/api/otp_resend", data);
export const passwordResetRequest = (data) => api.post("/api/pwd_reset", data);
export const passwordResetVerifyAndChange = (data) => api.put("/api/pwd_reset", data);
export const deleteAccount = (id) => api.delete(`/api/user/delete/${id}`);

// Activity endpoints
export const fetchActivities = (period) => api.get(`api/user/history/${period}`);
export const startActivity = (data) => api.post("/api/activity", data);
export const updateActivity = (id, data) => api.put(`/api/activity/${id}`, data);
export const deleteActivity = (id, data) => api.delete(`/api/activity/${id}`, data);

//Friendship endpoint
export const fetchFriends = () => api.get(`/api/friendships`);
export const acceptFriend = (id) => api.put(`/api/friendships/${id}`);
export const removeFriends = (id) => api.delete(`/api/friendships/${id}`);
export const sendFriendRequest = (userID) => api.post(`/api/friendships`, userID);
export const filteredUsers = (searchQuery) => {
    let url = "/api/filtered-friends";

    if (searchQuery) {
        url += `?q=${searchQuery}`;
    }
    return api.get(url);
};

// Achievements endpoint
export const fetchAchievements = (selectedFilter) => {
    let url = "/api/user/achievements";

    if (selectedFilter === "Personal") {
        url += `?personal=${true}`;
    } else if (selectedFilter !== "all") {
        url += `?type=${selectedFilter}`;
    }
    return api.get(url);
};
export const createAchievement = (data) => api.post("api/user/personal/achievements", data);
export const deleteAchievement = (id) => api.delete(`api/user/personal/achievements/${id}`);
export const editAchievement = (id, data) => api.put(`api/user/personal/achievements/${id}`, data);

// Reviews endpoint
export const fetchReviews = () => api.get("/api/user/reviews");
export const fetchTraininglocationReviews = (id) => api.get(`api/training-locations/${id}/reviews`);
export const postReview = (data) => api.post("/api/user/reviews", data);
export const updateReview = (id, data) => api.put(`/api/user/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/api/user/reviews/${id}`);

// Leaderboard endpoint
export const fetchLeaderboard = (event, period, page) =>
    api.get("api/leaderboard", { params: { event, period, page } });
export const inspectProfile = (username) => api.get(`/api/leaderboard/profiles/${username}`);
export const fetchEvents = (searchQuery) => {
    let url = "/api/events";

    if (searchQuery) {
        url += `?q=${searchQuery}`;
    }
    return api.get(url);
};

export const createEvent = (data) => api.post(`/api/events`, data);
export const editEvent = (id, data) => api.put(`/api/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/api/events/${id}`);
export const fetchInvitations = () => api.get("api/user/invitations");
export const createInvitation = (data) => api.post("api/user/invitations", data);
export const answerInvitation = (id, data) => api.put(`api/user/invitations/${id}`, data);
export const deleteInvitation = (id, data) => api.delete(`api/user/invitations/${id}`, data);
export const joinEvent = (UUID) => api.post(`api/events/uuid/${UUID}/join`);
export const getInvitationLink = (eventId) => api.get(`api/events/id/${eventId}/create_url`);
export const refreshInvitationLink = (eventId) => api.put(`api/events/id/${eventId}/create_url`);

// Training locations endpoint
export const fetchTrainingLocations = (selectedFilter) => {
    let url = "/api/training-locations";

    const filter = selectedFilter.toLowerCase(); // Convert to lowercase

    if (filter !== "all") {
        url += `?type=${filter}`;
    }

    return api.get(url);
};

// Statistics endpoint
export const fetchStatistics = (period) => {
    if (period === null) {
        return api.get("/api/user/statistics");
    } else {
        return api.get(`/api/user/statistics/${period}`);
    }
};

export default api;
async function errorCleanUp(error) {
    let errorKeys;
    let modalMessage;
    if (error.response.data.message) {
        errorKeys = error.response.data.message;
        const errorResponse = error.response.data.message;
        if (!(typeof errorResponse === "string" || errorResponse instanceof String)) {
            const errorMessages = Object.keys(errorResponse).map((key) => {
                let errorMessage = errorResponse[key];
                if (errorMessage === "This field may not be blank.") {
                    errorMessage = `${key.charAt(0).toUpperCase() + key.slice(1)} may not be blank.`;
                }
                return errorMessage;
            });
            let combinedMessages = await Promise.all(errorMessages);
            modalMessage = combinedMessages.join("\n");
        } else {
            modalMessage = errorResponse;
        }
    } else {
        modalMessage = "Something went wrong!";
    }
    if (errorKeys !== undefined) {
        error.response.data.fields = errorKeys;
    }
    error.response.data.message = modalMessage;
}
