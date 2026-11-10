import { Outlet } from "react-router-dom";

import NavBar from "../components/NavBar.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import DemoNotice from "../components/DemoNotice.jsx";

export const RootLayout = () => (
  <div className="flex min-h-screen flex-col">
    <NavBar />

    <main className="flex-1">
      <Outlet />
    </main>

    <SiteFooter />

    {/* Keep the demo disclaimer available across every route. */}
    <DemoNotice />
  </div>
);
