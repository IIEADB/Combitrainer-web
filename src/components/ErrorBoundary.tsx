import { useRouteError } from "react-router-dom";

export function ErrorBoundary() {
    let error = useRouteError();
    console.error(error);
    return (
        <div>
            <h1>Something went wrong</h1>
        </div>
    );
}
