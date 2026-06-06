import { createBrowserRouter, redirect } from "react-router";
import { supabase } from "../lib/client";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import App from "../App";

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
        index: true,
        element: <HomePage />,
        loader: requireAuth,
      },
      {
        path: "login",
        element: <AuthPage />,
      },
    ],
  },
]);
