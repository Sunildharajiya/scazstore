import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "../universal/layouts/RootLayout.jsx";
import ErrorPage from "../universal/components/ErrorPage.jsx";
import Loader from "../universal/components/Loader.jsx";

import {
  Home,
  NoticePage,
  LoginPage,
  SignupPage,
  AboutPage,
  ContactPage,
  TermsPage,
  HelpPage,
  FAQPage,
  ShippingPolicyPage,
  ReturnPolicyPage,
  PrivacyPolicyPage,
  RefundPolicyPage,
  OffersPage,
  CategoryPage,
  ProfilePage,
} from "./lazyPages.jsx";

// Wrap route-level lazy components in one consistent loading boundary.
const withLoader = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withLoader(Home) },
      { path: "notice", element: withLoader(NoticePage) },
      { path: "notifications", element: withLoader(NoticePage) },

      { path: "login", element: withLoader(LoginPage) },
      { path: "signup", element: withLoader(SignupPage) },
      { path: "account", element: withLoader(ProfilePage) },

      { path: "about", element: withLoader(AboutPage) },
      { path: "contact", element: withLoader(ContactPage) },
      { path: "terms", element: withLoader(TermsPage) },
      { path: "privacy-policy", element: withLoader(PrivacyPolicyPage) },
      { path: "refund-policy", element: withLoader(RefundPolicyPage) },
      { path: "help", element: withLoader(HelpPage) },
      { path: "faq", element: withLoader(FAQPage) },
      { path: "shipping-policy", element: withLoader(ShippingPolicyPage) },
      { path: "return-policy", element: withLoader(ReturnPolicyPage) },

      { path: "offers", element: withLoader(OffersPage) },

      // Static routes above take priority; this route handles product categories.
      { path: ":slug", element: withLoader(CategoryPage) },
    ],
  },
]);
