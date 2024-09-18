import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import App from "../App";
import ErrorPage from "../pages/error/ErrorPage"

import Step1 from "../pages/steps/Step1";
import Step2 from "../pages/steps/Step2";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <App><ErrorPage /></App>,
        children: [
            {
                path: "/",
                element: <MainPage />
            },
            {
                path: "/step1",
                element: <Step1 />
            },
            {
                path: "/step2",
                element: <Step2 />
            }
        ]
    },
]);
