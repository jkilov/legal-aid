import { createBrowserRouter, redirect } from "react-router";
import { supabase } from "../lib/client";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import App from "../App";
import ProtectedLayout from "../layouts/ProtectedLayout";

const requireAuth = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw redirect("/login");
  }

  return session;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <AuthPage />,
      },
      {
        id: "protected",
        element: <ProtectedLayout />,
        loader: requireAuth,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
    ],
  },
]);
