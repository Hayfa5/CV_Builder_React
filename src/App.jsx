import React, { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./admin/theme";
import AdminTopbar from "./admin/scenes/global/Topbar"; // Renamed to avoid conflict
import AdminSidebar from "./admin/scenes/global/Sidebar"; // Renamed to avoid conflict
import "./app.scss";

import AddSubCategory from "./admin/AddSubCategory";
import Dashboard from "./admin/scenes/dashboard";
import AllReview from "./admin/scenes/allReviews";
import Allgig from "./admin/scenes/allgigs";
import Alluser from "./admin/scenes/allusers";
import Bar from "./admin/scenes/bar";
import Form from "./admin/scenes/form";
import Line from "./admin/scenes/line";
import Pie from "./admin/scenes/pie";
import FAQ from "./admin/scenes/faq";
import Geography from "./admin/scenes/geography";
import Pays from "./admin/scenes/Allpays";
import Villes from "./admin/scenes/allcity";
import AjouterCountry from "./admin/scenes/addcountry";
import AjouterCity from "./admin/scenes/addcity";
import AllCategory from "./admin/scenes/allcategory";
import AddCategorie from "./admin/scenes/addcategory";
import AllSubCategory from "./admin/scenes/allsubcategory";

function AdminLayout() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="admin-app">
          <AdminSidebar isSidebar={isSidebar} />
          <main className="admin-content">
            <AdminTopbar setIsSidebar={setIsSidebar} />
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

function App() {
  const queryClient = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AdminLayout />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "allReview", element: <AllReview /> },
        { path: "Alluser", element: <Alluser /> },
        { path: "allgig", element: <Allgig /> },
        { path: "allpays", element: <Pays /> },
        { path: "allVilles", element: <Villes /> },
        { path: "ajouterCountry", element: <AjouterCountry /> },
        { path: "AjouterCity", element: <AjouterCity /> },
        { path: "allcategory", element: <AllCategory /> },
        { path: "addcategorie", element: <AddCategorie /> },
        { path: "addsubcategorie", element: <AddSubCategory /> },
        { path: "allsubcategory", element: <AllSubCategory /> },
        { path: "form", element: <Form /> },
        { path: "bar", element: <Bar /> },
        { path: "pie", element: <Pie /> },
        { path: "line", element: <Line /> },
        { path: "faq", element: <FAQ /> },
        { path: "geography", element: <Geography /> },
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
