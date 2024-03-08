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
                    const response = await apiAuth.post("login/refresh", {
                        refresh: store.getState().auth.refreshToken,
                    });

                    // Update the states in redux store
                    store.dispatch(
                        setToken({
                            token: response.data.access,
                            refreshToken: store.getState().auth.refreshToken,
                            user: store.getState().auth.user,
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
    refreshRetries = 0;
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication endpoints
export const authenticate = (data) => apiAuth.post("login", data);
export const signUp = (data) => apiAuth.post("register", data);
export const fetchUserProfile = () => api.get("user");
export const updateUserProfile = (data) => api.put("user", data);
export const otpVerify = (data) => api.post("otp_verify", data);
export const otpResend = (data) => api.post("otp_resend", data);
export const passwordResetRequest = (data) => api.post("pwd_reset", data);
export const passwordResetVerifyAndChange = (data) => api.put("pwd_reset", data);
export const deleteAccount = (id) => api.delete(`user/delete/${id}`);
export const userExists = (data) => {
    let url = "user/exists";
    url += `?username=${data.username}&email=${data.email}`;
    return api.get(url);
};

// Activity endpoints
export const fetchActivities = (period, page) => {
    let url = "user/history";
    url += `?period=${period}&page=${page}`;
    return api.get(url);
};

export const startActivity = (data) => api.post("activity", data);
export const updateActivity = (id, data) => api.put(`activity/${id}`, data);
export const deleteActivity = (id, data) => api.delete(`activity/${id}`, data);

//Friendship endpoint
export const fetchFriends = () => api.get(`friendships`);
export const acceptFriend = (id) => api.put(`friendships/${id}`);
export const removeFriends = (id) => api.delete(`friendships/${id}`);
export const sendFriendRequest = (userID) => api.post(`friendships`, userID);
export const filteredUsers = (searchQuery) => {
    let url = "filtered-friends";

    if (searchQuery) {
        url += `?q=${searchQuery}`;
    }
    return api.get(url);
};

// Achievements endpoint
export const fetchAchievements = (selectedFilter, page) => {
    let url = `user/achievements?page=${page}`;

    if (selectedFilter == "Personal") {
        url += `&personal=${true}`;
    } else if (selectedFilter !== "all") {
        url += `&type=${selectedFilter}`;
    }
    return api.get(url);
};
export const createAchievement = (data) => api.post("user/personal/achievements", data);
export const deleteAchievement = (id) => api.delete(`user/personal/achievements/${id}`);
export const editAchievement = (id, data) => api.put(`user/personal/achievements/${id}`, data);

// Reviews endpoint
export const fetchReviews = () => api.get("user/reviews");
export const fetchTraininglocationReviews = (id) => api.get(`training-locations/${id}/reviews`);
export const postReview = (data) => api.post("user/reviews", data);
export const updateReview = (id, data) => api.put(`user/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`user/reviews/${id}`);

// Leaderboard endpoint
export const fetchLeaderboard = (event, period, page) => api.get("leaderboard", { params: { event, period, page } });
export const inspectProfile = (username) => api.get(`leaderboard/profiles/${username}`);
export const fetchEvents = (searchQuery) => {
    let url = "events";

    if (searchQuery) {
        url += `?q=${searchQuery}`;
    }
    return api.get(url);
};

export const createEvent = (data) => api.post(`events`, data);
export const editEvent = (id, data) => api.put(`events/${id}`, data);
export const deleteEvent = (id) => api.delete(`events/${id}`);
export const fetchInvitations = (id) => api.get(`events/${id}/invitations`);
export const createInvitation = (data) => api.post("user/invitations", data);
export const answerInvitation = (id, data) => api.put(`user/invitations/${id}`, data);
export const deleteInvitation = (id, data) => api.delete(`user/invitations/${id}`, data);
export const joinEvent = (UUID) => api.post(`events/uuid/${UUID}/join`);
export const getInvitationLink = (eventId) => api.get(`events/id/${eventId}/create_url`);
export const refreshInvitationLink = (eventId) => api.put(`events/id/${eventId}/create_url`);

// Training locations endpoint
export const fetchTrainingLocations = (params) => {
    return api.get("training-locations", { params });
};

// Statistics endpoint
export const fetchStatistics = (period) => {
    if (period === null) {
        return api.get("user/statistics");
    } else {
        return api.get(`user/statistics/${period}`);
    }
};

// Team endpoints
export const isInTeam = (eventId) => api.get(`events/${eventId}/is_in_team`);
export const fetchTeams = (eventId, searchQuery) => {
    let url = `events/${eventId}/teams`;
    if (searchQuery) {
        url += `?name=${searchQuery}`;
    }
    return api.get(url);
};
export const createTeam = (eventId, data) => api.post(`events/${eventId}/teams`, data);
export const joinTeam = (teamId, data) => api.post(`team/${teamId}/join`, data);
export const getTeam = (teamId, page = 1) => api.get(`team/${teamId}?page=${page}`);
export const editTeam = (teamId, data) => api.put(`team/${teamId}`, data);
export const deleteTeam = (teamId) => api.delete(`team/${teamId}`);
export const removeTeamMember = (teamId, userId) => api.delete(`team/${teamId}/remove/${userId}`);

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
    if (errorKeys != undefined) {
        error.response.data.fields = errorKeys;
    }
    error.response.data.message = modalMessage;
}
