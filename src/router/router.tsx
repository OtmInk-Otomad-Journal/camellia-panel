import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import App from "../App";
import ErrorPage from "../pages/error/ErrorPage"

import Step1 from "../pages/steps/Step1";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <App><ErrorPage /></App>,
        children: [
            {
                path: "/",
                element: <MainPage />
            },{
                path: "/step1",
                element: <Step1 />
            }
        ]
    },
]);
