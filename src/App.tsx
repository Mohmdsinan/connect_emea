// import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Home, Team, Event, About, Join } from "@/pages";

import SingleEvent from "@/pages/SingleEvent";
import { GuestLayout } from "@/layout";
import FormData from "@/pages/Protected/FormData";

import AdminLayout from "@/layout/adminLayout";
import Dashboard from "@/pages/admin/dashboard";
import Interns from "./pages/admin/interns";
import Events from "./pages/admin/events";

import Login from "./pages/admin/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/team", element: <Team /> },
      { path: "/events", element: <Event /> },
      { path: "/event/:id", element: <SingleEvent /> },
      { path: "/join", element: <Join /> },
      { path: "/admin/responses", element: <FormData /> },
    ],
  },
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      {
        path: ".",
        element: <Navigate to="" />,
      },
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "interns",
        element: <Interns />,
      },
      {
        path: "events",
        element: <Events />,
      }
    ],
  },
  {
    path: "/signin",
    element: <Login />,
  },
  { path: "*", element: <Navigate to="/" /> },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
