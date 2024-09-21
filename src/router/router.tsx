import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import App from "../App";
import ErrorPage from "../pages/error/ErrorPage";

import Step0 from "../pages/steps/Step0";
import Step1 from "../pages/steps/Step1";
import Step2 from "../pages/steps/Step2";
import Step3 from "../pages/steps/Step3";
import Step4 from "../pages/steps/Step4";
import Step5 from "../pages/steps/Step5";
import Step6 from "../pages/steps/Step6";
import Step7 from "../pages/steps/Step7";
import Step8 from "../pages/steps/Step8";

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
        path: "/step0",
        element: <Step0 />,
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
      {
        path: "/step5",
        element: <Step5 />,
      },
      {
        path: "/step6",
        element: <Step6 />,
      },
      {
        path: "/step7",
        element: <Step7 />,
      },
      {
        path: "/step8",
        element: <Step8 />,
      },
    ],
  },
]);
