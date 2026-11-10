import { lazy } from "react";

// Keep route-level components lazy-loaded to reduce the initial bundle size.
export const Home = lazy(() => import("../pages/home/HomePage.jsx"));
export const NoticePage = lazy(() => import("../pages/NoticePage.jsx"));
export const OffersPage = lazy(() => import("../pages/offers/OffersPage.jsx"));
export const CategoryPage = lazy(() => import("../pages/category/CategoryPage.jsx"));
export const ProfilePage = lazy(() => import("../pages/account/ProfilePage.jsx"));

const authPages = () => import("../pages/auth/AuthPage.jsx");
const informationPages = () => import("../pages/info/InfoPages.jsx");

export const LoginPage = lazy(() =>
  authPages().then((module) => ({ default: module.LoginPage }))
);

export const SignupPage = lazy(() =>
  authPages().then((module) => ({ default: module.SignupPage }))
);

export const AboutPage = lazy(() =>
  informationPages().then((module) => ({ default: module.AboutPage }))
);

export const ContactPage = lazy(() =>
  informationPages().then((module) => ({ default: module.ContactPage }))
);

export const TermsPage = lazy(() =>
  informationPages().then((module) => ({ default: module.TermsPage }))
);

export const HelpPage = lazy(() =>
  informationPages().then((module) => ({ default: module.HelpPage }))
);

export const FAQPage = lazy(() =>
  informationPages().then((module) => ({ default: module.FAQPage }))
);

export const ShippingPolicyPage = lazy(() =>
  informationPages().then((module) => ({ default: module.ShippingPage }))
);

export const ReturnPolicyPage = lazy(() =>
  informationPages().then((module) => ({ default: module.ReturnPage }))
);

export const PrivacyPolicyPage = lazy(() =>
  informationPages().then((module) => ({ default: module.PrivacyPolicyPage }))
);

export const RefundPolicyPage = lazy(() =>
  informationPages().then((module) => ({ default: module.RefundPolicyPage }))
);
