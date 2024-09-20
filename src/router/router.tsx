import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import App from "../App";
import ErrorPage from "../pages/error/ErrorPage";

import Step1 from "../pages/steps/Step1";
import Step2 from "../pages/steps/Step2";
import Step3 from "../pages/steps/Step3";
import Step4 from "../pages/steps/Step4";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <App>
        <ErrorPage />
      </App>
    ),
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/step1",
        element: <Step1 />,
      },
      {
        path: "/step2",
        element: <Step2 />,
      },
      {
        path: "/step3",
        element: <Step3 />,
      },
      {
        path: "/step4",
        element: <Step4 />,
      },
    ],
  },
]);
