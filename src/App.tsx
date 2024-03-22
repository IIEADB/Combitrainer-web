import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout/Layout";
import { NotFound } from "./components/NotFound";
import { Events } from "./pages/events/Events";
import { fetchEvents } from "./api/api";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Event } from "./pages/events/Event";
import Login from "./pages/login/Login";
import SignUp from "./pages/login/SignUp";
import OTP from "./pages/login/OTP";
import { Overview } from "./pages/events/Overview";
import { Participants } from "./pages/events/Participants";
import { Teams } from "./pages/events/Teams";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" errorElement={<ErrorBoundary />}>
            <Route index={true} element={<Login />} errorElement={<ErrorBoundary />} />
            <Route path="signup" element={<SignUp />} errorElement={<ErrorBoundary />} />
            <Route path="otp" element={<OTP />} errorElement={<ErrorBoundary />} />
            <Route>
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                    errorElement={<ErrorBoundary />}
                >
                    <Route path="profile" element={<Profile />} errorElement={<ErrorBoundary />} />
                    <Route
                        path="events"
                        element={<Events />}
                        loader={async () => {
                            const events = await fetchEvents();
                            return events.data;
                        }}
                        errorElement={<ErrorBoundary />}
                    />
                    <Route
                        path="/dashboard/events/:eventId"
                        element={<Event />}
                        errorElement={<ErrorBoundary />}
                    ></Route>
                </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
        </Route>
    )
);

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    );
}

export default App;
