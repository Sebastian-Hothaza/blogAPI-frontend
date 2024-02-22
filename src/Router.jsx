import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import Home from "./Home";
import Login from "./Login";




const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        {path: "/login", element: <Login />},
      ]
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;