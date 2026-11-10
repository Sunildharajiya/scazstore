import { useState } from "react";

const STORAGE_KEY = "scazstore-demo-notice-accepted";

/**
 * Shows the demo disclaimer once per browser tab session.
 * The notice is intentionally informational; it does not imply that
 * checkout, payments, orders, or fulfilment are connected to live services.
 */
const DemoNotice = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(STORAGE_KEY) !== "true";
  });

  const handleAccept = () => {
    window.sessionStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <section
        aria-labelledby="demo-notice-title"
        aria-describedby="demo-notice-description"
        aria-modal="true"
        role="dialog"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
          ⓘ
        </div>

        <h2 id="demo-notice-title" className="text-xl font-black text-green-950">
          Demo Website Notice
        </h2>

        <p
          id="demo-notice-description"
          className="mt-3 text-sm leading-7 text-gray-600"
        >
          Welcome to ScazStore! This website is created for demonstration,
          educational, and portfolio purposes only. Products, orders, payments,
          and commercial transactions shown here are examples and are not
          available for real purchases. Do not use this demonstration for
          commercial or legal activities.
        </p>

        <button
          type="button"
          onClick={handleAccept}
          className="mt-6 w-full rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
        >
          I Understand
        </button>
      </section>
    </div>
  );
};

export default DemoNotice;
