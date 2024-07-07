import React, { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profil from "./cv/pages/profil";
import UserInfoForm from "./cv/UserInfo__Form";
import Eductionaldiploma from "./cv/Educational__Form";
import Skills from "./cv/Skills__Form";
import Certification from "./cv/Certification__Form";
import ProfessionalExperience from "./cv/ProfessionalExperience";
import Project from "./cv/Project__Form";
import "./app.scss";

function App() {
  const queryClient = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { path: "Profil/:id", element: <Profil /> },
        { path: "userInfoForm/:id", element: <UserInfoForm /> },
        { path: "Eductionaldiploma/:id", element: <Eductionaldiploma /> },
        { path: "Skills/:id", element: <Skills /> },
        { path: "Certification/:id", element: <Certification /> },
        { path: "ProfessionalExperience/:id", element: <ProfessionalExperience /> },
        { path: "Project/:id", element: <Project /> },
        
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
