interface User {
    access: any;
    refresh: any;
    user: any;
    id: number;
    username?: string;
    achievements?: EarnedAchievement[];
    image?: string;
    friends?: User[];
    is_verified?: boolean;
    otp_session?: string;
    private?: boolean;
    visible_on_leaderboard?: boolean;
    email?: string;
}

interface OTP {
    otp: string;
}

interface AuthState {
    auth: {
        token: string;
        refreshToken: string;
        user: any; // Replace `any` with the appropriate user type
    };
}
interface LoginData {
    username: string;
    password: string;
}

interface RefreshData {
    refresh: string;
}

interface SignUpData {
    username: string;
    email: string;
    password: string;
}
interface Friendships {
    from_user?: User;
    to_user?: User;
    status?: string;
}

interface Achievement {
    id?: number;
    name?: string;
    description?: string;
    points?: number;
    type?: "Distance" | "Duration" | string;
    period?: number;
    threshold?: number;
    owner?: User;
}

interface EarnedAchievement {
    user?: User;
    achievement?: Achievement;
    earned_date?: string;
}

interface TrainingLocation {
    id?: number;
    name?: string;
    city?: string;
    id_number?: number;
    location?: any; // Replace 'any' with a more specific type if possible
    address?: string;
    createdAt?: string;
    updatedAt?: string;
    type?: "swimming area" | "outdoor gym" | "trail" | "training area" | "ball field" | string;
    isActive?: boolean;
    date_added?: string;
}

interface Activity {
    id?: number;
    user?: User;
    location?: TrainingLocation;
    name?: string;
    description?: string;
    type?: "Cycling" | "Running" | "Lifting" | "Swimming" | "Ball Sports" | string;
    distance?: number;
    duration?: number;
    createdAt?: string;
    updatedAt?: string;
    points?: number;
    isManualLogged?: boolean;
}

interface Review {
    id?: number;
    rating?: number;
    comment?: string;
    user?: User;
    createdAt?: string;
    updatedAt?: string;
    trainingLocation?: TrainingLocation;
}

interface Event {
    id?: number;
    name?: string;
    start_date?: string;
    end_date?: string;
    creator?: User;
    UUIDkey?: string;
    team_event?: boolean;
}

interface EventParticipationRequest {
    id: number;
    event?: Event;
    from_user?: User;
    to_user?: User;
    joining_user?: User;
    status?: string;
}

interface Team {
    id: number;
    name?: string;
    creator?: User;
    event?: Event;
    image?: string;
}

interface TeamEventParticipationRequest {
    id?: number;
    team?: Team;
    joining_user?: User;
}

interface ErrorResponse {
    data: {
        message?: string | { [key: string]: string[] };
        fields?: string[];
    };
}
