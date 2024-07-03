import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./app.scss";

import DescriptionAnalysis from "./classifytext/DescriptionAnalysis";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<DescriptionAnalysis />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
