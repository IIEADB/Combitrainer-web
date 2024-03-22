import axios, { AxiosResponse } from "axios";
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
                    // Access the auth state directly
                    const refreshToken = store.getState().refreshToken;
                    const response = await refresh({ refresh: refreshToken });

                    // Access the auth state directly
                    const auth = store.getState();
                    store.dispatch(
                        setToken({
                            token: response.data.access,
                            refreshToken: auth.refreshToken,
                            user: auth.user,
                        })
                    );

                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (err) {
                    store.dispatch(clearToken());
                }
            }
        }
        return Promise.reject(error);
    }
);

apiAuth.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.request.use((config) => {
    const token = store.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const refresh = (data: RefreshData): ApiResponse<{ access: string; refresh: string; user: User }> =>
    apiAuth.post<{ access: string; refresh: string; user: User }>("login/refresh", data);
// Authentication endpoints
export const authenticate = (data: LoginData): ApiResponse<{ access: string; refresh: string; user: User }> =>
    apiAuth.post<{ access: string; refresh: string; user: User }>("login", data);

export const signUp = (data: SignUpData): ApiResponse<User> => apiAuth.post<User>("register", data);

export const fetchUserProfile = (): ApiResponse<User> => api.get<User>("user");

export const updateUserProfile = (data: Partial<User>): ApiResponse<User> => api.put<User>("user", data);

export const userExists = (data: Partial<User>): ApiResponse<User> => {
    let url = "user/exists";
    url += `?username=${data.username}&email=${data.email}`;
    return api.get<User>(url);
};

export const otpVerify = (data: OTP): ApiResponse<{ message: string }> => api.post("otp_verify", data);

export const otpResend = (): ApiResponse<{ message: string }> => api.post("otp_resend");

export const passwordResetRequest = (data: Password): ApiResponse<any> => api.post("pwd_reset", data); 

export const passwordResetVerifyAndChange = (data: Password): ApiResponse<any> => api.put("pwd_reset", data);

export const deleteAccount = (id?: number): ApiResponse<void> => api.delete(`user/delete/${id}`);

// Leaderboard endpoints
export const fetchLeaderboard = (event?: string, period?: number, page?: number): ApiResponse<any> =>
    api.get("leaderboard", { params: { event, period, page } }); 

export const inspectProfile = (username?: string): ApiResponse<User> =>
    api.get<User>(`leaderboard/profiles/${username}`);

export const fetchEvent = (id?: number): ApiResponse<Event> => api.get<Event>(`events/${id}`);

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

export const filteredUsers = (searchQuery: string) => {
    let url = "filtered-friends";

    if (searchQuery) {
        url += `?q=${searchQuery}`;
    }
    return api.get(url);
};

// Team endpoints
export const isInTeam = (eventId?: number): ApiResponse<boolean> => api.get<boolean>(`events/${eventId}/is_in_team`);

export const fetchTeams = (eventId?: number, searchQuery?: string): ApiResponse<{ teams: Team[] }> => {
    let url = `events/${eventId}/teams`;
    if (searchQuery) {
        url += `?name=${searchQuery}`;
    }
    return api.get<{ teams: Team[] }>(url);
};

export const createTeam = (data: any, eventId?: string): ApiResponse<Team> =>
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
    eventId?: number
): ApiResponse<any> => // Replace 'any' with an appropriate type
    api.get(`events/${eventId}/invitations`);

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

export default api;
