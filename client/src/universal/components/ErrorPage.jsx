import { useState } from "react";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";

const Error = ({ error: customError, resetErrorBoundary }) => {

  const routeError = useRouteError();

  const error = customError || routeError;

  const statusCode = isRouteErrorResponse(error)
    ? error.status
    : error?.statusCode || error?.status || 500;

  const errorMessages = {
    400: "Your request could not be processed.",
    401: "Please log in to continue.",
    403: "You don't have permission to access this page.",
    404: "The page you're looking for doesn't exist.",
    408: "Your request took too long.",
    429: "Too many requests. Please try again later.",
    500: "Something went wrong on our server.",
    502: "The server received an invalid response.",
    503: "Our service is temporarily unavailable.",
    504: "The server took too long to respond."
  };

  const message =
    errorMessages[statusCode] ||
    "Something unexpected happened. Please try again.";

  const [referenceId] = useState(() => {
    const generatedId =
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    return generatedId.slice(0, 8).toUpperCase();
  });

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  // Developer-only logging. Never render raw stack traces to users.
  if (import.meta.env.DEV && error) {
    console.error("ScazStore Application Error:", error);
  }

  return (

    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">

      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-sm p-7 sm:p-10 text-center">

        {/* ERROR ICON */}

        <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-10 h-10 text-red-500"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </svg>

        </div>


        {/* ERROR CODE */}

        <p className="mt-6 text-sm font-bold tracking-widest text-red-500">
          ERROR {statusCode}
        </p>


        {/* TITLE */}

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
          Oops! Something went wrong.
        </h1>


        {/* MESSAGE */}

        <p className="text-sm text-gray-500 mt-3 leading-6">
          {message}
        </p>


        {/* SAFE DIAGNOSTIC LOG */}

        <div className="mt-7 p-4 rounded-xl bg-gray-50 border border-gray-100 text-left">

          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Error Information
          </h3>

          <div className="space-y-2 text-xs">

            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Error Code</span>
              <span className="font-semibold text-gray-700">
                {statusCode}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Reference ID</span>
              <span className="font-semibold text-gray-700">
                {referenceId}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Time</span>
              <span className="font-semibold text-gray-700">
                {new Date().toLocaleTimeString()}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-gray-500 leading-5">
                Diagnostic: {message}
              </p>
            </div>

          </div>

        </div>


        {/* ACTION BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-3 mt-7">

          <button
            onClick={handleRetry}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition"
          >
            Try Again
          </button>

          <Link
            to="/"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-xl transition"
          >
            Back to Home
          </Link>

        </div>


        {/* BRAND */}

        <p className="mt-7 text-xs text-gray-400">
          Scaz<span className="text-green-600 font-bold">Store</span>
          {" "}• Shop Smart. Live Better.
        </p>

      </div>

    </div>
  );
};

export default Error;