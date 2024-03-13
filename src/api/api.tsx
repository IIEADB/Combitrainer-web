import axios, { AxiosError, AxiosResponse } from "axios";
import { store } from "../redux/store";
import { clearToken, setToken } from "../redux/authSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const api = axios.create({ baseURL: BASE_URL });
const apiAuth = axios.create({ baseURL: BASE_URL });
type ApiResponse<T> = Promise<AxiosResponse<T>>;

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
    // refreshRetries = 0;
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication endpoints
export const authenticate = (data: LoginData): ApiResponse<{ access: string; refresh: string; user: User }> =>
    apiAuth.post<{ access: string; refresh: string; user: User }>("login", data);

export const signUp = (data: SignUpData): ApiResponse<User> => apiAuth.post<User>("register", data);

export const fetchUserProfile = (): ApiResponse<User> => api.get<User>("user");

export const updateUserProfile = (data: Partial<User>): ApiResponse<User> => api.put<User>("user", data);

export const otpVerify = (data: any): ApiResponse<any> => api.post("otp_verify", data); // Replace 'any' with an appropriate type

export const otpResend = (data: any): ApiResponse<any> => api.post("otp_resend", data); // Replace 'any' with an appropriate type

export const passwordResetRequest = (data: any): ApiResponse<any> => api.post("pwd_reset", data); // Replace 'any' with an appropriate type

export const passwordResetVerifyAndChange = (data: any): ApiResponse<any> => api.put("pwd_reset", data); // Replace 'any' with an appropriate type

export const deleteAccount = (id?: number): ApiResponse<void> => api.delete(`user/delete/${id}`);

export const userExists = (data: { username?: string; email?: string }): ApiResponse<boolean> => {
    let url = "user/exists";
    if (data.username) {
        url += `?username=${data.username}`;
    }
    if (data.email) {
        url += `&email=${data.email}`;
    }
    return api.get<boolean>(url);
};

// Leaderboard endpoints
export const fetchLeaderboard = (event?: string, period?: string, page?: number): ApiResponse<any> =>
    api.get("leaderboard", { params: { event, period, page } }); // Replace 'any' with an appropriate type

export const inspectProfile = (username?: string): ApiResponse<User> =>
    api.get<User>(`leaderboard/profiles/${username}`);

export const fetchEvents = (searchQuery?: string): ApiResponse<Event[]> => {
    let url = "events";
    if (searchQuery) {
        url += `?q=${searchQuery}`;
    }
    return api.get<Event[]>(url);
};

export const createEvent = (data: Partial<Event>): ApiResponse<Event> => api.post<Event>(`events`, data);

export const editEvent = (data: Partial<Event>, id?: number): ApiResponse<Event> =>
    api.put<Event>(`events/${id}`, data);

export const deleteEvent = (id?: number): ApiResponse<void> => api.delete(`events/${id}`);

// Team endpoints
export const isInTeam = (eventId?: number): ApiResponse<boolean> => api.get<boolean>(`events/${eventId}/is_in_team`);

export const fetchTeams = (eventId?: number, searchQuery?: string): ApiResponse<Team[]> => {
    let url = `events/${eventId}/teams`;
    if (searchQuery) {
        url += `?name=${searchQuery}`;
    }
    return api.get<Team[]>(url);
};

export const createTeam = (data: any, eventId?: number): ApiResponse<Team> =>
    api.post<Team>(`events/${eventId}/teams`, data);

export const joinTeam = (data: any, teamId?: number): ApiResponse<void> => api.post<void>(`team/${teamId}/join`, data);

export const getTeam = (teamId?: number, page = 1): ApiResponse<Team> => api.get<Team>(`team/${teamId}?page=${page}`);

export const editTeam = (data: Partial<Team>, teamId?: number): ApiResponse<Team> =>
    api.put<Team>(`team/${teamId}`, data);

export const deleteTeam = (teamId?: number): ApiResponse<void> => api.delete<void>(`team/${teamId}`);

export const removeTeamMember = (teamId?: number, userId?: number): ApiResponse<void> =>
    api.delete<void>(`team/${teamId}/remove/${userId}`);

// Invitation endpoints
export const fetchInvitations = (
    id?: number
): ApiResponse<any> => // Replace 'any' with an appropriate type
    api.get(`events/${id}/invitations`);

export const createInvitation = (data: any): ApiResponse<any> => api.post("user/invitations", data); // Replace 'any' with an appropriate type

export const answerInvitation = (
    data: any,
    id?: number
): ApiResponse<any> => // Replace 'any' with an appropriate type
    api.put(`user/invitations/${id}`, data);

export const deleteInvitation = (id?: number): ApiResponse<void> => api.delete<void>(`user/invitations/${id}`);

// Event participation endpoints
export const joinEvent = (UUID?: string): ApiResponse<void> => api.post<void>(`events/uuid/${UUID}/join`);

export const getInvitationLink = (eventId?: number): ApiResponse<{ url: string }> =>
    api.get<{ url: string }>(`events/id/${eventId}/create_url`);

export const refreshInvitationLink = (eventId?: number): ApiResponse<{ url: string }> =>
    api.put<{ url: string }>(`events/id/${eventId}/create_url`);

async function errorCleanUp(error: AxiosError) {
    // Type the error as AxiosError
    let errorKeys;
    let modalMessage;

    if (error.response && error.response.data && error.response.data.message) {
        errorKeys = error.response.data.message;
        const errorResponse = error.response as AxiosResponse<ErrorResponse>;
        if (!(typeof errorResponse === "string" || errorResponse instanceof String)) {
            const errorMessages = Object.keys(errorResponse).map((key) => {
                let errorMessage = errorResponse[key];
                if (Array.isArray(errorMessage)) {
                    errorMessage = errorMessage.join(" "); // Join array elements into a single string
                }
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
    if (errorKeys != undefined && error.response) {
        error.response.data.fields = errorKeys;
    }
    if (error.response) {
        error.response.data.message = modalMessage;
    }
}

export default api;
