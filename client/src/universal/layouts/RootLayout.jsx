
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Nav from "../components/NavBar.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import DemoNotice from "../components/DemoNotice.jsx";

export const RootLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Nav isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        <Outlet context={{ setIsLoggedIn }} />
      </main>

      <SiteFooter />
      <DemoNotice />
    </div>
  );
};
