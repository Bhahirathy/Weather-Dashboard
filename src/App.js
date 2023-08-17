import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ROUTES from "./Configs/Routes";
import LandingPage from "./Component/landingPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
